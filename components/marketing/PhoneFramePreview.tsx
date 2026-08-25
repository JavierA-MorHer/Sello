'use client'

import { useLayoutEffect, useRef, useState } from 'react'

// Viewport de referencia (iPhone estándar): el iframe siempre renderiza a
// este tamaño real y luego se escala con CSS para caber en la ranura del
// marco, así se ve una "pantalla completa" en miniatura en vez de recortar
// el tope de una página mucho más alta que el marco.
const VIEWPORT_W = 390
const VIEWPORT_H = 844

// Hueco transparente real de public/marco-celular.png (389×800), medido
// sobre el canal alpha: x 18→371, y 14→785.
const SLOT = { left: 4.63, right: 4.37, top: 1.75, bottom: 1.75 }

export function PhoneFramePreview({ templateId, name }: { templateId: string; name: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setBox({ w: rect.width, h: rect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Escala tipo `cover`: la ranura y el viewport no comparten exactamente el
  // mismo aspecto, así que tomar solo el ancho dejaba unos px sin cubrir
  // abajo (por ahí se asomaba el fondo). Con max() siempre cubre, y el
  // sobrante se recorta con overflow-hidden.
  const scale = box.w > 0 ? Math.max(box.w / VIEWPORT_W, box.h / VIEWPORT_H) : 0
  const offsetX = (box.w - VIEWPORT_W * scale) / 2

  return (
    <div
      ref={containerRef}
      className="absolute overflow-hidden bg-ink"
      style={{
        left: `${SLOT.left}%`,
        right: `${SLOT.right}%`,
        top: `${SLOT.top}%`,
        bottom: `${SLOT.bottom}%`,
        // Radio proporcional al ancho (≈ el de la pantalla de un iPhone).
        // Las esquinas del bisel son opacas y se dibujan encima, así que
        // este radio solo evita que el contenido asome antes de cargar.
        borderRadius: box.w > 0 ? `${box.w * 0.11}px` : undefined,
      }}
    >
      {scale > 0 && (
        <iframe
          src={`/demo/${templateId}?bare=1`}
          title={`Vista previa de ${name}`}
          loading="lazy"
          tabIndex={-1}
          scrolling="no"
          width={VIEWPORT_W}
          height={VIEWPORT_H}
          className="pointer-events-none origin-top-left border-0"
          style={{ transform: `translateX(${offsetX}px) scale(${scale})` }}
        />
      )}
    </div>
  )
}
