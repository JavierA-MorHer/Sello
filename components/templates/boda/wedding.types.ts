import type { UbicacionValue } from '@/lib/templates/types'

export interface WeddingEvento {
  hora: string
  titulo: string
  descripcion?: string
}

export interface WeddingRegalo {
  tienda: string
  url?: string
}

export interface WeddingData {
  nombre_novia: string
  nombre_novio: string
  frase_bienvenida?: string
  fecha_evento: string
  hora_ceremonia?: string
  ceremonia_ubicacion: UbicacionValue
  recepcion_ubicacion: UbicacionValue
  eventos?: WeddingEvento[]
  opciones?: WeddingRegalo[]
  fecha_limite_rsvp?: string
  mensaje_rsvp?: string
}
