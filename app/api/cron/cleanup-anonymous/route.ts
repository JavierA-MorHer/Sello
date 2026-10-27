import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const DAY_MS = 86_400_000
// Confirmado con el dueño del producto (2026-09-27): un borrador anónimo que
// nunca se asoció a una cuenta se borra a los 30 días de creado.
const ANON_TTL_DAYS = 30
const PER_PAGE = 1000
// Tope por corrida para no pasarse del tiempo máximo de la función; lo que
// quede se limpia al día siguiente.
const MAX_USERS_PER_RUN = 200
const BUCKET = 'event-photos'

export const maxDuration = 60

/**
 * Corre diario (ver vercel.json). Borra usuarios anónimos (lib/auth/anonymous.ts)
 * de más de 30 días junto con sus borradores y las fotos que subieron.
 *
 * No toca ARCHITECTURE.md §7: eso es la vigencia de eventos PAGADOS. Aquí
 * solo entran borradores 'draft' de usuarios sin cuenta — si un anónimo
 * tuviera un evento en otro estado (no debería: pagar exige cuenta), se
 * salta completo por seguridad.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const cutoff = Date.now() - ANON_TTL_DAYS * DAY_MS

  // La API de admin no filtra por is_anonymous: hay que paginar todo auth.users.
  const stale: string[] = []
  for (let page = 1; stale.length < MAX_USERS_PER_RUN; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: PER_PAGE })
    if (error) {
      console.error('[cron cleanup-anonymous] listUsers falló:', error)
      break
    }
    for (const user of data.users) {
      if (user.is_anonymous && new Date(user.created_at).getTime() < cutoff) {
        stale.push(user.id)
      }
    }
    if (data.users.length < PER_PAGE) break
  }

  let deletedUsers = 0
  let deletedEvents = 0
  let skipped = 0

  for (const userId of stale.slice(0, MAX_USERS_PER_RUN)) {
    try {
      const { data: events } = await supabase
        .from('events')
        .select('id, status')
        .eq('owner_id', userId)

      if ((events ?? []).some((event) => event.status !== 'draft')) {
        skipped++
        continue
      }

      for (const event of events ?? []) {
        const { data: files } = await supabase.storage.from(BUCKET).list(event.id, { limit: 1000 })
        if (files && files.length > 0) {
          await supabase.storage.from(BUCKET).remove(files.map((file) => `${event.id}/${file.name}`))
        }
      }

      if (events && events.length > 0) {
        const { error } = await supabase.from('events').delete().eq('owner_id', userId).eq('status', 'draft')
        if (error) throw error
        deletedEvents += events.length
      }

      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error
      deletedUsers++
    } catch (err) {
      console.error('[cron cleanup-anonymous] No se pudo limpiar', userId, err)
    }
  }

  return NextResponse.json({ ok: true, deletedUsers, deletedEvents, skipped })
}
