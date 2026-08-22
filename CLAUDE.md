# CLAUDE.md

Este archivo le da contexto a Claude Code al trabajar en este repositorio. Colócalo en la raíz del proyecto (junto a `package.json`).

## Qué es este proyecto

Plataforma self-service de invitaciones digitales (bodas, XV años, bautizos, eventos). El cliente elige una plantilla, llena un formulario con sus datos, ve un preview, paga una vez, y recibe un enlace único (`slug.sello.com`) para compartir con sus invitados, quienes confirman asistencia (RSVP).

Documentación completa:
- `docs/PRODUCT.md` — qué se construye y por qué (leer primero si hay dudas de producto)
- `docs/ARCHITECTURE.md` — stack, modelo de datos, decisiones técnicas
- `docs/SETUP.md` — cómo levantar el entorno local

## Stack

- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- Supabase (Postgres + Auth + Storage) como backend
- Stripe para pagos
- Resend para emails
- Deploy en Vercel

## Convenciones del proyecto

- **Componentes de plantilla son "tontos"**: reciben `custom_data` (el JSON del evento) como props y solo renderizan. No hacen fetch de datos ellos mismos — eso vive en el Server Component padre.
- **El formulario es dinámico**, generado a partir de `templates.field_schema`. No hardcodear formularios distintos por plantilla — si un campo nuevo se necesita, se agrega al schema, no a un componente ad-hoc.
- **El preview y la página pública final usan el mismo componente de plantilla.** Nunca construir una "vista simulada" aparte — la fuente de verdad del render es una sola.
- **Nunca exponer la `service role key` de Supabase al cliente.** Solo se usa en Route Handlers / Server Actions.
- **RLS siempre activo.** Cualquier tabla nueva con datos de clientes debe llevar políticas de Row Level Security antes de mergear, no "se agrega después".
- **No usar `localStorage`/`sessionStorage`** en el navegador — todo estado persistente va a Supabase (autosave de borradores incluido).
- Nombrar rutas y componentes en español cuando sea contenido de cara al usuario final (ej. `/mis-eventos`), en inglés cuando sea código interno (ej. `lib/supabase.ts`).

## Comandos habituales

```bash
npm run dev          # servidor local
npm run build         # build de producción
npm run lint          # lint
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # probar webhooks localmente
```

## Cosas que Claude Code NO debe hacer sin confirmar explícitamente

- Modificar o eliminar políticas de RLS en Supabase
- Cambiar la lógica de expiración/borrado de eventos (`docs/ARCHITECTURE.md` sección 7) sin revisar antes con el dueño del producto — es una decisión de negocio, no solo técnica
- Agregar dependencias nuevas grandes (librerías de UI completas, ORMs, etc.) sin justificar por qué no basta con lo ya instalado
- Hacer deploy a producción o hacer push directo a la rama principal

## Estado actual del proyecto

- [x] Schema de Supabase creado (RLS activo en `events`/`guests`/`rsvp_responses`/`templates`)
- [x] Auth con Google OAuth + magic link funcionando
- [x] Primera plantilla (Boda Clásica) con su `field_schema` y componente (`BodaClasica.tsx`)
- [x] Formulario dinámico (wizard paso a paso) + autosave por usuario
- [x] Preview conectado — usa el mismo componente de plantilla, con marca de agua
- [x] Storage de fotos (bucket `event-photos` + políticas RLS)
- [x] Stripe Checkout + webhook de activación (`app/api/webhooks/stripe`) — código completo, **solo faltan las API keys reales** en `.env.local` (ver `.env.example`)
- [x] Decisión de dominio: el link del invitado es `slug.sello.com` (subdominio) — `proxy.ts` detecta el subdominio y reescribe a `/evento/{slug}`
- [x] Página pública del invitado (`app/evento/[slug]/page.tsx`)
- [x] RLS pública para lectura de eventos por slug (`supabase/rls-public-event-read.sql`)
- [x] RSVP real — `RsvpForm` guarda en `guests`/`rsvp_responses` vía `lib/rsvp/actions.ts`
- [x] Panel del cliente (`/mis-eventos`) — lista eventos reales del usuario
- [x] Panel de admin (`/admin`) — métricas agregadas, gateado por `app_metadata.role`
- [x] Avisos de vencimiento + paso a `expired` (`app/api/cron/expire-events`, `vercel.json`) — el borrado definitivo (punto 4 de `ARCHITECTURE.md` §7) se deja sin implementar a propósito, ver el comentario en ese archivo
- [x] Emails con Resend (`lib/email/`) — confirmación de pago y avisos de vencimiento
- [x] Plantillas de XV años, Bautizo y Baby Shower (`XvAnos.tsx`, `Bautizo.tsx`, `BabyShower.tsx`) — ya insertadas en Supabase
- [ ] Plantilla "Genérico" — sigue como "próximamente" en el catálogo, no se construyó (no hay spec de qué campos debería tener; es la única que queda sin definir)

## Pendientes que requieren acceso externo (no resolubles por Claude Code)

- **Pegar las API keys reales de Stripe** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) y de ser necesario `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — ver comentarios en `.env.example`.
- **Correr `supabase/rls-public-event-read.sql`** en el SQL Editor de Supabase si no se ha corrido aún — crear políticas RLS requiere SQL directo, no se puede hacer vía la API REST con la service role key.
- **Configurar el cron en Vercel**: agregar la env var `CRON_SECRET` (ya generada en `.env.local`) en el proyecto de Vercel — Vercel Cron la manda automáticamente como header `Authorization: Bearer`.
- **DNS wildcard** `*.sello.com` → Vercel (`ARCHITECTURE.md` §4) — necesita acceso al registrador del dominio.
- **Verificar dominio en Resend** para poder usar `hola@sello.com` como remitente en vez del `onboarding@resend.dev` de prueba.
- **Google OAuth "profesional"** (nombre "Sello", logo, dominio verificado) — ver guía dada en conversación; es 100% configuración en Google Cloud Console + Supabase Dashboard.

Actualiza esta lista conforme avances — ayuda a retomar contexto en sesiones futuras.
