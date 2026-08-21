import type { Control, UseFormRegister } from 'react-hook-form'
import type { Field } from '@/lib/templates/types'
import { RepeaterField } from './repeater-field'

const labelClass =
  'font-body text-xs font-semibold tracking-[0.05em] text-ink/60 uppercase'

const inputClass =
  'rounded-sm border border-ink/15 bg-paper px-3.5 py-3 font-body text-base text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-clay'

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
            {field.required && <span className="text-clay"> *</span>}
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
            {field.required && <span className="text-clay"> *</span>}
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
            {field.required && <span className="text-clay"> *</span>}
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
        <fieldset className="flex flex-col gap-4 rounded-sm border border-ink/10 p-4 sm:p-5">
          <legend className="px-1 font-display text-base">
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
