'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/shared/Modal'
import { deleteDraftEvent } from './actions'

export function DeleteDraftButton({ eventId, eventName }: { eventId: string; eventName: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await deleteDraftEvent(eventId)
      setConfirmOpen(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="inline-block rounded-sm border border-error/30 px-4 py-2 font-body text-xs font-semibold text-error transition-colors hover:border-error hover:bg-error/10"
      >
        Eliminar
      </button>

      {confirmOpen && (
        <Modal
          title="Eliminar borrador"
          onClose={() => setConfirmOpen(false)}
          actions={
            <>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-sm border border-ink/20 px-4 py-2 font-body text-xs font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirm}
                className="rounded-sm bg-error px-4 py-2 font-body text-xs font-semibold text-paper transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? 'Eliminando…' : 'Eliminar'}
              </button>
            </>
          }
        >
          ¿Eliminar el borrador &ldquo;{eventName}&rdquo;? Esta acción no se puede deshacer.
        </Modal>
      )}
    </>
  )
}
