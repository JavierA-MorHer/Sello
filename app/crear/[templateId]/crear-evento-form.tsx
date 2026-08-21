'use client'

import { useState } from 'react'
import type { FieldSchema } from '@/lib/templates/types'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { autosaveDraft } from './actions'

export function CrearEventoForm({
  eventId,
  templateName,
  priceRange,
  schema,
  defaultValues,
}: {
  eventId: string
  templateName: string
  priceRange: string
  schema: FieldSchema
  defaultValues: Record<string, unknown>
}) {
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <p className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
          Vas a armar
        </p>

        <div className="mt-6 flex aspect-[5/7] w-56 flex-col items-center justify-center gap-3 rounded-sm border border-clay/40 bg-paper-2 px-6 text-center">
          <span className="font-display text-xl leading-tight">{templateName}</span>
          <div className="h-px w-6 bg-ink/20" />
          <span className="font-body text-xs font-semibold tracking-[0.14em] text-ink/60 uppercase">
            {priceRange}
          </span>
        </div>

        <h1 className="mt-8 font-display text-3xl">{templateName}</h1>
        <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-ink/60">
          Llena tus datos con autosave — puedes cerrar el navegador y retomar
          después. Verás una vista previa con marca de agua antes de pagar.
        </p>

        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-9 rounded-sm bg-ink px-8 py-4 font-body text-base font-semibold text-paper transition-colors hover:bg-clay"
        >
          Comenzar a llenar →
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 font-display text-2xl">{templateName}</h1>
      <DynamicForm
        schema={schema}
        defaultValues={defaultValues}
        onAutosave={(data) => autosaveDraft(eventId, data)}
      />
    </div>
  )
}
