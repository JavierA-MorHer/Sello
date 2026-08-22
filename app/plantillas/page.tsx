import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPriceRangeForCategory } from '@/lib/templates/pricing'
import { TemplateCard } from '@/components/marketing/TemplateCard'
import { SignOutButton } from '@/components/auth/SignOutButton'

const COMING_SOON = ['Genérico']

export default async function PlantillasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/plantillas')
  }

  const { data: templates } = await supabase
    .from('templates')
    .select('id, name, category')
    .eq('active', true)
    .order('created_at', { ascending: true })

  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null
  const displayName = metadataName ?? user.email?.split('@')[0] ?? 'de nuevo'

  return (
    <main className="min-h-screen bg-paper px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <p className="font-body text-sm text-ink/60">Hola, {displayName}.</p>
          <SignOutButton />
        </div>
        <h1 className="mt-3 max-w-lg font-display text-3xl sm:text-4xl">
          Elige tu plantilla.
        </h1>
        <p className="mt-3 max-w-md font-body text-base text-ink/70">
          Cada plantilla define sus propios campos. Puedes ver una vista
          previa completa antes de pagar.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(templates ?? []).map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              tag={template.category}
              priceRange={getPriceRangeForCategory(template.category)}
              href={`/crear/${template.id}`}
            />
          ))}

          {COMING_SOON.map((name) => (
            <TemplateCard key={name} name={name} tag="Próximamente" priceRange="" comingSoon />
          ))}
        </div>
      </div>
    </main>
  )
}
