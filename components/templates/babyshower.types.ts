export type BabyShowerTema = 'neutro' | 'nino' | 'nina'

export interface BabyShowerPlanItem {
  hora: string
  titulo: string
}

export interface BabyShowerJuego {
  titulo: string
  descripcion?: string
}

export interface BabyShowerTienda {
  nombre: string
  detalle?: string
  url?: string
}

export interface BabyShowerData {
  tema?: BabyShowerTema
  nombre_bebe: string
  tagline?: string
  padres: string
  dedicatoria?: string
  fecha_evento: string
  hora_evento?: string
  lugar_nombre: string
  lugar_direccion: string
  plan?: BabyShowerPlanItem[]
  juegos?: BabyShowerJuego[]
  tiendas?: BabyShowerTienda[]
  talla_sugerida?: string
  fecha_limite_rsvp?: string
}
