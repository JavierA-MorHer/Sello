import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEventTitle } from '@/lib/templates/summary'
import { AppMenu } from '@/components/nav/AppMenu'

// Página detrás de login: no aporta nada en el índice de Google y solo
// gasta presupuesto de rastreo. Refuerza el Disallow de app/robots.ts.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

const STATUS_ORDER = ['draft', 'active', 'expiring_soon', 'expired', 'archived'] as const

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.is_anonymous) {
    redirect('/login?next=/admin')
  }

  // Rol de admin asignado manualmente en Supabase (app_metadata.role), no
  // editable por el propio usuario — ver ARCHITECTURE.md §5. La query de abajo
  // además está reforzada por la policy RLS "admin reads all events": un
  // usuario sin ese rol solo vería sus propios eventos aunque este chequeo
  // fallara.
  if (user.app_metadata?.role !== 'admin') {
    redirect('/plantillas')
  }

  const { data: events } = await supabase
    .from('events')
    .select('id, status, template_id, custom_data, created_at, paid_at, price_paid_mxn')
    .order('created_at', { ascending: false })

  const { data: templates } = await supabase.from('templates').select('id, name, category, price_mxn')
  const templateById = new Map((templates ?? []).map((t) => [t.id, t]))

  const counts: Record<string, number> = { draft: 0, active: 0, expiring_soon: 0, expired: 0, archived: 0 }
  let revenueMXN = 0

  for (const event of events ?? []) {
    counts[event.status] = (counts[event.status] ?? 0) + 1
    if (event.paid_at) {
      // price_paid_mxn es el monto real confirmado por Stripe (guardado por
      // el webhook). Solo se usa el precio actual de la plantilla como
      // respaldo para eventos activados antes de que existiera esa columna.
      revenueMXN += event.price_paid_mxn ?? templateById.get(event.template_id)?.price_mxn ?? 0
    }
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Panel de admin</h1>
            <p className="mt-2 font-body text-sm text-ink/60">
              Métricas agregadas — {events?.length ?? 0} eventos en total.
            </p>
          </div>
          <AppMenu isAdmin />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="rounded-sm border border-ink/8 bg-paper p-4">
              <p className="font-body text-[11px] font-semibold tracking-[0.08em] text-ink/50 uppercase">
                {status}
              </p>
              <p className="mt-1 font-display text-2xl">{counts[status] ?? 0}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-sm bg-ink p-6 text-paper">
          <p className="font-body text-[11px] font-semibold tracking-[0.08em] text-paper/60 uppercase">
            Ingresos totales (monto real cobrado por Stripe)
          </p>
          <p className="mt-1 font-display text-3xl">${revenueMXN.toLocaleString('es-MX')} MXN</p>
        </div>

        <h2 className="mt-12 font-display text-xl">Eventos recientes</h2>
        <div className="mt-4 flex flex-col divide-y divide-ink/8 rounded-sm border border-ink/8">
          {(events ?? []).slice(0, 50).map((event) => {
            const template = templateById.get(event.template_id)
            const title = template
              ? getEventTitle(template.category, (event.custom_data ?? {}) as Record<string, unknown>)
              : 'Evento'

            return (
              <div key={event.id} className="flex items-center justify-between px-4 py-3 font-body text-sm">
                <span>{title}</span>
                <span className="text-ink/50">
                  {template?.name ?? '—'} · {event.status}
                </span>
              </div>
            )
          })}
          {(events ?? []).length === 0 && (
            <p className="px-4 py-6 text-center font-body text-sm text-ink/50">Sin eventos todavía.</p>
          )}
        </div>
      </div>
    </main>
  )
}
