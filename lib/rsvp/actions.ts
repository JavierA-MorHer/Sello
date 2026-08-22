'use server'

import { createAdminClient } from '@/lib/supabase/admin'

const PUBLISHED_STATUSES = ['active', 'expiring_soon']

/**
 * Server Action pública (la llama cualquier invitado, sin sesión) — por eso
 * usa el cliente con service role (RLS no tiene policy de insert pública a
 * propósito, ver supabase/schema.sql) y por eso mismo revalida aquí que el
 * evento exista y esté publicado antes de guardar nada.
 */
export async function submitRsvp(
  eventId: string,
  data: { name: string; attending: boolean; plusOnes: number }
) {
  const name = data.name.trim()
  if (!name) {
    throw new Error('Escribe tu nombre.')
  }

  const supabase = createAdminClient()

  const { data: event } = await supabase.from('events').select('status').eq('id', eventId).single()

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

  const { error: rsvpError } = await supabase
    .from('rsvp_responses')
    .insert({ guest_id: guest.id, attending: data.attending, plus_ones: plusOnes })

  if (rsvpError) {
    throw new Error('No se pudo guardar tu confirmación. Intenta de nuevo.')
  }
}
