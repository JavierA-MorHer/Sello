'use client'

import { useEffect, useRef } from 'react'

/**
 * Dispara un evento estándar del pixel una sola vez al montar. Sirve para
 * marcar una página como "vista de producto" desde un Server Component:
 * `<TrackEvent event="ViewContent" params={{ content_name: ... }} />`.
 *
 * Si el pixel no está configurado, `window.fbq` no existe y esto no hace nada.
 */
export function TrackEvent({
  event,
  params,
}: {
  event: 'ViewContent' | 'InitiateCheckout' | 'Lead'
  params?: Record<string, unknown>
}) {
  const disparado = useRef(false)

  useEffect(() => {
    // React 19 en desarrollo monta dos veces (StrictMode); el ref evita
    // contar el evento por duplicado.
    if (disparado.current) return
    disparado.current = true
    window.fbq?.('track', event, params)
  }, [event, params])

  return null
}
