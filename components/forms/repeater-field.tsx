'use client'

import { useState } from 'react'
import { useFieldArray, useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import type { Field, RepeaterField as RepeaterFieldType } from '@/lib/templates/types'
import { FieldRenderer } from './field-renderer'

function RepeaterListRow({
  control,
  name,
  chipField,
  labelField,
  index,
  itemLabel,
  onEdit,
  onRemove,
  canRemove,
}: {
  control: Control<any>
  name: string
  chipField?: Field
  labelField?: Field
  index: number
  itemLabel: string
  onEdit: () => void
  onRemove: () => void
  canRemove: boolean
}) {
  const chipValue = useWatch({ control, name: chipField ? `${name}.${chipField.key}` : name })
  const labelValue = useWatch({ control, name: labelField ? `${name}.${labelField.key}` : name })

  return (
    <div className="flex items-center gap-3 rounded-sm border border-ink/8 bg-paper p-3">
      {chipField && (
        <span className="flex-none rounded-sm bg-paper-2 px-2.5 py-2 text-center font-body text-xs font-semibold text-ink/70">
          {(chipValue as string) || '—'}
        </span>
      )}
      <span className="flex-1 truncate font-body text-sm text-ink">
        {(labelValue as string) || `${itemLabel} ${index + 1}`}
      </span>
      <button
        type="button"
        onClick={onEdit}
        className="flex-none font-body text-xs font-semibold tracking-wide text-clay underline decoration-clay/40 underline-offset-2 hover:decoration-clay"
      >
        Editar
      </button>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-none font-body text-xs font-semibold tracking-wide text-error underline decoration-error/40 underline-offset-2 hover:decoration-error"
        >
          Eliminar
        </button>
      )}
    </div>
  )
}

export function RepeaterField({
  field,
  name,
  register,
  control,
  eventId,
}: {
  field: RepeaterFieldType
  name: string
  register: UseFormRegister<any>
  control: Control<any>
  eventId: string
}) {
  const { fields, append, remove } = useFieldArray({ control, name })
  const canAddMore = field.max === undefined || fields.length < field.max
  const canRemove = fields.length > (field.min ?? 0)
  const isListMode = field.display === 'list'
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const chipField = isListMode ? field.fields.find((f) => f.type === 'time') : undefined
  const labelField = isListMode ? field.fields.find((f) => f.type === 'text') : undefined

  return (
    <fieldset className="flex flex-col gap-4 rounded-sm border border-ink/10 p-4 sm:p-5">
      <legend className="px-1 font-display text-base">{field.label}</legend>

      {fields.map((item, index) => {
        const rowName = `${name}.${index}`
        const isExpanded = !isListMode || expandedIndex === index

        if (!isExpanded) {
          return (
            <RepeaterListRow
              key={item.id}
              control={control}
              name={rowName}
              chipField={chipField}
              labelField={labelField}
              index={index}
              itemLabel={field.itemLabel ?? 'Item'}
              onEdit={() => setExpandedIndex(index)}
              onRemove={() => remove(index)}
              canRemove={canRemove}
            />
          )
        }

        return (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-sm border border-ink/8 bg-paper-3/50 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-body text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
                {field.itemLabel ?? 'Item'} {index + 1}
              </span>
              <div className="flex items-center gap-4">
                {isListMode && (
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(null)}
                    className="font-body text-xs font-semibold tracking-wide text-ink/70 underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
                  >
                    Listo
                  </button>
                )}
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="font-body text-xs font-semibold tracking-wide text-error underline decoration-error/40 underline-offset-2 hover:decoration-error"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
            {field.fields.map((subField) => (
              <FieldRenderer
                key={subField.key}
                field={subField}
                name={`${rowName}.${subField.key}`}
                register={register}
                control={control}
                eventId={eventId}
              />
            ))}
          </div>
        )
      })}

      {canAddMore && (
        <button
          type="button"
          onClick={() => {
            append({})
            if (isListMode) setExpandedIndex(fields.length)
          }}
          className="self-start rounded-sm border border-ink/20 px-4 py-2 font-body text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
        >
          + Agregar {field.itemLabel ?? 'item'}
        </button>
      )}
    </fieldset>
  )
}
