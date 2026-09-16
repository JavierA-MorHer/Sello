# CLAUDE.md

Este archivo le da contexto a Claude Code al trabajar en este repositorio. Colócalo en la raíz del proyecto (junto a `package.json`).

## Qué es este proyecto

Plataforma self-service de invitaciones digitales (bodas, XV años, bautizos, eventos). El cliente elige una plantilla, llena un formulario con sus datos, ve un preview, paga una vez, y recibe un enlace único (`slug.misello.com.mx`) para compartir con sus invitados, quienes confirman asistencia (RSVP).

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
- [x] Decisión de dominio: el link del invitado es `slug.misello.com.mx` (subdominio) — `proxy.ts` detecta el subdominio y reescribe a `/evento/{slug}`
- [x] Página pública del invitado (`app/evento/[slug]/page.tsx`)
- [x] RLS pública para lectura de eventos por slug (`supabase/rls-public-event-read.sql`)
- [x] RSVP real — `RsvpForm` guarda en `guests`/`rsvp_responses` vía `lib/rsvp/actions.ts`
- [x] Panel del cliente (`/mis-eventos`) — lista eventos reales del usuario
- [x] Panel de admin (`/admin`) — métricas agregadas, gateado por `app_metadata.role`
- [x] Avisos de vencimiento + paso a `expired` (`app/api/cron/expire-events`, `vercel.json`) — el borrado definitivo (punto 4 de `ARCHITECTURE.md` §7) se deja sin implementar a propósito, ver el comentario en ese archivo
- [x] Emails con Resend (`lib/email/`) — confirmación de pago y avisos de vencimiento
- [x] Plantillas de XV años, Bautizo y Baby Shower (`XvAnos.tsx`, `Bautizo.tsx`, `BabyShower.tsx`) — ya insertadas en Supabase
- [x] Base técnica de SEO — `app/robots.ts`, `app/sitemap.ts` (lista `/`, `/privacidad` y los demos públicos), canonical por página, `generateMetadata` en `/demo/[templateId]`, `noindex` en las páginas detrás de login (`/plantillas`, `/mis-eventos`, `/admin`) y JSON-LD (Organization + WebSite + FAQPage + Product) en la landing
- [x] Aviso de privacidad (`app/privacidad`) enlazado desde el footer — **borrador sin revisión legal**: falta razón social y domicilio (los exige la LFPDPPP), ver el comentario en el archivo
- [x] Pixel de Meta + Conversions API — `lib/analytics/meta.ts` (server) y `components/analytics/` (cliente). `PageView` y `ViewContent` por navegador; `InitiateCheckout` desde el server action del checkout; `Purchase` desde el webhook de Stripe, que es lo único que sabe que el pago se cobró. Las cookies `_fbp`/`_fbc` viajan en la metadata de la sesión de Stripe para poder atribuir la venta. Sin las env vars, todo es no-op
- [x] Microsoft Clarity — `components/analytics/MicrosoftClarity.tsx`, montado en `app/layout.tsx`. Sin `NEXT_PUBLIC_CLARITY_ID` no renderiza nada. **Falta poner `NEXT_PUBLIC_CLARITY_ID=yiwbjk0pr8` en las env vars de Vercel y hacer redeploy** (es `NEXT_PUBLIC_*`, se incrusta en build time)
- [ ] Plantilla "Genérico" — sigue como "próximamente" en el catálogo, no se construyó (no hay spec de qué campos debería tener; es la única que queda sin definir)

## Pendientes que requieren acceso externo (no resolubles por Claude Code)

- [x] API keys reales de Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) puestas en `.env.local`
- [x] `supabase/rls-public-event-read.sql` corrido en el SQL Editor de Supabase
- [x] `field_schema` de la plantilla Bautizo actualizado al rediseño de `plantillas-handoff/design_handoff_bautizo` (temas, cita bíblica, padrinos de ofrenda, ceremonia/comida, RSVP con stepper de lugares) — aplicado en Supabase vía REST API con la service role key el 2026-09-16 (no había eventos reales de Bautizo creados todavía, así que no hubo `custom_data` viejo que migrar). El script queda en `supabase/seed/update-template-bautizo-schema.sql` como referencia histórica.
- [x] `CRON_SECRET` configurado en el proyecto de Vercel (confirmado por el usuario 2026-08-24)
- [x] Dominio comprado: `misello.com.mx` en Hostinger. Nameservers delegados a Vercel DNS (`ns1.vercel-dns.com`/`ns2.vercel-dns.com`). `misello.com.mx` y `*.misello.com.mx` verificados en Vercel, DNS propagado y HTTPS respondiendo 200 (confirmado 2026-08-24).
- [x] Código y docs actualizados de `sello.com` a `misello.com.mx`: `.env.local` (`NEXT_PUBLIC_ROOT_DOMAIN`), `proxy.ts`, `slug-field.tsx`, páginas de éxito/mis-eventos, cron y webhook de Stripe, `resend.ts`, `app/page.tsx`, `ARCHITECTURE.md`, `PRODUCT.md`. **Falta**: setear `NEXT_PUBLIC_ROOT_DOMAIN=misello.com.mx` también en las env vars del proyecto en Vercel (no solo en `.env.local`).
- [x] Dominio verificado en Resend. Remitente: `RESEND_FROM_ADDRESS=Sello <hola@misello.com.mx>`. Resend autentica por DKIM (`resend._domainkey`) y usa `send.misello.com.mx` como return-path con su propio SPF.
- [x] Buzón real para `hola@misello.com.mx` (comprado en Hostinger, 2026-08-28). Los MX del dominio raíz apuntan a `mx1/mx2.hostinger.com` y el SPF raíz incluye `_spf.mail.hostinger.com`. **No choca con Resend**: son caminos distintos (raíz = recibir y enviar a mano desde el webmail; `send.` = transaccional de Resend). `FEEDBACK_TO_ADDRESS` ya apunta ahí. El contacto de la landing sigue siendo formulario (honeypot + `replyTo`), con la dirección mostrada abajo como alternativa.
- **SMTP propio en Supabase Auth** — el magic link NO pasa por Resend: lo manda el SMTP interno de Supabase, que es solo para pruebas y va limitado a unos pocos correos por hora. Configurar Custom SMTP (`smtp.resend.com`, puerto 465, usuario `resend`, password = `RESEND_API_KEY`, remitente `hola@misello.com.mx`). Templates en español ya escritos en `supabase/email-templates/` — pegar **los dos**: con un correo existente Supabase usa "Magic Link", con uno nuevo usa "Confirm signup".
- **Redirect URLs de Supabase Auth** — todavía apuntaban a `sello-sand.vercel.app` (deployment que ya no existe). Deben ser `https://misello.com.mx/auth/callback` y `/auth/confirm` (+ las de localhost para desarrollo), y el Site URL a `https://misello.com.mx`. Sin esto el login falla en producción.
- **Env vars en Vercel** — producción no lee `.env.local`. Faltan al menos: `NEXT_PUBLIC_APP_URL=https://misello.com.mx` (lo usa `app/crear/[templateId]/actions.ts` para el `success_url` de Stripe: si queda en localhost, el cliente paga y aterriza en la nada), `NEXT_PUBLIC_ROOT_DOMAIN`, `RESEND_FROM_ADDRESS`, `FEEDBACK_TO_ADDRESS`.
- **Google OAuth "profesional"** (nombre "Sello", logo, dominio verificado) — 100% configuración en Google Cloud Console + Supabase Dashboard. Dos campos distintos en la pantalla de consentimiento:
  - *Developer contact information*: texto libre, ya puede ser `hola@misello.com.mx`.
  - *User support email*: **es un desplegable, no un campo de texto**. Google solo lista el correo de la cuenta con la que estás firmado o un Grupo de Google de Workspace que administres, así que un buzón de Hostinger no aparece solo. Rodeo: crear una cuenta de Google *con* la dirección `hola@misello.com.mx` (Google lo permite con correos que no son Gmail; requiere recibir el código de verificación, por eso antes del buzón era imposible), agregarla como propietario del proyecto en Google Cloud y entrar con ella.
  - Es el pendiente de menor impacto de esta lista: solo cambia qué correo de soporte ve quien usa "Entrar con Google".
- **Vercel plan Hobby (free) actual no permite uso comercial** según sus términos — antes de cobrar clientes reales hay que subir a plan Pro.

- [x] **Meta: pixel y token listos en `.env.local`** (2026-08-28). Conjunto de datos "Sello Web" = `1076067731790913`, creado desde Configuración → Orígenes de datos del portafolio "Javier Morales" (el primer intento, "Sello" = `1118576813836899`, quedó fuera del portafolio y por eso no dejaba generar token; está huérfano, ignorar o borrar). Token de CAPI verificado contra la Graph API: solo sirve para `POST /{pixel}/events`, no para leer metadata — un `GET` responde "Missing Permission" y eso es normal, no es un token roto.
- **Meta, lo que falta** — (1) `NEXT_PUBLIC_META_PIXEL_ID` y `META_CAPI_ACCESS_TOKEN` en las env vars de Vercel, y redeploy (las `NEXT_PUBLIC_*` se incrustan en el build). (2) **Verificar `misello.com.mx`** en Configuración → Seguridad de la marca → Dominios; el TXT va en **Vercel DNS**, no en Hostinger. Sin esto no se pueden priorizar los eventos de conversión y se pierde atribución en iOS. (3) Validar el flujo completo con Events Manager → Probar eventos y `META_TEST_EVENT_CODE`, y **borrar esa variable después** o los eventos reales entran como prueba y no optimizan nada.
- **Google Search Console** — verificar el dominio (por DNS, o pegando el token en `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) y mandar `https://misello.com.mx/sitemap.xml`. Entre más pronto se conecte, más histórico se acumula.
- **Revisión legal del aviso de privacidad** — `app/privacidad/page.tsx` es un borrador honesto de lo que el producto hace, pero le falta razón social y domicilio y no lo ha visto un abogado.

Actualiza esta lista conforme avances — ayuda a retomar contexto en sesiones futuras.
