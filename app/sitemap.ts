import type { MetadataRoute } from 'next'
import { createServerClient } from '@supabase/ssr'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://misello.com.mx'

// Lectura anónima y sin sesión: el sitemap solo lista lo que ya es público,
// así que no necesita (ni debe) leer las cookies de auth del visitante.
// Usar el cliente de `lib/supabase/server.ts` volvería la ruta dinámica.
function createAnonClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

// Se regenera cada hora: las plantillas cambian muy de vez en cuando.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Los demos son las únicas páginas de producto públicas (todo lo demás
  // vive detrás del login). Si Supabase no responde, el sitemap sale con las
  // estáticas en vez de romper el build.
  try {
    const { data: templates } = await createAnonClient()
      .from('templates')
      .select('id, created_at')
      .eq('active', true)

    return [
      ...estaticas,
      ...(templates ?? []).map((t) => ({
        url: `${APP_URL}/demo/${t.id}`,
        lastModified: t.created_at ? new Date(t.created_at) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ]
  } catch (err) {
    console.error('[sitemap] No se pudieron leer las plantillas:', err)
    return estaticas
  }
}
