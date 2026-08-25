import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'
import { expiryWarningEmail } from '@/lib/email/templates'
import { getEventTitle } from '@/lib/templates/summary'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'misello.com.mx'
const DAY_MS = 86_400_000

type ExpiringEvent = {
  id: string
  slug: string
  custom_data: unknown
  owner_id: string
  template_id: string
}

/**
 * Corre diario (ver vercel.json). Implementa ARCHITECTURE.md sección 7,
 * puntos 1–3 (avisos a 30/7 días + pasar a 'expired'), que son reversibles.
 *
 * El punto 4 (borrado definitivo 30 días después de expirado) se deja SIN
 * implementar a propósito: es borrado irreversible de datos de un cliente
 * que ya pagó, y CLAUDE.md pide explícitamente no tocar la lógica de
 * expiración/borrado sin que el dueño del producto lo confirme primero.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()
  const in30Days = new Date(now.getTime() + 30 * DAY_MS).toISOString()
  const in7Days = new Date(now.getTime() + 7 * DAY_MS).toISOString()
  const nowIso = now.toISOString()

  let notified30 = 0
  let notified7 = 0

  const { data: expiring30 } = await supabase
    .from('events')
    .select('id, slug, custom_data, owner_id, template_id')
    .eq('status', 'active')
    .eq('expiry_notified_30d', false)
    .lte('expires_at', in30Days)
    .gt('expires_at', nowIso)

  for (const event of (expiring30 ?? []) as ExpiringEvent[]) {
    await notifyExpiry(supabase, event, 30)
    await supabase.from('events').update({ expiry_notified_30d: true }).eq('id', event.id)
    notified30++
  }

  const { data: expiring7 } = await supabase
    .from('events')
    .select('id, slug, custom_data, owner_id, template_id')
    .eq('status', 'active')
    .eq('expiry_notified_7d', false)
    .lte('expires_at', in7Days)
    .gt('expires_at', nowIso)

  for (const event of (expiring7 ?? []) as ExpiringEvent[]) {
    await notifyExpiry(supabase, event, 7)
    await supabase.from('events').update({ expiry_notified_7d: true }).eq('id', event.id)
    notified7++
  }

  const { data: expired } = await supabase
    .from('events')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('expires_at', nowIso)
    .select('id')

  return NextResponse.json({
    ok: true,
    notified30,
    notified7,
    expired: expired?.length ?? 0,
  })
}

async function notifyExpiry(
  supabase: ReturnType<typeof createAdminClient>,
  event: ExpiringEvent,
  daysLeft: number
) {
  try {
    const { data: template } = await supabase
      .from('templates')
      .select('category')
      .eq('id', event.template_id)
      .single()

    const { data: owner } = await supabase.auth.admin.getUserById(event.owner_id)
    const ownerEmail = owner?.user?.email
    if (!ownerEmail) return

    const customData = (event.custom_data ?? {}) as Record<string, unknown>
    const eventName = template ? getEventTitle(template.category, customData) : 'tu evento'
    const link = `https://${event.slug}.${ROOT_DOMAIN}`
    const { subject, html } = expiryWarningEmail({ eventName, link, daysLeft })
    await sendEmail({ to: ownerEmail, subject, html })
  } catch (err) {
    console.error('[cron expire-events] No se pudo notificar:', err)
  }
}
