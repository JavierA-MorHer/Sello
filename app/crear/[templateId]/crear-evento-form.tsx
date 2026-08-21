'use client'

import { useState } from 'react'
import type { FieldSchema } from '@/lib/templates/types'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { StampFrame } from '@/components/marketing/StampFrame'
import { WeddingArchVignette } from '@/components/marketing/WeddingArchVignette'
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
        <p className="font-body text-xs font-semibold tracking-[0.3em] text-kraft/60 uppercase">
          Vas a armar
        </p>

        <StampFrame className="mt-6 aspect-[4/5] w-56 bg-kraft shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="flex h-full flex-col p-5 text-kraft-ink">
            <div className="flex items-center justify-between font-body text-[9px] font-semibold tracking-[0.25em]">
              <span>SELLO</span>
              <span>MÉXICO</span>
            </div>
            <div className="flex flex-1 items-center justify-center px-2 py-1 text-kraft-ink/80">
              <WeddingArchVignette className="h-full w-full" />
            </div>
            <div className="flex items-end justify-between">
              <span className="font-display text-base leading-tight font-bold">
                {templateName}
              </span>
              <div className="text-right font-display">
                <div className="text-sm leading-none font-bold">{priceRange}</div>
                <div className="text-[8px] tracking-[0.2em]">MXN</div>
              </div>
            </div>
          </div>
        </StampFrame>

        <h1 className="mt-8 font-display text-3xl font-bold text-kraft">
          {templateName}
        </h1>
        <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-kraft/70">
          Llena tus datos con autosave — puedes cerrar el navegador y retomar
          después. Verás una vista previa con marca de agua antes de pagar.
        </p>

        <button
          type="button"
          onClick={() => setStarted(true)}
          className="stamp-button mt-9 rounded-sm bg-vermilion-dark px-8 py-4 font-body text-base font-semibold text-kraft"
        >
          Comenzar a llenar →
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 font-display text-2xl font-bold text-kraft">
        {templateName}
      </h1>
      <DynamicForm
        schema={schema}
        defaultValues={defaultValues}
        onAutosave={(data) => autosaveDraft(eventId, data)}
      />
    </div>
  )
}
