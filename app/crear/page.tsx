import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Punto de entrada único para "Crear invitación" en toda la navegación
 * (menú, landing, etc.) — decide a dónde mandar al usuario en vez de que
 * cada link tenga que saberlo:
 * - Sin cuenta / sin eventos todavía → elegir plantilla.
 * - Ya tiene al menos un evento (borrador o publicado) → su dashboard.
 */
export default async function CrearEntryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/crear')
  }

  const { count } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  if (!count) {
    redirect('/plantillas')
  }

  redirect('/mis-eventos')
}
