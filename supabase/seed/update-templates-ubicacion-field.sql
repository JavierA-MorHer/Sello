-- Migra las 4 plantillas ya sembradas del patrón viejo (lugar/dirección/mapa
-- como 3 campos sueltos) al campo único "ubicacion" (Places Autocomplete,
-- guarda lat/lng/place_id). Los INSERT originales en template-*.sql no
-- vuelven a correr solos — este UPDATE sí hay que correrlo una vez en el
-- SQL Editor de Supabase.
--
-- Como todavía no hay clientes reales pagando, no existe custom_data en
-- producción que dependa de las claves viejas (*_lugar/*_direccion/*_mapa) —
-- por eso este cambio se hace directo, sin migrar datos existentes.

update templates
set field_schema = $$
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
        { "key": "ceremonia_ubicacion", "label": "Lugar de la ceremonia", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "recepcion",
      "title": "Recepción",
      "description": "Dónde sigue la fiesta después de la ceremonia.",
      "fields": [
        { "key": "recepcion_ubicacion", "label": "Lugar de la recepción", "type": "ubicacion", "required": true }
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
where component_key = 'BodaClasica';

update templates
set field_schema = $$
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
where component_key = 'XvAnos';

update templates
set field_schema = $$
{
  "sections": [
    {
      "id": "bebe",
      "title": "El bebé",
      "description": "Así aparecerá en la portada y en el link que compartes.",
      "fields": [
        { "key": "nombre_bebe", "label": "Nombre del bebé", "type": "text", "required": true },
        { "key": "nombre_padres", "label": "Nombre de los papás", "type": "text" },
        {
          "key": "slug",
          "label": "Link de tu invitación",
          "type": "slug",
          "sourceFields": ["nombre_bebe"]
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
      "id": "iglesia",
      "title": "Misa",
      "description": "Dónde y a qué hora empieza la misa de bautizo.",
      "fields": [
        { "key": "hora_misa", "label": "Hora de la misa", "type": "time" },
        { "key": "iglesia_ubicacion", "label": "Lugar de la misa", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "recepcion",
      "title": "Recepción",
      "description": "Opcional — si hay festejo después de la misa.",
      "fields": [
        { "key": "recepcion_ubicacion", "label": "Lugar de la recepción", "type": "ubicacion" }
      ]
    },
    {
      "id": "itinerario",
      "title": "Itinerario",
      "description": "Opcional — los momentos del día, en orden.",
      "fields": [
        {
          "key": "eventos",
          "label": "Eventos del día",
          "type": "repeater",
          "itemLabel": "Evento",
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
        { "key": "fotos", "label": "Fotos del evento", "type": "gallery", "min": 0, "max": 12 }
      ]
    },
    {
      "id": "padrinos",
      "title": "Padrinos",
      "description": "Opcional — quiénes son los padrinos de bautizo.",
      "fields": [
        {
          "key": "padrinos",
          "label": "Padrinos",
          "type": "repeater",
          "itemLabel": "Padrino",
          "min": 0,
          "max": 4,
          "fields": [
            { "key": "nombre", "label": "Nombre", "type": "text", "required": true },
            { "key": "rol", "label": "Rol (padrino, madrina...)", "type": "text" }
          ]
        }
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
where component_key = 'Bautizo';

update templates
set field_schema = $$
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
            { "value": "neutro", "label": "Neutro" },
            { "value": "nino", "label": "Niño" },
            { "value": "nina", "label": "Niña" }
          ]
        }
      ]
    },
    {
      "id": "bebe",
      "title": "El bebé",
      "description": "Así aparecerá en la portada y en el link que compartes.",
      "fields": [
        { "key": "nombre_bebe", "label": "Nombre del bebé (o de la mamá si aún no lo tienen)", "type": "text", "required": true },
        { "key": "tagline", "label": "Frase corta bajo el nombre", "type": "text", "placeholder": "Ya viene en camino y queremos celebrarlo contigo" },
        {
          "key": "slug",
          "label": "Link de tu invitación",
          "type": "slug",
          "sourceFields": ["nombre_bebe"]
        }
      ]
    },
    {
      "id": "papas",
      "title": "Los papás",
      "description": "Quién organiza el festejo.",
      "fields": [
        { "key": "padres", "label": "Nombres de los papás", "type": "text", "required": true, "placeholder": "Regina y Mateo" },
        { "key": "dedicatoria", "label": "Dedicatoria", "type": "textarea", "maxLength": 240 }
      ]
    },
    {
      "id": "fecha",
      "title": "Fecha",
      "description": "Se usa para la cuenta regresiva del evento.",
      "fields": [
        { "key": "fecha_evento", "label": "Fecha del evento", "type": "date", "required": true },
        { "key": "hora_evento", "label": "Hora", "type": "time", "required": true }
      ]
    },
    {
      "id": "lugar",
      "title": "Lugar",
      "description": "Dónde es el festejo.",
      "fields": [
        { "key": "lugar_ubicacion", "label": "Lugar del festejo", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "plan",
      "title": "El plan del día",
      "description": "Opcional — llegada, comida, juegos, apertura de regalos...",
      "fields": [
        {
          "key": "plan",
          "label": "Momentos del día",
          "type": "repeater",
          "itemLabel": "Momento",
          "display": "list",
          "min": 0,
          "max": 8,
          "fields": [
            { "key": "hora", "label": "Hora", "type": "time", "required": true },
            { "key": "titulo", "label": "Qué pasa", "type": "text", "required": true }
          ]
        }
      ]
    },
    {
      "id": "juegos",
      "title": "Juguemos",
      "description": "Opcional — juegos o dinámicas para tus invitados.",
      "fields": [
        {
          "key": "juegos",
          "label": "Juegos",
          "type": "repeater",
          "itemLabel": "Juego",
          "min": 0,
          "max": 6,
          "fields": [
            { "key": "titulo", "label": "Nombre del juego", "type": "text", "required": true },
            { "key": "descripcion", "label": "En qué consiste", "type": "textarea" }
          ]
        }
      ]
    },
    {
      "id": "mesa_regalos",
      "title": "Mesa de regalos",
      "description": "Dónde están registrados para regalos del bebé.",
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
            { "key": "detalle", "label": "Detalle", "type": "text", "placeholder": "Lista de bebé · Emiliano" },
            { "key": "url", "label": "Link", "type": "url" }
          ]
        },
        { "key": "talla_sugerida", "label": "Talla sugerida de ropa", "type": "text", "placeholder": "3 a 6 meses" }
      ]
    },
    {
      "id": "rsvp",
      "title": "Confirmación de asistencia",
      "description": "Así confirmarán tus invitados que van a asistir.",
      "fields": [
        { "key": "fecha_limite_rsvp", "label": "Fecha límite para confirmar", "type": "date" }
      ]
    }
  ]
}
$$::jsonb
where component_key = 'BabyShower';
