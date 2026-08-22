'use server'

import { createClient } from '@/lib/supabase/server'

export async function autosaveDraft(eventId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { slug, ...custom_data } = data
  const update: Record<string, unknown> = { custom_data }

  if (typeof slug === 'string' && slug.trim().length > 0) {
    update.slug = slug.trim()
  }

  const { error } = await supabase.from('events').update(update).eq('id', eventId)

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ese link ya está en uso, prueba con otro.')
    }
    throw new Error('No se pudo guardar el borrador.')
  }
}
