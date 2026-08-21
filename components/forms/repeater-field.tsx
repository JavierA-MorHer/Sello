import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import type { RepeaterField as RepeaterFieldType } from '@/lib/templates/types'
import { FieldRenderer } from './field-renderer'

export function RepeaterField({
  field,
  name,
  register,
  control,
}: {
  field: RepeaterFieldType
  name: string
  register: UseFormRegister<any>
  control: Control<any>
}) {
  const { fields, append, remove } = useFieldArray({ control, name })
  const canAddMore = field.max === undefined || fields.length < field.max
  const canRemove = fields.length > (field.min ?? 0)

  return (
    <fieldset className="flex flex-col gap-4 rounded-sm border border-ink/10 p-4 sm:p-5">
      <legend className="px-1 font-display text-base">{field.label}</legend>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-sm border border-ink/8 bg-paper-3/50 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold tracking-[0.1em] text-ink/70 uppercase">
              {field.itemLabel ?? 'Item'} {index + 1}
            </span>
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
          {field.fields.map((subField) => (
            <FieldRenderer
              key={subField.key}
              field={subField}
              name={`${name}.${index}.${subField.key}`}
              register={register}
              control={control}
            />
          ))}
        </div>
      ))}

      {canAddMore && (
        <button
          type="button"
          onClick={() => append({})}
          className="self-start rounded-sm border border-ink/20 px-4 py-2 font-body text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
        >
          + Agregar {field.itemLabel ?? 'item'}
        </button>
      )}
    </fieldset>
  )
}
