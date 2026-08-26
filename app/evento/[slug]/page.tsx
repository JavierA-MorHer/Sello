import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import { buildEventMetadataCopy } from '@/lib/templates/metadataCopy'

// Solo estos dos estados corresponden a un evento pagado/publicado. 'draft'
// (no pagado), 'expired' y 'archived' nunca deben renderizarse aquí — esto
// es la segunda capa de defensa: la política RLS "publico lee eventos
// publicados" (supabase/rls-public-event-read.sql) ya bloquea la lectura a
// nivel de base de datos para cualquier otro estado.
const PUBLISHED_STATUSES = ['active', 'expiring_soon']

// cache() dedupea esta consulta entre generateMetadata y el render de la
// página — ambos corren para el mismo request.
const getEventoPublicado = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('id, status, template_id, custom_data')
    .eq('slug', slug)
    .maybeSingle()

  if (!event || !PUBLISHED_STATUSES.includes(event.status)) return null

  const { data: template } = await supabase
    .from('templates')
    .select('component_key')
    .eq('id', event.template_id)
    .single()

  if (!template) return null

  return { event, template }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getEventoPublicado(slug)

  // Los subdominios de eventos no deben indexarse (son privados por link).
  const robots = { index: false, follow: false }
  if (!data) return { robots }

  const { fotos, ...custom_data } = data.event.custom_data as Record<string, unknown> & { fotos?: string[] }
  const { title, description } = buildEventMetadataCopy(data.template.component_key, custom_data)
  const portada = fotos?.[0]

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      images: portada ? [{ url: portada }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: portada ? [portada] : undefined,
    },
  }
}

export default async function EventoPublicoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getEventoPublicado(slug)

  if (!data) notFound()

  const TemplateComponent = TEMPLATE_COMPONENTS[data.template.component_key]
  if (!TemplateComponent) notFound()

  const { fotos, ...custom_data } = data.event.custom_data as Record<string, unknown> & { fotos?: string[] }

  return <TemplateComponent custom_data={custom_data} fotos={fotos} eventId={data.event.id} />
}
