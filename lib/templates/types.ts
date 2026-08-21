export type FieldType = 'text' | 'textarea' | 'date' | 'time' | 'url' | 'group' | 'repeater'

interface BaseField {
  key: string
  label: string
  required?: boolean
}

export interface TextField extends BaseField {
  type: 'text' | 'textarea' | 'url'
  placeholder?: string
}

export interface DateField extends BaseField {
  type: 'date' | 'time'
}

export interface GroupField extends BaseField {
  type: 'group'
  fields: Field[]
}

export interface RepeaterField extends BaseField {
  type: 'repeater'
  itemLabel?: string
  min?: number
  max?: number
  fields: Field[]
}

export type Field = TextField | DateField | GroupField | RepeaterField

export interface FieldSchemaSection {
  id: string
  title: string
  /** Línea de ayuda mostrada bajo el título del paso en el wizard. Opcional. */
  description?: string
  fields: Field[]
}

export interface FieldSchema {
  sections: FieldSchemaSection[]
}
