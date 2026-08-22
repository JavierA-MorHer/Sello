import type { ComponentType } from 'react'
import { BodaClasica } from '@/components/templates/BodaClasica'
import type { WeddingData } from '@/components/templates/wedding.types'

type WeddingTemplateProps = { custom_data: WeddingData; fotos?: string[] }

/** Mapea `templates.component_key` al componente "tonto" que renderiza esa plantilla. */
export const TEMPLATE_COMPONENTS: Record<string, ComponentType<WeddingTemplateProps>> = {
  BodaClasica,
}
