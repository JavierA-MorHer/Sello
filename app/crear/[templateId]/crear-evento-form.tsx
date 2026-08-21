'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Field, FieldSchema } from '@/lib/templates/types'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { autosaveDraft } from './actions'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DEBOUNCE_MS = 1000

function formatDateEs(iso: unknown): string {
  if (typeof iso !== 'string' || !iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function formatFieldValue(field: Field, raw: unknown): string {
  if (field.type === 'repeater') {
    const items = Array.isArray(raw) ? raw.filter((item) => item && Object.values(item).some(Boolean)) : []
    if (items.length === 0) return 'Sin agregar'
    return `${items.length} ${field.itemLabel ? field.itemLabel.toLowerCase() + (items.length === 1 ? '' : 's') : 'elementos'}`
  }
  if (field.type === 'date') return formatDateEs(raw) || 'Sin llenar'
  if (raw === undefined || raw === null || raw === '') return 'Sin llenar'
  return String(raw)
}

function summarizeSchema(
  schema: FieldSchema,
  values: Record<string, unknown>
): { section: string; rows: { k: string; v: string }[] }[] {
  return schema.sections
    .map((section) => ({
      section: section.title,
      rows: section.fields
        .filter((field): field is Exclude<Field, { type: 'group' }> => field.type !== 'group')
        .map((field) => ({ k: field.label, v: formatFieldValue(field, values[field.key]) })),
    }))
    .filter((section) => section.rows.length > 0)
}

function SaveStatusLine({ status }: { status: SaveStatus }) {
  return (
    <p className="h-4 font-body text-[11px] text-ink/40">
      {status === 'saving' && 'Guardando…'}
      {status === 'saved' && 'Cambios guardados'}
      {status === 'error' && <span className="text-error">No se pudo guardar — revisa tu conexión</span>}
    </p>
  )
}

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
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const { register, control, watch, getValues } = useForm({ defaultValues })

  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(async () => {
        setStatus('saving')
        try {
          await autosaveDraft(eventId, values as Record<string, unknown>)
          setStatus('saved')
        } catch {
          setStatus('error')
        }
      }, AUTOSAVE_DEBOUNCE_MS)
    })

    return () => {
      subscription.unsubscribe()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [watch, eventId])

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center">
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
      </div>
    )
  }

  const totalSteps = schema.sections.length + 1
  const isReview = stepIndex === schema.sections.length
  const currentSection = isReview ? null : schema.sections[stepIndex]

  function goToStep(index: number) {
    setStepIndex(Math.max(0, Math.min(index, schema.sections.length)))
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-ink/8 bg-paper/95 px-4 pt-4 pb-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => (stepIndex === 0 ? setStarted(false) : goToStep(stepIndex - 1))}
              className="font-body text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
            >
              ← Atrás
            </button>
            <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-ink/50 uppercase">
              Paso {stepIndex + 1} de {totalSteps}
            </span>
            <button
              type="button"
              disabled={isReview}
              onClick={() => goToStep(schema.sections.length)}
              className="rounded-sm border border-ink/15 px-3 py-2 font-body text-xs font-semibold text-ink transition-colors hover:border-clay hover:text-clay disabled:cursor-not-allowed disabled:opacity-40"
            >
              Preview
            </button>
          </div>

          <div className="flex gap-[5px]">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-[3px] flex-1 rounded-full ${i <= stepIndex ? 'bg-ink' : 'bg-ink/10'}`}
              />
            ))}
          </div>

          <SaveStatusLine status={status} />
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
        {isReview ? (
          <>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">Revisión</h2>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/70">
                Antes de pagar, confirma que todo esté correcto. Puedes volver
                a cualquier paso para corregirlo.
              </p>
            </div>

            <div className="flex flex-col gap-6 rounded-sm border border-ink/8 bg-paper p-6 sm:p-8">
              {summarizeSchema(schema, getValues()).map((section) => (
                <div key={section.section} className="flex flex-col gap-2.5">
                  <span className="font-body text-xs font-semibold tracking-[0.1em] text-ink/50 uppercase">
                    {section.section}
                  </span>
                  {section.rows.map((row) => (
                    <div key={row.k} className="flex items-baseline justify-between gap-4 font-body text-sm">
                      <span className="text-ink/60">{row.k}</span>
                      <span className="text-right font-medium">{row.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 rounded-sm bg-clay/12 p-4">
              <span className="font-body text-xs font-semibold tracking-[0.08em] text-clay uppercase">
                Falta un paso
              </span>
              <span className="font-body text-sm leading-relaxed text-ink/70">
                Tu invitación está lista, pero lleva marca de agua hasta que
                completes el pago único de {priceRange}.
              </span>
            </div>
          </>
        ) : (
          currentSection && (
            <>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl">{currentSection.title}</h2>
                {currentSection.description && (
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/70">
                    {currentSection.description}
                  </p>
                )}
              </div>
              <DynamicForm fields={currentSection.fields} register={register} control={control} />
            </>
          )
        )}
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 bg-linear-to-t from-paper from-40% to-transparent px-4 pt-3.5 pb-5 sm:px-6">
        <div className="mx-auto flex max-w-2xl gap-2.5">
          {isReview ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-sm border border-ink/15 bg-paper-2 py-4 text-center font-body text-sm font-semibold text-ink/40"
            >
              Pagar y publicar — próximamente
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => goToStep(schema.sections.length)}
                className="flex-none rounded-sm border border-ink/20 px-4 py-3.5 font-body text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
              >
                Ver
              </button>
              <button
                type="button"
                onClick={() => goToStep(stepIndex + 1)}
                className="flex-1 rounded-sm bg-ink py-4 font-body text-[15px] font-semibold text-paper transition-colors hover:bg-clay"
              >
                {stepIndex === schema.sections.length - 1 ? 'Revisar' : 'Siguiente'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
