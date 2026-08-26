import { useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import type { Field } from '@/lib/templates/types'
import { RepeaterField } from './repeater-field'
import { GalleryField } from './gallery-field'
import { SlugField } from './slug-field'
import { UbicacionField } from './ubicacion-field'

const labelClass =
  'font-body text-xs font-semibold tracking-[0.05em] text-ink/60 uppercase'

const inputClass =
  'rounded-sm border border-ink/15 bg-paper px-3.5 py-3 font-body text-base text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-clay'

function TextareaCounter({ control, name, maxLength }: { control: Control<any>; name: string; maxLength: number }) {
  const value = useWatch({ control, name }) as string | undefined
  return (
    <span className="self-end font-body text-xs text-ink/40">
      {(value ?? '').length} de {maxLength} caracteres
    </span>
  )
}

export function FieldRenderer({
  field,
  name,
  register,
  control,
  eventId,
}: {
  field: Field
  name: string
  register: UseFormRegister<any>
  control: Control<any>
  eventId: string
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
            placeholder={field.placeholder}
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
            {...register(name, { required: field.required, maxLength: field.maxLength })}
            rows={3}
            maxLength={field.maxLength}
            className={`${inputClass} resize-none`}
          />
          {field.maxLength && <TextareaCounter control={control} name={name} maxLength={field.maxLength} />}
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

    case 'number':
      return (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>
            {labelText}
            {field.required && <span className="text-clay"> *</span>}
          </span>
          <input
            type="number"
            min={field.min}
            max={field.max}
            {...register(name, { required: field.required, valueAsNumber: true })}
            className={`${inputClass} sm:max-w-[10rem]`}
          />
        </label>
      )

    case 'select':
      return (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>
            {labelText}
            {field.required && <span className="text-clay"> *</span>}
          </span>
          <select
            {...register(name, { required: field.required })}
            defaultValue=""
            className={`${inputClass} sm:max-w-[16rem]`}
          >
            <option value="" disabled>
              Elige una opción
            </option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
              eventId={eventId}
            />
          ))}
        </fieldset>
      )

    case 'repeater':
      return (
        <RepeaterField field={field} name={name} register={register} control={control} eventId={eventId} />
      )

    case 'gallery':
      return (
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>{labelText}</span>
          <GalleryField field={field} name={name} control={control} eventId={eventId} />
        </div>
      )

    case 'slug':
      return (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>{labelText}</span>
          <SlugField field={field} name={name} control={control} />
        </label>
      )

    case 'ubicacion':
      return (
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>
            {labelText}
            {field.required && <span className="text-clay"> *</span>}
          </span>
          <UbicacionField field={field} name={name} control={control} />
        </div>
      )
  }
}
