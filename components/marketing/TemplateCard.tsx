import Link from 'next/link'
import Image from 'next/image'
import { PhoneFramePreview } from './PhoneFramePreview'

/**
 * Tarjeta de plantilla compartida entre el carrusel de la landing y la
 * grilla de /plantillas. El marco de celular (public/marco-celular.png)
 * enmarca un iframe en vivo de /demo/[templateId]?bare=1 — el mismo
 * componente que renderiza la invitación real (ver CLAUDE.md), no una
 * captura ni una vista simulada aparte. Toda la tarjeta enlaza al demo
 * completo, para que el cliente vea el resultado final antes de decidirse.
 */
export function TemplateCard({
  name,
  priceRange,
  templateId,
  comingSoon = false,
  className = '',
}: {
  name: string
  priceRange: string
  templateId?: string
  comingSoon?: boolean
  className?: string
}) {
  const href = templateId ? `/demo/${templateId}` : undefined

  const card = (
    <div className={`group flex flex-col gap-2 ${className}`}>
      <div
        className={`relative aspect-[389/800] w-full ${
          comingSoon
            ? 'overflow-hidden rounded-sm border border-ink/7 bg-paper-3'
            : // Sin fondo ni borde propios: el marco del celular es la única
              // silueta. Un bg aquí se asomaría por los ~3px transparentes
              // que el PNG tiene en sus bordes exteriores.
              ''
        }`}
      >
        {comingSoon || !templateId ? (
          <div className="absolute inset-2.5 flex flex-col items-center justify-center gap-2 rounded-[3px] border border-clay/40 px-3 text-center">
            <span className="font-display text-base leading-tight">{name}</span>
          </div>
        ) : (
          <>
            <PhoneFramePreview templateId={templateId} name={name} />
            <Image
              src="/marco-celular.png"
              alt=""
              fill
              sizes="(max-width: 640px) 45vw, 300px"
              className="pointer-events-none object-contain"
            />
          </>
        )}
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
        {!comingSoon && templateId && (
          <span className="font-body text-xs text-clay">Ver demo →</span>
        )}
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
