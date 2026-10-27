-- Mensajes de cumpleaños: feature exclusiva de la plantilla Cumpleaños
-- (ver plantillas-handoff/design_handoff_cumpleanos/README.md sección 8) —
-- el invitado deja unas palabras para el festejado, independiente del RSVP
-- (guests/rsvp_responses). Por eso vive en su propia tabla y no reutiliza
-- guests: no requiere nombre, no implica confirmación de asistencia, y un
-- mismo invitado podría mandar RSVP y mensaje por separado.
--
-- Córrelo una vez en el SQL Editor de Supabase.

create table birthday_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  name text,
  message text not null,
  created_at timestamptz default now()
);

alter table birthday_messages enable row level security;

-- El dueño del evento ve los mensajes de sus invitados, igual que con guests.
create policy "owner reads own birthday messages"
on birthday_messages for select
using (event_id in (select id from events where owner_id = auth.uid()));

-- El envío público (invitados, sin sesión) se hace vía Server Action con
-- service role, igual que el RSVP — a propósito no hay policy de insert
-- público (ver lib/rsvp/actions.ts, función submitBirthdayMessage).
