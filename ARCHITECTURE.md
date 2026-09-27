# ARCHITECTURE.md — Invitaciones Digitales

> El **qué y por qué** del producto vive en `PRODUCT.md`. Este documento cubre el **cómo técnico**.

## 1. Stack

| Capa | Herramienta | Notas |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | Server Components para SEO y velocidad; rutas dinámicas por slug |
| Backend / DB / Auth / Storage | Supabase (Postgres) | Auth con magic link, RLS para permisos, Storage para fotos |
| Hosting | Vercel | Wildcard domains nativos, SSL automático por subdominio |
| Pagos | Stripe (o Mercado Pago para LatAm) | Checkout hosted + webhooks |
| Emails transaccionales | Resend | Confirmaciones, magic link, avisos de expiración |
| Storage de imágenes (si escala) | Cloudflare R2 | Sin costo de egress; migrar desde Supabase Storage si el volumen crece |

## 2. Modelo de datos (Postgres / Supabase)

```sql
-- Plantillas disponibles en el catálogo
create table templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- 'boda' | 'xv_anos' | 'bautizo' | 'generico'
  component_key text not null, -- identifica el componente React que la renderiza
  field_schema jsonb not null, -- define los campos del formulario para esta plantilla
  preview_image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Eventos creados por los clientes
create table events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  template_id uuid references templates(id),
  slug text unique not null,
  custom_domain text unique, -- null en v1, reservado para futuro upsell
  event_date timestamptz,
  custom_data jsonb not null default '{}', -- datos del formulario (nombres, ubicación, itinerario, fotos, etc.)
  status text not null default 'draft'
    check (status in ('draft','active','expiring_soon','expired','archived')),
  paid_at timestamptz,
  expires_at timestamptz,
  expiry_notified_30d boolean default false,
  expiry_notified_7d boolean default false,
  created_at timestamptz default now()
);

-- Invitados de cada evento
create table guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  group_size int default 1,
  created_at timestamptz default now()
);

-- Confirmaciones de asistencia
create table rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests(id) on delete cascade,
  attending boolean not null,
  plus_ones int default 0,
  message text,
  responded_at timestamptz default now()
);
```

### Por qué `custom_data` es JSONB

Cada plantilla tiene campos distintos (una boda pide dos ubicaciones — ceremonia y recepción —, un bautizo solo una). En vez de migrar el schema cada vez que se agrega una plantilla, `custom_data` guarda lo que el `field_schema` de esa plantilla define. El formulario se genera dinámicamente a partir de `templates.field_schema`.

## 3. Row Level Security (RLS)

```sql
alter table events enable row level security;
alter table guests enable row level security;
alter table rsvp_responses enable row level security;

-- El cliente solo ve/edita sus propios eventos
create policy "owner reads own events"
on events for select
using (owner_id = auth.uid());

create policy "owner updates own events"
on events for update
using (owner_id = auth.uid());

-- El admin ve todo (para métricas agregadas y soporte)
create policy "admin reads all events"
on events for select
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- El cliente solo ve invitados de sus propios eventos
create policy "owner reads own guests"
on guests for select
using (event_id in (select id from events where owner_id = auth.uid()));

-- El RSVP público (invitados) se hace vía una función/endpoint con service role,
-- no acceso directo de cliente anónimo a la tabla.
```

## 4. Subdominios por evento

- DNS wildcard: `*.misello.com.mx` → `CNAME` a `cname.vercel-dns.com`.
- En Vercel (Project Settings → Domains): agregar `*.misello.com.mx` una sola vez. Vercel emite y renueva SSL automáticamente por subdominio.
- `middleware.ts` extrae el subdominio del `host` y reescribe la ruta internamente hacia `/evento/[slug]`, sin exponer esa ruta al usuario:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  if (hostname === 'misello.com.mx' || hostname === 'www.misello.com.mx') {
    return NextResponse.next() // landing de marketing
  }

  const slug = hostname.replace('.misello.com.mx', '')
  const url = request.nextUrl.clone()
  url.pathname = `/evento/${slug}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

- Dominio propio del cliente (`mariayluisboda.com`): **no se implementa en v1**. Si se agrega después, usa el campo `events.custom_domain` + API de dominios de Vercel para verificación y SSL.

## 5. Autenticación

- **Magic link** (Supabase `signInWithOtp`) como método principal — sin contraseña.
- Google OAuth como alternativa opcional.
- El email se pide **al inicio del formulario**, antes de pagar, para poder recuperar el borrador (autosave) si el usuario cierra el navegador.
- Rol de admin vía `app_metadata.role = 'admin'` (no editable por el propio usuario), asignado manualmente por ti en Supabase.

```typescript
// Enviar magic link
await supabase.auth.signInWithOtp({
  email: userEmail,
  options: { emailRedirectTo: 'https://misello.com.mx/auth/callback' }
})
```

```typescript
// app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const supabase = createServerClient(/* ... */)
  const { error } = await supabase.auth.verifyOtp({ token_hash, type })
  return NextResponse.redirect(error ? '/login?error=link-invalido' : '/mis-eventos')
}
```

### 5.1 Borradores sin cuenta (usuario anónimo)

El login ya no es la puerta de entrada al wizard: la mayoría abandonaba ahí, antes de invertir nada.

- `/crear/[templateId]` sin sesión llama a `signInAnonymously()` desde el navegador (`empezar-anonimo.tsx`). El anónimo es un usuario real en `auth.users` con `is_anonymous = true`, así que **el RLS existente (`owner_id = auth.uid()`) aplica sin cambios** a `events` y a Storage. Nada vive en `localStorage`: la sesión va en las cookies de Supabase, como la de cualquier usuario.
- El anónimo puede llenar, subir fotos, autoguardar y ver el preview. Fuera del wizard (`/mis-eventos`, `/plantillas`, `/admin`, landing) se trata como "sin sesión".
- Se pide cuenta al tocar "Guardar mi progreso", en el banner que aparece desde el paso 3 y siempre antes de pagar (`createCheckoutSession` rechaza anónimos).
- Traspaso (`lib/auth/anonymous.ts`): antes de iniciar sesión se guarda el id del anónimo en una cookie httpOnly firmada con HMAC. Al completar el login (`/auth/callback`, `/auth/confirm` o `finishLoginAction` para One Tap) sus borradores `draft` pasan a la cuenta real con la service role, y el anónimo se borra. Las fotos no se mueven: su ruta es `{event_id}/…`.
- Regreso después del login: el destino (p. ej. `/crear/{id}?paso=N`, el resumen) se guarda en la cookie httpOnly `sello_login_next` (`lib/auth/login-next.ts`), no como `?next=` en la URL de retorno. Así `/auth/callback` y `/auth/confirm` llegan limpias y coinciden con las Redirect URLs de Supabase; con query string, Supabase podía descartarlas y mandar al Site URL (el home).
- Limpieza: `app/api/cron/cleanup-anonymous` (diario) borra anónimos con más de 30 días, sus borradores y sus fotos.
- Google: One Tap y el botón oficial de Google Identity Services, con `signInWithIdToken` (sin redirect). Sin `NEXT_PUBLIC_GOOGLE_CLIENT_ID` se usa `signInWithOAuth` con redirect.

## 6. Pagos

- **Stripe Checkout** (hosted) — evita construir un formulario de tarjeta propio.
- **Webhook** (`/api/webhooks/stripe`) escucha `checkout.session.completed`, marca `events.status = 'active'`, `paid_at = now()`, calcula `expires_at` a partir de `event_date`, y genera el `slug` definitivo si aún no existe.
- Considerar Mercado Pago como alternativa/complemento si el mercado inicial es LatAm fuera de México.

## 7. Vigencia y expiración (cron)

Job diario (Supabase Edge Function programada con `pg_cron` o Supabase Cron):

1. Eventos a 30 días de expirar y no notificados → enviar email, marcar `expiry_notified_30d = true`.
2. Eventos a 7 días de expirar y no notificados → enviar email, marcar `expiry_notified_7d = true`.
3. Eventos con `expires_at < now()` y `status = 'active'` → `status = 'expired'` (deja de ser pública, **no se borra**).
4. Eventos con `status = 'expired'` y `expires_at < now() - 30 días` → borrado definitivo.

## 8. Preview y protección

- El preview (antes de pagar) vive en una ruta protegida por sesión, separada del slug público final.
- El RSVP está deshabilitado en modo preview.
- La marca de agua, si se quiere protección real contra capturas de pantalla, se renderiza **server-side como imagen** (ej. `@vercel/og` o Puppeteer/Playwright), no como overlay CSS removible por inspección del navegador.
- No se implementan bloqueos de clic derecho ni detección de DevTools — son frágiles y dañan a usuarios legítimos.

## 9. SEO

- Landing de marketing con SSR/SSG y `Metadata API` de Next.js por página.
- `app/sitemap.ts` y `app/robots.ts` generados automáticamente.
- Schema markup (JSON-LD) para producto y FAQ.
- Los subdominios de eventos (`slug.misello.com.mx`) llevan `noindex` — no deben indexarse.

## 10. Estructura de carpetas propuesta

```
/app
  /(public)
    /page.tsx                    → landing de marketing
    /invitaciones-boda/page.tsx  → landing por segmento
    /blog/[slug]/page.tsx
  /evento/[slug]/page.tsx        → invitación pública (resuelta por middleware)
  /(client)
    /mis-eventos/page.tsx        → lista de eventos del cliente
    /mis-eventos/[eventId]/page.tsx → detalle: invitados, RSVP, editar
    /crear/[templateId]/page.tsx → formulario + preview
  /(admin)
    /admin/page.tsx               → métricas de negocio
  /api
    /rsvp/route.ts                → POST público, guarda confirmación
    /webhooks/stripe/route.ts     → activa el evento tras el pago
  /auth/callback/route.ts
middleware.ts
/components
  /templates
    BodaClasica.tsx
    XvAnos.tsx
  /forms
    DynamicForm.tsx               → genera el formulario a partir de field_schema
/lib
  supabase.ts
  stripe.ts
  resend.ts
```

## 11. Costos estimados de infraestructura

| Etapa | Costo mensual |
|---|---|
| Validando (pocos eventos) | $0–20 USD |
| Con tracción (decenas de eventos activos) | $60–90 USD |

## 12. Documentos relacionados

- `PRODUCT.md` — qué se construye y por qué
- `SETUP.md` — cómo levantar el proyecto
- `CLAUDE.md` — contexto para Claude Code
