# SETUP.md — Cómo arrancar el proyecto

## 1. Requisitos previos

- Node.js 20+ y npm (o pnpm)
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Stripe](https://stripe.com) (modo test para empezar)
- Cuenta en [Resend](https://resend.com)
- Un dominio propio (para configurar el wildcard más adelante — no es necesario el primer día)

## 2. Crear el proyecto Next.js

```bash
npx create-next-app@latest invitaciones-app --typescript --tailwind --app --eslint
cd invitaciones-app
```

Cuando el asistente pregunte:
- ¿usar `src/` directory? → como prefieras, esta guía asume que no
- ¿App Router? → sí

## 3. Instalar dependencias principales

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js
npm install resend
npm install zod                # validación de formularios
npm install react-hook-form    # manejo de formularios dinámicos
```

## 4. Crear el proyecto en Supabase

1. En [supabase.com](https://supabase.com), crea un nuevo proyecto.
2. Copia la **Project URL** y la **anon key** desde Settings → API.
3. Copia también la **service role key** (se usa solo en el backend, nunca en el cliente).
4. Ve a SQL Editor y pega el schema completo de `ARCHITECTURE.md` (sección 2 y 3) para crear las tablas y las policies de RLS.
5. En Authentication → Providers, confirma que "Email" (magic link) esté activo. Opcionalmente activa Google OAuth.
6. En Authentication → Email Templates, personaliza el template del magic link.
7. (Recomendado en producción) En Authentication → SMTP Settings, conecta Resend como proveedor de envío en vez del SMTP default de Supabase.

## 5. Variables de entorno

Copia `.env.example` a `.env.local` y llena los valores:

```bash
cp docs/.env.example .env.local
```

## 6. Correr el proyecto localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 7. Configurar Stripe (modo test)

1. En el dashboard de Stripe, obtén tu **Secret key** de test (`sk_test_...`) y **Publishable key** (`pk_test_...`).
2. Instala el CLI de Stripe para probar webhooks localmente:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copia el **Webhook signing secret** que te da el CLI (`whsec_...`) a tu `.env.local`.

## 8. Configurar el dominio wildcard (cuando estés listo para producción)

1. En tu proveedor de DNS, agrega un registro:
   ```
   Tipo: CNAME
   Nombre: *
   Valor: cname.vercel-dns.com
   ```
2. En Vercel → Project Settings → Domains, agrega `*.tudominio.com`.
3. Verifica que `middleware.ts` (ver `ARCHITECTURE.md` sección 4) esté implementado antes de probar subdominios reales.

## 9. Deploy

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones del CLI. Configura las mismas variables de entorno de `.env.local` en Vercel → Project Settings → Environment Variables (usa las keys de **producción** de Stripe/Supabase, no las de test, para el ambiente de Production).

## 10. Orden sugerido para empezar a construir con Claude Code

1. Pega el schema SQL en Supabase (paso 4).
2. Configura `lib/supabase.ts` (cliente de Supabase para server y browser).
3. Construye el flujo de auth con magic link (`/login`, `/auth/callback`).
4. Define el `field_schema` de la primera plantilla (boda) y el componente `DynamicForm`.
5. Construye el componente de la plantilla (`components/templates/BodaClasica.tsx`) que recibe `custom_data` como props.
6. Conecta el preview: mismo componente de plantilla, alimentado con el borrador en progreso.
7. Integra Stripe Checkout + webhook de activación.
8. Construye el panel del cliente (`/mis-eventos`).
9. Construye el panel de admin (`/admin`) con métricas agregadas.
10. Implementa el cron de expiración.

## 11. Documentos relacionados

- `PRODUCT.md` — qué se construye y por qué
- `ARCHITECTURE.md` — detalle técnico completo
- `CLAUDE.md` — contexto que Claude Code lee automáticamente en este repo
