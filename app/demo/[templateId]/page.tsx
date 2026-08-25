import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import { DEMO_DATA } from '@/lib/templates/demoData'

/**
 * Demo público de una plantilla, sin necesidad de cuenta: usa datos de
 * ejemplo (lib/templates/demoData.ts) con el mismo componente que renderiza
 * la invitación real, para que el cliente decida antes de crear la suya.
 * `eventId={null}` deja el RSVP visible pero deshabilitado (mismo patrón
 * que el preview de /crear).
 */
export default async function DemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>
  searchParams: Promise<{ bare?: string }>
}) {
  const { templateId } = await params
  const { bare } = await searchParams
  const supabase = await createClient()

  const { data: template } = await supabase
    .from('templates')
    .select('id, name, component_key')
    .eq('id', templateId)
    .eq('active', true)
    .single()

  if (!template) {
    notFound()
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[template.component_key]
  const demo = DEMO_DATA[template.component_key]

  if (!TemplateComponent || !demo) {
    notFound()
  }

  // ?bare=1: sin barra superior y recortado a un alto de pantalla (844px,
  // ver PhoneFramePreview) — es el modo que usa el iframe del thumbnail en
  // TemplateCard. overflow hidden evita el scrollbar del iframe: se ve como
  // una foto fija del primer tramo de la invitación, no una página con scroll.
  if (bare === '1') {
    return (
      <div style={{ height: 844, overflow: 'hidden' }}>
        <TemplateComponent custom_data={demo.custom_data} fotos={demo.fotos} eventId={null} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3.5 sm:px-6">
        <Link
          href="/plantillas"
          className="font-body text-sm font-semibold text-paper/85 transition-colors hover:text-paper"
        >
          ← Plantillas
        </Link>
        <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-paper/60 uppercase">
          Demo · {template.name}
        </span>
        <Link
          href={`/crear/${template.id}`}
          className="rounded-sm bg-clay px-3.5 py-2 font-body text-xs font-semibold text-paper transition-colors hover:bg-clay-light"
        >
          Crear la mía →
        </Link>
      </div>

      <TemplateComponent custom_data={demo.custom_data} fotos={demo.fotos} eventId={null} />
    </div>
  )
}
