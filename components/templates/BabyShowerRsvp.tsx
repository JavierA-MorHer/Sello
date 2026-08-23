'use client'

import { useState, useTransition } from 'react'
import { submitRsvp } from '@/lib/rsvp/actions'

const INK = '#2e2a26'
const PAPER = '#fffdf6'
const YELLOW = '#ffc94a'

const PARTY_OPTIONS = ['Solo yo', '+1', '+2', '+3']
const GUESS_OPTIONS: { key: 'mama' | 'papa'; label: string }[] = [
  { key: 'mama', label: 'A mamá' },
  { key: 'papa', label: 'A papá' },
]

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

function shadowFor(selected: boolean) {
  return selected ? 'inset 0 3px 0 rgba(46,42,38,.18)' : '3px 3px 0 #2e2a26'
}

export function BabyShowerRsvp({
  eventId,
  accent,
  fechaLimite,
}: {
  eventId: string | null
  accent: string
  fechaLimite?: string
}) {
  const [name, setName] = useState('')
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)
  const [party, setParty] = useState<number | null>(null)
  const [guess, setGuess] = useState<'mama' | 'papa' | null>(null)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const first = name.trim().split(' ')[0]

  function handleSend() {
    if (!name.trim() || !choice || !eventId) return
    setError(null)
    startTransition(async () => {
      try {
        const guessLabel = guess ? GUESS_OPTIONS.find((g) => g.key === guess)?.label : null
        await submitRsvp(eventId, {
          name,
          attending: choice === 'yes',
          plusOnes: party ?? 0,
          message: guessLabel ? `Cree que el bebé se va a parecer... ${guessLabel}` : undefined,
        })
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
          marginTop: 16,
          background: PAPER,
          border: `2px solid ${INK}`,
          borderRadius: 22,
          boxShadow: `5px 5px 0 ${INK}`,
          padding: '30px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          animation: 'bs-pop .5s cubic-bezier(.34,1.56,.64,1) both',
        }}
      >
        <span
          style={{
            ...displayFont,
            width: 62,
            height: 62,
            borderRadius: 9999,
            background: accent,
            border: `2px solid ${INK}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 26,
            color: PAPER,
          }}
        >
          {(first || 'S').charAt(0).toUpperCase()}
        </span>
        <span style={{ ...displayFont, fontWeight: 800, fontSize: 24, lineHeight: '29px', textAlign: 'center' }}>
          {choice === 'no' ? 'Te vamos a extrañar' : `¡Ahí te esperamos${first ? `, ${first}` : ''}!`}
        </span>
        <span
          style={{ ...bodyFont, fontSize: 15, lineHeight: '22px', color: '#5c554d', maxWidth: 240, textAlign: 'center' }}
        >
          {choice === 'no'
            ? 'Gracias por avisarnos. Te mandamos fotos y pastel guardado.'
            : 'Ya te apuntamos. ¡Nos vemos pronto!'}
        </span>
        <button
          type="button"
          onClick={() => setDone(false)}
          style={{
            ...displayFont,
            marginTop: 4,
            border: `2px solid ${INK}`,
            background: PAPER,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            padding: '11px 18px',
            borderRadius: 12,
          }}
        >
          Cambiar mi respuesta
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: 16,
        background: PAPER,
        border: `2px solid ${INK}`,
        borderRadius: 22,
        boxShadow: `5px 5px 0 ${INK}`,
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        textAlign: 'left',
      }}
    >
      <span style={{ ...displayFont, fontWeight: 800, fontSize: 22, lineHeight: '27px', textAlign: 'center' }}>
        ¿Nos acompañas?
      </span>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre"
        style={{
          ...bodyFont,
          border: `2px solid ${INK}`,
          borderRadius: 12,
          padding: 14,
          fontSize: 16,
          background: PAPER,
          color: INK,
          outline: 'none',
        }}
      />
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={() => setChoice('yes')}
          style={{
            ...displayFont,
            flex: 1,
            cursor: 'pointer',
            border: `2px solid ${INK}`,
            borderRadius: 12,
            padding: '14px 8px',
            fontWeight: 700,
            fontSize: 15,
            background: choice === 'yes' ? accent : PAPER,
            color: INK,
            boxShadow: shadowFor(choice === 'yes'),
          }}
        >
          Sí voy
        </button>
        <button
          type="button"
          onClick={() => setChoice('no')}
          style={{
            ...displayFont,
            flex: 1,
            cursor: 'pointer',
            border: `2px solid ${INK}`,
            borderRadius: 12,
            padding: '14px 8px',
            fontWeight: 700,
            fontSize: 15,
            background: choice === 'no' ? YELLOW : PAPER,
            color: INK,
            boxShadow: shadowFor(choice === 'no'),
          }}
        >
          No podré
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ ...bodyFont, fontSize: 13, fontWeight: 700, color: '#5c554d' }}>¿Cuántos vienen contigo?</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {PARTY_OPTIONS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setParty(i)}
              style={{
                ...displayFont,
                flex: 1,
                cursor: 'pointer',
                border: `2px solid ${INK}`,
                borderRadius: 10,
                padding: '11px 0',
                fontWeight: 700,
                fontSize: 15,
                background: party === i ? accent : PAPER,
                color: INK,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingTop: 12,
          borderTop: '2px dashed rgba(46,42,38,.18)',
        }}
      >
        <span style={{ ...bodyFont, fontSize: 13, fontWeight: 700, color: '#5c554d' }}>
          Adivina: ¿a quién se va a parecer?
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {GUESS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setGuess(opt.key)}
              style={{
                ...displayFont,
                flex: 1,
                cursor: 'pointer',
                border: `2px solid ${INK}`,
                borderRadius: 10,
                padding: '12px 6px',
                fontWeight: 700,
                fontSize: 14,
                background: guess === opt.key ? YELLOW : PAPER,
                color: INK,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <span style={{ ...bodyFont, fontSize: 13, color: '#c94a4a', textAlign: 'center' }}>{error}</span>
      )}
      {!eventId && (
        <span style={{ ...bodyFont, fontSize: 12, color: '#8a8177', textAlign: 'center' }}>
          El RSVP se activa cuando publiques tu invitación.
        </span>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSend}
        style={{
          ...displayFont,
          border: `2px solid ${INK}`,
          cursor: 'pointer',
          background: accent,
          color: PAPER,
          fontWeight: 700,
          fontSize: 17,
          padding: 15,
          borderRadius: 14,
          boxShadow: `4px 4px 0 ${INK}`,
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? 'Enviando…' : 'Enviar'}
      </button>
      {fechaLimite && (
        <span style={{ ...bodyFont, fontSize: 12, color: '#8a8177', textAlign: 'center' }}>
          Puedes cambiar tu respuesta hasta el {fechaLimite}.
        </span>
      )}
    </div>
  )
}
