export interface XvAnosEvento {
  hora: string
  titulo: string
  descripcion?: string
}

export interface XvAnosPadrino {
  nombre: string
  rol?: string
}

export interface XvAnosRegalo {
  tienda: string
  url?: string
}

export interface XvAnosData {
  nombre_festejada: string
  frase_bienvenida?: string
  fecha_evento: string
  hora_misa?: string
  iglesia_lugar: string
  iglesia_direccion: string
  recepcion_lugar: string
  recepcion_direccion: string
  eventos?: XvAnosEvento[]
  padrinos?: XvAnosPadrino[]
  opciones?: XvAnosRegalo[]
  fecha_limite_rsvp?: string
  mensaje_rsvp?: string
}
