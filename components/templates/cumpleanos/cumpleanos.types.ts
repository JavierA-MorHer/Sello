import type { UbicacionValue } from '@/lib/templates/types'

export type CumpleanosTema = 'mujer' | 'hombre' | 'neutro'

export interface CumpleanosMomento {
  hora: string
  titulo: string
}

export interface CumpleanosData {
  tema?: CumpleanosTema
  nombre_festejado: string
  edad: number
  fecha_evento: string
  /** Mensaje/cita casual del anfitrión, no una cita bíblica — ej. "Cumplir años sola no tiene chiste. Ven a celebrarlo conmigo." */
  mensaje?: string
  lugar_ubicacion: UbicacionValue
  hora?: string
  momentos?: CumpleanosMomento[]
  dresscode?: string
  dresscode_nota?: string
  /** Cuántos lugares trae cada invitación (1-20). Se aplica igual a todos los invitados: aún no hay pases individuales por invitado. */
  lugares_por_invitacion?: number
  fecha_limite_rsvp?: string
}
