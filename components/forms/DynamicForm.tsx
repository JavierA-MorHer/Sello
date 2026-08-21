'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldSchema } from '@/lib/templates/types'
import { FieldRenderer } from './field-renderer'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DEBOUNCE_MS = 1000

function SaveStatusLine({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null

  return (
    <p className="flex items-center gap-2 font-body text-sm text-kraft-ink/80">
      {status === 'saving' && (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vermilion-dark" />
          Guardando…
        </>
      )}
      {status === 'saved' && (
        <>
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 text-vermilion-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 8.5 6.5 12 13 4" />
          </svg>
          Cambios guardados
        </>
      )}
      {status === 'error' && (
        <span className="text-vermilion-dark">
          No se pudo guardar — revisa tu conexión
        </span>
      )}
    </p>
  )
}

export function DynamicForm({
  schema,
  defaultValues,
  onAutosave,
}: {
  schema: FieldSchema
  defaultValues?: Record<string, unknown>
  onAutosave: (data: Record<string, unknown>) => Promise<void>
}) {
  const { register, control, watch } = useForm({ defaultValues })
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(async () => {
        setStatus('saving')
        try {
          await onAutosave(values as Record<string, unknown>)
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
  }, [watch, onAutosave])

  return (
    <form className="kraft-texture rounded-sm bg-kraft p-6 text-kraft-ink shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] sm:p-10">
      <div className="relative z-10 flex flex-col gap-10">
        {schema.sections.map((section, i) => (
          <section key={section.id} className="flex flex-col gap-5">
            <div className="flex items-baseline gap-3 border-b border-kraft-ink/15 pb-3">
              <span className="font-body text-xs font-semibold text-kraft-ink/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display text-2xl font-bold">{section.title}</h2>
            </div>
            <div className="flex flex-col gap-5">
              {section.fields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  name={field.key}
                  register={register}
                  control={control}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="sticky bottom-4 self-start">
          <SaveStatusLine status={status} />
        </div>
      </div>
    </form>
  )
}
