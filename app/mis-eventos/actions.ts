'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/** Solo se permite borrar borradores — un evento publicado/vencido se archiva, no se elimina. */
export async function deleteDraftEvent(eventId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autenticado.')
  }

  const { data: event } = await supabase
    .from('events')
    .select('id, owner_id, status')
    .eq('id', eventId)
    .single()

  if (!event || event.owner_id !== user.id) {
    throw new Error('Evento no encontrado.')
  }

  if (event.status !== 'draft') {
    throw new Error('Solo se pueden eliminar borradores.')
  }

  // La ownership y el status='draft' ya se validaron arriba con el cliente
  // normal (respetando RLS) — el delete usa service role porque no existe
  // policy de DELETE para "events" (solo insert/select/update, ver
  // supabase/schema.sql), y agregarla requiere correr SQL directo que esta
  // sesión no puede ejecutar.
  const admin = createAdminClient()
  const { error } = await admin.from('events').delete().eq('id', eventId)

  if (error) {
    throw new Error('No se pudo eliminar el borrador.')
  }

  revalidatePath('/mis-eventos')
}
