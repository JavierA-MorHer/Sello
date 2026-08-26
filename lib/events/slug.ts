import { createAdminClient } from '@/lib/supabase/admin'
import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * Helpers de disponibilidad de slug. Van con el cliente admin a propósito:
 * con el cliente normal, RLS esconde los eventos de otros usuarios, así que
 * un slug ocupado por alguien más se vería como "libre" y el choque saldría
 * hasta el constraint de la base. Solo se expone un booleano, nunca datos
 * del otro evento.
 */

type SlugHolder = { id: string; owner_id: string; status: string }

/**
 * Devuelve quién bloquea el slug, o null si está libre. Un borrador sin
 * pagar del mismo usuario NO bloquea: su link nunca se compartió, así que
 * el cliente puede reclamar ese nombre para su evento nuevo.
 */
export async function findSlugBlocker(
  slug: string,
  eventId: string,
  userId: string
): Promise<SlugHolder | null> {
  const admin = createAdminClient()

  const { data: holder } = await admin
    .from('events')
    .select('id, owner_id, status')
    .eq('slug', slug)
    .neq('id', eventId)
    .maybeSingle()

  if (!holder) return null
  if (holder.owner_id === userId && holder.status === 'draft') return null

  return holder
}

/** De una lista de candidatos, deja solo los que nadie tiene tomados. */
export async function filterFreeSlugs(candidates: string[]): Promise<string[]> {
  if (candidates.length === 0) return []

  const admin = createAdminClient()
  const { data: taken } = await admin.from('events').select('slug').in('slug', candidates)
  const takenSet = new Set((taken ?? []).map((row) => row.slug))

  return candidates.filter((candidate) => !takenSet.has(candidate))
}

/**
 * Libera el slug si lo tenía un borrador sin pagar del mismo usuario, para
 * que su evento nuevo pueda quedarse con el nombre. Está acotado a `status
 * = 'draft'` y al mismo `owner_id`: nunca puede tocar un evento publicado ni
 * uno de alguien más.
 */
export async function releaseOwnDraftSlug(
  supabase: SupabaseServerClient,
  slug: string,
  eventId: string,
  userId: string
): Promise<void> {
  await supabase
    .from('events')
    .update({ slug: `borrador-${crypto.randomUUID().slice(0, 8)}` })
    .eq('slug', slug)
    .eq('owner_id', userId)
    .eq('status', 'draft')
    .neq('id', eventId)
}
