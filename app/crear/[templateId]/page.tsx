import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { FieldSchema } from '@/lib/templates/types'
import { getPriceRangeForCategory } from '@/lib/templates/pricing'
import { CrearEventoForm } from './crear-evento-form'

export default async function CrearEventoPage({
  params,
}: {
  params: Promise<{ templateId: string }>
}) {
  const { templateId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/crear/${templateId}`)}`)
  }

  const { data: template } = await supabase
    .from('templates')
    .select('id, category, field_schema')
    .eq('id', templateId)
    .single()

  if (!template) {
    notFound()
  }

  const { data: existingDraft } = await supabase
    .from('events')
    .select('id, slug, custom_data')
    .eq('owner_id', user.id)
    .eq('template_id', templateId)
    .eq('status', 'draft')
    .maybeSingle()

  const draft =
    existingDraft ??
    (await (async () => {
      const { data: created, error } = await supabase
        .from('events')
        .insert({
          owner_id: user.id,
          template_id: templateId,
          slug: `borrador-${crypto.randomUUID().slice(0, 8)}`,
          custom_data: {},
        })
        .select('id, slug, custom_data')
        .single()

      if (error || !created) {
        throw new Error('No se pudo crear el borrador del evento.')
      }

      return created
    })())

  // El slug placeholder (borrador-xxxxxxxx) no es un link real elegido por el
  // cliente — se muestra vacío para que el campo "slug" del wizard lo
  // autogenere a partir de los nombres en cuanto los llene.
  const isPlaceholderSlug = draft.slug.startsWith('borrador-')

  return (
    <main className="min-h-screen bg-paper">
      <CrearEventoForm
        eventId={draft.id}
        templateId={templateId}
        priceRange={getPriceRangeForCategory(template.category)}
        schema={template.field_schema as FieldSchema}
        defaultValues={{
          ...(draft.custom_data as Record<string, unknown>),
          slug: isPlaceholderSlug ? '' : draft.slug,
        }}
      />
    </main>
  )
}
