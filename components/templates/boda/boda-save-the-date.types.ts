import type { UbicacionValue } from '@/lib/templates/types'

export type SaveTheDateTema = 'salvia' | 'terracota' | 'tinta'
export type SaveTheDatePortada = 'tipografica' | 'foto'

export interface SaveTheDateMomento {
  hora: string
  titulo: string
}

export interface SaveTheDateTienda {
  nombre: string
  detalle?: string
  url?: string
}

export interface SaveTheDateData {
  tema?: SaveTheDateTema
  portada?: SaveTheDatePortada
  /** 'si' | 'no' — el formulario no tiene campo booleano, así que se modela como select. */
  sobre?: 'si' | 'no'
  cuenta_regresiva?: 'si' | 'no'
  nombre_novia: string
  nombre_novio: string
  fecha_evento: string
  ciudad?: string
  mensaje_calendario?: string
  hora_ceremonia?: string
  ceremonia_ubicacion: UbicacionValue
  hora_recepcion?: string
  recepcion_ubicacion: UbicacionValue
  itinerario?: SaveTheDateMomento[]
  vestimenta?: string
  vestimenta_nota?: string
  tiendas?: SaveTheDateTienda[]
  transferencia_banco?: string
  transferencia_clabe?: string
  /** Cuántos lugares trae cada invitación (1-20). Igual para todos los invitados: aún no hay pases individuales. */
  pases_por_invitacion?: number
  fecha_limite_rsvp?: string
}
