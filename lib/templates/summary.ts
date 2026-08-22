/**
 * Título legible de un evento a partir de su categoría — para el dashboard,
 * emails y notificaciones. Es la única excepción "hardcodeada" por categoría
 * en todo el flujo: es puramente de despliegue (no genera campos de
 * formulario), así que no rompe la convención de formularios 100% dirigidos
 * por field_schema.
 */
export function getEventTitle(category: string, customData: Record<string, unknown>): string {
  const str = (key: string) => (typeof customData[key] === 'string' ? (customData[key] as string) : undefined)

  switch (category) {
    case 'boda': {
      const novia = str('nombre_novia')
      const novio = str('nombre_novio')
      return [novia, novio].filter(Boolean).join(' & ') || 'Boda sin nombre'
    }
    case 'xv_anos':
      return str('nombre_festejada') ?? 'XV años'
    case 'bautizo':
      return str('nombre_bebe') ?? 'Bautizo'
    case 'baby_shower':
      return str('nombre_mama') ?? 'Baby shower'
    default:
      return 'Evento'
  }
}
