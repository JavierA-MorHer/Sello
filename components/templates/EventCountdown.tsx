'use client'

import { useEffect, useState } from 'react'

type Parts = { months: number; days: number; hours: number; minutes: number; seconds: number }

const UNITS: { key: keyof Parts; label: string }[] = [
  { key: 'months', label: 'Meses' },
  { key: 'days', label: 'Días' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
]

// Italiana solo existe en peso 400 — el mismo refuerzo de trazo que usa
// BodaClasica.tsx para que los números no se pierdan contra el marfil.
const displayFont = { fontFamily: 'var(--font-tpl-display)', WebkitTextStroke: '0.4px currentColor' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

/** Descompone la diferencia respetando la duración real de cada mes (no un promedio de 30 días). */
function computeParts(target: Date, now: Date): Parts | null {
  if (target <= now) return null

  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  const cursor = new Date(now)
  cursor.setMonth(cursor.getMonth() + months)
  if (cursor > target) {
    months -= 1
    cursor.setMonth(cursor.getMonth() - 1)
  }

  let remainingMs = target.getTime() - cursor.getTime()
  const days = Math.floor(remainingMs / 86_400_000)
  remainingMs -= days * 86_400_000
  const hours = Math.floor(remainingMs / 3_600_000)
  remainingMs -= hours * 3_600_000
  const minutes = Math.floor(remainingMs / 60_000)
  remainingMs -= minutes * 60_000
  const seconds = Math.floor(remainingMs / 1000)

  return { months: Math.max(0, months), days, hours, minutes, seconds }
}

export function EventCountdown({ fechaEvento }: { fechaEvento?: string }) {
  // Se calcula solo en el cliente (useEffect) para evitar que el render del
  // servidor y el del navegador difieran por el paso del tiempo (hydration mismatch).
  const [parts, setParts] = useState<Parts | null>(null)

  useEffect(() => {
    if (!fechaEvento) return
    const target = new Date(`${fechaEvento}T00:00:00`)
    if (Number.isNaN(target.getTime())) return

    const tick = () => setParts(computeParts(target, new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [fechaEvento])

  if (!fechaEvento || !parts) return null

  return (
    <section className="px-6 pt-16 sm:pt-20">
      <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#1c2333]/60 uppercase">
        Cuenta regresiva
      </p>
      <div className="mx-auto mt-6 flex max-w-md justify-center gap-3 sm:gap-5">
        {UNITS.map((unit) => (
          <div key={unit.key} className="flex flex-col items-center gap-1">
            <span style={displayFont} className="text-3xl tabular-nums sm:text-4xl">
              {String(parts[unit.key]).padStart(2, '0')}
            </span>
            <span
              style={bodyFont}
              className="text-[10px] font-semibold tracking-[0.1em] text-[#1c2333]/60 uppercase"
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
