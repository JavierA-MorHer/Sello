import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function MisEventosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/mis-eventos')
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Mis eventos</h1>
      <p className="mt-2 text-gray-600">Sesión iniciada como {user.email}.</p>
    </main>
  )
}
