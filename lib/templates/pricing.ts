/** Formatea un precio en pesos mexicanos, ej. `formatMXN(900)` → "$900 MXN". */
export function formatMXN(priceMXN: number): string {
  return `$${priceMXN.toLocaleString('es-MX')} MXN`
}

/**
 * Menor precio entre plantillas activas de una categoría, para mostrar
 * "Desde $X MXN" sin inventar un rango — cada plantilla ya trae su propio
 * `price_mxn` real desde la base de datos (ver supabase/add-template-pricing.sql).
 */
export function minPriceMXN(templates: { category: string; price_mxn: number }[], category: string): number | null {
  const prices = templates.filter((t) => t.category === category).map((t) => t.price_mxn)
  return prices.length > 0 ? Math.min(...prices) : null
}
