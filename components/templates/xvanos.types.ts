export type XvAnosTema = 'noche' | 'esmeralda' | 'vino'

export interface XvAnosProgramaItem {
  hora: string
  titulo: string
}

export interface XvAnosTienda {
  nombre: string
  url?: string
}

export interface XvAnosData {
  tema?: XvAnosTema
  nombre_festejada: string
  fecha_evento: string
  padres: string
  padrinos?: string
  dedicatoria?: string
  iglesia_nombre: string
  iglesia_direccion: string
  iglesia_hora?: string
  recepcion_nombre: string
  recepcion_direccion: string
  recepcion_hora?: string
  programa?: XvAnosProgramaItem[]
  vestimenta?: string
  vestimenta_nota?: string
  tiendas?: XvAnosTienda[]
  /** Cuántos lugares trae cada invitación (1-20). Se aplica igual a todos los invitados: aún no hay pases individuales por invitado. */
  pases_por_invitacion?: number
  fecha_limite_rsvp?: string
}
