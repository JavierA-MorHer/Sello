import Link from 'next/link'

/**
 * Tarjeta de plantilla compartida entre el carrusel de la landing y la
 * grilla de /plantillas. Sin foto real de portada todavía por plantilla —
 * el marco con el nombre centrado es el placeholder hasta que cada
 * plantilla tenga su propia miniatura.
 */
export function TemplateCard({
  name,
  tag,
  priceRange,
  href,
  comingSoon = false,
  className = '',
}: {
  name: string
  tag: string
  priceRange: string
  href?: string
  comingSoon?: boolean
  className?: string
}) {
  const card = (
    <div
      className={`group flex flex-col gap-2 ${className}`}
    >
      <div
        className={`relative aspect-[5/7] w-full overflow-hidden rounded-sm border ${
          comingSoon ? 'border-ink/7 bg-paper-3' : 'border-ink/7 bg-paper shadow-[0_6px_22px_rgba(28,27,27,0.07)]'
        }`}
      >
        <div className="absolute inset-2.5 flex flex-col items-center justify-center gap-2 rounded-[3px] border border-clay/40 px-3 text-center">
          <span className="font-display text-base leading-tight">{name}</span>
          <div className="h-px w-4 bg-ink/20" />
          <span className="text-[9px] tracking-[0.14em] text-ink/60 uppercase">{tag}</span>
        </div>
        <span
          className={`absolute right-2.5 top-2.5 rounded-full px-2 py-1 text-[9px] font-semibold tracking-[0.08em] ${
            comingSoon ? 'bg-ink/6 text-ink/60' : 'bg-ink text-paper'
          }`}
        >
          {comingSoon ? 'PRÓXIMAMENTE' : priceRange}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="font-body text-sm font-semibold text-ink">{name}</span>
        <span className="font-body text-xs text-ink/50">{tag}</span>
      </div>
    </div>
  )

  if (comingSoon || !href) return card

  return (
    <Link href={href} className="transition-transform hover:-translate-y-1">
      {card}
    </Link>
  )
}
