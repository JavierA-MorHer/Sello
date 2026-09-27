import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { claimAnonymousDrafts } from '@/lib/auth/anonymous'
import { consumeLoginNext, safeNext } from '@/lib/auth/login-next'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // ?next= en la URL es de links viejos; lo normal es la cookie (ver lib/auth/login-next.ts).
  const saved = await consumeLoginNext()
  const next = safeNext(searchParams.get('next')) ?? saved

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      await claimAnonymousDrafts(data.user)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
