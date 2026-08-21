import type { Control, UseFormRegister } from 'react-hook-form'
import type { Field } from '@/lib/templates/types'
import { RepeaterField } from './repeater-field'

const labelClass =
  'font-body text-xs font-semibold tracking-[0.1em] text-kraft-ink/80 uppercase'

const inputClass =
  'border-0 border-b-2 border-kraft-ink/25 bg-transparent px-0.5 py-1.5 font-body text-base text-kraft-ink outline-none transition-colors placeholder:text-kraft-ink/30 focus:border-vermilion-dark'

export function FieldRenderer({
  field,
  name,
  register,
  control,
}: {
  field: Field
  name: string
  register: UseFormRegister<any>
  control: Control<any>
}) {
  const labelText = field.label

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>
            {labelText}
            {field.required && <span className="text-vermilion-dark"> *</span>}
          </span>
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            {...register(name, { required: field.required })}
            className={inputClass}
          />
        </label>
      )

    case 'textarea':
      return (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>
            {labelText}
            {field.required && <span className="text-vermilion-dark"> *</span>}
          </span>
          <textarea
            {...register(name, { required: field.required })}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </label>
      )

    case 'date':
    case 'time':
      return (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>
            {labelText}
            {field.required && <span className="text-vermilion-dark"> *</span>}
          </span>
          <input
            type={field.type}
            {...register(name, { required: field.required })}
            className={`${inputClass} sm:max-w-[16rem]`}
          />
        </label>
      )

    case 'group':
      return (
        <fieldset className="flex flex-col gap-4 rounded-sm border border-kraft-ink/15 p-4 sm:p-5">
          <legend className="px-1 font-display text-base font-bold">
            {field.label}
          </legend>
          {field.fields.map((subField) => (
            <FieldRenderer
              key={subField.key}
              field={subField}
              name={`${name}.${subField.key}`}
              register={register}
              control={control}
            />
          ))}
        </fieldset>
      )

    case 'repeater':
      return <RepeaterField field={field} name={name} register={register} control={control} />
  }
}
