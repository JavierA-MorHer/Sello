import { cookies } from 'next/headers'

// A dónde regresar después del login. Antes viajaba como ?next=… dentro de
// la URL de retorno (/auth/callback, /auth/confirm), pero Supabase solo
// respeta esa URL si coincide con sus Redirect URLs permitidas — con query
// string muchas veces no coincide y Supabase manda al Site URL (el home),
// perdiendo el paso en el que iba el cliente. En cookie, la URL de retorno
// queda limpia y siempre coincide.

const NEXT_COOKIE = 'sello_login_next'
const NEXT_MAX_AGE_S = 60 * 60 * 24

/** Solo rutas internas: evita que ?next=//otro-sitio.com sirva de redirect abierto. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null
  return next
}

export async function rememberLoginNext(next: string) {
  const safe = safeNext(next)
  if (!safe) return
  const cookieStore = await cookies()
  cookieStore.set(NEXT_COOKIE, safe, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: NEXT_MAX_AGE_S,
  })
}

/** Lee y borra el destino guardado. Solo desde Route Handlers / Server Actions. */
export async function consumeLoginNext(fallback = '/plantillas'): Promise<string> {
  const cookieStore = await cookies()
  const saved = safeNext(cookieStore.get(NEXT_COOKIE)?.value)
  if (saved) cookieStore.delete(NEXT_COOKIE)
  return saved ?? fallback
}
