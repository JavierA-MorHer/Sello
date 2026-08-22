// PRODUCT.md sección "Vigencia de la invitación" deja N sin definir y sugiere
// 6 meses — se implementa ese valor sugerido, no una decisión nueva. Si el
// dueño del producto define otro N, solo hay que cambiar esta constante.
export const EXPIRATION_MONTHS_AFTER_EVENT = 6

/** `fecha_evento + N meses` (o "ahora + N meses" si no hay fecha capturada todavía). */
export function computeExpiresAt(fechaEventoIso: string | undefined): Date {
  const base = fechaEventoIso ? new Date(`${fechaEventoIso}T00:00:00`) : new Date()
  const target = Number.isNaN(base.getTime()) ? new Date() : base

  const expires = new Date(target)
  expires.setMonth(expires.getMonth() + EXPIRATION_MONTHS_AFTER_EVENT)
  return expires
}
