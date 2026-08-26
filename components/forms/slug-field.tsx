'use client'

import { useEffect, useRef, useState } from 'react'
import { useController, useWatch, type Control } from 'react-hook-form'
import type { SlugField as SlugFieldType } from '@/lib/templates/types'
import { slugify } from '@/lib/text/slugify'
import { checkSlugAvailability, type SlugAvailability } from '@/lib/events/slug-actions'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'misello.com.mx'
const CHECK_DEBOUNCE_MS = 500

export function SlugField({
  field,
  name,
  control,
  eventId,
}: {
  field: SlugFieldType
  name: string
  control: Control<any>
  eventId: string
}) {
  const { field: controllerField } = useController({ control, name, defaultValue: '' })
  const sourceValues = useWatch({ control, name: field.sourceFields ?? [] }) as string[] | undefined
  const lastAutoValue = useRef<string>('')
  const [result, setResult] = useState<SlugAvailability | null>(null)

  const value: string = controllerField.value ?? ''

  useEffect(() => {
    const autoSlug = slugify(...(sourceValues ?? []))
    if (!autoSlug || autoSlug === lastAutoValue.current) return

    const current = controllerField.value ?? ''
    if (current === '' || current === lastAutoValue.current) {
      controllerField.onChange(autoSlug)
    }
    lastAutoValue.current = autoSlug
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo debe reaccionar a cambios de los campos fuente
  }, [JSON.stringify(sourceValues)])

  useEffect(() => {
    if (!value) return
    let cancelled = false

    const timeout = setTimeout(async () => {
      try {
        const availability = await checkSlugAvailability(eventId, value)
        if (!cancelled) setResult(availability)
      } catch {
        // Sin conexión: se deja sin veredicto en vez de mentir con un "libre".
      }
    }, CHECK_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [value, eventId])

  // El veredicto solo vale para el texto con el que se consultó — mientras el
  // cliente sigue escribiendo no se muestra un estado viejo.
  const current = result && result.slug === value ? result : null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center rounded-sm border border-ink/15 bg-paper-2 px-3.5">
        <input
          value={value}
          onChange={(e) => controllerField.onChange(slugify(e.target.value))}
          className="flex-1 border-0 bg-transparent py-3 font-body text-base text-ink outline-none"
        />
        <span className="font-body text-sm text-ink/45">.{ROOT_DOMAIN}</span>
      </div>

      {value && !current && (
        <span className="font-body text-xs text-ink/40">Revisando disponibilidad…</span>
      )}

      {current?.available && (
        <span className="font-body text-xs text-ink/50">Este link está disponible.</span>
      )}

      {current && !current.available && (
        <div className="flex flex-col gap-1.5">
          <span className="font-body text-xs text-clay">
            Ese link ya está ocupado. Escribe otro
            {current.suggestions.length > 0 ? ' o elige una opción:' : '.'}
          </span>
          {current.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {current.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => controllerField.onChange(suggestion)}
                  className="rounded-full border border-ink/15 px-3 py-1.5 font-body text-xs text-ink/70 transition-colors hover:border-clay hover:text-clay"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
