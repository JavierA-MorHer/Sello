import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import { paymentConfirmationEmail } from '@/lib/email/templates'
import { computeExpiresAt } from '@/lib/events/expiration'
import { getEventTitle } from '@/lib/templates/summary'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'misello.com.mx'

// Prueba local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
// (te da un STRIPE_WEBHOOK_SECRET temporal para .env.local).
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    console.error('[stripe webhook] Falta STRIPE_WEBHOOK_SECRET o la firma de la petición.')
    return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 400 })
  }

  const rawBody = await request.text()

  let stripeEvent: Stripe.Event
  try {
    const stripe = getStripe()
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('[stripe webhook] Firma inválida:', err)
    return NextResponse.json({ error: 'Firma inválida.' }, { status: 400 })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session
    const eventId = session.metadata?.event_id

    if (eventId) {
      await activateEvent(eventId)
    } else {
      console.error('[stripe webhook] checkout.session.completed sin metadata.event_id')
    }
  }

  return NextResponse.json({ received: true })
}

async function activateEvent(eventId: string) {
  const supabase = createAdminClient()

  const { data: eventRow } = await supabase
    .from('events')
    .select('id, slug, custom_data, owner_id, status, template_id')
    .eq('id', eventId)
    .single()

  // Idempotencia: Stripe puede reintentar/duplicar el webhook — si ya no
  // está en 'draft', ya se activó antes, no hacer nada de nuevo.
  if (!eventRow || eventRow.status !== 'draft') return

  const customData = (eventRow.custom_data ?? {}) as Record<string, unknown>
  const fechaEvento = typeof customData.fecha_evento === 'string' ? customData.fecha_evento : undefined

  const { error: updateError } = await supabase
    .from('events')
    .update({
      status: 'active',
      paid_at: new Date().toISOString(),
      expires_at: computeExpiresAt(fechaEvento).toISOString(),
    })
    .eq('id', eventId)

  if (updateError) {
    console.error('[stripe webhook] No se pudo activar el evento:', updateError)
    return
  }

  // El correo de confirmación es "best effort" — si falla, el pago y la
  // activación ya se hicieron; no se debe reintentar el webhook por esto.
  try {
    const { data: template } = await supabase
      .from('templates')
      .select('category')
      .eq('id', eventRow.template_id)
      .single()

    const { data: owner } = await supabase.auth.admin.getUserById(eventRow.owner_id)
    const ownerEmail = owner?.user?.email

    if (ownerEmail) {
      const eventName = template ? getEventTitle(template.category, customData) : 'tu evento'
      const link = `https://${eventRow.slug}.${ROOT_DOMAIN}`
      const { subject, html } = paymentConfirmationEmail({ eventName, link })
      await sendEmail({ to: ownerEmail, subject, html })
    }
  } catch (err) {
    console.error('[stripe webhook] No se pudo enviar el correo de confirmación:', err)
  }
}
