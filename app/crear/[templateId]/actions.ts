'use server'

import { createClient } from '@/lib/supabase/server'

export async function autosaveDraft(eventId: string, data: Record<string, unknown>) {
  const supabase = await createClient()

  const { error } = await supabase.from('events').update({ custom_data: data }).eq('id', eventId)

  if (error) {
    throw new Error('No se pudo guardar el borrador.')
  }
}
