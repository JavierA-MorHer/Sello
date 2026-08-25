'use client'

import { useState, type FormEvent } from 'react'
import { submitFeedback } from '@/lib/feedback/actions'

const INPUT_CLASS =
  'w-full rounded-sm border border-ink/15 bg-paper px-3.5 py-3 font-body text-base text-ink outline-none transition-colors focus:border-clay'

export function FeedbackForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    setError(null)

    const result = await submitFeedback({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
    })

    if (result.ok) {
      form.reset()
      setStatus('sent')
    } else {
      setError(result.error)
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-sm border border-clay/30 bg-paper p-6 text-center">
        <p className="font-display text-xl">Gracias, ya nos llegó.</p>
        <p className="mt-2 font-body text-sm text-ink/60">
          Te respondemos al correo que nos dejaste.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 font-body text-sm font-semibold text-clay hover:text-clay-light"
        >
          Escribir otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Campo trampa para bots: invisible y fuera del orden de tabulación. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-xs font-semibold tracking-[0.08em] text-ink/50 uppercase">
            Tu nombre
          </span>
          <input name="name" required maxLength={100} className={INPUT_CLASS} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-body text-xs font-semibold tracking-[0.08em] text-ink/50 uppercase">
            Tu correo
          </span>
          <input name="email" type="email" required maxLength={200} className={INPUT_CLASS} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-body text-xs font-semibold tracking-[0.08em] text-ink/50 uppercase">
          Tu mensaje
        </span>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={2000}
          placeholder="¿Qué te gustaría preguntarnos?"
          className={`${INPUT_CLASS} resize-y`}
        />
      </label>

      {error && (
        <p role="alert" className="font-body text-sm text-clay">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="self-start rounded-sm bg-ink px-7 py-3.5 font-body text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
