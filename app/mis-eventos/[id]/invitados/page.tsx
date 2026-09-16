import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AppMenu } from '@/components/nav/AppMenu'
import { getEventTitle } from '@/lib/templates/summary'

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default async function InvitadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/mis-eventos/${id}/invitados`)
  }

  // owner_id se valida vía RLS de "events" con el cliente normal — si el
  // evento no es del usuario, esta consulta simplemente no regresa filas.
  const { data: event } = await supabase
    .from('events')
    .select('id, template_id, custom_data')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  const { data: template } = await supabase
    .from('templates')
    .select('category')
    .eq('id', event.template_id)
    .single()

  const eventName = template
    ? getEventTitle(template.category, (event.custom_data ?? {}) as Record<string, unknown>)
    : 'Evento'

  // guests/rsvp_responses: la ownership ya quedó validada arriba, así que
  // aquí usamos el cliente con service role solo para poder hacer el join
  // (rsvp_responses no tiene policy propia — el RSVP público se escribe vía
  // service role, ver lib/rsvp/actions.ts).
  const admin = createAdminClient()
  const { data: guests } = await admin
    .from('guests')
    .select('id, name, phone, group_size, created_at, rsvp_responses(attending, plus_ones, message, responded_at)')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  // Solo la plantilla Cumpleaños escribe aquí (ver lib/rsvp/actions.ts,
  // submitBirthdayMessage) — para el resto de las plantillas esta consulta
  // simplemente no regresa filas.
  const { data: birthdayMessages } = await admin
    .from('birthday_messages')
    .select('id, name, message, created_at')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  type GuestRow = {
    id: string
    name: string
    phone: string | null
    group_size: number
    created_at: string
    rsvp_responses: { attending: boolean; plus_ones: number; message: string | null; responded_at: string }[]
  }

  const rows = (guests ?? []) as GuestRow[]
  const confirmed = rows.filter((g) => g.rsvp_responses[0]?.attending)
  const declined = rows.filter((g) => g.rsvp_responses[0] && !g.rsvp_responses[0].attending)
  const totalPeople = confirmed.reduce((sum, g) => sum + (g.rsvp_responses[0]?.plus_ones ?? 0) + 1, 0)

  return (
    <main className="min-h-screen bg-paper px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/mis-eventos"
              className="font-body text-sm font-semibold text-ink/60 transition-colors hover:text-ink"
            >
              ← Mis eventos
            </Link>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">{eventName}</h1>
            <p className="mt-1 font-body text-sm text-ink/60">Confirmaciones de asistencia</p>
          </div>
          <AppMenu />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-sm border border-ink/8 p-4 text-center">
            <span className="font-display text-3xl text-clay">{confirmed.length}</span>
            <p className="mt-1 font-body text-xs text-ink/60">Confirmaron</p>
          </div>
          <div className="rounded-sm border border-ink/8 p-4 text-center">
            <span className="font-display text-3xl">{declined.length}</span>
            <p className="mt-1 font-body text-xs text-ink/60">No podrán ir</p>
          </div>
          <div className="rounded-sm border border-ink/8 p-4 text-center">
            <span className="font-display text-3xl">{totalPeople}</span>
            <p className="mt-1 font-body text-xs text-ink/60">Personas en total</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {rows.length === 0 ? (
            <div className="rounded-sm border border-dashed border-ink/20 p-10 text-center">
              <p className="font-body text-sm text-ink/60">Todavía no hay confirmaciones.</p>
            </div>
          ) : (
            rows.map((guest) => {
              const rsvp = guest.rsvp_responses[0]
              return (
                <div key={guest.id} className="rounded-sm border border-ink/8 bg-paper p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg">{guest.name}</span>
                      {rsvp ? (
                        <span
                          className={`rounded-full px-2.5 py-1 font-body text-[10px] font-semibold tracking-[0.08em] uppercase ${
                            rsvp.attending ? 'bg-clay/15 text-clay' : 'bg-paper-2 text-ink/50'
                          }`}
                        >
                          {rsvp.attending ? `Asiste · ${rsvp.plus_ones + 1} persona${rsvp.plus_ones ? 's' : ''}` : 'No asiste'}
                        </span>
                      ) : (
                        <span className="rounded-full bg-paper-2 px-2.5 py-1 font-body text-[10px] font-semibold tracking-[0.08em] text-ink/40 uppercase">
                          Sin responder
                        </span>
                      )}
                    </div>
                    {rsvp && (
                      <span className="font-body text-xs text-ink/40">{formatDateTime(rsvp.responded_at)}</span>
                    )}
                  </div>
                  {rsvp?.message && (
                    <p className="mt-2 font-body text-sm text-ink/70 italic">&ldquo;{rsvp.message}&rdquo;</p>
                  )}
                </div>
              )
            })
          )}
        </div>

        {birthdayMessages && birthdayMessages.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl">Mensajes de cumpleaños</h2>
            <div className="mt-4 flex flex-col gap-3">
              {birthdayMessages.map((m) => (
                <div key={m.id} className="rounded-sm border border-ink/8 bg-paper p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-lg">{m.name || 'Anónimo'}</span>
                    <span className="font-body text-xs text-ink/40">{formatDateTime(m.created_at)}</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-ink/70 italic">&ldquo;{m.message}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
