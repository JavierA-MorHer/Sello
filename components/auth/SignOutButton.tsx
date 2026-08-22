'use client'

import { useTransition } from 'react'
import { signOutAction } from '@/lib/auth/actions'

export function SignOutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => signOutAction())}
      className={
        className ??
        'font-body text-sm font-semibold text-ink/60 underline decoration-ink/30 underline-offset-2 transition-colors hover:text-ink disabled:opacity-50'
      }
    >
      {isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
    </button>
  )
}
