function formatFechaEs(iso: string): string | null {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

/**
 * Título/descripción para el link preview (WhatsApp, etc.) de la página
 * pública del invitado — nunca el copy genérico de la landing.
 */
export function buildEventMetadataCopy(
  componentKey: string | undefined,
  customData: Record<string, unknown>
): { title: string; description: string } {
  const fecha = typeof customData.fecha_evento === 'string' ? formatFechaEs(customData.fecha_evento) : null
  const description = fecha
    ? `Estás invitado — ${fecha}. Entra para ver los detalles y confirmar tu asistencia.`
    : 'Estás invitado. Entra para ver los detalles y confirmar tu asistencia.'

  const str = (key: string) => (typeof customData[key] === 'string' ? (customData[key] as string) : undefined)

  switch (componentKey) {
    case 'BodaClasica':
    case 'BodaSaveTheDate': {
      const novia = str('nombre_novia')
      const novio = str('nombre_novio')
      return { title: novia && novio ? `Boda de ${novia} & ${novio}` : 'Nos casamos', description }
    }
    case 'XvAnos': {
      const nombre = str('nombre_festejada')
      return { title: nombre ? `Mis XV años · ${nombre}` : 'Mis XV años', description }
    }
    case 'Bautizo': {
      const nombre = str('nombre_bebe')
      return { title: nombre ? `Bautizo de ${nombre}` : 'Bautizo', description }
    }
    case 'BabyShower': {
      const nombre = str('nombre_bebe')
      return { title: nombre ? `Baby Shower de ${nombre}` : 'Baby Shower', description }
    }
    default:
      return { title: 'Estás invitado', description }
  }
}
