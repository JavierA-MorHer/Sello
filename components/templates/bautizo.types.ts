import type { UbicacionValue } from '@/lib/templates/types'

export type BautizoTema = 'agua' | 'oliva' | 'arena'

export interface BautizoOfrenda {
  rol: string
  nombre: string
}

export interface BautizoRegalo {
  tienda: string
  url?: string
}

export interface BautizoData {
  tema?: BautizoTema
  nombre_bebe: string
  fecha_evento: string
  /** Cita bíblica opcional — si viene vacía, la sección completa se omite. */
  cita?: string
  cita_ref?: string
  /** "Sus papás", ej. "Daniela Ortega y Rodrigo Lara". */
  papas: string
  /** "Sus padrinos de bautizo", ej. "Sofía Ortega y Emilio Vega". */
  padrinos_bautizo?: string
  /** Quién regala cada ofrenda del rito (ropón, vela, medalla, concha...). */
  padrinos_ofrenda?: BautizoOfrenda[]
  hora_misa?: string
  iglesia_ubicacion: UbicacionValue
  recepcion_hora?: string
  recepcion_ubicacion?: UbicacionValue
  detalle_titulo?: string
  detalle_nota?: string
  opciones?: BautizoRegalo[]
  /** Cuántos lugares trae cada invitación (1-20). Se aplica igual a todos los invitados: aún no hay pases individuales por invitado. */
  lugares_por_invitacion?: number
  fecha_limite_rsvp?: string
}
