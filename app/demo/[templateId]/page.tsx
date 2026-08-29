import type { Metadata } from 'next'
import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import { DEMO_DATA } from '@/lib/templates/demoData'
import { TrackEvent } from '@/components/analytics/TrackEvent'

// Cómo se nombra cada categoría en el texto de cara a buscadores. Es la
// palabra que la gente escribe en Google ("invitaciones digitales para
// bautizo"), no la etiqueta interna de la base de datos.
const CATEGORIA_EN_TEXTO: Record<string, string> = {
  boda: 'boda',
  xv_anos: 'XV años',
  bautizo: 'bautizo',
  baby_shower: 'baby shower',
  generico: 'evento',
}

// cache() dedupea la consulta entre generateMetadata y el render — ambos
// corren para el mismo request (mismo patrón que app/evento/[slug]/page.tsx).
const getTemplate = cache(async (templateId: string) => {
  const supabase = await createClient()

  const { data } = await supabase
    .from('templates')
    .select('id, name, category, component_key')
    .eq('id', templateId)
    .eq('active', true)
    .single()

  return data
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>
}): Promise<Metadata> {
  const { templateId } = await params
  const template = await getTemplate(templateId)

  if (!template) return { title: 'Plantilla no encontrada' }

  const categoria = CATEGORIA_EN_TEXTO[template.category] ?? 'evento'
  // La keyword va primero (es lo que Google trunca menos) y "plantilla"
  // evita que se lea repetido cuando el nombre ya trae la categoría dentro,
  // como en "XV Años".
  const title = `Invitación digital para ${categoria} — plantilla ${template.name}`
  const description = `Así se ve la plantilla ${template.name}: invitación digital de ${categoria} con confirmación de asistencia, ubicación y enlace para compartir por WhatsApp. Pago único, sin suscripción.`

  return {
    title,
    description,
    // Todas las variantes (incluida ?bare=1, que usan los thumbnails) apuntan
    // a la misma URL limpia para no partir la señal entre duplicados.
    alternates: { canonical: `/demo/${templateId}` },
    openGraph: { title, description, url: `/demo/${templateId}`, type: 'article' },
  }
}

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
  const template = await getTemplate(templateId)

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
  // Sin TrackEvent: es un thumbnail, no una visita real a la plantilla.
  if (bare === '1') {
    return (
      <div style={{ height: 844, overflow: 'hidden' }}>
        <TemplateComponent custom_data={demo.custom_data} fotos={demo.fotos} eventId={null} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <TrackEvent
        event="ViewContent"
        params={{
          content_name: template.name,
          content_ids: [template.id],
          content_type: 'product',
          content_category: template.category,
        }}
      />

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
