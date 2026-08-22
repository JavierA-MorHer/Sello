import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import type { FieldSchema } from '@/lib/templates/types'
import { PreviewWatermark } from '@/components/preview/PreviewWatermark'

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>
  searchParams: Promise<{ paso?: string }>
}) {
  const { templateId } = await params
  const { paso } = await searchParams
  const editHref = paso ? `/crear/${templateId}?paso=${paso}` : `/crear/${templateId}`
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/crear/${templateId}/preview`)}`)
  }

  const { data: template } = await supabase
    .from('templates')
    .select('component_key, field_schema')
    .eq('id', templateId)
    .single()

  if (!template) {
    notFound()
  }

  const { data: draft } = await supabase
    .from('events')
    .select('custom_data')
    .eq('owner_id', user.id)
    .eq('template_id', templateId)
    .eq('status', 'draft')
    .maybeSingle()

  if (!draft) {
    notFound()
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[template.component_key]

  if (!TemplateComponent) {
    notFound()
  }

  const { fotos, ...custom_data } = draft.custom_data as Record<string, unknown> & { fotos?: string[] }
  const reviewStepIndex = (template.field_schema as FieldSchema).sections.length

  return (
    <div className="min-h-screen bg-paper">
      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3.5 sm:px-6">
        <Link
          href={editHref}
          className="font-body text-sm font-semibold text-paper/85 transition-colors hover:text-paper"
        >
          ← Editar
        </Link>
        <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-paper/60 uppercase">
          Vista previa · sin publicar
        </span>
        <Link
          href={`/crear/${templateId}?paso=${reviewStepIndex}`}
          className="rounded-sm bg-clay px-3.5 py-2 font-body text-xs font-semibold text-paper transition-colors hover:bg-clay-light"
        >
          Publicar
        </Link>
      </div>

      <div className="relative">
        <PreviewWatermark />
        {/* eventId=null: el RSVP queda deshabilitado en modo preview (ver ARCHITECTURE.md §8). */}
        <TemplateComponent custom_data={custom_data} fotos={fotos} eventId={null} />
      </div>
    </div>
  )
}
