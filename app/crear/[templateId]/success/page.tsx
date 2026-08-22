import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/server'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'sello.com'

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { templateId } = await params
  const { session_id: sessionId } = await searchParams

  if (!sessionId) {
    redirect(`/crear/${templateId}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // El webhook (app/api/webhooks/stripe/route.ts) es la única fuente de
  // verdad que activa el evento. Aquí solo leemos la sesión de Stripe para
  // mostrar el link correcto — si por lo que sea el webhook aún no corre,
  // igual mostramos una confirmación honesta en vez de fallar.
  let slug: string | null = null
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const eventId = session.metadata?.event_id

    if (eventId) {
      const { data: event } = await supabase
        .from('events')
        .select('slug, owner_id')
        .eq('id', eventId)
        .single()

      if (event && event.owner_id === user.id) {
        slug = event.slug
      }
    }
  } catch {
    // Se ignora — la confirmación genérica de abajo sigue siendo honesta.
  }

  const link = slug ? `https://${slug}.${ROOT_DOMAIN}` : null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-clay/50 bg-clay/10 font-display text-3xl text-clay">
        S
      </span>

      <div>
        <h1 className="font-display text-3xl">Tu invitación está publicada</h1>
        <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-ink/70">
          Sin marca de agua y lista para compartir. Si el link de abajo aún no
          carga, dale un minuto — la activación puede tardar unos segundos.
        </p>
      </div>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="font-display text-lg text-clay underline decoration-clay/40 underline-offset-4"
        >
          {link}
        </a>
      )}

      <Link
        href="/mis-eventos"
        className="rounded-sm bg-ink px-6 py-3 font-body text-sm font-semibold text-paper transition-colors hover:bg-clay"
      >
        Ir a mis eventos
      </Link>
    </main>
  )
}
