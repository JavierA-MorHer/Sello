import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatMXN } from '@/lib/templates/pricing'
import { TemplateCard } from '@/components/marketing/TemplateCard'
import { AppMenu } from '@/components/nav/AppMenu'

// Página detrás de login: no aporta nada en el índice de Google y solo
// gasta presupuesto de rastreo. Refuerza el Disallow de app/robots.ts.
export const metadata: Metadata = {
  title: 'Elige tu plantilla',
  robots: { index: false, follow: false },
}

export default async function PlantillasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.is_anonymous) {
    redirect('/login?next=/plantillas')
  }

  const { data: templates } = await supabase
    .from('templates')
    .select('id, name, category, price_mxn')
    .eq('active', true)
    .order('created_at', { ascending: true })

  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null
  const displayName = metadataName ?? user.email?.split('@')[0] ?? 'de nuevo'
  const isAdmin = user.app_metadata?.role === 'admin'

  return (
    <main className="min-h-screen bg-paper px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <p className="font-body text-sm text-ink/60">Hola, {displayName}.</p>
          <AppMenu displayName={displayName} isAdmin={isAdmin} />
        </div>
        <h1 className="mt-3 max-w-lg font-display text-3xl sm:text-4xl">
          Elige tu plantilla.
        </h1>
        <p className="mt-3 max-w-md font-body text-base text-ink/70">
          Cada plantilla define sus propios campos. Puedes ver una vista
          previa completa antes de pagar.
        </p>
        <p className="mt-2 font-body text-sm text-ink/50">
          Precios en pesos mexicanos, pago único con IVA incluido.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(templates ?? []).map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              priceRange={formatMXN(template.price_mxn)}
              templateId={template.id}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
