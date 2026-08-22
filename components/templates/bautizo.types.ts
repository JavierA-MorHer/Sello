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
  iglesia_lugar: string
  iglesia_direccion: string
  recepcion_lugar?: string
  recepcion_direccion?: string
  eventos?: BautizoEvento[]
  padrinos?: BautizoPadrino[]
  opciones?: BautizoRegalo[]
  fecha_limite_rsvp?: string
  mensaje_rsvp?: string
}
