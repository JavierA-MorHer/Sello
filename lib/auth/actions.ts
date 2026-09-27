'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { claimAnonymousDrafts, rememberAnonymousUser } from './anonymous'
import { consumeLoginNext, rememberLoginNext } from './login-next'

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Antes de cualquier login: recuerda a dónde regresar y, si es anónimo, al
 * usuario para heredarle su borrador.
 */
export async function prepareLoginAction(next: string) {
  await rememberLoginNext(next)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await rememberAnonymousUser(user)
}

/**
 * Después de un login que no pasa por /auth/callback ni /auth/confirm
 * (Google One Tap: la sesión se crea en el navegador, sin redirect).
 */
export async function finishLoginAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await claimAnonymousDrafts(user)
  // Aquí no hay redirect del server (el panel decide qué sigue), pero se
  // limpia para que un login posterior no herede este destino.
  await consumeLoginNext()
}
