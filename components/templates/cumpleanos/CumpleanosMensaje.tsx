'use client'

import { useState, useTransition } from 'react'
import { submitBirthdayMessage } from '@/lib/rsvp/actions'

export function CumpleanosMensaje({
  eventId,
  accent,
  paper,
  ink,
  inkMid,
  inkSoft,
  hairStrong,
  displayFont,
  quoteFont,
  primerNombre,
}: {
  eventId: string | null
  accent: string
  paper: string
  ink: string
  inkMid: string
  inkSoft: string
  hairStrong: string
  displayFont: React.CSSProperties
  quoteFont: React.CSSProperties
  primerNombre?: string
}) {
  const [texto, setTexto] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSend() {
    if (!texto.trim() || !eventId) return
    setError(null)
    startTransition(async () => {
      try {
        await submitBirthdayMessage(eventId, { message: texto })
        setDone(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo guardar tu mensaje.')
      }
    })
  }

  if (done) {
    return (
      <p style={{ ...quoteFont, fontSize: 15, color: inkMid, textAlign: 'center', margin: 0 }}>
        ¡Gracias! Tu mensaje llegará junto con las felicitaciones del día.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, fontSize: 13, lineHeight: '20px', color: inkSoft, textAlign: 'center', margin: 0 }}>
        Escribe unas palabras para {primerNombre || 'el festejado'}. Se guardan con la confirmación.
      </p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        placeholder="Feliz cumpleaños…"
        style={{
          ...quoteFont,
          resize: 'none',
          border: `1px solid ${hairStrong}`,
          background: paper,
          color: ink,
          padding: '12px 14px',
          fontSize: 15,
          outline: 'none',
        }}
      />
      {error && <span style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 12, color: '#e08a8a', textAlign: 'center' }}>{error}</span>}
      {!eventId && (
        <span style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 11, color: inkSoft, textAlign: 'center' }}>
          Se activa cuando se publique la invitación.
        </span>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSend}
        style={{
          ...displayFont,
          fontFamily: 'var(--font-tpl-sans)',
          fontWeight: 500,
          background: 'transparent',
          border: `1px solid ${accent}`,
          color: accent,
          fontSize: 11,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          padding: 14,
          cursor: 'pointer',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </div>
  )
}
