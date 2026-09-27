'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { claimAnonymousDrafts, rememberAnonymousUser } from './anonymous'

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/** Antes de cualquier login: recuerda al usuario anónimo para heredarle su borrador. */
export async function prepareLoginAction() {
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
}
