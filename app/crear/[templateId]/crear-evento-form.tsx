'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { Field, FieldSchema } from '@/lib/templates/types'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { AppMenu } from '@/components/nav/AppMenu'
import { Modal } from '@/components/shared/Modal'
import { autosaveDraft, createCheckoutSession } from './actions'

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
  if (field.type === 'gallery') {
    const count = Array.isArray(raw) ? raw.length : 0
    return count === 0 ? 'Sin fotos' : `${count} foto${count === 1 ? '' : 's'}`
  }
  if (field.type === 'date') return formatDateEs(raw) || 'Sin llenar'
  if (raw === undefined || raw === null || raw === '' || (typeof raw === 'number' && Number.isNaN(raw))) return 'Sin llenar'
  if (field.type === 'select') return field.options.find((opt) => opt.value === raw)?.label ?? String(raw)
  if (field.type === 'ubicacion') {
    const ubicacion = raw as { lugar?: string; direccion?: string }
    return ubicacion.lugar || ubicacion.direccion || 'Sin llenar'
  }
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
        .filter(
          (field): field is Exclude<Field, { type: 'group' }> => field.type !== 'group'
        )
        .map((field) => ({ k: field.label, v: formatFieldValue(field, values[field.key]) })),
    }))
    .filter((section) => section.rows.length > 0)
}

function SaveStatusLine({
  status,
  errorMessage,
  slugNotice,
}: {
  status: SaveStatus
  errorMessage: string | null
  slugNotice: string | null
}) {
  if (slugNotice) {
    return <p className="h-4 font-body text-[11px] text-clay">{slugNotice}</p>
  }
  return (
    <p className="h-4 font-body text-[11px] text-ink/40">
      {status === 'saving' && 'Guardando…'}
      {status === 'saved' && 'Cambios guardados'}
      {status === 'error' && (
        <span className="text-error">{errorMessage ?? 'No se pudo guardar — revisa tu conexión'}</span>
      )}
    </p>
  )
}

function isFieldEmpty(field: Field, raw: unknown): boolean {
  if (field.type === 'repeater') {
    const items = Array.isArray(raw) ? raw.filter((item) => item && Object.values(item).some(Boolean)) : []
    return items.length === 0
  }
  if (field.type === 'gallery') return !Array.isArray(raw) || raw.length === 0
  if (field.type === 'number') return typeof raw !== 'number' || Number.isNaN(raw)
  return raw === undefined || raw === null || raw === ''
}

function findFirstMissingRequiredStep(
  schema: FieldSchema,
  values: Record<string, unknown>
): { stepIndex: number; label: string } | null {
  for (let i = 0; i < schema.sections.length; i++) {
    const missing = schema.sections[i].fields.find(
      (field) => field.type !== 'group' && field.required && isFieldEmpty(field, values[field.key])
    )
    if (missing) return { stepIndex: i, label: missing.label }
  }
  return null
}

function daysUntil(iso: unknown): number | null {
  if (typeof iso !== 'string' || !iso) return null
  const target = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86_400_000))
}

function CountdownPreview({ fechaEvento }: { fechaEvento: unknown }) {
  const days = daysUntil(fechaEvento)
  return (
    <div className="flex flex-col gap-1 rounded-sm bg-paper-2 p-4">
      <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-ink/50 uppercase">
        Cuenta regresiva
      </span>
      <span className="font-display text-2xl">{days === null ? '—' : `${days} días`}</span>
      <span className="font-body text-xs text-ink/60">Se actualiza sola en la invitación.</span>
    </div>
  )
}

export function CrearEventoForm({
  eventId,
  templateId,
  priceRange,
  schema,
  defaultValues,
}: {
  eventId: string
  templateId: string
  priceRange: string
  schema: FieldSchema
  defaultValues: Record<string, unknown>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = Number.parseInt(searchParams.get('paso') ?? '', 10)
  const [stepIndex, setStepIndex] = useState(
    Number.isNaN(initialStep) ? 0 : Math.max(0, Math.min(initialStep, schema.sections.length))
  )
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPaying, startPayTransition] = useTransition()
  const payError = searchParams.get('error') === 'pago'
  const linkError = searchParams.get('error') === 'link'
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [missingFieldAlert, setMissingFieldAlert] = useState<{ stepIndex: number; label: string } | null>(null)
  const [slugNotice, setSlugNotice] = useState<string | null>(null)
  const slugNoticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const { register, control, watch, getValues } = useForm({ defaultValues })

  // El link no se cambia solo: si está ocupado se avisa y el cliente elige.
  // Esto cubre el caso de estar en otro paso del wizard, donde no se ve el
  // aviso que el propio campo del link ya muestra en línea.
  function noteSlugTaken(slugTaken: boolean | undefined) {
    if (!slugTaken) return
    setSlugNotice('Ese link ya está ocupado — elige otro para poder publicar.')
    if (slugNoticeTimeoutRef.current) clearTimeout(slugNoticeTimeoutRef.current)
    slugNoticeTimeoutRef.current = setTimeout(() => setSlugNotice(null), 5000)
  }

  async function handlePay() {
    const missing = findFirstMissingRequiredStep(schema, getValues())
    if (missing) {
      setMissingFieldAlert(missing)
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const result = await autosaveDraft(eventId, getValues()).catch(() => undefined)

    // El link que se ve en el formulario no se pudo guardar porque está
    // ocupado: seguir al pago publicaría uno distinto al que el cliente eligió.
    if (result?.slugTaken) {
      noteSlugTaken(true)
      return
    }

    startPayTransition(() => createCheckoutSession(eventId, stepIndex))
  }

  async function openPreview() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setStatus('saving')
    try {
      const result = await autosaveDraft(eventId, getValues())
      noteSlugTaken(result?.slugTaken)
      setStatus('saved')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : null)
    } finally {
      router.push(`/crear/${templateId}/preview?paso=${stepIndex}`)
    }
  }

  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(async () => {
        setStatus('saving')
        try {
          const result = await autosaveDraft(eventId, values as Record<string, unknown>)
          noteSlugTaken(result?.slugTaken)
          setStatus('saved')
          setErrorMessage(null)
        } catch (err) {
          setStatus('error')
          setErrorMessage(err instanceof Error ? err.message : null)
        }
      }, AUTOSAVE_DEBOUNCE_MS)
    })

    return () => {
      subscription.unsubscribe()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (slugNoticeTimeoutRef.current) clearTimeout(slugNoticeTimeoutRef.current)
    }
  }, [watch, eventId])

  const totalSteps = schema.sections.length + 1
  const isReview = stepIndex === schema.sections.length
  const currentSection = isReview ? null : schema.sections[stepIndex]

  function goToStep(index: number) {
    const next = Math.max(0, Math.min(index, schema.sections.length))
    setStepIndex(next)
    router.replace(`/crear/${templateId}?paso=${next}`, { scroll: false })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-ink/8 bg-paper/95 px-4 pt-4 pb-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <AppMenu />
              <button
                type="button"
                onClick={() => (stepIndex === 0 ? router.push('/plantillas') : goToStep(stepIndex - 1))}
                className="font-body text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
              >
                ← Atrás
              </button>
            </div>
            <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-ink/50 uppercase">
              Paso {stepIndex + 1} de {totalSteps}
            </span>
            <button
              type="button"
              onClick={openPreview}
              className="rounded-sm border border-ink/15 px-3 py-2 font-body text-xs font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
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

          <SaveStatusLine status={status} errorMessage={errorMessage} slugNotice={slugNotice} />
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

            {payError && (
              <p className="font-body text-sm text-error">
                No se pudo iniciar el pago. Intenta de nuevo en un momento.
              </p>
            )}

            {linkError && (
              <p className="font-body text-sm text-error">
                Antes de pagar elige el link de tu invitación — el que querías ya está ocupado.
              </p>
            )}
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
              <DynamicForm
                fields={currentSection.fields}
                register={register}
                control={control}
                eventId={eventId}
              />
              {currentSection.fields.some((f) => f.key === 'fecha_evento') && (
                <CountdownPreview fechaEvento={watch('fecha_evento')} />
              )}
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
              disabled={isPaying}
              onClick={handlePay}
              className="w-full rounded-sm bg-ink py-4 text-center font-body text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying ? 'Redirigiendo a pago…' : `Pagar y publicar — ${priceRange}`}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={openPreview}
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

      {missingFieldAlert && (
        <Modal
          title="Falta un paso"
          onClose={() => setMissingFieldAlert(null)}
          actions={
            <button
              type="button"
              onClick={() => {
                goToStep(missingFieldAlert.stepIndex)
                setMissingFieldAlert(null)
              }}
              className="rounded-sm bg-ink px-4 py-2 font-body text-xs font-semibold text-paper transition-colors hover:bg-clay"
            >
              Ir al paso
            </button>
          }
        >
          Te falta completar &ldquo;{missingFieldAlert.label}&rdquo; antes de publicar.
        </Modal>
      )}
    </div>
  )
}
