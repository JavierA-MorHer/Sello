import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'

// Borradores anónimos: quien llega desde un demo empieza a llenar su
// invitación con un usuario anónimo de Supabase (`is_anonymous = true`). Es
// un usuario real en auth.users, así que el RLS de `events` y de Storage
// (owner_id = auth.uid()) funciona sin cambios. La cuenta real se pide hasta
// "Guardar mi progreso" o "Pagar", y al entrar sus borradores se le pasan.
//
// Solo server-side: usa la service role key.

const CLAIM_COOKIE = 'sello_anon_claim'
const CLAIM_MAX_AGE_S = 60 * 60 * 24

/** Usuario con cuenta de verdad — un anónimo cuenta como "sin sesión" fuera del wizard. */
export function isRealUser(user: User | null): user is User {
  return !!user && !user.is_anonymous
}

function sign(anonId: string) {
  // La service role key ya es un secreto exclusivo del server; derivar la
  // llave de ahí evita una env var más que configurar en Vercel.
  return createHmac('sha256', `anon-claim:${process.env.SUPABASE_SERVICE_ROLE_KEY}`)
    .update(anonId)
    .digest('base64url')
}

function verify(value: string): string | null {
  const [anonId, signature] = value.split('.')
  if (!anonId || !signature) return null
  const expected = Buffer.from(sign(anonId))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
  return anonId
}

/**
 * Se llama justo antes de iniciar sesión (Google o magic link), mientras la
 * sesión anónima todavía existe: al terminar el login la cookie de sesión ya
 * es de la cuenta real y sin esto no habría forma de saber de quién era el
 * borrador. Firmada para que nadie pueda reclamar borradores ajenos poniendo
 * un id a mano.
 */
export async function rememberAnonymousUser(user: User | null) {
  if (!user?.is_anonymous) return
  const cookieStore = await cookies()
  cookieStore.set(CLAIM_COOKIE, `${user.id}.${sign(user.id)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // lax: tiene que viajar en la navegación de regreso desde Google y desde
    // el link del correo.
    sameSite: 'lax',
    path: '/',
    maxAge: CLAIM_MAX_AGE_S,
  })
}

/**
 * Pasa los borradores del usuario anónimo recordado a la cuenta recién
 * iniciada y borra al anónimo. Solo desde Route Handlers / Server Actions
 * (tiene que poder borrar la cookie). Nunca lanza: si algo falla, el login
 * sigue y el borrador queda en el anónimo hasta que el cron lo limpie.
 */
export async function claimAnonymousDrafts(user: User | null) {
  const cookieStore = await cookies()
  const raw = cookieStore.get(CLAIM_COOKIE)?.value
  if (!raw) return
  cookieStore.delete(CLAIM_COOKIE)

  const anonId = verify(raw)
  if (!anonId || !isRealUser(user) || anonId === user.id) return

  try {
    const admin = createAdminClient()

    // Doble candado: aunque la firma sea válida, solo se mueven borradores
    // de un usuario que sigue siendo anónimo — nunca de una cuenta real.
    const { data: anon } = await admin.auth.admin.getUserById(anonId)
    if (!anon.user?.is_anonymous) return

    const { error } = await admin
      .from('events')
      .update({ owner_id: user.id })
      .eq('owner_id', anonId)
      .eq('status', 'draft')

    if (error) {
      console.error('[anon-claim] No se pudieron mover los borradores:', error)
      return
    }

    // Las fotos viven en event-photos/{event_id}/…, no dependen del dueño:
    // no hay que moverlas.
    await admin.auth.admin.deleteUser(anonId)
  } catch (err) {
    console.error('[anon-claim] Falló el traspaso:', err)
  }
}
