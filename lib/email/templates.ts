const WRAPPER_STYLE =
  'font-family: Georgia, serif; background: #fdf8f8; color: #1c1b1b; padding: 40px 24px;'
const CARD_STYLE =
  'max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid rgba(28,27,27,.08);'
const BUTTON_STYLE =
  'display: inline-block; margin-top: 20px; background: #1c1b1b; color: #fdf8f8; text-decoration: none; padding: 14px 24px; border-radius: 4px; font-weight: 600;'

/**
 * Escapa texto que viene de un formulario público antes de meterlo al HTML
 * del correo. Sin esto, el mensaje de un tercero podría inyectar markup en
 * la bandeja de quien lo lee.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function feedbackEmail({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  // El mensaje es texto plano: se escapa y solo se respetan los saltos de línea.
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

  return {
    subject: `Feedback de ${safeName}`,
    html: `
      <div style="${WRAPPER_STYLE}">
        <div style="${CARD_STYLE}">
          <p style="font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #a8927e; font-weight: 600;">Sello · feedback</p>
          <h1 style="font-size: 22px; margin: 8px 0 16px;">${safeName} escribió</h1>
          <p style="font-size: 15px; line-height: 22px; color: #444748;">${safeMessage}</p>
          <p style="font-size: 13px; color: #747878; margin-top: 24px;">
            Responde a este correo para contestarle directo a ${safeEmail}.
          </p>
        </div>
      </div>
    `,
  }
}

export function paymentConfirmationEmail({ eventName, link }: { eventName: string; link: string }) {
  return {
    subject: `Tu invitación "${eventName}" ya está publicada`,
    html: `
      <div style="${WRAPPER_STYLE}">
        <div style="${CARD_STYLE}">
          <p style="font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #a8927e; font-weight: 600;">Sello</p>
          <h1 style="font-size: 22px; margin: 8px 0 16px;">¡Tu pago se procesó con éxito!</h1>
          <p style="font-size: 15px; line-height: 22px; color: #444748;">
            "${eventName}" ya no tiene marca de agua y tu link está activo para compartir con tus invitados.
          </p>
          <a href="${link}" style="${BUTTON_STYLE}">Ver mi invitación</a>
          <p style="font-size: 13px; color: #747878; margin-top: 24px;">${link}</p>
        </div>
      </div>
    `,
  }
}

export function rsvpNotificationEmail({
  eventName,
  guestName,
  attending,
  plusOnes,
  message,
  link,
}: {
  eventName: string
  guestName: string
  attending: boolean
  plusOnes: number
  message?: string | null
  link: string
}) {
  const safeGuestName = escapeHtml(guestName)
  const totalPersonas = plusOnes + 1
  const asistenciaLinea = attending
    ? `Asiste${totalPersonas > 1 ? ` · ${totalPersonas} personas` : ''}`
    : 'No podrá asistir'
  const safeMessage = message ? escapeHtml(message).replace(/\n/g, '<br />') : null

  return {
    subject: `${safeGuestName} confirmó para "${eventName}"`,
    html: `
      <div style="${WRAPPER_STYLE}">
        <div style="${CARD_STYLE}">
          <p style="font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #a8927e; font-weight: 600;">Sello</p>
          <h1 style="font-size: 22px; margin: 8px 0 16px;">Nueva confirmación</h1>
          <p style="font-size: 15px; line-height: 22px; color: #444748;">
            <strong>${safeGuestName}</strong> respondió a "${eventName}": ${asistenciaLinea}.
          </p>
          ${safeMessage ? `<p style="font-size: 14px; line-height: 21px; color: #616565; font-style: italic;">"${safeMessage}"</p>` : ''}
          <a href="${link}" style="${BUTTON_STYLE}">Ver todas las confirmaciones</a>
        </div>
      </div>
    `,
  }
}

export function expiryWarningEmail({
  eventName,
  link,
  daysLeft,
}: {
  eventName: string
  link: string
  daysLeft: number
}) {
  return {
    subject: `Tu invitación "${eventName}" vence en ${daysLeft} días`,
    html: `
      <div style="${WRAPPER_STYLE}">
        <div style="${CARD_STYLE}">
          <p style="font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #a8927e; font-weight: 600;">Sello</p>
          <h1 style="font-size: 22px; margin: 8px 0 16px;">Tu invitación vence pronto</h1>
          <p style="font-size: 15px; line-height: 22px; color: #444748;">
            En ${daysLeft} días "${eventName}" dejará de estar disponible públicamente. Tus invitados no podrán confirmar asistencia después de esa fecha.
          </p>
          <a href="${link}" style="${BUTTON_STYLE}">Ver mi invitación</a>
        </div>
      </div>
    `,
  }
}
