export interface BabyShowerEvento {
  hora: string
  titulo: string
  descripcion?: string
}

export interface BabyShowerRegalo {
  tienda: string
  url?: string
}

export interface BabyShowerData {
  nombre_mama: string
  nombre_bebe?: string
  sexo_bebe?: string
  frase_bienvenida?: string
  fecha_evento: string
  hora_evento?: string
  lugar_nombre: string
  lugar_direccion: string
  eventos?: BabyShowerEvento[]
  opciones?: BabyShowerRegalo[]
  fecha_limite_rsvp?: string
  mensaje_rsvp?: string
}
