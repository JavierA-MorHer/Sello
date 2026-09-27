'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { finishLoginAction, prepareLoginAction } from '@/lib/auth/actions'

// Google Identity Services (One Tap + botón oficial). El token de Google se
// canjea en el navegador con signInWithIdToken: no hay redirect, así que el
// cliente no pierde de vista su invitación. Sin NEXT_PUBLIC_GOOGLE_CLIENT_ID
// se cae al login con redirect de siempre (signInWithOAuth).
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GSI_SRC = 'https://accounts.google.com/gsi/client'

type GoogleCredentialResponse = { credential: string }

type GoogleIdentity = {
  initialize: (config: Record<string, unknown>) => void
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
  prompt: () => void
  cancel: () => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } }
  }
}

let gsiPromise: Promise<void> | null = null

function loadGsi(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  gsiPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GSI_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      gsiPromise = null
      reject(new Error('No cargó Google Identity Services'))
    }
    document.head.appendChild(script)
  })
  return gsiPromise
}

// Google firma el nonce hasheado dentro del id_token y Supabase compara
// contra el nonce en claro: evita que un token robado se reuse.
async function createNonce() {
  const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  const hashed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return { raw, hashed }
}

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

function GoogleRedirectButton({ next }: { next: string }) {
  async function handleGoogle() {
    await prepareLoginAction()
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="flex items-center justify-center gap-3 rounded-sm border border-ink/15 bg-paper py-3 font-body text-sm font-semibold text-ink transition-colors hover:border-ink/30"
    >
      <GoogleIcon />
      Continuar con Google
    </button>
  )
}

function GoogleOneTap({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const buttonRef = useRef<HTMLDivElement>(null)
  // GIS se inicializa una sola vez; el callback lee la versión más reciente.
  const onSignedInRef = useRef(onSignedIn)
  const [error, setError] = useState(false)
  const [failedToLoad, setFailedToLoad] = useState(false)

  useEffect(() => {
    onSignedInRef.current = onSignedIn
  }, [onSignedIn])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        await loadGsi()
      } catch {
        if (!cancelled) setFailedToLoad(true)
        return
      }
      if (cancelled || !buttonRef.current || !window.google) return

      const nonce = await createNonce()
      const gsi = window.google.accounts.id

      gsi.initialize({
        client_id: GOOGLE_CLIENT_ID,
        nonce: nonce.hashed,
        use_fedcm_for_prompt: true,
        itp_support: true,
        context: 'signin',
        callback: async ({ credential }: GoogleCredentialResponse) => {
          setError(false)
          await prepareLoginAction()
          const { error: signInError } = await createClient().auth.signInWithIdToken({
            provider: 'google',
            token: credential,
            nonce: nonce.raw,
          })
          if (signInError) {
            setError(true)
            return
          }
          await finishLoginAction()
          await onSignedInRef.current()
        },
      })

      gsi.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        locale: 'es',
        width: Math.min(buttonRef.current.offsetWidth || 320, 400),
      })
      gsi.prompt()
    })()

    return () => {
      cancelled = true
      window.google?.accounts.id.cancel()
    }
  }, [])

  // Bloqueadores de anuncios a veces tumban el script de Google.
  if (failedToLoad) return null

  return (
    <div className="flex flex-col gap-2">
      <div ref={buttonRef} className="flex min-h-11 w-full justify-center" />
      {error && (
        <p className="font-body text-sm text-error">
          No se pudo entrar con Google. Intenta de nuevo o usa tu correo.
        </p>
      )}
    </div>
  )
}

/**
 * Login con Google (One Tap / botón, sin redirect) o magic link. Se usa en
 * /login y en el modal del wizard.
 *
 * `onSignedIn`: qué hacer cuando el login se completó sin salir de la página
 * (Google). Por defecto navega a `next`. El magic link siempre regresa por
 * /auth/confirm a `next`.
 */
export function LoginPanel({
  next,
  onSignedIn,
}: {
  next: string
  onSignedIn?: () => Promise<void> | void
}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSignedIn() {
    if (onSignedIn) {
      await onSignedIn()
      return
    }
    router.push(next)
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    await prepareLoginAction()
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
    <div className="flex flex-col gap-6">
      {GOOGLE_CLIENT_ID ? (
        <GoogleOneTap onSignedIn={handleSignedIn} />
      ) : (
        <GoogleRedirectButton next={next} />
      )}

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
  )
}
