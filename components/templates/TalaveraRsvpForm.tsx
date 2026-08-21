'use client'

import { useState } from 'react'

const CREAM = '#f7f2e7'
const OCHRE = '#c9932e'
// Ochre base contra fondo azul da 3.23:1 — bajo el piso de 4.5:1 para texto.
// Esta variante más clara sí cumple (5.20:1).
const OCHRE_ON_BLUE = '#eec070'

export function TalaveraRsvpForm({
  fechaLimite,
  mensaje,
}: {
  fechaLimite?: string
  mensaje?: string
}) {
  const [attending, setAttending] = useState<'si' | 'no' | null>(null)
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="text-center">
        <p className="font-[family-name:var(--font-tal-display)] text-2xl" style={{ color: CREAM }}>
          ¡Gracias por confirmar!
        </p>
        <p
          className="mt-2 font-[family-name:var(--font-tal-body)] text-sm"
          style={{ color: `${CREAM}b3` }}
        >
          Te esperamos con mucho cariño.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
      className="mx-auto flex w-full max-w-md flex-col gap-6"
    >
      {mensaje && (
        <p
          className="text-center font-[family-name:var(--font-tal-body)] text-sm"
          style={{ color: `${CREAM}b3` }}
        >
          {mensaje}
        </p>
      )}
      {fechaLimite && (
        <p
          className="text-center font-[family-name:var(--font-tal-body)] text-xs tracking-[0.15em] uppercase"
          style={{ color: OCHRE_ON_BLUE }}
        >
          Antes del {fechaLimite}
        </p>
      )}

      <label className="flex flex-col gap-1.5">
        <span
          className="font-[family-name:var(--font-tal-body)] text-xs font-medium tracking-[0.1em] uppercase"
          style={{ color: `${CREAM}b3` }}
        >
          Nombre completo
        </span>
        <input
          required
          type="text"
          className="border-0 border-b bg-transparent px-0.5 py-2 font-[family-name:var(--font-tal-body)] text-base outline-none"
          style={{ borderColor: `${CREAM}4d`, color: CREAM }}
        />
      </label>

      <div className="flex flex-col gap-2">
        <span
          className="font-[family-name:var(--font-tal-body)] text-xs font-medium tracking-[0.1em] uppercase"
          style={{ color: `${CREAM}b3` }}
        >
          ¿Nos acompañas?
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAttending('si')}
            className="flex-1 border py-2.5 font-[family-name:var(--font-tal-body)] text-sm transition-colors"
            style={
              attending === 'si'
                ? { borderColor: OCHRE, backgroundColor: OCHRE, color: '#2b2620' }
                : { borderColor: `${CREAM}4d`, color: CREAM }
            }
          >
            Sí, ahí estaré
          </button>
          <button
            type="button"
            onClick={() => setAttending('no')}
            className="flex-1 border py-2.5 font-[family-name:var(--font-tal-body)] text-sm transition-colors"
            style={
              attending === 'no'
                ? { borderColor: OCHRE, backgroundColor: OCHRE, color: '#2b2620' }
                : { borderColor: `${CREAM}4d`, color: CREAM }
            }
          >
            No podré ir
          </button>
        </div>
      </div>

      {attending === 'si' && (
        <label className="flex flex-col gap-1.5">
          <span
            className="font-[family-name:var(--font-tal-body)] text-xs font-medium tracking-[0.1em] uppercase"
            style={{ color: `${CREAM}b3` }}
          >
            Acompañantes
          </span>
          <input
            type="number"
            min={0}
            defaultValue={0}
            className="border-0 border-b bg-transparent px-0.5 py-2 font-[family-name:var(--font-tal-body)] text-base outline-none"
            style={{ borderColor: `${CREAM}4d`, color: CREAM }}
          />
        </label>
      )}

      <button
        type="submit"
        disabled={attending === null}
        className="mt-2 border py-3 font-[family-name:var(--font-tal-body)] text-sm font-medium tracking-[0.1em] uppercase transition-colors disabled:opacity-40"
        style={{ borderColor: OCHRE, color: OCHRE_ON_BLUE }}
      >
        Confirmar asistencia
      </button>
    </form>
  )
}
