import type { UbicacionValue } from '@/lib/templates/types'
import { buildEmbedUrl } from '@/lib/maps/urls'

/**
 * Mapa embebido "tonto" — recibe la ubicación ya resuelta (lat/lng/place_id)
 * y solo renderiza el iframe. Usado igual en preview y en la página pública
 * del invitado porque ambas comparten el mismo componente de plantilla.
 */
export function MapaUbicacion({
  ubicacion,
  className,
}: {
  ubicacion?: UbicacionValue
  className?: string
}) {
  if (!ubicacion || !ubicacion.lat || !ubicacion.lng) return null

  const embedUrl = buildEmbedUrl(ubicacion)
  if (!embedUrl) return null

  return (
    <div className={className}>
      <iframe
        key={embedUrl}
        src={embedUrl}
        title={ubicacion.lugar || 'Ubicación'}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  )
}
