insert into templates (name, category, component_key, field_schema)
values (
  'XV Años Editorial',
  'xv_anos',
  'XvAnos',
  $$
{
  "sections": [
    {
      "id": "tema",
      "title": "Tema",
      "description": "Cambia los colores de toda la invitación.",
      "fields": [
        {
          "key": "tema",
          "label": "Tema",
          "type": "select",
          "required": true,
          "options": [
            { "value": "noche", "label": "Noche (dorado)" },
            { "value": "esmeralda", "label": "Esmeralda" },
            { "value": "vino", "label": "Vino" }
          ]
        }
      ]
    },
    {
      "id": "festejada",
      "title": "La quinceañera",
      "description": "Así aparecerá en la portada y en el link que compartes.",
      "fields": [
        { "key": "nombre_festejada", "label": "Nombre", "type": "text", "required": true },
        {
          "key": "slug",
          "label": "Link de tu invitación",
          "type": "slug",
          "sourceFields": ["nombre_festejada"]
        }
      ]
    },
    {
      "id": "presentacion",
      "title": "Presentación",
      "description": "Quiénes presentan a la quinceañera.",
      "fields": [
        { "key": "padres", "label": "Mis padres", "type": "text", "required": true, "placeholder": "Alejandra Ruiz y Fernando Salas" },
        { "key": "padrinos", "label": "Mis padrinos", "type": "text", "placeholder": "Marisol Ruiz y Enrique Cárdenas" },
        { "key": "dedicatoria", "label": "Dedicatoria", "type": "textarea", "maxLength": 240 }
      ]
    },
    {
      "id": "fecha",
      "title": "Fecha",
      "description": "Se usa para la cuenta regresiva del evento.",
      "fields": [
        { "key": "fecha_evento", "label": "Fecha del evento", "type": "date", "required": true }
      ]
    },
    {
      "id": "iglesia",
      "title": "Misa",
      "description": "Dónde y a qué hora empieza la misa.",
      "fields": [
        { "key": "iglesia_hora", "label": "Hora de la misa", "type": "time" },
        { "key": "iglesia_ubicacion", "label": "Lugar de la misa", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "recepcion",
      "title": "Recepción",
      "description": "Dónde sigue la fiesta después de la misa.",
      "fields": [
        { "key": "recepcion_hora", "label": "Hora", "type": "time" },
        { "key": "recepcion_ubicacion", "label": "Lugar de la recepción", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "programa",
      "title": "Programa de la noche",
      "description": "Los momentos de la fiesta, en orden.",
      "fields": [
        {
          "key": "programa",
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
        { "key": "vestimenta_nota", "label": "Nota adicional", "type": "text", "placeholder": "Vestido largo y traje oscuro" }
      ]
    },
    {
      "id": "fotos",
      "title": "Fotos",
      "description": "Sube hasta 12 fotos. La primera será el retrato principal.",
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
          "label": "Opciones de regalo",
          "type": "repeater",
          "itemLabel": "Opción",
          "min": 0,
          "max": 6,
          "fields": [
            { "key": "nombre", "label": "Tienda", "type": "text", "required": true },
            { "key": "url", "label": "Link", "type": "url" }
          ]
        }
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

  $$::jsonb
)
returning id;
