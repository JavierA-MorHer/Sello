const WRAPPER_STYLE =
  'font-family: Georgia, serif; background: #fdf8f8; color: #1c1b1b; padding: 40px 24px;'
const CARD_STYLE =
  'max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid rgba(28,27,27,.08);'
const BUTTON_STYLE =
  'display: inline-block; margin-top: 20px; background: #1c1b1b; color: #fdf8f8; text-decoration: none; padding: 14px 24px; border-radius: 4px; font-weight: 600;'

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
