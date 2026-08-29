import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import { paymentConfirmationEmail } from '@/lib/email/templates'
import { computeExpiresAt } from '@/lib/events/expiration'
import { getEventTitle } from '@/lib/templates/summary'
import { trackMetaEvent, type MetaUserData } from '@/lib/analytics/meta'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'misello.com.mx'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://misello.com.mx'

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
      // amount_total viene de Stripe, ya confirmado y cobrado — es la única
      // fuente confiable del monto pagado. No se recalcula a partir del
      // precio actual de la plantilla, que pudo cambiar después.
      const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : null
      await activateEvent(eventId, amountTotal !== null ? Math.round(amountTotal / 100) : null, session)
    } else {
      console.error('[stripe webhook] checkout.session.completed sin metadata.event_id')
    }
  }

  return NextResponse.json({ received: true })
}

async function activateEvent(
  eventId: string,
  pricePaidMXN: number | null,
  session: Stripe.Checkout.Session
) {
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
      price_paid_mxn: pricePaidMXN,
    })
    .eq('id', eventId)

  if (updateError) {
    console.error('[stripe webhook] No se pudo activar el evento:', updateError)
    return
  }

  // A partir de aquí todo es "best effort": el pago y la activación ya se
  // hicieron y no se debe reintentar el webhook por un correo o un pixel.
  let ownerEmail: string | undefined
  let eventName = 'tu evento'
  // Para Meta interesa QUÉ plantilla se vendió, no el nombre del evento del
  // cliente: es lo que permite ver cuál convierte mejor en los anuncios.
  let templateName: string | undefined

  try {
    const { data: template } = await supabase
      .from('templates')
      .select('category, name')
      .eq('id', eventRow.template_id)
      .single()

    const { data: owner } = await supabase.auth.admin.getUserById(eventRow.owner_id)
    ownerEmail = owner?.user?.email

    if (template) {
      eventName = getEventTitle(template.category, customData)
      templateName = template.name
    }

    if (ownerEmail) {
      const link = `https://${eventRow.slug}.${ROOT_DOMAIN}`
      const { subject, html } = paymentConfirmationEmail({ eventName, link })
      await sendEmail({ to: ownerEmail, subject, html })
    }
  } catch (err) {
    console.error('[stripe webhook] No se pudo enviar el correo de confirmación:', err)
  }

  // Purchase se dispara AQUÍ y no en la página de éxito a propósito: este es
  // el único punto que sabe que el dinero se cobró de verdad. El bloque de
  // idempotencia de arriba garantiza que corra una sola vez por evento.
  //
  // `fb_*` son las cookies/señales del navegador capturadas al crear la
  // sesión (app/crear/[templateId]/actions.ts); sin ellas Meta casi no puede
  // atribuir la venta al anuncio.
  const userData: MetaUserData = {
    email: ownerEmail ?? session.customer_details?.email ?? null,
    fbp: session.metadata?.fb_fbp ?? null,
    fbc: session.metadata?.fb_fbc ?? null,
    ip: session.metadata?.fb_ip ?? null,
    userAgent: session.metadata?.fb_user_agent ?? null,
  }

  await trackMetaEvent({
    eventName: 'Purchase',
    // El id de la sesión de Stripe es único por compra y estable entre
    // reintentos — sirve como clave de deduplicación en Meta.
    eventId: session.id,
    eventSourceUrl: `${APP_URL}/crear/${eventRow.template_id}/success`,
    userData,
    customData: {
      currency: 'MXN',
      value: pricePaidMXN ?? 0,
      content_name: templateName ?? eventName,
      content_ids: [eventRow.template_id],
      content_type: 'product',
    },
  })
}
