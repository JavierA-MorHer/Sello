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
