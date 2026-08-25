-- Mueve el precio de "hardcodeado por categoría en código" a la base de
-- datos, por plantilla individual. Corre esto en el SQL Editor de Supabase.
-- Es seguro volver a correrlo (usa IF NOT EXISTS / ON CONFLICT donde aplica).
--
-- Seguridad: `templates` ya tiene RLS activo con una sola policy de
-- SELECT público (`active = true`, ver schema.sql). No se agrega ninguna
-- policy de INSERT/UPDATE/DELETE para `anon`/`authenticated`, así que
-- price_mxn solo se puede cambiar con la service role key (o SQL directo
-- aquí) — nunca desde el cliente ni desde una Server Action expuesta.

alter table templates
  add column if not exists price_mxn integer;

-- Precios de lanzamiento (conservadores, por debajo del costo de imprenta
-- tradicional): boda tiene mayor disposición a pagar que el resto, así que
-- se separa; XV años/bautizo/baby shower quedan parejos.
update templates set price_mxn = 600 where category = 'boda';
update templates set price_mxn = 400 where category <> 'boda';

alter table templates
  alter column price_mxn set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'templates_price_mxn_positive'
  ) then
    alter table templates
      add constraint templates_price_mxn_positive check (price_mxn > 0);
  end if;
end $$;

-- Snapshot del monto realmente cobrado por Stripe en cada evento. No se
-- recalcula a partir de templates.price_mxn: si el precio de una plantilla
-- cambia después, el historial de ingresos ya generado no se altera.
alter table events
  add column if not exists price_paid_mxn integer;
