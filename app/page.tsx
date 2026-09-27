import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { minPriceMXN } from '@/lib/templates/pricing'
import { FAQS } from '@/lib/marketing/landing-content'
import { SiteHeader } from '@/components/marketing/SiteHeader'
import { Hero } from '@/components/marketing/Hero'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { TemplatesSection } from '@/components/marketing/TemplatesSection'
import { PricingSection } from '@/components/marketing/PricingSection'
import { FaqSection } from '@/components/marketing/FaqSection'
import { ContactSection } from '@/components/marketing/ContactSection'
import { FinalCta } from '@/components/marketing/FinalCta'
import { SiteFooter } from '@/components/marketing/SiteFooter'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://misello.com.mx'

// El título y la descripción viven en app/layout.tsx; aquí solo se fija la URL
// canónica, para que los parámetros de campaña (?utm_source=..., ?fbclid=...)
// no se indexen como páginas distintas.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * Datos estructurados (schema.org). Le dicen a Google qué es esta página en
 * lugar de que lo adivine del HTML:
 *  - FAQPage: es el que puede pintar las preguntas desplegables en el
 *    resultado de búsqueda. Se genera del mismo array FAQS que se renderiza
 *    en FaqSection, porque Google penaliza el marcado que no coincide con lo
 *    visible.
 *  - Organization / WebSite: identifican la marca.
 *  - Product: precio real de arranque, leído de la base igual que la página.
 */
function buildJsonLd(precioDesde: number | null) {
  const grafo: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${APP_URL}/#organization`,
      name: 'Sello',
      url: APP_URL,
      logo: `${APP_URL}/brand/sello-principal.png`,
      areaServed: 'MX',
    },
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      name: 'Sello',
      url: APP_URL,
      inLanguage: 'es-MX',
      publisher: { '@id': `${APP_URL}/#organization` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  if (precioDesde !== null) {
    grafo.push({
      '@type': 'Product',
      name: 'Invitación digital',
      description:
        'Invitación digital para boda, XV años, bautizo o baby shower, con confirmación de asistencia y enlace propio para compartir por WhatsApp.',
      brand: { '@id': `${APP_URL}/#organization` },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'MXN',
        lowPrice: precioDesde,
        availability: 'https://schema.org/InStock',
        url: APP_URL,
      },
    })
  }

  return { '@context': 'https://schema.org', '@graph': grafo }
}

export default async function LandingPage() {
  const supabase = await createClient()
  const [{ data: allTemplates }, { data: userData }] = await Promise.all([
    supabase
      .from('templates')
      .select('id, name, category, price_mxn')
      .eq('active', true)
      .order('created_at', { ascending: true }),
    supabase.auth.getUser(),
  ])
  // Un anónimo (borrador sin cuenta) se trata como visitante en la landing.
  const user = userData.user?.is_anonymous ? null : userData.user
  const templates = (allTemplates ?? []).slice(0, 6)

  const desdeBoda = minPriceMXN(allTemplates ?? [], 'boda')
  const otrasPrecios = ['xv_anos', 'bautizo', 'baby_shower', 'cumpleanos', 'generico']
    .map((c) => minPriceMXN(allTemplates ?? [], c))
    .filter((p): p is number => p !== null)
  const desdeOtras = otrasPrecios.length > 0 ? Math.min(...otrasPrecios) : null

  // Precio de entrada de todo el catálogo, para el marcado Product.
  const precios = [desdeBoda, desdeOtras].filter((p): p is number => p !== null)
  const precioDesde = precios.length > 0 ? Math.min(...precios) : null

  const metadataName =
    typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user?.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null
  const displayName = metadataName ?? user?.email?.split('@')[0] ?? null
  const isAdmin = user?.app_metadata?.role === 'admin'

  return (
    <div className="flex-1 bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(precioDesde)) }}
      />

      <SiteHeader hasUser={!!user} displayName={displayName} isAdmin={isAdmin} />
      <Hero />
      <HowItWorks />
      <TemplatesSection templates={templates} />
      <PricingSection desdeBoda={desdeBoda} desdeOtras={desdeOtras} />
      <FaqSection />
      <ContactSection />
      <FinalCta />
      <SiteFooter />
    </div>
  )
}
