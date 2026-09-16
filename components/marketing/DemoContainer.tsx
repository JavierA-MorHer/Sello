'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import { TEMPLATE_THEMES } from '@/lib/templates/themes'
import { TrackEvent } from '@/components/analytics/TrackEvent'

interface DemoContainerProps {
  templateId: string
  templateName: string
  templateCategory: string
  componentKey: string
  initialCustomData: Record<string, unknown>
  fotos: string[]
  backHref: string
  initialTema?: string
}

export function DemoContainer({
  templateId,
  templateName,
  templateCategory,
  componentKey,
  initialCustomData,
  fotos,
  backHref,
  initialTema,
}: DemoContainerProps) {
  const TemplateComponent = TEMPLATE_COMPONENTS[componentKey]
  const themes = TEMPLATE_THEMES[componentKey] ?? []

  const defaultTheme =
    initialTema && themes.some((t) => t.id === initialTema)
      ? initialTema
      : (initialCustomData.tema as string | undefined) ?? themes[0]?.id

  const [activeTheme, setActiveTheme] = useState<string | undefined>(defaultTheme)

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId)

    // Actualizar la URL con el tema seleccionado sin recargar la página
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tema', themeId)
      window.history.replaceState({}, '', url.toString())
    }
  }

  const customData =
    themes.length > 0 && activeTheme
      ? { ...initialCustomData, tema: activeTheme }
      : initialCustomData

  if (!TemplateComponent) {
    return null
  }

  return (
    <div className="min-h-screen bg-paper">
      <TrackEvent
        event="ViewContent"
        params={{
          content_name: templateName,
          content_ids: [templateId],
          content_type: 'product',
          content_category: templateCategory,
        }}
      />

      <div className="sticky top-0 z-30 bg-ink shadow-md">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href={backHref}
            className="font-body text-sm font-semibold text-paper/85 transition-colors hover:text-paper"
          >
            ← Plantillas
          </Link>

          <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-paper/60 uppercase">
            Demo · {templateName}
          </span>

          <Link
            href={`/crear/${templateId}`}
            className="rounded-sm bg-clay px-3.5 py-2 font-body text-xs font-semibold text-paper transition-colors hover:bg-clay-light"
          >
            Crear la mía →
          </Link>
        </div>

        {/* Selector de temas (si la plantilla dispone de múltiples temas) */}
        {themes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-paper/10 bg-ink/95 px-4 py-2 sm:gap-3">
            <span className="font-body text-[11px] font-medium tracking-wider text-paper/50 uppercase">
              Tema:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {themes.map((t) => {
                const isSelected = activeTheme === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTheme(t.id)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-paper text-ink shadow-sm ring-1 ring-paper'
                        : 'bg-paper/10 text-paper/75 hover:bg-paper/20 hover:text-paper'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <TemplateComponent custom_data={customData} fotos={fotos} eventId={null} />
    </div>
  )
}
