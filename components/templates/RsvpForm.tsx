'use client'

import { useState } from 'react'

export function RsvpForm({
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
        <p className="font-[family-name:var(--font-tpl-display)] text-2xl text-[#f5efe4]">
          ¡Gracias por confirmar!
        </p>
        <p className="mt-2 font-[family-name:var(--font-tpl-body)] text-sm text-[#f5efe4]/70">
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
        <p className="text-center font-[family-name:var(--font-tpl-body)] text-sm text-[#f5efe4]/70">
          {mensaje}
        </p>
      )}
      {fechaLimite && (
        <p className="text-center font-[family-name:var(--font-tpl-body)] text-xs tracking-[0.15em] text-[#f5efe4]/50 uppercase">
          Antes del {fechaLimite}
        </p>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="font-[family-name:var(--font-tpl-body)] text-xs font-medium tracking-[0.1em] text-[#f5efe4]/70 uppercase">
          Nombre completo
        </span>
        <input
          required
          type="text"
          className="border-0 border-b border-[#f5efe4]/30 bg-transparent px-0.5 py-2 font-[family-name:var(--font-tpl-body)] text-base text-[#f5efe4] outline-none placeholder:text-[#f5efe4]/30 focus:border-[#f5efe4]"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="font-[family-name:var(--font-tpl-body)] text-xs font-medium tracking-[0.1em] text-[#f5efe4]/70 uppercase">
          ¿Nos acompañas?
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAttending('si')}
            className={`flex-1 border py-2.5 font-[family-name:var(--font-tpl-body)] text-sm transition-colors ${
              attending === 'si'
                ? 'border-[#f5efe4] bg-[#f5efe4] text-[#1c2333]'
                : 'border-[#f5efe4]/30 text-[#f5efe4]'
            }`}
          >
            Sí, ahí estaré
          </button>
          <button
            type="button"
            onClick={() => setAttending('no')}
            className={`flex-1 border py-2.5 font-[family-name:var(--font-tpl-body)] text-sm transition-colors ${
              attending === 'no'
                ? 'border-[#f5efe4] bg-[#f5efe4] text-[#1c2333]'
                : 'border-[#f5efe4]/30 text-[#f5efe4]'
            }`}
          >
            No podré ir
          </button>
        </div>
      </div>

      {attending === 'si' && (
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-tpl-body)] text-xs font-medium tracking-[0.1em] text-[#f5efe4]/70 uppercase">
            Acompañantes
          </span>
          <input
            type="number"
            min={0}
            defaultValue={0}
            className="border-0 border-b border-[#f5efe4]/30 bg-transparent px-0.5 py-2 font-[family-name:var(--font-tpl-body)] text-base text-[#f5efe4] outline-none focus:border-[#f5efe4]"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={attending === null}
        className="mt-2 border border-[#f5efe4] py-3 font-[family-name:var(--font-tpl-body)] text-sm font-medium tracking-[0.1em] text-[#f5efe4] uppercase transition-colors hover:bg-[#f5efe4] hover:text-[#1c2333] disabled:opacity-40"
      >
        Confirmar asistencia
      </button>
    </form>
  )
}
