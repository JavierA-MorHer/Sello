'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/server'
import { slugify } from '@/lib/text/slugify'
import { findSlugBlocker, releaseOwnDraftSlug } from '@/lib/events/slug'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

/**
 * Guarda el borrador. Si el link deseado ya lo tiene alguien más, se guarda
 * todo lo demás y se devuelve `slugTaken` para que el formulario lo diga de
 * frente — nunca se le cambia el link al cliente a sus espaldas (un sufijo
 * tipo "-2" se descubre hasta que ya lo compartió).
 */
export async function autosaveDraft(eventId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Tu sesión expiró. Vuelve a entrar para seguir guardando.')
  }

  const { slug, ...custom_data } = data
  const update: Record<string, unknown> = { custom_data }

  const desired = typeof slug === 'string' ? slugify(slug) : ''
  let slugTaken = false

  if (desired) {
    if (await findSlugBlocker(desired, eventId, user.id)) {
      slugTaken = true
    } else {
      // El nombre lo tenía un borrador sin pagar suyo: se libera y se reusa.
      await releaseOwnDraftSlug(supabase, desired, eventId, user.id)
      update.slug = desired
    }
  }

  const { error } = await supabase.from('events').update(update).eq('id', eventId)

  if (error) {
    // Carrera: alguien tomó el slug entre el chequeo y el update. Se reintenta
    // sin tocar el slug para no perder lo que el cliente venía escribiendo.
    if (error.code === '23505') {
      delete update.slug
      const { error: retryError } = await supabase.from('events').update(update).eq('id', eventId)
      if (retryError) throw new Error('No se pudo guardar el borrador.')
      return { slugTaken: true }
    }
    throw new Error('No se pudo guardar el borrador.')
  }

  return { slugTaken }
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
    .select('id, owner_id, status, template_id, slug')
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

  // El slug placeholder significa que el link deseado estaba ocupado y nunca
  // llegó a guardarse. Cobrar aquí publicaría "borrador-a1b2c3d4.misello.com.mx"
  // como link definitivo del cliente.
  if (event.slug.startsWith('borrador-')) {
    redirect(`/crear/${templateId}?paso=${reviewStepIndex}&error=link`)
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
