const COMBINING_DIACRITICS_START = 0x0300
const COMBINING_DIACRITICS_END = 0x036f

function stripDiacritics(value: string): string {
  let result = ''
  for (const char of value.normalize('NFD')) {
    const code = char.codePointAt(0) ?? 0
    if (code < COMBINING_DIACRITICS_START || code > COMBINING_DIACRITICS_END) {
      result += char
    }
  }
  return result
}

/** "Camila & Sebastián" -> "camila-sebastian" */
export function slugify(...parts: (string | undefined)[]): string {
  return stripDiacritics(parts.filter(Boolean).join(' '))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const PREFIJO_POR_CATEGORIA: Record<string, string> = {
  boda: 'boda',
  xv_anos: 'xv',
  bautizo: 'bautizo',
  baby_shower: 'babyshower',
}

/**
 * Alternativas para cuando el link deseado ya está ocupado. A propósito NO
 * se usa un contador ("-2"): eso delata que alguien más ya tenía el nombre y
 * hace ver la invitación como una de un lote. El año, la fecha y el tipo de
 * evento se leen como una decisión del cliente, no como un accidente.
 */
export function buildSlugSuggestions(
  base: string,
  { fechaEvento, categoria }: { fechaEvento?: string; categoria?: string }
): string[] {
  const suggestions: string[] = []

  if (fechaEvento) {
    const date = new Date(`${fechaEvento}T00:00:00`)
    if (!Number.isNaN(date.getTime())) {
      suggestions.push(`${base}-${date.getFullYear()}`)
      suggestions.push(`${base}-${date.getDate()}${MESES[date.getMonth()]}`)
    }
  }

  const prefijo = categoria ? PREFIJO_POR_CATEGORIA[categoria] : undefined
  if (prefijo) suggestions.push(`${prefijo}-${base}`)

  return suggestions
}
