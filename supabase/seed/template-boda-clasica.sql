insert into templates (name, category, component_key, field_schema)
values (
  'Boda Clásica',
  'boda',
  'BodaClasica',
  $$
  {
    "sections": [
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
        "description": "Se usa para la cuenta regresiva del evento.",
        "fields": [
          { "key": "fecha_evento", "label": "Fecha del evento", "type": "date", "required": true }
        ]
      },
      {
        "id": "ceremonia",
        "title": "Ceremonia",
        "description": "Dónde y a qué hora empieza la ceremonia.",
        "fields": [
          { "key": "hora_ceremonia", "label": "Hora de la ceremonia", "type": "time" },
          { "key": "ceremonia_lugar", "label": "Nombre del lugar", "type": "text", "required": true },
          { "key": "ceremonia_direccion", "label": "Dirección", "type": "text", "required": true },
          {
            "key": "ceremonia_mapa",
            "label": "Ubicación en el mapa",
            "type": "map",
            "sourceFields": ["ceremonia_lugar", "ceremonia_direccion"]
          }
        ]
      },
      {
        "id": "recepcion",
        "title": "Recepción",
        "description": "Dónde sigue la fiesta después de la ceremonia.",
        "fields": [
          { "key": "recepcion_lugar", "label": "Nombre del lugar", "type": "text", "required": true },
          { "key": "recepcion_direccion", "label": "Dirección", "type": "text", "required": true },
          {
            "key": "recepcion_mapa",
            "label": "Ubicación en el mapa",
            "type": "map",
            "sourceFields": ["recepcion_lugar", "recepcion_direccion"]
          }
        ]
      },
      {
        "id": "itinerario",
        "title": "Itinerario",
        "description": "Los momentos del día, en orden.",
        "fields": [
          {
            "key": "eventos",
            "label": "Eventos del día",
            "type": "repeater",
            "itemLabel": "Evento",
            "display": "list",
            "min": 0,
            "max": 10,
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
          { "key": "fotos", "label": "Fotos del evento", "type": "gallery", "min": 0, "max": 12 }
        ]
      },
      {
        "id": "mesa_regalos",
        "title": "Mesa de regalos",
        "description": "Opcional — puedes dejarlo vacío si no quieres incluirla.",
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
          {
            "key": "frase_bienvenida",
            "label": "Tu dedicatoria",
            "type": "textarea",
            "maxLength": 240
          }
        ]
      }
    ]
  }
  $$::jsonb
)
returning id;
