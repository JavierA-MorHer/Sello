'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { claimAnonymousDrafts } from '@/lib/auth/anonymous'
import { consumeLoginNext, safeNext } from '@/lib/auth/login-next'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function confirmMagicLink(tokenHash: string, type: EmailOtpType, next: string | null) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

  if (error) {
    redirect('/login?error=link-invalido')
  }

  await claimAnonymousDrafts(data.user)

  const saved = await consumeLoginNext()
  redirect(safeNext(next) ?? saved)
}
