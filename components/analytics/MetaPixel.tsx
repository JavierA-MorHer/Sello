'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Pixel de Meta. Sin `NEXT_PUBLIC_META_PIXEL_ID` no renderiza nada, así que
 * en local y en previews no se manda tráfico basura al Events Manager.
 *
 * Este pixel solo cubre las señales de navegador (PageView, ViewContent,
 * InitiateCheckout). Las conversiones de dinero — `Purchase` — NO se disparan
 * aquí: salen del webhook de Stripe vía Conversions API (`lib/analytics/meta.ts`),
 * que es la única fuente que sabe con certeza que el pago se cobró.
 */
export function MetaPixel() {
  const pathname = usePathname()
  const montado = useRef(false)

  useEffect(() => {
    if (!PIXEL_ID) return
    // El snippet ya mandó el PageView de la carga inicial. Este efecto cubre
    // las navegaciones del router de Next, que no recargan la página y por
    // tanto no vuelven a ejecutar el snippet.
    if (!montado.current) {
      montado.current = true
      return
    }
    window.fbq?.('track', 'PageView')
  }, [pathname])

  if (!PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
