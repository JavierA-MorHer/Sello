'use client'

import { useState } from 'react'

/** Web Share API cuando existe (móvil, casi todo browser moderno con HTTPS); si no, abre WhatsApp directo. */
export function CopyShareActions({ link, eventName }: { link: string; eventName?: string }) {
  const [copied, setCopied] = useState(false)
  const message = eventName ? `Aquí está mi invitación — ${eventName}: ${link}` : `Aquí está mi invitación: ${link}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El link ya está visible arriba y se puede seleccionar a mano.
    }
  }

  async function handleShare() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Mi invitación', text: message, url: link })
        return
      } catch {
        // El usuario canceló el share sheet, o el navegador lo rechazó — cae al link de WhatsApp.
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-sm border border-ink/20 px-7 py-3.5 font-body text-sm font-semibold whitespace-nowrap text-ink transition-colors hover:border-clay hover:text-clay"
      >
        {copied ? 'Copiado ✓' : 'Copiar link'}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="rounded-sm bg-ink px-7 py-3.5 font-body text-sm font-semibold whitespace-nowrap text-paper transition-colors hover:bg-clay"
      >
        Compartir
      </button>
    </div>
  )
}
