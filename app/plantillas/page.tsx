import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPriceRangeForCategory } from '@/lib/templates/pricing'
import { StampFrame } from '@/components/marketing/StampFrame'
import { WeddingArchVignette } from '@/components/marketing/WeddingArchVignette'

const COMING_SOON = ['XV Años', 'Bautizo', 'Genérico']

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

  return (
    <main className="ink-texture min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="font-body text-sm text-kraft/70">Sesión iniciada como {user.email ?? user.id}</p>
        <h1 className="mt-3 max-w-lg font-display text-4xl font-bold text-kraft">
          Elige tu serie de estampillas.
        </h1>
        <p className="mt-3 max-w-md font-body text-base text-kraft/70">
          Cada plantilla define sus propios campos. Puedes ver una vista
          previa completa antes de pagar.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(templates ?? []).map((template) => (
            <Link key={template.id} href={`/crear/${template.id}`} className="group">
              <StampFrame className="aspect-[4/5] bg-kraft transition-transform group-hover:-translate-y-1">
                <div className="flex h-full flex-col justify-between p-4 text-kraft-ink">
                  <span className="font-body text-[9px] tracking-[0.25em]">SELLO</span>
                  <WeddingArchVignette className="h-16 w-full" />
                  <div className="flex items-end justify-between">
                    <span className="font-display text-xl leading-tight font-bold">
                      {template.name}
                    </span>
                    <span className="font-body text-[9px] font-semibold tracking-[0.2em]">
                      {getPriceRangeForCategory(template.category)}
                    </span>
                  </div>
                </div>
              </StampFrame>
            </Link>
          ))}

          {COMING_SOON.map((name) => (
            <StampFrame key={name} className="aspect-[4/5] bg-kraft-2">
              <div className="flex h-full flex-col justify-between p-4 text-kraft-ink">
                <span className="font-body text-[9px] tracking-[0.25em]">SELLO</span>
                <span className="font-display text-2xl leading-tight font-bold">{name}</span>
                <span className="font-body text-[9px] font-semibold tracking-[0.2em]">
                  PRÓXIMAMENTE
                </span>
              </div>
            </StampFrame>
          ))}
        </div>
      </div>
    </main>
  )
}
