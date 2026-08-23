'use client'

import { useTransition } from 'react'
import { deleteDraftEvent } from './actions'

export function DeleteDraftButton({ eventId, eventName }: { eventId: string; eventName: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!window.confirm(`¿Eliminar el borrador "${eventName}"? Esta acción no se puede deshacer.`)) {
      return
    }
    startTransition(() => deleteDraftEvent(eventId))
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="inline-block rounded-sm border border-error/30 px-4 py-2 font-body text-xs font-semibold text-error transition-colors hover:border-error hover:bg-error/10 disabled:opacity-50"
    >
      {isPending ? 'Eliminando…' : 'Eliminar'}
    </button>
  )
}
