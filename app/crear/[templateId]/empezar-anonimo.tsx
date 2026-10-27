'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Quien llega sin sesión empieza con un usuario anónimo de Supabase, sin
 * pedirle cuenta. Se hace en el navegador (no en el Server Component) para
 * que crawlers y prefetches — que no ejecutan este efecto — no creen usuarios.
 * Si los anonymous sign-ins están apagados en Supabase, cae al login de siempre.
 */
export function EmpezarAnonimo({ templateId }: { templateId: string }) {
  const router = useRouter()
  // StrictMode monta dos veces en desarrollo: sin esto se crean dos anónimos.
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    createClient()
      .auth.signInAnonymously()
      .then(({ error }) => {
        if (error) {
          router.replace(`/login?next=${encodeURIComponent(`/crear/${templateId}`)}`)
          return
        }
        router.refresh()
      })
  }, [router, templateId])

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <p className="font-body text-sm text-ink/60">Preparando tu invitación…</p>
    </main>
  )
}
