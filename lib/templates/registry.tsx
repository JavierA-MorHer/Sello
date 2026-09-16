import type { ComponentType } from 'react'
import { BodaClasica } from '@/components/templates/boda/BodaClasica'
import { XvAnos } from '@/components/templates/xv-anos/XvAnos'
import { Bautizo } from '@/components/templates/bautizo/Bautizo'
import { BabyShower } from '@/components/templates/baby-shower/BabyShower'
import { Cumpleanos } from '@/components/templates/cumpleanos/Cumpleanos'

/**
 * `custom_data` llega como jsonb sin validar desde Supabase — cada
 * componente de plantilla declara su propio tipo específico (WeddingData,
 * XvAnosData, etc.) y este registro solo necesita saber que existe. El
 * `as ComponentType<EventTemplateProps>` de abajo es el único punto donde se
 * afloja ese tipo, igual que ya se hace en cada call site con
 * `custom_data as WeddingData`.
 */
export type EventTemplateProps = {
  custom_data: Record<string, unknown>
  fotos?: string[]
  eventId?: string | null
}

/** Mapea `templates.component_key` al componente "tonto" que renderiza esa plantilla. */
export const TEMPLATE_COMPONENTS: Record<string, ComponentType<EventTemplateProps>> = {
  BodaClasica: BodaClasica as unknown as ComponentType<EventTemplateProps>,
  XvAnos: XvAnos as unknown as ComponentType<EventTemplateProps>,
  Bautizo: Bautizo as unknown as ComponentType<EventTemplateProps>,
  BabyShower: BabyShower as unknown as ComponentType<EventTemplateProps>,
  Cumpleanos: Cumpleanos as unknown as ComponentType<EventTemplateProps>,
}
