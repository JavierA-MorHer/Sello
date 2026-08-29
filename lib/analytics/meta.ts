import { createHash } from 'node:crypto'
import { cookies, headers } from 'next/headers'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
// Solo para el "Test Events" del Events Manager. Vacío en producción.
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE
const GRAPH_VERSION = 'v21.0'

export type MetaEventName = 'ViewContent' | 'InitiateCheckout' | 'Purchase' | 'Lead'

/**
 * Señales del navegador que mejoran el "match rate" de Meta. Se capturan en
 * el request del usuario (`collectMetaUserData`) y viajan hasta donde se
 * dispara el evento — en el caso de Purchase, hasta el webhook de Stripe,
 * que corre sin navegador enfrente.
 */
export type MetaUserData = {
  email?: string | null
  fbp?: string | null
  fbc?: string | null
  ip?: string | null
  userAgent?: string | null
}

export function metaCapiEnabled(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN)
}

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

/**
 * Lee, desde un Server Action o Route Handler, las cookies `_fbp`/`_fbc` que
 * dejó el pixel más la IP y el user agent. Guardar esto (por ejemplo en la
 * metadata de la sesión de Stripe) es lo que permite atribuir después una
 * conversión server-side al anuncio que la originó.
 */
export async function collectMetaUserData(email?: string | null): Promise<MetaUserData> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])

  return {
    email: email ?? null,
    fbp: cookieStore.get('_fbp')?.value ?? null,
    fbc: cookieStore.get('_fbc')?.value ?? null,
    ip: headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: headerStore.get('user-agent'),
  }
}

/**
 * Manda un evento a la Conversions API.
 *
 * Nunca lanza: se llama desde el webhook de Stripe, donde un fallo de Meta no
 * debe hacer que Stripe reintente un pago ya procesado. Si el pixel no está
 * configurado, es un no-op silencioso (mismo criterio que `lib/email/resend.ts`).
 *
 * `eventId` debe ser estable y único por conversión — es lo que Meta usa para
 * deduplicar si el mismo evento llega también por el pixel del navegador.
 */
export async function trackMetaEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData = {},
  customData,
  eventTime,
}: {
  eventName: MetaEventName
  eventId: string
  eventSourceUrl?: string
  userData?: MetaUserData
  customData?: Record<string, unknown>
  eventTime?: number
}): Promise<void> {
  if (!metaCapiEnabled()) {
    console.warn(`[meta capi] ${eventName} omitido: falta NEXT_PUBLIC_META_PIXEL_ID o META_CAPI_ACCESS_TOKEN.`)
    return
  }

  // Meta exige SHA-256 en los datos personales; fbp/fbc e IP van en claro
  // porque no son identificadores directos.
  const user_data: Record<string, unknown> = {}
  if (userData.email) user_data.em = [sha256(userData.email)]
  if (userData.fbp) user_data.fbp = userData.fbp
  if (userData.fbc) user_data.fbc = userData.fbc
  if (userData.ip) user_data.client_ip_address = userData.ip
  if (userData.userAgent) user_data.client_user_agent = userData.userAgent

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime ?? Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
        user_data,
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      console.error(`[meta capi] ${eventName} rechazado (${res.status}):`, await res.text())
    }
  } catch (err) {
    console.error(`[meta capi] No se pudo enviar ${eventName}:`, err)
  }
}
