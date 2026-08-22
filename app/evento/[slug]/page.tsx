import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import type { WeddingData } from '@/components/templates/wedding.types'

// Solo estos dos estados corresponden a un evento pagado/publicado. 'draft'
// (no pagado), 'expired' y 'archived' nunca deben renderizarse aquí — esto
// es la segunda capa de defensa: la política RLS "publico lee eventos
// publicados" (supabase/rls-public-event-read.sql) ya bloquea la lectura a
// nivel de base de datos para cualquier otro estado.
const PUBLISHED_STATUSES = ['active', 'expiring_soon']

export const metadata: Metadata = {
  // Los subdominios de eventos no deben indexarse (son privados por link).
  robots: { index: false, follow: false },
}

export default async function EventoPublicoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('id, status, template_id, custom_data')
    .eq('slug', slug)
    .maybeSingle()

  if (!event || !PUBLISHED_STATUSES.includes(event.status)) {
    notFound()
  }

  const { data: template } = await supabase
    .from('templates')
    .select('component_key')
    .eq('id', event.template_id)
    .single()

  if (!template) {
    notFound()
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[template.component_key]

  if (!TemplateComponent) {
    notFound()
  }

  const { fotos, ...custom_data } = event.custom_data as WeddingData & { fotos?: string[] }

  return <TemplateComponent custom_data={custom_data} fotos={fotos} eventId={event.id} />
}
