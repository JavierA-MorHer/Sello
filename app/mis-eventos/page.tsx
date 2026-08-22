import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppMenu } from '@/components/nav/AppMenu'
import { getEventTitle } from '@/lib/templates/summary'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'sello.com'
const PUBLISHED_STATUSES = ['active', 'expiring_soon']

const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador',
  active: 'Publicado',
  expiring_soon: 'Por vencer',
  expired: 'Vencido',
  archived: 'Archivado',
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const target = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  return Math.ceil((target.getTime() - Date.now()) / 86_400_000)
}

export default async function MisEventosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/mis-eventos')
  }

  const { data: events } = await supabase
    .from('events')
    .select('id, slug, status, custom_data, template_id, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const templateIds = [...new Set((events ?? []).map((e) => e.template_id).filter(Boolean))]
  const { data: templates } =
    templateIds.length > 0
      ? await supabase.from('templates').select('id, name, category').in('id', templateIds)
      : { data: [] as { id: string; name: string; category: string }[] }

  const templateById = new Map((templates ?? []).map((t) => [t.id, t]))

  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null
  const displayName = metadataName ?? user.email?.split('@')[0] ?? 'de nuevo'
  const isAdmin = user.app_metadata?.role === 'admin'

  return (
    <main className="min-h-screen bg-paper px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body text-sm text-ink/60">Hola, {displayName}.</p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">Mis eventos</h1>
          </div>
          <AppMenu displayName={displayName} isAdmin={isAdmin} />
        </div>

        {events && events.length > 0 ? (
          <div className="mt-10 flex flex-col gap-4">
            {events.map((event) => {
              const template = templateById.get(event.template_id)
              const customData = (event.custom_data ?? {}) as Record<string, unknown>
              const title = template ? getEventTitle(template.category, customData) : 'Evento'
              const fechaEvento =
                typeof customData.fecha_evento === 'string' ? customData.fecha_evento : null
              const days = daysUntil(fechaEvento)
              const isPublished = PUBLISHED_STATUSES.includes(event.status)
              const link = isPublished ? `https://${event.slug}.${ROOT_DOMAIN}` : null

              return (
                <div
                  key={event.id}
                  className="flex flex-col gap-3 rounded-sm border border-ink/8 bg-paper p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xl">{title}</span>
                      <span className="rounded-full bg-paper-2 px-2.5 py-1 font-body text-[10px] font-semibold tracking-[0.08em] text-ink/60 uppercase">
                        {STATUS_LABEL[event.status] ?? event.status}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-xs text-ink/50">
                      {template?.name ?? 'Plantilla'}
                      {days !== null && days >= 0 && ` · faltan ${days} días`}
                    </p>
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-body text-xs font-semibold text-clay underline decoration-clay/40 underline-offset-2"
                      >
                        {link} ↗
                      </a>
                    )}
                  </div>

                  <div className="flex-none">
                    {event.status === 'draft' && (
                      <Link
                        href={`/crear/${event.template_id}`}
                        className="inline-block rounded-sm border border-ink/20 px-4 py-2 font-body text-xs font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
                      >
                        Continuar armando
                      </Link>
                    )}
                    {(event.status === 'expired' || event.status === 'archived') && (
                      <span className="font-body text-xs text-ink/40">Ya no está disponible</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-sm border border-dashed border-ink/20 p-10 text-center">
            <p className="font-body text-sm text-ink/60">Todavía no has armado ninguna invitación.</p>
            <Link
              href="/plantillas"
              className="mt-4 inline-block rounded-sm bg-ink px-6 py-3 font-body text-sm font-semibold text-paper transition-colors hover:bg-clay"
            >
              Elegir plantilla
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
