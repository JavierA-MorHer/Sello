'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import { rsvpNotificationEmail } from '@/lib/email/templates'
import { getEventTitle } from '@/lib/templates/summary'

const PUBLISHED_STATUSES = ['active', 'expiring_soon']
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

/**
 * Server Action pública (la llama cualquier invitado, sin sesión) — por eso
 * usa el cliente con service role (RLS no tiene policy de insert pública a
 * propósito, ver supabase/schema.sql) y por eso mismo revalida aquí que el
 * evento exista y esté publicado antes de guardar nada.
 */
export async function submitRsvp(
  eventId: string,
  data: { name: string; attending: boolean; plusOnes: number; message?: string }
) {
  const name = data.name.trim()
  if (!name) {
    throw new Error('Escribe tu nombre.')
  }

  const supabase = createAdminClient()

  const { data: event } = await supabase
    .from('events')
    .select('status, owner_id, template_id, custom_data')
    .eq('id', eventId)
    .single()

  if (!event || !PUBLISHED_STATUSES.includes(event.status)) {
    throw new Error('Esta invitación ya no acepta confirmaciones.')
  }

  const plusOnes = data.attending ? Math.max(0, Math.floor(data.plusOnes)) : 0

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .insert({ event_id: eventId, name, group_size: plusOnes + 1 })
    .select('id')
    .single()

  if (guestError || !guest) {
    throw new Error('No se pudo guardar tu confirmación. Intenta de nuevo.')
  }

  const message = data.message?.trim() || null

  const { error: rsvpError } = await supabase
    .from('rsvp_responses')
    .insert({ guest_id: guest.id, attending: data.attending, plus_ones: plusOnes, message })

  if (rsvpError) {
    throw new Error('No se pudo guardar tu confirmación. Intenta de nuevo.')
  }

  // Notificación al dueño del evento — "best effort": el RSVP ya se guardó,
  // así que un fallo aquí no debe hacer fallar la confirmación del invitado.
  try {
    const { data: template } = await supabase
      .from('templates')
      .select('category')
      .eq('id', event.template_id)
      .single()

    const { data: owner } = await supabase.auth.admin.getUserById(event.owner_id)
    const ownerEmail = owner?.user?.email

    if (ownerEmail) {
      const eventName = template
        ? getEventTitle(template.category, (event.custom_data ?? {}) as Record<string, unknown>)
        : 'tu evento'
      const link = `${APP_URL}/mis-eventos/${eventId}/invitados`
      const { subject, html } = rsvpNotificationEmail({
        eventName,
        guestName: name,
        attending: data.attending,
        plusOnes,
        message,
        link,
      })
      await sendEmail({ to: ownerEmail, subject, html })
    }
  } catch (err) {
    console.error('[rsvp] No se pudo notificar al dueño del evento:', err)
  }
}
