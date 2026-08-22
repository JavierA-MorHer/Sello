'use client'

import { useWatch, type Control } from 'react-hook-form'
import type { MapField as MapFieldType } from '@/lib/templates/types'
import { buildMapsEmbedUrl, buildMapsSearchUrl } from '@/lib/text/maps'

/**
 * Vista previa automática con Google Maps (el embed/search por query no
 * necesita API key — la versión "de paga" es Places/Directions/Static Maps).
 * No guarda ningún valor propio: se arma en vivo a partir de otros campos.
 */
export function MapField({
  field,
  control,
}: {
  field: MapFieldType
  name: string
  control: Control<any>
}) {
  const sourceValues = useWatch({ control, name: field.sourceFields }) as string[]
  const embedUrl = buildMapsEmbedUrl(...sourceValues)
  const searchUrl = buildMapsSearchUrl(...sourceValues)

  if (!embedUrl) {
    return (
      <div className="flex h-[150px] items-center justify-center rounded-sm border border-dashed border-ink/20 bg-paper-2 font-body text-xs text-ink/40">
        El mapa aparece cuando llenes el lugar y la dirección
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[150px] overflow-hidden rounded-sm border border-ink/10">
        <iframe
          key={embedUrl}
          src={embedUrl}
          title={field.label}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      {searchUrl && (
        <a
          href={searchUrl}
          target="_blank"
          rel="noreferrer"
          className="self-start font-body text-xs font-semibold tracking-[0.05em] text-clay underline decoration-clay/40 underline-offset-2 hover:decoration-clay"
        >
          Abrir en Google Maps ↗
        </a>
      )}
    </div>
  )
}
