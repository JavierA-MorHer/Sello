/**
 * Franja decorativa repetida a mano, inspirada en el azulejo de Talavera
 * poblana (medallón floral de 4 pétalos + puntos de esquina) — el
 * dispositivo de firma de esta plantilla, usado como divisor entre
 * secciones en vez de una simple línea.
 */
export function TalaveraBorder({ className }: { className?: string }) {
  return (
    <div className={`h-5 w-full ${className ?? ''}`} aria-hidden>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id="talavera-tile" width="40" height="20" patternUnits="userSpaceOnUse">
            <rect width="40" height="20" fill="#f7f2e7" />
            <circle cx="20" cy="10" r="2.4" fill="#c9932e" />
            <path d="M20 3 Q24 10 20 17 Q16 10 20 3Z" fill="#204e70" />
            <path d="M3 10 Q11 6.5 18 10 Q11 13.5 3 10Z" fill="#204e70" opacity="0.85" />
            <path d="M37 10 Q29 6.5 22 10 Q29 13.5 37 10Z" fill="#204e70" opacity="0.85" />
            <circle cx="3" cy="3" r="1.3" fill="#204e70" />
            <circle cx="37" cy="3" r="1.3" fill="#204e70" />
            <circle cx="3" cy="17" r="1.3" fill="#204e70" />
            <circle cx="37" cy="17" r="1.3" fill="#204e70" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#talavera-tile)" />
      </svg>
    </div>
  )
}
