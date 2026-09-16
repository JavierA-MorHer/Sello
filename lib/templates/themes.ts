export interface TemplateThemeOption {
  id: string
  label: string
  color: string
}

/**
 * Temas disponibles por `component_key` para la vista de demo.
 * Alineados oficialmente con los labels de cada `.schema.json`.
 */
export const TEMPLATE_THEMES: Record<string, TemplateThemeOption[]> = {
  Bautizo: [
    { id: 'agua', label: 'Agua', color: '#3f6980' },
    { id: 'oliva', label: 'Oliva', color: '#556349' },
    { id: 'arena', label: 'Arena', color: '#7a5b39' },
  ],
  XvAnos: [
    { id: 'esmeralda', label: 'Esmeralda', color: '#0f1a17' },
    { id: 'noche', label: 'Noche (dorado)', color: '#17121a' },
    { id: 'vino', label: 'Vino', color: '#1c1013' },
  ],
  Cumpleanos: [
    { id: 'mujer', label: 'Pedrería', color: '#8a3fa8' },
    { id: 'hombre', label: 'Grafito', color: '#c07a3e' },
    { id: 'neutro', label: 'Confeti', color: '#c2553a' },
  ],
  BabyShower: [
    { id: 'neutro', label: 'Neutro', color: '#4fb6a5' },
    { id: 'nino', label: 'Niño', color: '#4a86c9' },
    { id: 'nina', label: 'Niña', color: '#e0698e' },
  ],
}
