import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATE_COMPONENTS } from '@/lib/templates/registry'
import { DEMO_DATA } from '@/lib/templates/demoData'
import { DemoContainer } from '@/components/marketing/DemoContainer'

const CATEGORIA_EN_TEXTO: Record<string, string> = {
  boda: 'boda',
  xv_anos: 'XV años',
  bautizo: 'bautizo',
  baby_shower: 'baby shower',
  generico: 'evento',
}

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
  const title = `Invitación digital para ${categoria} — plantilla ${template.name}`
  const description = `Así se ve la plantilla ${template.name}: invitación digital de ${categoria} con confirmación de asistencia, ubicación y enlace para compartir por WhatsApp. Pago único, sin suscripción.`

  return {
    title,
    description,
    alternates: { canonical: `/demo/${templateId}` },
    openGraph: { title, description, url: `/demo/${templateId}`, type: 'article' },
  }
}

export default async function DemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>
  searchParams: Promise<{ bare?: string; tema?: string }>
}) {
  const { templateId } = await params
  const { bare, tema } = await searchParams
  const template = await getTemplate(templateId)

  if (!template) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const backHref = user ? '/plantillas' : '/#plantillas'

  const TemplateComponent = TEMPLATE_COMPONENTS[template.component_key]
  const demo = DEMO_DATA[template.component_key]

  if (!TemplateComponent || !demo) {
    notFound()
  }

  if (bare === '1') {
    const bareCustomData = tema ? { ...demo.custom_data, tema } : demo.custom_data
    return (
      <div style={{ height: 844, overflow: 'hidden' }}>
        <TemplateComponent custom_data={bareCustomData} fotos={demo.fotos} eventId={null} />
      </div>
    )
  }

  return (
    <DemoContainer
      templateId={template.id}
      templateName={template.name}
      templateCategory={template.category}
      componentKey={template.component_key}
      initialCustomData={demo.custom_data}
      fotos={demo.fotos}
      backHref={backHref}
      initialTema={tema}
    />
  )
}
