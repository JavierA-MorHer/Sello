export function getPriceRangeForCategory(category: string): string {
  return category === 'boda' ? '$700–1,200' : '$500–900'
}

/**
 * Precio fijo a cobrar (MXN, pesos enteros) — Checkout necesita un monto
 * exacto, no un rango. Elegido dentro del rango de `getPriceRangeForCategory`;
 * ajústalo aquí si cambian los precios de lanzamiento.
 */
export function getPriceMXNForCategory(category: string): number {
  return category === 'boda' ? 900 : 700
}
