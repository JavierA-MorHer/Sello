'use client'

import { useState, useTransition } from 'react'
import { submitRsvp } from '@/lib/rsvp/actions'

const PAPER = '#f7f9fa'
const INK = '#2b3a42'
const GRAY_TEXT = '#61737d'
const GRAY_LABEL = '#7d8f98'
const GRAY_DISABLED = '#a4b4bb'

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

export function BautizoRsvp({
  eventId,
  accent,
  hair,
  hairStrong,
  lugares,
  fechaLimite,
  lugar,
  hora,
}: {
  eventId: string | null
  accent: string
  hair: string
  hairStrong: string
  lugares: number
  fechaLimite?: string
  lugar?: string
  hora?: string
}) {
  const [nombre, setNombre] = useState('')
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)
  const [personas, setPersonas] = useState(1)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const primerNombre = nombre.trim().split(' ')[0]

  function handleSend() {
    if (!nombre.trim() || !choice || !eventId) return
    setError(null)
    startTransition(async () => {
      try {
        await submitRsvp(eventId, { name: nombre, attending: choice === 'yes', plusOnes: personas - 1 })
        setDone(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo guardar tu confirmación.')
      }
    })
  }

  if (done) {
    const asiste = choice === 'yes'
    return (
      <div
        data-bt-anim
        style={{
          border: `1px solid ${hairStrong}`,
          background: PAPER,
          padding: '36px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          animation: 'bt-in .7s ease-out both',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 9999, background: accent }} />
        <span style={{ ...displayFont, fontWeight: 400, fontSize: 24, lineHeight: '31px', color: INK }}>
          {asiste ? `Ahí te esperamos${primerNombre ? `, ${primerNombre}` : ''}` : 'Te vamos a extrañar'}
        </span>
        <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '21px', color: GRAY_TEXT, maxWidth: 240 }}>
          {asiste
            ? `Ya apartamos tu lugar en la comida.${lugar ? ` Nos vemos en ${lugar}${hora ? ` a las ${hora}` : ''}.` : ''}`
            : 'Gracias por avisarnos. Te mandaremos las fotos del día.'}
        </span>
        <button
          type="button"
          onClick={() => setDone(false)}
          style={{
            ...bodyFont,
            marginTop: 4,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 10,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: GRAY_LABEL,
          }}
        >
          Cambiar mi respuesta
        </button>
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${hair}`, background: PAPER, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center' }}>
        <span style={{ ...displayFont, fontWeight: 400, fontSize: 25, lineHeight: '32px', color: INK }}>¿Nos acompañas?</span>
        <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '20px', color: GRAY_TEXT }}>
          {fechaLimite
            ? `Confirma antes del ${fechaLimite} para apartar tu lugar en la comida.`
            : 'Confirma tu asistencia para apartar tu lugar en la comida.'}
        </span>
      </div>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        style={{
          ...bodyFont,
          fontWeight: 300,
          border: 'none',
          borderBottom: `1px solid ${hairStrong}`,
          background: 'transparent',
          padding: '12px 2px',
          fontSize: 16,
          color: INK,
          textAlign: 'center',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 1 }}>
        <button
          type="button"
          onClick={() => setChoice('yes')}
          style={{
            ...bodyFont,
            flex: 1,
            cursor: 'pointer',
            padding: '15px 8px',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            border: `1px solid ${choice === 'yes' ? accent : hairStrong}`,
            background: choice === 'yes' ? accent : 'transparent',
            color: choice === 'yes' ? PAPER : INK,
          }}
        >
          Ahí estaré
        </button>
        <button
          type="button"
          onClick={() => setChoice('no')}
          style={{
            ...bodyFont,
            flex: 1,
            cursor: 'pointer',
            padding: '15px 8px',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            border: `1px solid ${choice === 'no' ? accent : hairStrong}`,
            background: choice === 'no' ? accent : 'transparent',
            color: choice === 'no' ? PAPER : INK,
          }}
        >
          No podré
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span
          style={{
            ...bodyFont,
            textAlign: 'center',
            fontSize: 10,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: GRAY_LABEL,
          }}
        >
          Personas que asistirán
        </span>
        <div style={{ display: 'flex', alignItems: 'stretch', border: `1px solid ${hairStrong}` }}>
          <button
            type="button"
            aria-disabled={personas <= 1}
            onClick={() => setPersonas((p) => Math.max(1, p - 1))}
            style={{
              ...displayFont,
              flex: 'none',
              width: 54,
              border: 'none',
              borderRight: `1px solid ${hairStrong}`,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1,
              padding: '13px 0',
              color: personas <= 1 ? GRAY_DISABLED : INK,
            }}
          >
            −
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '9px 0' }}>
            <span style={{ ...displayFont, fontWeight: 400, fontSize: 26, lineHeight: 1, color: accent }}>{personas}</span>
            <span style={{ ...bodyFont, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: GRAY_LABEL, marginTop: 5 }}>
              de {lugares} disponibles
            </span>
          </div>
          <button
            type="button"
            aria-disabled={personas >= lugares}
            onClick={() => setPersonas((p) => Math.min(lugares, p + 1))}
            style={{
              ...displayFont,
              flex: 'none',
              width: 54,
              border: 'none',
              borderLeft: `1px solid ${hairStrong}`,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1,
              padding: '13px 0',
              color: personas >= lugares ? GRAY_DISABLED : INK,
            }}
          >
            +
          </button>
        </div>
      </div>

      {error && <span style={{ ...bodyFont, fontSize: 12, color: '#b3524a', textAlign: 'center' }}>{error}</span>}
      {!eventId && (
        <span style={{ ...bodyFont, fontSize: 11, color: GRAY_LABEL, textAlign: 'center' }}>
          El RSVP se activa cuando publiques tu invitación.
        </span>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSend}
        style={{
          ...bodyFont,
          fontWeight: 500,
          background: accent,
          border: `1px solid ${accent}`,
          color: PAPER,
          fontSize: 11,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          padding: 16,
          cursor: 'pointer',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? 'Enviando…' : 'Enviar confirmación'}
      </button>
    </div>
  )
}
