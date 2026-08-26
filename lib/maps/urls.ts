import type { UbicacionValue } from '@/lib/templates/types'

/** Link para que el invitado abra direcciones desde su propia app de mapas. */
export function buildDirectionsUrl(ubicacion: UbicacionValue): string {
  const params = new URLSearchParams({
    api: '1',
    destination: `${ubicacion.lat},${ubicacion.lng}`,
  })
  if (ubicacion.place_id) params.set('destination_place_id', ubicacion.place_id)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

/**
 * Requiere NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Maps Embed API). Si no está
 * configurada, devuelve null y el llamador debe omitir el iframe.
 */
export function buildEmbedUrl(ubicacion: UbicacionValue): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const params = new URLSearchParams({
    key: apiKey,
    q: ubicacion.place_id ? `place_id:${ubicacion.place_id}` : `${ubicacion.lat},${ubicacion.lng}`,
  })
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`
}
