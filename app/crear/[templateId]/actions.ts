'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/server'
import { getPriceMXNForCategory } from '@/lib/templates/pricing'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function autosaveDraft(eventId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { slug, ...custom_data } = data
  const update: Record<string, unknown> = { custom_data }

  if (typeof slug === 'string' && slug.trim().length > 0) {
    update.slug = slug.trim()
  }

  const { error } = await supabase.from('events').update(update).eq('id', eventId)

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ese link ya está en uso, prueba con otro.')
    }
    throw new Error('No se pudo guardar el borrador.')
  }
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
    .select('category, name')
    .eq('id', templateId)
    .single()

  if (!template) {
    redirect(`/crear/${templateId}?paso=${reviewStepIndex}&error=pago`)
  }

  let checkoutUrl: string
  try {
    const stripe = getStripe()
    const priceMXN = getPriceMXNForCategory(template.category)

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
