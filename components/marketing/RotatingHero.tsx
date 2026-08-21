'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export type HeroSlide = {
  src: string
  alt: string
}

/**
 * Cada slide se monta hasta que le toca su turno (no las 4 de una vez) —
 * evita competir con el LCP inicial. Respeta prefers-reduced-motion: sin
 * rotación automática, se queda en la primera foto.
 */
export function RotatingHero({
  slides,
  intervalMs = 6000,
}: {
  slides: HeroSlide[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [mountedCount, setMountedCount] = useState(1)

  useEffect(() => {
    if (slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % slides.length
        setMountedCount((count) => Math.max(count, next + 1))
        return next
      })
    }, intervalMs)

    return () => clearInterval(id)
  }, [slides.length, intervalMs])

  return (
    <>
      {slides.map((slide, i) =>
        i < mountedCount ? (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`absolute inset-0 object-cover object-[50%_38%] transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null
      )}
    </>
  )
}
