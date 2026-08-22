# PRODUCT.md — Invitaciones Digitales

> Documento de producto (PRD). Fuente de verdad sobre **qué** se construye y **por qué**.
> El **cómo técnico** vive en `ARCHITECTURE.md`. El **cómo arrancar el proyecto** vive en `SETUP.md`.

## 1. Visión

Plataforma self-service donde una persona arma, en minutos, la invitación digital de su boda, XV años, bautizo u otro evento — eligiendo una plantilla, llenando un formulario con sus datos, y pagando una sola vez. El resultado es un sitio real y funcional (no una imagen ni un PDF): con confirmación de asistencia (RSVP), mapa, galería, mesa de regalos, y un enlace único para compartir.

**Diferenciador central**: la mayoría de la competencia barata vende solo una imagen o un diseño estático. Este producto vende un sistema que funciona — RSVP real, panel para ver quién confirmó, notificaciones automáticas.

## 2. Usuarios

| Rol | Quién es | Qué necesita |
|---|---|---|
| **Cliente** | Persona organizando el evento (novios, papás de XV años, etc.) | Personalizar su invitación rápido, verla antes de pagar, y después ver quién confirmó |
| **Invitado** | Persona invitada al evento | Ver la invitación y confirmar asistencia en segundos, sin crear cuenta |
| **Admin (dueño del negocio)** | Tú | Ver métricas del negocio (ventas, conversión, plantillas más vendidas), dar soporte puntual |

## 3. Modelo de negocio

- **Self-service, pago único** (no suscripción). El cliente paga una vez y la invitación queda activa por un período definido tras la fecha del evento.
- **Sin editor visual libre** (no drag-and-drop). Cada plantilla define un conjunto fijo de campos (nombres, fecha, ubicación, itinerario, fotos, mesa de regalos). Esto reduce drásticamente la complejidad de construcción vs. un editor tipo Canva/Webflow.
- **Catálogo inicial**: 3-4 plantillas, elegidas por segmento de evento (boda, XV años, bautizo/familiar, genérico), no por estilo visual. El catálogo crece según demanda real, no de entrada.

### Precios de referencia (México, investigado)

| Segmento | Rango |
|---|---|
| Vendedores informales / Marketplace (solo imagen) | $150–800 MXN |
| Plantillas editables (Canva/Etsy) | $200–600 MXN |
| Diseñador freelance (PDF personalizado, sin RSVP) | $800–3,000 MXN |
| Plataformas completas (RSVP + dashboard) — categoría de este producto | $1,000–4,888 MXN |
| **Precio de lanzamiento propuesto** | **$700–1,200 MXN** (boda) · **$500–900 MXN** (XV años y otros) |

## 4. Flujo principal (happy path)

1. El usuario elige una plantilla del catálogo (filtrable por tipo de evento).
2. Llena un formulario multi-step con sus datos (autosave en cada paso — no debe perder progreso si cierra el navegador).
3. Ve un **preview en vivo** — el mismo componente que verán los invitados, con marca de agua hasta que pague.
4. Paga una sola vez (Stripe o Mercado Pago).
5. Al confirmarse el pago (webhook), el evento se activa: se genera el enlace definitivo y desaparece la marca de agua.
6. El cliente comparte su enlace único (`slug.sello.com`).
7. Los invitados entran, ven la invitación y confirman asistencia (RSVP).
8. El cliente recibe una notificación (email) por cada confirmación, y puede ver el detalle en su panel.

## 5. Alcance del MVP (v1)

### Incluido
- Catálogo de 3-4 plantillas (boda, XV años, bautizo, genérico)
- Formulario dinámico por plantilla con autosave
- Preview en vivo con marca de agua antes de pagar
- Pago único vía Stripe (o Mercado Pago)
- Subdominio automático por evento (`slug.sello.com`)
- RSVP público para invitados (sin login)
- Notificación por email al dueño del evento en cada RSVP
- Panel del cliente: lista de invitados, estado de RSVP, exportar CSV, editar datos básicos
- Login sin contraseña (magic link) para clientes
- Panel de admin: métricas agregadas de negocio (ventas, conversión, plantilla más vendida)
- Política de vigencia con avisos automáticos (30 y 7 días antes de expirar) y borrado con periodo de gracia

### Explícitamente fuera de alcance en v1
- Editor visual libre / drag-and-drop
- Dominio propio del cliente (`mariayluisboda.com`) — queda como posible upsell futuro
- Notificaciones por WhatsApp (v2, si se valida demanda)
- Multi-idioma
- Planes por niveles (Plata/Oro/Diamante) — un solo precio, todas las funciones incluidas

## 6. Reglas de negocio clave

- **El enlace real y el RSVP no funcionan hasta que se paga.** El preview vive en una ruta separada, protegida por sesión, con marca de agua.
- **Vigencia de la invitación**: activa hasta `fecha_evento + N meses` (definir N, sugerido 6). Se avisa 30 y 7 días antes. Al expirar pasa a estado `expired` (no se borra), y se elimina definitivamente 30 días después.
- **El admin no ve el detalle de invitados de cada cliente** por defecto — solo métricas agregadas. El detalle solo se consulta como herramienta de soporte puntual.
- **Precio único por evento**, sin niveles ni suscripción.

## 7. Métricas de éxito a monitorear

- Tasa de conversión: borradores creados → pagados (mide fricción del formulario)
- Tiempo promedio entre "crear borrador" y "pagar"
- Plantilla más vendida vs. menos vendida
- Ingresos por mes / por plantilla
- Tasa de confirmación de RSVP por evento (indicador de que el producto se está usando de verdad, no solo comprando)

## 8. Roadmap sugerido

| Fase | Contenido |
|---|---|
| **v1 — MVP** | Todo lo listado en "Incluido" arriba, con 3-4 plantillas |
| **v2** | Notificaciones por WhatsApp, más plantillas según demanda, extensión de vigencia como producto (renovación) |
| **v3** | Dominio propio como upsell, "álbum de recuerdo" post-evento, posible expansión a otros países/monedas |

## 9. Documentos relacionados

- `ARCHITECTURE.md` — stack técnico, modelo de datos, dominios, autenticación
- `SETUP.md` — cómo levantar el proyecto localmente
- `CLAUDE.md` — contexto para Claude Code al trabajar en este repo
