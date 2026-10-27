# CLAUDE.md

Este archivo le da contexto a Claude Code al trabajar en este repositorio. Colócalo en la raíz del proyecto (junto a `package.json`).

## Qué es este proyecto

Plataforma self-service de invitaciones digitales (bodas, XV años, bautizos, eventos). El cliente elige una plantilla, llena un formulario con sus datos, ve un preview, paga una vez, y recibe un enlace único (`slug.misello.com.mx`) para compartir con sus invitados, quienes confirman asistencia (RSVP).

Documentación completa:
- `PRODUCT.md` — qué se construye y por qué (leer primero si hay dudas de producto)
- `ARCHITECTURE.md` — stack, modelo de datos, decisiones técnicas
- `SETUP.md` — cómo levantar el entorno local

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
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # probar webhooks localmente
```

## Cosas que Claude Code NO debe hacer sin confirmar explícitamente

- Modificar o eliminar políticas de RLS en Supabase
- Cambiar la lógica de expiración/borrado de eventos (`ARCHITECTURE.md` sección 7) sin revisar antes con el dueño del producto — es una decisión de negocio, no solo técnica
- Agregar dependencias nuevas grandes (librerías de UI completas, ORMs, etc.) sin justificar por qué no basta con lo ya instalado
- Hacer deploy a producción o hacer push directo a la rama principal

## Estado del proyecto

El estado de avance y los pendientes que requieren acceso externo (env vars en Vercel, SMTP de Supabase Auth, pixel de Meta, Google OAuth, Search Console, revisión legal) viven en la skill `estado-del-proyecto` (`.claude/skills/estado-del-proyecto/SKILL.md`) para no cargarse en cada sesión. Invocarla al retomar contexto o al trabajar en despliegue, y actualizarla ahí conforme avances.
