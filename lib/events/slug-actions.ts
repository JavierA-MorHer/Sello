'use server'

import { createClient } from '@/lib/supabase/server'
import { buildSlugSuggestions, slugify } from '@/lib/text/slugify'
import { filterFreeSlugs, findSlugBlocker } from '@/lib/events/slug'

export type SlugAvailability = {
  /** El slug ya normalizado con el que se hizo la consulta. */
  slug: string
  available: boolean
  /** Alternativas libres, solo cuando `available` es false. */
  suggestions: string[]
}

/**
 * Consulta si un link está libre, para poder avisarle al cliente mientras
 * escribe en vez de cambiárselo a sus espaldas al guardar.
 */
export async function checkSlugAvailability(eventId: string, slug: string): Promise<SlugAvailability> {
  const base = slugify(slug)
  const unavailable = { slug: base, available: false, suggestions: [] }

  if (!base) return unavailable

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return unavailable

  // Con el cliente normal (RLS): si el evento no es de quien pregunta, esto
  // no devuelve filas y la consulta se corta aquí.
  const { data: event } = await supabase
    .from('events')
    .select('id, template_id, custom_data')
    .eq('id', eventId)
    .single()

  if (!event) return unavailable

  const blocker = await findSlugBlocker(base, eventId, user.id)
  if (!blocker) return { slug: base, available: true, suggestions: [] }

  const { data: template } = await supabase
    .from('templates')
    .select('category')
    .eq('id', event.template_id)
    .single()

  const customData = (event.custom_data ?? {}) as Record<string, unknown>
  const fechaEvento = typeof customData.fecha_evento === 'string' ? customData.fecha_evento : undefined

  const candidates = buildSlugSuggestions(base, { fechaEvento, categoria: template?.category })

  return { slug: base, available: false, suggestions: await filterFreeSlugs(candidates) }
}
