insert into templates (name, category, component_key, field_schema)
values (
  'Baby Shower Clásico',
  'baby_shower',
  'BabyShower',
  $$
  {
    "sections": [
      {
        "id": "mama",
        "title": "La mamá",
        "description": "Así aparecerá en la portada y en el link que compartes.",
        "fields": [
          { "key": "nombre_mama", "label": "Nombre de la mamá", "type": "text", "required": true },
          { "key": "nombre_bebe", "label": "Nombre del bebé (si ya lo tienen)", "type": "text" },
          { "key": "sexo_bebe", "label": "Niño, niña o sorpresa", "type": "text" },
          {
            "key": "slug",
            "label": "Link de tu invitación",
            "type": "slug",
            "sourceFields": ["nombre_mama"]
          }
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
        "id": "lugar",
        "title": "Lugar",
        "description": "Dónde y a qué hora es el festejo.",
        "fields": [
          { "key": "hora_evento", "label": "Hora", "type": "time" },
          { "key": "lugar_nombre", "label": "Nombre del lugar", "type": "text", "required": true },
          { "key": "lugar_direccion", "label": "Dirección", "type": "text", "required": true },
          {
            "key": "lugar_mapa",
            "label": "Ubicación en el mapa",
            "type": "map",
            "sourceFields": ["lugar_nombre", "lugar_direccion"]
          }
        ]
      },
      {
        "id": "itinerario",
        "title": "Programa",
        "description": "Opcional — juegos, pastel, apertura de regalos...",
        "fields": [
          {
            "key": "eventos",
            "label": "Momentos del día",
            "type": "repeater",
            "itemLabel": "Momento",
            "display": "list",
            "min": 0,
            "max": 8,
            "fields": [
              { "key": "hora", "label": "Hora", "type": "time", "required": true },
              { "key": "titulo", "label": "Título", "type": "text", "required": true },
              { "key": "descripcion", "label": "Descripción", "type": "textarea" }
            ]
          }
        ]
      },
      {
        "id": "fotos",
        "title": "Fotos",
        "description": "Sube hasta 12 fotos. La primera será la portada.",
        "fields": [
          { "key": "fotos", "label": "Fotos", "type": "gallery", "min": 0, "max": 12 }
        ]
      },
      {
        "id": "mesa_regalos",
        "title": "Mesa de regalos",
        "description": "Dónde están registrados para regalos del bebé.",
        "fields": [
          {
            "key": "opciones",
            "label": "Opciones de regalo",
            "type": "repeater",
            "itemLabel": "Opción",
            "min": 0,
            "max": 6,
            "fields": [
              { "key": "tienda", "label": "Tienda", "type": "text", "required": true },
              { "key": "url", "label": "Link", "type": "url" }
            ]
          }
        ]
      },
      {
        "id": "rsvp",
        "title": "Confirmación de asistencia",
        "description": "Así confirmarán tus invitados que van a asistir.",
        "fields": [
          { "key": "fecha_limite_rsvp", "label": "Fecha límite para confirmar", "type": "date" },
          { "key": "mensaje_rsvp", "label": "Mensaje para invitados", "type": "textarea" }
        ]
      },
      {
        "id": "dedicatoria",
        "title": "Dedicatoria",
        "description": "Un mensaje corto para tus invitados, justo después de la portada.",
        "fields": [
          { "key": "frase_bienvenida", "label": "Tu dedicatoria", "type": "textarea", "maxLength": 240 }
        ]
      }
    ]
  }
  $$::jsonb
)
returning id;
