import Link from 'next/link'
import { TemplateCard } from '@/components/marketing/TemplateCard'
import { formatMXN } from '@/lib/templates/pricing'

export function TemplatesSection({
  templates,
}: {
  templates: { id: string; name: string; price_mxn: number }[]
}) {
  return (
    <section id="plantillas" className="border-t border-ink/6 bg-paper-2 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
              Plantillas
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Elige la que se parezca a tu evento.</h2>
          </div>
          <Link href="/plantillas" className="hidden shrink-0 font-body text-sm font-semibold text-clay hover:text-clay-light sm:block">
            Ver todas →
          </Link>
        </div>

        <div className="mt-12 flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              priceRange={formatMXN(template.price_mxn)}
              templateId={template.id}
              className="w-[150px] shrink-0 sm:w-auto"
            />
          ))}
        </div>

        <Link href="/plantillas" className="mt-8 block font-body text-sm font-semibold text-clay sm:hidden">
          Ver todas →
        </Link>
      </div>
    </section>
  )
}
