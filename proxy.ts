import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'misello.com.mx'

function getSubdomain(hostname: string): string | null {
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) return null
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return hostname.slice(0, -(`.${ROOT_DOMAIN}`.length))
  }
  // Desarrollo local: slug.localhost:3000 resuelve a 127.0.0.1 sin tocar /etc/hosts.
  if (hostname.endsWith('.localhost:3000')) {
    return hostname.slice(0, -'.localhost:3000'.length)
  }
  return null
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca el token de sesión en cada request — sin esto, los Server
  // Components pueden recibir cookies de auth expiradas.
  await supabase.auth.getUser()

  const hostname = request.headers.get('host') || ''
  const slug = getSubdomain(hostname)

  if (slug) {
    const url = request.nextUrl.clone()
    url.pathname = `/evento/${slug}${url.pathname}`
    const rewritten = NextResponse.rewrite(url)
    response.cookies.getAll().forEach((cookie) => rewritten.cookies.set(cookie))
    return rewritten
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
