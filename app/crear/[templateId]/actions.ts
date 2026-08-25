'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * Encuentra un slug libre a partir de uno deseado, sin perder el toque
 * personalizado: si "emiliano" ya existe, prueba "emiliano-2", "emiliano-3"...
 * en vez de forzar al usuario a inventar otro link a mano.
 */
async function resolveUniqueSlug(supabase: SupabaseServerClient, base: string, eventId: string): Promise<string> {
  const { data: matches } = await supabase
    .from('events')
    .select('slug')
    .neq('id', eventId)
    .or(`slug.eq.${base},slug.like.${base}-*`)

  const taken = new Set((matches ?? []).map((m) => m.slug))
  if (!taken.has(base)) return base

  let i = 2
  while (taken.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}

export async function autosaveDraft(eventId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { slug, ...custom_data } = data
  const update: Record<string, unknown> = { custom_data }

  let resolvedSlug: string | undefined
  if (typeof slug === 'string' && slug.trim().length > 0) {
    resolvedSlug = await resolveUniqueSlug(supabase, slug.trim(), eventId)
    update.slug = resolvedSlug
  }

  let { error } = await supabase.from('events').update(update).eq('id', eventId)

  // Carrera: alguien más tomó el slug resuelto entre el chequeo y el update.
  // Un solo reintento con un sufijo corto al azar resuelve el caso extremo
  // sin bloquear al usuario con el mensaje de error.
  if (error?.code === '23505' && resolvedSlug) {
    resolvedSlug = `${resolvedSlug}-${Math.random().toString(36).slice(2, 6)}`
    update.slug = resolvedSlug
    ;({ error } = await supabase.from('events').update(update).eq('id', eventId))
  }

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ese link ya está en uso, prueba con otro.')
    }
    throw new Error('No se pudo guardar el borrador.')
  }

  return { slug: resolvedSlug }
}

/**
 * Crea la sesión de Stripe Checkout y redirige ahí. El evento pasa a
 * 'active' hasta que el webhook (app/api/webhooks/stripe/route.ts) confirme
 * el pago — nunca se activa desde aquí, para no poder saltarse el cobro.
 */
export async function createCheckoutSession(eventId: string, reviewStepIndex: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: event } = await supabase
    .from('events')
    .select('id, owner_id, status, template_id')
    .eq('id', eventId)
    .single()

  if (!event || event.owner_id !== user.id) {
    redirect('/plantillas')
  }

  const templateId = event.template_id

  if (event.status !== 'draft') {
    // Ya se pagó (o está en otro estado) — no volver a cobrar.
    redirect(`/crear/${templateId}/preview`)
  }

  const { data: template } = await supabase
    .from('templates')
    .select('name, price_mxn')
    .eq('id', templateId)
    .single()

  // El precio nunca viene del cliente: se lee server-side de `templates`
  // justo antes de crear la sesión de Stripe. Si por alguna razón el precio
  // no es un entero positivo (dato corrupto, plantilla mal cargada), se
  // aborta en vez de cobrar un monto inválido o $0.
  if (!template || !Number.isInteger(template.price_mxn) || template.price_mxn <= 0) {
    redirect(`/crear/${templateId}?paso=${reviewStepIndex}&error=pago`)
  }

  let checkoutUrl: string
  try {
    const stripe = getStripe()
    const priceMXN = template.price_mxn

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            unit_amount: priceMXN * 100,
            product_data: {
              name: `Invitación digital — ${template.name}`,
              description: 'Pago único. Publica tu invitación y quita la marca de agua.',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { event_id: eventId },
      customer_email: user.email ?? undefined,
      success_url: `${APP_URL}/crear/${templateId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/crear/${templateId}?paso=${reviewStepIndex}`,
    })

    if (!session.url) {
      throw new Error('Stripe no devolvió una URL de checkout.')
    }
    checkoutUrl = session.url
  } catch {
    redirect(`/crear/${templateId}?paso=${reviewStepIndex}&error=pago`)
  }

  redirect(checkoutUrl)
}
