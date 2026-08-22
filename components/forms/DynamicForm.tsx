import type { Control, UseFormRegister } from 'react-hook-form'
import type { Field } from '@/lib/templates/types'
import { FieldRenderer } from './field-renderer'

/** Renderiza los campos de un solo paso del wizard (una sección del field_schema). */
export function DynamicForm({
  fields,
  register,
  control,
  eventId,
}: {
  fields: Field[]
  register: UseFormRegister<any>
  control: Control<any>
  eventId: string
}) {
  return (
    <div className="flex flex-col gap-5 rounded-sm border border-ink/8 bg-paper p-6 sm:p-8">
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          name={field.key}
          register={register}
          control={control}
          eventId={eventId}
        />
      ))}
    </div>
  )
}
