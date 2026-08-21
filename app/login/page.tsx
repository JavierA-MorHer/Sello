'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.27V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/plantillas'

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    })

    setStatus(error ? 'error' : 'sent')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl">Sello</p>

        <div className="mt-8 rounded-sm border border-ink/8 bg-paper p-8 text-ink">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display text-2xl">Inicia sesión</h1>
              <p className="mt-2 font-body text-sm text-ink/60">
                Para armar y guardar tu invitación necesitas una cuenta.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex items-center justify-center gap-3 rounded-sm border border-ink/15 bg-paper py-3 font-body text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              <GoogleIcon />
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 font-body text-[9px] font-semibold tracking-[0.15em] text-ink/50">
              <div className="h-px flex-1 bg-ink/10" />
              O CON TU CORREO
              <div className="h-px flex-1 bg-ink/10" />
            </div>

            {status === 'sent' ? (
              <p className="font-body text-sm text-ink/70">
                Te enviamos un enlace a <strong>{email}</strong>. Ábrelo desde
                este mismo navegador.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-sm border border-ink/15 bg-paper px-3.5 py-3 font-body text-base text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-clay"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="rounded-sm bg-ink px-4 py-2.5 font-body text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:opacity-50"
                >
                  {status === 'sending' ? 'Enviando…' : 'Enviar enlace mágico'}
                </button>
                {status === 'error' && (
                  <p className="font-body text-sm text-error">
                    Algo falló al enviar el enlace. Intenta de nuevo.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
