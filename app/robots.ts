import type { MetadataRoute } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://misello.com.mx'

/**
 * robots.txt del dominio raíz.
 *
 * Ojo: los subdominios de eventos (`slug.misello.com.mx`) NO usan este
 * archivo — robots.txt es por host y el proxy reescribe todo a
 * `/evento/{slug}`. Ahí la exclusión se hace con `noindex`: el header
 * `X-Robots-Tag` que pone `proxy.ts` y el meta que emite
 * `app/evento/[slug]/page.tsx`. Se deja crawleable a propósito, porque una
 * URL bloqueada por robots.txt nunca llega a leer su propio `noindex`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Rutas detrás de login o de uso interno: no aportan nada en el índice
      // y gastan presupuesto de rastreo.
      disallow: ['/api/', '/admin', '/mis-eventos', '/crear', '/plantillas', '/login', '/auth/'],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
