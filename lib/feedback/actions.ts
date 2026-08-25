'use server'

import { sendEmail } from '@/lib/email/resend'
import { feedbackEmail } from '@/lib/email/templates'

const MAX = { name: 100, email: 200, message: 2000 }

export type FeedbackResult = { ok: true } | { ok: false; error: string }

/**
 * Recibe el formulario público de dudas/feedback de la landing y lo manda
 * por correo a FEEDBACK_TO_ADDRESS. El destinatario es fijo del lado del
 * servidor: el formulario nunca decide a quién se le escribe, solo aporta
 * el contenido del mensaje.
 */
export async function submitFeedback(input: {
  name: string
  email: string
  message: string
  /** Campo trampa: los humanos no lo ven, los bots sí lo llenan. */
  website?: string
}): Promise<FeedbackResult> {
  // Bot detectado: se responde ok para no darle pistas de por qué falló.
  if (input.website && input.website.trim().length > 0) {
    return { ok: true }
  }

  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()

  if (!name || !email || !message) {
    return { ok: false, error: 'Llena tu nombre, correo y mensaje.' }
  }
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return { ok: false, error: 'El mensaje es demasiado largo.' }
  }
  // Validación deliberadamente laxa: solo descarta lo que claramente no es
  // un correo. La verificación real es que la persona reciba tu respuesta.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Revisa tu correo, no parece válido.' }
  }

  const to = process.env.FEEDBACK_TO_ADDRESS
  if (!to) {
    console.error('[feedback] Falta FEEDBACK_TO_ADDRESS — mensaje no entregado.')
    return { ok: false, error: 'No pudimos enviar tu mensaje. Intenta más tarde.' }
  }

  const { subject, html } = feedbackEmail({ name, email, message })
  // replyTo con el correo de quien escribe: responder desde la bandeja
  // contesta directo a esa persona.
  const result = await sendEmail({ to, subject, html, replyTo: email })

  if (!result.ok) {
    return { ok: false, error: 'No pudimos enviar tu mensaje. Intenta más tarde.' }
  }

  return { ok: true }
}
