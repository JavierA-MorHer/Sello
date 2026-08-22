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

-- Row Level Security
alter table events enable row level security;
alter table guests enable row level security;
alter table rsvp_responses enable row level security;

-- El cliente solo ve/crea/edita sus propios eventos
create policy "owner creates own events"
on events for insert
with check (owner_id = auth.uid());

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

-- La página pública del invitado (slug.dominio) lee sin sesión — solo
-- expone eventos ya pagados/publicados. 'draft' (no pagado), 'expired' y
-- 'archived' quedan bloqueados a nivel de base de datos, no solo en la app.
create policy "publico lee eventos publicados"
on events for select
using (status in ('active', 'expiring_soon'));

-- El cliente solo ve invitados de sus propios eventos
create policy "owner reads own guests"
on guests for select
using (event_id in (select id from events where owner_id = auth.uid()));

-- El RSVP público (invitados) se hace vía una función/endpoint con service role,
-- no acceso directo de cliente anónimo a la tabla.

-- El catálogo de plantillas es público (no son datos de clientes). Supabase
-- activa RLS por defecto en tablas nuevas, así que sin esta policy el catálogo
-- queda inaccesible para el cliente anónimo/autenticado.
alter table templates enable row level security;

create policy "catalogo publico"
on templates for select
using (active = true);
