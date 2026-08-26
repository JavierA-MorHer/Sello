export type FieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'time'
  | 'url'
  | 'select'
  | 'number'
  | 'group'
  | 'repeater'
  | 'gallery'
  | 'slug'
  | 'ubicacion'

interface BaseField {
  key: string
  label: string
  required?: boolean
}

export interface TextField extends BaseField {
  type: 'text' | 'textarea' | 'url'
  placeholder?: string
  /** Límite de caracteres (textarea) — se muestra un contador debajo del campo. */
  maxLength?: number
}

export interface DateField extends BaseField {
  type: 'date' | 'time'
}

export interface SelectField extends BaseField {
  type: 'select'
  options: { value: string; label: string }[]
}

export interface NumberField extends BaseField {
  type: 'number'
  min?: number
  max?: number
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
  /**
   * 'list' muestra cada item colapsado (hora + título) con Editar/Eliminar;
   * 'expanded' (default) muestra el mini-formulario completo siempre abierto.
   */
  display?: 'list' | 'expanded'
}

export interface GalleryField extends BaseField {
  type: 'gallery'
  min?: number
  max?: number
}

export interface SlugField extends BaseField {
  type: 'slug'
  /** Claves de otros campos del mismo paso a partir de las cuales se autogenera el link. */
  sourceFields?: string[]
}

/** Valor que guarda un campo `ubicacion` en `custom_data`. */
export interface UbicacionValue {
  lugar: string
  direccion: string
  lat: number
  lng: number
  place_id: string
}

export interface UbicacionField extends BaseField {
  type: 'ubicacion'
  placeholder?: string
}

export type Field =
  | TextField
  | DateField
  | SelectField
  | NumberField
  | GroupField
  | RepeaterField
  | GalleryField
  | SlugField
  | UbicacionField

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
