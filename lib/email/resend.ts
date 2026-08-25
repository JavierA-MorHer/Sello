import { Resend } from 'resend'

// "onboarding@resend.dev" funciona sin verificar dominio propio (útil para
// probar ya mismo). En cuanto verifiques misello.com.mx en Resend, cambia esto a
// algo como "Sello <hola@misello.com.mx>".
// `||` a propósito (no `??`): una env var vacía ("") sigue siendo string,
// no undefined, así que `??` no aplicaría el fallback.
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || 'Sello <onboarding@resend.dev>'

let resendClient: Resend | null = null

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!resendClient) resendClient = new Resend(apiKey)
  return resendClient
}

/**
 * Envía un correo — si RESEND_API_KEY no está configurada, no hace nada (no
 * revienta el flujo que la llama). Los llamadores deben tratar el envío de
 * correo como "best effort", nunca como condición para completar un pago o
 * un RSVP.
 */
export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  /** Para que al responder el correo la respuesta vaya a esta dirección y no al remitente. */
  replyTo?: string
}) {
  const resend = getResend()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY no configurada — correo no enviado:', params.subject)
    return { ok: false as const }
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: params.to,
    subject: params.subject,
    html: params.html,
    ...(params.replyTo ? { replyTo: params.replyTo } : {}),
  })

  if (error) {
    console.error('[email] Error enviando correo:', error)
    return { ok: false as const }
  }

  return { ok: true as const }
}
