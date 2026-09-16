import type { HeroSlide } from '@/components/marketing/RotatingHero'

export type { HeroSlide }

export const HERO_SLIDES: HeroSlide[] = [
  { src: '/hero/boda.jpg', alt: 'Novios el día de su boda — invitación digital de Sello' },
  { src: '/hero/xv-anos.jpg', alt: 'Festejada de XV años — invitación digital de Sello' },
  { src: '/hero/bautizo.jpg', alt: 'Bautizo — invitación digital de Sello' },
  { src: '/hero/baby-shower.jpg', alt: 'Baby shower — invitación digital de Sello' },
]

export const STEPS = [
  {
    n: '1',
    title: 'Elige tu estilo',
    body: 'Formal, moderna o cálida: cada plantilla ya luce impecable, tú solo eliges la que se sienta como tu evento.',
  },
  {
    n: '2',
    title: 'Cuenta tu historia',
    body: 'Nombres, fecha, lugar, fotos y las palabras que quieras dedicar. Avanza a tu ritmo — si te vas a medio camino, todo sigue ahí cuando regreses.',
  },
  {
    n: '3',
    title: 'Comparte tu sello',
    body: 'Un solo pago y tu invitación queda lista para mandar por WhatsApp.',
  },
]

export const INCLUYE = [
  'Avanza a tu ritmo — cierra y retoma cuando quieras, nada se pierde',
  'Vista previa idéntica a la invitación final, antes de pagar',
  'Sabes quién confirma, al momento',
  'Un enlace propio, listo para compartir por WhatsApp',
  'Cambios ilimitados hasta la fecha de tu evento',
  'Pago único, sin sorpresas ni renovaciones',
]

/**
 * Fuente única de las preguntas frecuentes: las usa tanto FaqSection (lo que
 * se ve) como buildJsonLd en app/page.tsx (el FAQPage schema.org) — Google
 * penaliza el marcado que no coincide con lo visible.
 */
export const FAQS = [
  {
    q: '¿Es una suscripción?',
    a: 'No. Pago único por evento. Tu invitación queda activa hasta varios meses después de la fecha del evento, sin cobros recurrentes.',
  },
  {
    q: '¿Mis invitados necesitan crear una cuenta para confirmar?',
    a: 'No. El RSVP es público — entran a tu enlace, confirman asistencia en segundos, y tú recibes la notificación.',
  },
  {
    q: '¿Puedo ver mi invitación antes de pagar?',
    a: 'Sí. El preview usa exactamente el mismo diseño que verán tus invitados, con una marca de agua que desaparece al activarse.',
  },
  {
    q: '¿Qué pasa cuando termina la vigencia?',
    a: 'Te avisamos por correo antes de que expire. Tu invitación deja de ser pública pero no se borra de inmediato.',
  },
]
