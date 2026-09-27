'use client'

import { useTransition } from 'react'
import type { EmailOtpType } from '@supabase/supabase-js'
import { confirmMagicLink } from './actions'

export function ConfirmButton({
  tokenHash,
  type,
  next,
}: {
  tokenHash: string
  type: EmailOtpType
  next: string | null
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => confirmMagicLink(tokenHash, type, next))}
      className="rounded-sm bg-ink px-6 py-3 font-body text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:opacity-50"
    >
      {isPending ? 'Confirmando…' : 'Confirmar acceso'}
    </button>
  )
}
