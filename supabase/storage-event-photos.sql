-- Bucket para las fotos que los clientes suben desde el wizard (paso "Fotos").
-- Público en lectura porque los invitados ven la invitación sin cuenta; solo
-- el dueño autenticado del evento puede subir/borrar. Las rutas se guardan
-- como {event_id}/{uuid}.jpg, así que la política valida contra events.owner_id.
-- Córrelo una vez en el SQL Editor de Supabase.

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

create policy "lectura publica de fotos de eventos"
on storage.objects for select
using (bucket_id = 'event-photos');

create policy "dueño sube fotos de sus propios eventos"
on storage.objects for insert
with check (
  bucket_id = 'event-photos'
  and exists (
    select 1 from events
    where events.id::text = (storage.foldername(name))[1]
    and events.owner_id = auth.uid()
  )
);

create policy "dueño borra fotos de sus propios eventos"
on storage.objects for delete
using (
  bucket_id = 'event-photos'
  and exists (
    select 1 from events
    where events.id::text = (storage.foldername(name))[1]
    and events.owner_id = auth.uid()
  )
);
