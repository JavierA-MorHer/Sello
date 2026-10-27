'use client'

import { useState, useTransition } from 'react'
import { submitRsvp } from '@/lib/rsvp/actions'
import type { SaveTheDateTheme } from './BodaSaveTheDate'

const CREAM = '#fbf8f2'

const displayFont = { fontFamily: 'var(--font-tpl-display)' }

export function BodaSaveTheDateRsvp({
  eventId,
  theme,
  iniciales,
  pases,
  fechaLimite,
}: {
  eventId: string | null
  theme: SaveTheDateTheme
  iniciales: string
  pases: number
  fechaLimite?: string
}) {
  const t = theme
  const [nombre, setNombre] = useState('')
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)
  // El stepper arranca en el máximo: lo normal es que la invitación se use completa.
  const [personas, setPersonas] = useState(pases)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const uso = Math.min(personas, pases)
  const first = nombre.trim().split(' ')[0]
  const ready = Boolean(nombre.trim() && choice)

  function handleSend() {
    if (!ready || !eventId || isPending) return
    setError(null)
    startTransition(async () => {
      try {
        await submitRsvp(eventId, {
          name: nombre,
          attending: choice === 'yes',
          plusOnes: choice === 'yes' ? uso - 1 : 0,
        })
        setDone(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo guardar tu confirmación.')
      }
    })
  }

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <span
          style={{
            ...displayFont,
            width: 56,
            height: 56,
            borderRadius: 9999,
            background: t.accent,
            color: CREAM,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {iniciales}
        </span>
        <div style={{ ...displayFont, fontSize: 28, lineHeight: '34px' }}>
          {choice === 'no' ? 'Te vamos a extrañar' : `Nos vemos pronto${first ? `, ${first}` : ''}`}
        </div>
        <span style={{ fontSize: 13, lineHeight: '20px', color: t.soft, maxWidth: 260, textWrap: 'pretty' }}>
          {choice === 'no'
            ? 'Gracias por avisarnos con tiempo. Te mandaremos fotos del día.'
            : `Confirmaste ${uso} ${uso === 1 ? 'lugar' : 'lugares'}. Te avisaremos por WhatsApp si algo cambia.`}
        </span>
        <button
          type="button"
          onClick={() => setDone(false)}
          style={{
            cursor: 'pointer',
            border: 0,
            background: 'none',
            fontSize: 12,
            fontWeight: 600,
            color: t.accent,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            marginTop: 4,
          }}
        >
          Cambiar respuesta
        </button>
      </div>
    )
  }

  const opciones: { key: 'yes' | 'no'; label: string }[] = [
    { key: 'yes', label: 'Sí, ahí estaré' },
    { key: 'no', label: 'No podré asistir' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '.3em',
          paddingLeft: '.3em',
          textTransform: 'uppercase',
          color: t.accent,
        }}
      >
        Confirma tu asistencia
      </span>
      <div style={{ ...displayFont, fontSize: 28, lineHeight: '34px' }}>¿Nos acompañas?</div>
      <span style={{ fontSize: 12, lineHeight: '18px', color: t.soft, marginTop: -6 }}>
        {pases === 1 ? 'Tu invitación es personal.' : `Tu invitación incluye ${pases} lugares.`}
        {fechaLimite ? ` Confirma antes del ${fechaLimite}.` : ''}
      </span>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        aria-label="Tu nombre"
        style={{
          border: `1px solid ${t.line}`,
          background: 'transparent',
          borderRadius: 9999,
          padding: '14px 18px',
          fontSize: 15,
          color: t.ink,
          outline: 'none',
          textAlign: 'center',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opciones.map((o) => {
          const on = choice === o.key
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => setChoice(o.key)}
              style={{
                cursor: 'pointer',
                border: `1px solid ${on ? t.ink : t.line}`,
                background: on ? t.ink : 'transparent',
                color: on ? t.bg : t.ink,
                fontSize: 13,
                fontWeight: 600,
                padding: 14,
                borderRadius: 9999,
              }}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {choice === 'yes' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: `1px solid ${t.line}`,
            borderRadius: 9999,
            padding: '6px 6px 6px 20px',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500 }}>Personas que asistirán</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              aria-label="Una persona menos"
              disabled={uso <= 1}
              onClick={() => setPersonas(Math.max(1, uso - 1))}
              style={{
                cursor: 'pointer',
                width: 38,
                height: 38,
                borderRadius: 9999,
                border: 0,
                background: 'transparent',
                fontSize: 18,
                color: t.ink,
                opacity: uso <= 1 ? 0.3 : 1,
              }}
            >
              −
            </button>
            <span style={{ ...displayFont, minWidth: 20, fontSize: 22 }} aria-live="polite">
              {uso}
            </span>
            <button
              type="button"
              aria-label="Una persona más"
              disabled={uso >= pases}
              onClick={() => setPersonas(Math.min(pases, uso + 1))}
              style={{
                cursor: 'pointer',
                width: 38,
                height: 38,
                borderRadius: 9999,
                border: 0,
                background: 'transparent',
                fontSize: 18,
                color: t.ink,
                opacity: uso >= pases ? 0.3 : 1,
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {error && <span style={{ fontSize: 12, color: t.accent }}>{error}</span>}
      {!eventId && (
        <span style={{ fontSize: 11, color: t.soft }}>El RSVP se activa cuando publiques tu invitación.</span>
      )}

      <button
        type="button"
        onClick={handleSend}
        aria-disabled={!ready || !eventId}
        style={{
          cursor: ready ? 'pointer' : 'default',
          border: 0,
          background: t.accent,
          color: CREAM,
          fontSize: 14,
          fontWeight: 600,
          padding: 16,
          borderRadius: 9999,
          opacity: isPending ? 0.6 : ready ? 1 : 0.45,
        }}
      >
        {isPending ? 'Enviando…' : 'Enviar'}
      </button>
    </div>
  )
}
