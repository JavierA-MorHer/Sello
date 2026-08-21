export interface WeddingEvento {
  hora: string
  titulo: string
  descripcion?: string
}

export interface WeddingRegalo {
  tienda: string
  url?: string
  numero_mesa?: string
}

export interface WeddingData {
  nombre_novia: string
  nombre_novio: string
  frase_bienvenida?: string
  fecha_evento: string
  hora_ceremonia: string
  ceremonia_lugar: string
  ceremonia_direccion: string
  ceremonia_mapa_url?: string
  recepcion_lugar: string
  recepcion_direccion: string
  recepcion_mapa_url?: string
  eventos?: WeddingEvento[]
  opciones?: WeddingRegalo[]
  fecha_limite_rsvp?: string
  mensaje_rsvp?: string
}
