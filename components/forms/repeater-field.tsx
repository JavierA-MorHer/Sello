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
    <fieldset className="flex flex-col gap-4 rounded-sm border border-kraft-ink/15 p-4 sm:p-5">
      <legend className="px-1 font-display text-base font-bold">{field.label}</legend>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-sm border border-kraft-ink/10 bg-kraft-2/40 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold tracking-[0.1em] text-kraft-ink/90 uppercase">
              {field.itemLabel ?? 'Item'} {index + 1}
            </span>
            {canRemove && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="font-body text-xs font-semibold tracking-wide text-vermilion-dark underline decoration-vermilion-dark/40 underline-offset-2 hover:text-vermilion"
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
          className="self-start rounded-sm border border-kraft-ink/30 px-4 py-2 font-body text-sm font-semibold text-kraft-ink transition-colors hover:border-vermilion-dark hover:text-vermilion-dark"
        >
          + Agregar {field.itemLabel ?? 'item'}
        </button>
      )}
    </fieldset>
  )
}
