'use client'

import { useState, useTransition } from 'react'
import { submitRsvp } from '@/lib/rsvp/actions'

const IVORY = '#f7f1e8'
const GOLD_BORDER = 'rgba(201,162,94,.3)'
const LABEL_GRAY = '#9a90a0'

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

function folioFor(name: string, personas: number) {
  const seed = name
    .trim()
    .split('')
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  const numero = 1000 + (seed % 9000)
  return `XV · ${numero} · ${personas} persona${personas === 1 ? '' : 's'}`
}

export function XvAnosRsvp({
  eventId,
  gold,
  dark,
  pases,
  fechaLimite,
}: {
  eventId: string | null
  gold: string
  dark: string
  pases: number
  fechaLimite?: string
}) {
  const [nombre, setNombre] = useState('')
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)
  const [personas, setPersonas] = useState(1)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const first = nombre.trim().split(' ')[0]

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
    return (
      <div
        style={{
          border: `1px solid rgba(201,162,94,.32)`,
          padding: '36px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          animation: 'xv-in .7s ease-out both',
        }}
      >
        <span style={{ ...displayFont, fontSize: 34, color: gold, lineHeight: 1 }}>XV</span>
        <span style={{ width: 34, height: 1, background: 'rgba(201,162,94,.5)' }} />
        <span style={{ ...displayFont, fontSize: 22, lineHeight: '29px' }}>
          {choice === 'no' ? 'Te voy a extrañar' : `Nos vemos esa noche${first ? `, ${first}` : ''}`}
        </span>
        <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '21px', color: 'rgba(247,241,232,.6)', maxWidth: 240, textWrap: 'pretty' }}>
          {choice === 'no'
            ? 'Gracias por avisarme. Te guardo un pedazo de pastel y las fotos.'
            : 'Ya estás en la lista de la puerta. Muestra tu pase al llegar.'}
        </span>

        {choice === 'yes' && (
          <div
            style={{
              marginTop: 8,
              border: `1px solid ${GOLD_BORDER}`,
              padding: '16px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <span style={{ ...bodyFont, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: LABEL_GRAY }}>
              Tu pase
            </span>
            <span style={{ ...displayFont, fontSize: 20, letterSpacing: '.06em', color: gold }}>
              {folioFor(nombre, personas)}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setDone(false)}
          style={{
            ...bodyFont,
            marginTop: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 10,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: LABEL_GRAY,
          }}
        >
          Cambiar mi respuesta
        </button>
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${GOLD_BORDER}`, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center' }}>
        <span style={{ ...displayFont, fontSize: 23, lineHeight: '30px' }}>¿Nos acompañas?</span>
        <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '20px', color: 'rgba(247,241,232,.72)' }}>
          {pases === 1
            ? `Tu invitación es personal, para una persona.${fechaLimite ? ` Confirma antes del ${fechaLimite}.` : ''}`
            : `Tu invitación incluye ${pases} lugares.${fechaLimite ? ` Confirma antes del ${fechaLimite}.` : ''}`}
        </span>
      </div>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre completo"
        style={{
          ...bodyFont,
          fontWeight: 300,
          border: 'none',
          borderBottom: '1px solid rgba(201,162,94,.4)',
          background: 'transparent',
          padding: '12px 2px',
          fontSize: 16,
          color: IVORY,
          textAlign: 'center',
          letterSpacing: '.02em',
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
            padding: '16px 8px',
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            border: `1px solid ${choice === 'yes' ? gold : GOLD_BORDER}`,
            background: choice === 'yes' ? gold : 'transparent',
            color: choice === 'yes' ? dark : IVORY,
          }}
        >
          Asistiré
        </button>
        <button
          type="button"
          onClick={() => setChoice('no')}
          style={{
            ...bodyFont,
            flex: 1,
            cursor: 'pointer',
            padding: '16px 8px',
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            border: `1px solid ${choice === 'no' ? gold : GOLD_BORDER}`,
            background: choice === 'no' ? gold : 'transparent',
            color: choice === 'no' ? dark : IVORY,
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
            fontSize: 11,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: LABEL_GRAY,
          }}
        >
          Personas que asistirán
        </span>
        <div style={{ display: 'flex', alignItems: 'stretch', border: `1px solid ${GOLD_BORDER}` }}>
          <button
            type="button"
            aria-disabled={personas <= 1}
            onClick={() => setPersonas((p) => Math.max(1, p - 1))}
            style={{
              ...displayFont,
              flex: 'none',
              width: 56,
              border: 'none',
              borderRight: `1px solid ${GOLD_BORDER}`,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1,
              padding: '14px 0',
              color: personas <= 1 ? 'rgba(247,241,232,.22)' : IVORY,
            }}
          >
            −
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ ...displayFont, fontSize: 26, lineHeight: 1, color: gold }}>{personas}</span>
            <span
              style={{
                ...bodyFont,
                fontSize: 10,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: LABEL_GRAY,
                marginTop: 5,
              }}
            >
              de {pases} disponibles
            </span>
          </div>
          <button
            type="button"
            aria-disabled={personas >= pases}
            onClick={() => setPersonas((p) => Math.min(pases, p + 1))}
            style={{
              ...displayFont,
              flex: 'none',
              width: 56,
              border: 'none',
              borderLeft: `1px solid ${GOLD_BORDER}`,
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1,
              padding: '14px 0',
              color: personas >= pases ? 'rgba(247,241,232,.22)' : IVORY,
            }}
          >
            +
          </button>
        </div>
      </div>

      {error && <span style={{ ...bodyFont, fontSize: 12, color: '#e08a8a', textAlign: 'center' }}>{error}</span>}
      {!eventId && (
        <span style={{ ...bodyFont, fontSize: 11, color: LABEL_GRAY, textAlign: 'center' }}>
          El RSVP se activa cuando publiques tu invitación.
        </span>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSend}
        style={{
          ...bodyFont,
          background: gold,
          border: `1px solid ${gold}`,
          color: dark,
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          padding: 17,
          cursor: 'pointer',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? 'Enviando…' : 'Enviar confirmación'}
      </button>
    </div>
  )
}
