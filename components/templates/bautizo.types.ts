import type { UbicacionValue } from '@/lib/templates/types'

export interface BautizoEvento {
  hora: string
  titulo: string
  descripcion?: string
}

export interface BautizoPadrino {
  nombre: string
  rol?: string
}

export interface BautizoRegalo {
  tienda: string
  url?: string
}

export interface BautizoData {
  nombre_bebe: string
  nombre_padres?: string
  frase_bienvenida?: string
  fecha_evento: string
  hora_misa?: string
  iglesia_ubicacion: UbicacionValue
  recepcion_ubicacion?: UbicacionValue
  eventos?: BautizoEvento[]
  padrinos?: BautizoPadrino[]
  opciones?: BautizoRegalo[]
  fecha_limite_rsvp?: string
  mensaje_rsvp?: string
}
