/**
 * Integración "free tier": el embed y el link de búsqueda de Google Maps por
 * query no requieren API key (a diferencia de Places/Directions/Static Maps).
 */
function buildQuery(parts: (string | undefined)[]): string | null {
  const query = parts.filter(Boolean).join(', ').trim()
  return query.length > 0 ? query : null
}

export function buildMapsSearchUrl(...parts: (string | undefined)[]): string | null {
  const query = buildQuery(parts)
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}` : null
}

export function buildMapsEmbedUrl(...parts: (string | undefined)[]): string | null {
  const query = buildQuery(parts)
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : null
}
