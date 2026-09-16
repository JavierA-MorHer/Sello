import Link from 'next/link'
import { INCLUYE } from '@/lib/marketing/landing-content'
import { formatMXN } from '@/lib/templates/pricing'

export function PricingSection({
  desdeBoda,
  desdeOtras,
}: {
  desdeBoda: number | null
  desdeOtras: number | null
}) {
  return (
    <section id="precios" className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-8 rounded-sm bg-ink p-8 text-paper sm:p-12">
          <span className="font-body text-xs font-semibold tracking-[0.16em] text-paper/60 uppercase">
            Precio · IVA incluido
          </span>
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-6 border-b border-paper/10 pb-8">
            {desdeBoda !== null && (
              <div>
                <div className="font-display text-3xl">{formatMXN(desdeBoda)}</div>
                <div className="mt-1 font-body text-xs tracking-[0.14em] text-paper/60 uppercase">
                  Boda
                </div>
              </div>
            )}
            {desdeOtras !== null && (
              <div>
                <div className="font-display text-3xl">{formatMXN(desdeOtras)}</div>
                <div className="mt-1 font-body text-xs tracking-[0.14em] text-paper/60 uppercase">
                  XV años, bautizos y baby shower
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {INCLUYE.map((item) => (
              <div key={item} className="flex items-start gap-2.5 font-body text-sm leading-snug text-paper/85">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/crear"
            className="self-start rounded-sm bg-clay px-7 py-3.5 font-body text-sm font-semibold text-ink transition-colors hover:bg-clay-light"
          >
            Crear mi invitación →
          </Link>
        </div>
      </div>
    </section>
  )
}
