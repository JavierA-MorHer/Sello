'use client'

import { useEffect, useRef } from 'react'
import { useController, useWatch, type Control } from 'react-hook-form'
import type { SlugField as SlugFieldType } from '@/lib/templates/types'
import { slugify } from '@/lib/text/slugify'

const LINK_PREFIX = 'sello.mx/'

export function SlugField({
  field,
  name,
  control,
}: {
  field: SlugFieldType
  name: string
  control: Control<any>
}) {
  const { field: controllerField } = useController({ control, name, defaultValue: '' })
  const sourceValues = useWatch({ control, name: field.sourceFields ?? [] }) as string[] | undefined
  const lastAutoValue = useRef<string>('')

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

  return (
    <div className="flex items-center rounded-sm border border-ink/15 bg-paper-2 px-3.5">
      <span className="font-body text-sm text-ink/45">{LINK_PREFIX}</span>
      <input
        value={controllerField.value ?? ''}
        onChange={(e) => {
          controllerField.onChange(slugify(e.target.value))
        }}
        className="flex-1 border-0 bg-transparent py-3 font-body text-base text-ink outline-none"
      />
    </div>
  )
}
