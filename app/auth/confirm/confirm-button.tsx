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
  next: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => confirmMagicLink(tokenHash, type, next))}
      className="stamp-button rounded-sm bg-vermilion-dark px-6 py-3 font-body text-sm font-semibold text-kraft disabled:opacity-50"
    >
      {isPending ? 'Confirmando…' : 'Confirmar acceso'}
    </button>
  )
}
