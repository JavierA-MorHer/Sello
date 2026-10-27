-- Plantilla "Boda Save the Date". Corre esto en el SQL Editor de Supabase.
-- El field_schema es copia de lib/templates/boda-save-the-date.schema.json.
-- price_mxn es NOT NULL desde supabase/add-template-pricing.sql: mismo precio
-- que la otra plantilla de boda.
insert into templates (name, category, component_key, field_schema, price_mxn)
values (
  'Boda Save the Date',
  'boda',
  'BodaSaveTheDate',
  $$
{
  "sections": [
    {
      "id": "estilo",
      "title": "Estilo",
      "description": "Colores y portada de toda la invitación.",
      "fields": [
        {
          "key": "tema",
          "label": "Tema",
          "type": "select",
          "required": true,
          "options": [
            { "value": "salvia", "label": "Salvia" },
            { "value": "terracota", "label": "Terracota" },
            { "value": "tinta", "label": "Tinta" }
          ]
        },
        {
          "key": "portada",
          "label": "Portada",
          "type": "select",
          "required": true,
          "options": [
            { "value": "tipografica", "label": "Tipográfica, con foto en arco" },
            { "value": "foto", "label": "Foto a pantalla completa" }
          ]
        },
        {
          "key": "sobre",
          "label": "Sobre de apertura",
          "type": "select",
          "options": [
            { "value": "si", "label": "Sí, que tus invitados abran un sello" },
            { "value": "no", "label": "No, mostrar la portada directo" }
          ]
        }
      ]
    },
    {
      "id": "pareja",
      "title": "Los nombres",
      "description": "Así aparecerán en la portada y en el link que compartes.",
      "fields": [
        { "key": "nombre_novia", "label": "Novia", "type": "text", "required": true },
        { "key": "nombre_novio", "label": "Novio", "type": "text", "required": true },
        {
          "key": "slug",
          "label": "Link de tu invitación",
          "type": "slug",
          "sourceFields": ["nombre_novia", "nombre_novio"]
        }
      ]
    },
    {
      "id": "fecha",
      "title": "Fecha",
      "description": "Se marca en el calendario de la invitación y tus invitados pueden guardarla en el suyo.",
      "fields": [
        { "key": "fecha_evento", "label": "Fecha de la boda", "type": "date", "required": true },
        { "key": "ciudad", "label": "Ciudad", "type": "text", "placeholder": "San Miguel de Allende" },
        {
          "key": "mensaje_calendario",
          "label": "Mensaje bajo el calendario",
          "type": "textarea",
          "maxLength": 160,
          "placeholder": "Nos casamos y queremos que estés ahí. Aparta el día."
        },
        {
          "key": "cuenta_regresiva",
          "label": "Cuenta regresiva",
          "type": "select",
          "options": [
            { "value": "si", "label": "Mostrar" },
            { "value": "no", "label": "Ocultar" }
          ]
        }
      ]
    },
    {
      "id": "ceremonia",
      "title": "Ceremonia",
      "description": "Dónde y a qué hora empieza la ceremonia.",
      "fields": [
        { "key": "hora_ceremonia", "label": "Hora de la ceremonia", "type": "time" },
        { "key": "ceremonia_ubicacion", "label": "Lugar de la ceremonia", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "recepcion",
      "title": "Recepción",
      "description": "Dónde sigue la fiesta después de la ceremonia.",
      "fields": [
        { "key": "hora_recepcion", "label": "Hora de la recepción", "type": "time" },
        { "key": "recepcion_ubicacion", "label": "Lugar de la recepción", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "itinerario",
      "title": "Itinerario",
      "description": "Los momentos del día, en orden.",
      "fields": [
        {
          "key": "itinerario",
          "label": "Momentos",
          "type": "repeater",
          "itemLabel": "Momento",
          "display": "list",
          "min": 0,
          "max": 10,
          "fields": [
            { "key": "hora", "label": "Hora", "type": "time", "required": true },
            { "key": "titulo", "label": "Qué pasa", "type": "text", "required": true }
          ]
        }
      ]
    },
    {
      "id": "vestimenta",
      "title": "Vestimenta",
      "description": "Opcional.",
      "fields": [
        { "key": "vestimenta", "label": "Código de vestimenta", "type": "text", "placeholder": "Formal" },
        {
          "key": "vestimenta_nota",
          "label": "Nota adicional",
          "type": "text",
          "placeholder": "Te pedimos reservar el blanco para la novia."
        }
      ]
    },
    {
      "id": "fotos",
      "title": "Fotos",
      "description": "Sube hasta 12 fotos. La primera será la de la portada.",
      "fields": [
        { "key": "fotos", "label": "Fotos", "type": "gallery", "min": 0, "max": 12 }
      ]
    },
    {
      "id": "mesa_regalos",
      "title": "Mesa de regalos",
      "description": "Opcional — puedes dejarlo vacío si no quieres incluirla.",
      "fields": [
        {
          "key": "tiendas",
          "label": "Mesas de regalo",
          "type": "repeater",
          "itemLabel": "Mesa",
          "min": 0,
          "max": 6,
          "fields": [
            { "key": "nombre", "label": "Tienda", "type": "text", "required": true },
            { "key": "detalle", "label": "Detalle", "type": "text", "placeholder": "Evento 51234567" },
            { "key": "url", "label": "Link", "type": "url" }
          ]
        },
        { "key": "transferencia_banco", "label": "Banco para transferencia", "type": "text", "placeholder": "BBVA" },
        { "key": "transferencia_clabe", "label": "CLABE", "type": "text", "placeholder": "18 dígitos" }
      ]
    },
    {
      "id": "rsvp",
      "title": "Confirmación de asistencia",
      "description": "Cuántos lugares trae cada invitación y hasta cuándo se puede confirmar.",
      "fields": [
        { "key": "pases_por_invitacion", "label": "Lugares por invitación", "type": "number", "min": 1, "max": 20, "required": true },
        { "key": "fecha_limite_rsvp", "label": "Fecha límite para confirmar", "type": "date" }
      ]
    }
  ]
}
  $$::jsonb,
  600
)
returning id;
