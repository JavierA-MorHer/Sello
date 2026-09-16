-- Actualiza el field_schema de la fila ya sembrada de 'Bautizo Clásico' al
-- rediseño de plantillas-handoff/design_handoff_bautizo (temas, cita
-- bíblica, presentación de papás/padrinos, padrinos de ofrendas, ceremonia +
-- comida, RSVP con stepper de lugares). Córrelo una vez en el SQL Editor de
-- Supabase.
--
-- Nota: los eventos ya creados con el field_schema anterior guardan su
-- custom_data con las claves viejas (nombre_padres, padrinos, eventos,
-- frase_bienvenida...) — sus invitaciones publicadas no se reescriben solas.
-- Si ya hay eventos reales de Bautizo, avisar antes de correr esto.

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
            { "value": "agua", "label": "Agua" },
            { "value": "oliva", "label": "Oliva" },
            { "value": "arena", "label": "Arena" }
          ]
        }
      ]
    },
    {
      "id": "bebe",
      "title": "El bebé",
      "description": "Así aparecerá en la portada y en el link que compartes.",
      "fields": [
        { "key": "nombre_bebe", "label": "Nombre del bebé", "type": "text", "required": true },
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
      "fields": [
        { "key": "fecha_evento", "label": "Fecha del evento", "type": "date", "required": true }
      ]
    },
    {
      "id": "cita",
      "title": "Cita bíblica",
      "description": "Opcional — algunas familias prefieren otra cita, o ninguna.",
      "fields": [
        { "key": "cita", "label": "Cita", "type": "textarea", "maxLength": 160 },
        { "key": "cita_ref", "label": "Referencia (ej. Marcos 10:14)", "type": "text" }
      ]
    },
    {
      "id": "presentacion",
      "title": "Presentación",
      "description": "Quiénes son los papás y los padrinos de bautizo.",
      "fields": [
        { "key": "papas", "label": "Sus papás", "type": "text", "required": true, "placeholder": "Nombre y nombre" },
        { "key": "padrinos_bautizo", "label": "Sus padrinos de bautizo", "type": "text", "placeholder": "Nombre y nombre" }
      ]
    },
    {
      "id": "ofrendas",
      "title": "Padrinos de ofrendas",
      "description": "Opcional — quién regala cada ofrenda del rito (ropón, vela, medalla, concha...).",
      "fields": [
        {
          "key": "padrinos_ofrenda",
          "label": "Ofrendas",
          "type": "repeater",
          "itemLabel": "Ofrenda",
          "min": 0,
          "max": 6,
          "fields": [
            { "key": "rol", "label": "Ofrenda", "type": "text", "required": true, "placeholder": "Ropón, vela, medalla..." },
            { "key": "nombre", "label": "Quién la regala", "type": "text", "required": true }
          ]
        }
      ]
    },
    {
      "id": "ceremonia",
      "title": "Ceremonia",
      "description": "Dónde y a qué hora es la misa.",
      "fields": [
        { "key": "hora_misa", "label": "Hora", "type": "time" },
        { "key": "iglesia_ubicacion", "label": "Lugar de la ceremonia", "type": "ubicacion", "required": true }
      ]
    },
    {
      "id": "comida",
      "title": "Comida",
      "description": "Opcional — si hay festejo después de la misa.",
      "fields": [
        { "key": "recepcion_hora", "label": "Hora", "type": "time" },
        { "key": "recepcion_ubicacion", "label": "Lugar de la comida", "type": "ubicacion" }
      ]
    },
    {
      "id": "detalle",
      "title": "Un detalle",
      "description": "Opcional — una petición para tus invitados, ej. vestir de blanco.",
      "fields": [
        { "key": "detalle_titulo", "label": "Título", "type": "text", "placeholder": "Vestir de blanco" },
        { "key": "detalle_nota", "label": "Nota", "type": "textarea", "maxLength": 160 }
      ]
    },
    {
      "id": "fotos",
      "title": "Fotos",
      "description": "Sube hasta 12 fotos. La primera será la foto del arco de la portada.",
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
        { "key": "lugares_por_invitacion", "label": "Lugares por invitación", "type": "number", "min": 1, "max": 20 },
        { "key": "fecha_limite_rsvp", "label": "Fecha límite para confirmar", "type": "date" }
      ]
    }
  ]
}
$$::jsonb
where component_key = 'Bautizo';
