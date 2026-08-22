-- Habilita la lectura pública (sin sesión) de eventos ya pagados/publicados,
-- para que app/evento/[slug]/page.tsx pueda leerlos como visitante anónimo.
-- 'draft' (no pagado), 'expired' y 'archived' quedan bloqueados a nivel de
-- base de datos — aunque haya un bug en el código de la página, Postgres
-- rechaza la lectura de cualquier evento que no esté en estos dos estados.
-- Córrelo una vez en el SQL Editor de Supabase.

create policy "publico lee eventos publicados"
on events for select
using (status in ('active', 'expiring_soon'));
