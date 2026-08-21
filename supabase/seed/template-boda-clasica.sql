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
        "title": "La pareja",
        "fields": [
          { "key": "nombre_novia", "label": "Nombre de la novia", "type": "text", "required": true },
          { "key": "nombre_novio", "label": "Nombre del novio", "type": "text", "required": true },
          { "key": "frase_bienvenida", "label": "Frase de bienvenida", "type": "textarea" }
        ]
      },
      {
        "id": "fecha",
        "title": "Fecha y hora",
        "fields": [
          { "key": "fecha_evento", "label": "Fecha del evento", "type": "date", "required": true },
          { "key": "hora_ceremonia", "label": "Hora de la ceremonia", "type": "time", "required": true }
        ]
      },
      {
        "id": "ceremonia",
        "title": "Ceremonia",
        "fields": [
          { "key": "ceremonia_lugar", "label": "Nombre del lugar", "type": "text", "required": true },
          { "key": "ceremonia_direccion", "label": "Dirección", "type": "text", "required": true },
          { "key": "ceremonia_mapa_url", "label": "Link de Google Maps", "type": "url" }
        ]
      },
      {
        "id": "recepcion",
        "title": "Recepción",
        "fields": [
          { "key": "recepcion_lugar", "label": "Nombre del lugar", "type": "text", "required": true },
          { "key": "recepcion_direccion", "label": "Dirección", "type": "text", "required": true },
          { "key": "recepcion_mapa_url", "label": "Link de Google Maps", "type": "url" }
        ]
      },
      {
        "id": "itinerario",
        "title": "Itinerario",
        "fields": [
          {
            "key": "eventos",
            "label": "Eventos del día",
            "type": "repeater",
            "itemLabel": "Evento",
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
        "id": "mesa_regalos",
        "title": "Mesa de regalos",
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
              { "key": "url", "label": "Link", "type": "url" },
              { "key": "numero_mesa", "label": "Número de mesa/evento", "type": "text" }
            ]
          }
        ]
      },
      {
        "id": "rsvp",
        "title": "Confirmación de asistencia",
        "fields": [
          { "key": "fecha_limite_rsvp", "label": "Fecha límite para confirmar", "type": "date" },
          { "key": "mensaje_rsvp", "label": "Mensaje para invitados", "type": "textarea" }
        ]
      }
    ]
  }
  $$::jsonb
)
returning id;
