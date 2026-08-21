import type { EmailOtpType } from '@supabase/supabase-js'
import { ConfirmButton } from './confirm-button'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>
}) {
  const { token_hash, type, next } = await searchParams

  if (!token_hash || !type) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-display text-2xl">Enlace inválido</h1>
          <p className="font-body text-ink/70">
            Pide un enlace nuevo desde la página de inicio de sesión.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4">
        <h1 className="font-display text-2xl">Confirmar acceso</h1>
        <p className="font-body text-sm text-ink/70">
          Por seguridad pedimos un clic extra aquí — algunos correos (como
          Gmail) visitan los enlaces automáticamente antes de que los abras.
        </p>
        <ConfirmButton
          tokenHash={token_hash}
          type={type as EmailOtpType}
          next={next ?? '/plantillas'}
        />
      </div>
    </main>
  )
}
