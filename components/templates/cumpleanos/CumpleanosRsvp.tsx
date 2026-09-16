'use client'

import { useState, useTransition } from 'react'
import { submitRsvp } from '@/lib/rsvp/actions'

export function CumpleanosRsvp({
  eventId,
  accent,
  paper,
  ink,
  inkSoft,
  hairStrong,
  displayFont,
  rsvpTitulo,
  edad,
  lugares,
  fechaLimite,
}: {
  eventId: string | null
  accent: string
  paper: string
  ink: string
  inkSoft: string
  hairStrong: string
  displayFont: React.CSSProperties
  rsvpTitulo: string
  edad: number
  lugares: number
  fechaLimite?: string
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
        data-cp-anim
        style={{
          border: `1px solid ${hairStrong}`,
          padding: '36px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 13,
          animation: 'cp-in .7s ease-out both',
        }}
      >
        <span style={{ ...displayFont, fontSize: 38, lineHeight: 1, color: accent }}>{edad}</span>
        <span style={{ ...displayFont, fontSize: 24, lineHeight: '31px', color: ink }}>
          {asiste ? `Nos vemos ahí${primerNombre ? `, ${primerNombre}` : ''}` : 'Te voy a extrañar'}
        </span>
        <span style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, fontSize: 13, lineHeight: '20px', color: inkSoft, maxWidth: 240 }}>
          {asiste ? 'Ya estás en la lista. Llega con hambre y con ganas de bailar.' : 'Gracias por avisarme. Te guardo un pedazo de pastel.'}
        </span>
        <button
          type="button"
          onClick={() => setDone(false)}
          style={{
            fontFamily: 'var(--font-tpl-sans)',
            marginTop: 4,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 10,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: inkSoft,
          }}
        >
          Cambiar mi respuesta
        </button>
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${hairStrong}`, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 17 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center' }}>
        <span style={{ ...displayFont, fontSize: 25, lineHeight: '32px', color: ink }}>{rsvpTitulo}</span>
        <span style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, fontSize: 13, lineHeight: '20px', color: inkSoft }}>
          {fechaLimite ? `Confirma antes del ${fechaLimite}.` : 'Confirma tu asistencia.'}
        </span>
      </div>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        style={{
          fontFamily: 'var(--font-tpl-sans)',
          fontWeight: 300,
          border: 'none',
          borderBottom: `1px solid ${hairStrong}`,
          background: 'transparent',
          padding: '12px 2px',
          fontSize: 16,
          color: ink,
          textAlign: 'center',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 1 }}>
        <button
          type="button"
          onClick={() => setChoice('yes')}
          style={{
            fontFamily: 'var(--font-tpl-sans)',
            flex: 1,
            cursor: 'pointer',
            padding: '15px 8px',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            border: `1px solid ${choice === 'yes' ? accent : hairStrong}`,
            background: choice === 'yes' ? accent : 'transparent',
            color: choice === 'yes' ? paper : ink,
          }}
        >
          Ahí estaré
        </button>
        <button
          type="button"
          onClick={() => setChoice('no')}
          style={{
            fontFamily: 'var(--font-tpl-sans)',
            flex: 1,
            cursor: 'pointer',
            padding: '15px 8px',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            border: `1px solid ${choice === 'no' ? accent : hairStrong}`,
            background: choice === 'no' ? accent : 'transparent',
            color: choice === 'no' ? paper : ink,
          }}
        >
          No podré
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span
          style={{
            fontFamily: 'var(--font-tpl-sans)',
            textAlign: 'center',
            fontSize: 10,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: inkSoft,
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
              color: personas <= 1 ? inkSoft : ink,
              opacity: personas <= 1 ? 0.5 : 1,
            }}
          >
            −
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '9px 0' }}>
            <span style={{ ...displayFont, fontSize: 26, lineHeight: 1, color: accent }}>{personas}</span>
            <span style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, marginTop: 5 }}>
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
              color: personas >= lugares ? inkSoft : ink,
              opacity: personas >= lugares ? 0.5 : 1,
            }}
          >
            +
          </button>
        </div>
      </div>

      {error && <span style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 12, color: '#e08a8a', textAlign: 'center' }}>{error}</span>}
      {!eventId && (
        <span style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 11, color: inkSoft, textAlign: 'center' }}>
          El RSVP se activa cuando publiques tu invitación.
        </span>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSend}
        style={{
          fontFamily: 'var(--font-tpl-sans)',
          fontWeight: 500,
          background: accent,
          border: `1px solid ${accent}`,
          color: paper,
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
