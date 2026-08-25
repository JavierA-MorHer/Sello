import type { WeddingData } from '@/components/templates/wedding.types'
import type { XvAnosData } from '@/components/templates/xvanos.types'
import type { BautizoData } from '@/components/templates/bautizo.types'
import type { BabyShowerData } from '@/components/templates/babyshower.types'

/**
 * Datos de ejemplo por `component_key`, usados en /demo/[templateId] para
 * que el cliente vea el diseño final con el mismo componente que renderiza
 * la invitación real — nunca una "vista simulada" aparte (ver CLAUDE.md).
 */
export const DEMO_DATA: Record<string, { custom_data: Record<string, unknown>; fotos: string[] }> = {
  BodaClasica: {
    custom_data: {
      nombre_novia: 'María',
      nombre_novio: 'Diego',
      frase_bienvenida:
        'Con la bendición de Dios y de nuestras familias, nos casamos — y queremos que tú seas parte de este día.',
      fecha_evento: '2026-11-14',
      hora_ceremonia: '5:00 pm',
      ceremonia_lugar: 'Hacienda San Rafael',
      ceremonia_direccion: 'Carretera a Tequisquiapan km 4.5, Querétaro',
      recepcion_lugar: 'Jardín Los Encinos',
      recepcion_direccion: 'Misma hacienda, salón principal',
      eventos: [
        { hora: '5:00 pm', titulo: 'Ceremonia religiosa', descripcion: 'Bajo el arco del jardín principal' },
        { hora: '6:30 pm', titulo: 'Coctel de bienvenida', descripcion: 'Bebidas y aperitivos en la terraza' },
        { hora: '8:00 pm', titulo: 'Cena y recepción' },
        { hora: '10:00 pm', titulo: 'Baile', descripcion: '¡A celebrar hasta que el cuerpo aguante!' },
      ],
      opciones: [
        { tienda: 'Liverpool', url: '#' },
        { tienda: 'Amazon', url: '#' },
        { tienda: 'Sobre de regalo' },
      ],
      fecha_limite_rsvp: '2026-10-15',
      mensaje_rsvp: 'Por favor confirma antes del 15 de octubre para poder organizar todo con cariño.',
    } satisfies WeddingData,
    fotos: Array(6).fill('/demo/boda-placeholder.jpg'),
  },
  XvAnos: {
    custom_data: {
      tema: 'esmeralda',
      nombre_festejada: 'Regina',
      fecha_evento: '2026-09-12',
      padres: 'Sr. Ricardo Torres y Sra. Fernanda López',
      padrinos: 'Sr. y Sra. Hernández Castillo',
      dedicatoria: 'Hoy celebro quince años de vida rodeada de quienes más amo. Gracias por ser parte de mi historia.',
      iglesia_nombre: 'Parroquia de San José',
      iglesia_direccion: 'Av. Reforma 210, Mérida',
      iglesia_hora: '5:00 pm',
      recepcion_nombre: 'Salón Jardín Botánico',
      recepcion_direccion: 'Calle 60 #480, Mérida',
      recepcion_hora: '7:30 pm',
      programa: [
        { hora: '5:00 pm', titulo: 'Misa de acción de gracias' },
        { hora: '7:00 pm', titulo: 'Recepción de invitados' },
        { hora: '8:00 pm', titulo: 'Vals y brindis' },
        { hora: '9:00 pm', titulo: 'Fiesta' },
      ],
      vestimenta: 'Formal',
      vestimenta_nota: 'Se sugiere evitar el color esmeralda, reservado para la festejada.',
      tiendas: [
        { nombre: 'Liverpool', url: '#' },
        { nombre: 'Amazon', url: '#' },
      ],
      pases_por_invitacion: 2,
      fecha_limite_rsvp: '2026-08-20',
    } satisfies XvAnosData,
    fotos: ['/hero/xv-anos.jpg', '/hero/xv-anos.jpg', '/hero/xv-anos.jpg'],
  },
  Bautizo: {
    custom_data: {
      nombre_bebe: 'Emiliano',
      nombre_padres: 'Andrea y Luis Fernando',
      frase_bienvenida: 'Con inmensa alegría te invitamos a celebrar el bautizo de nuestro hijo.',
      fecha_evento: '2026-06-21',
      hora_misa: '12:00 pm',
      iglesia_lugar: 'Parroquia del Sagrado Corazón',
      iglesia_direccion: 'Calle Hidalgo 45, Puebla',
      recepcion_lugar: 'Casa de los abuelos',
      recepcion_direccion: 'Privada Los Pinos 12, Puebla',
      eventos: [
        { hora: '12:00 pm', titulo: 'Ceremonia religiosa' },
        { hora: '2:00 pm', titulo: 'Comida familiar', descripcion: 'En casa de los abuelos' },
      ],
      padrinos: [
        { nombre: 'Sofía Ramírez', rol: 'Madrina' },
        { nombre: 'Carlos Medina', rol: 'Padrino' },
      ],
      opciones: [{ tienda: 'Amazon', url: '#' }, { tienda: 'Sobre de regalo' }],
      fecha_limite_rsvp: '2026-06-10',
      mensaje_rsvp: 'Confírmanos antes del 10 de junio, ¡nos encantará contar contigo!',
    } satisfies BautizoData,
    fotos: ['/hero/bautizo.jpg', '/hero/bautizo.jpg'],
  },
  BabyShower: {
    custom_data: {
      tema: 'nina',
      nombre_bebe: 'Valentina',
      tagline: 'Una princesa está por llegar',
      padres: 'Karla y Jorge',
      dedicatoria: 'Acompáñanos a darle la bienvenida a la personita que ya nos robó el corazón.',
      fecha_evento: '2026-07-05',
      hora_evento: '1:00 pm',
      lugar_nombre: 'Terraza Jardín Rosa',
      lugar_direccion: 'Av. de las Flores 88, Guadalajara',
      plan: [
        { hora: '1:00 pm', titulo: 'Bienvenida y comida' },
        { hora: '3:00 pm', titulo: 'Juegos' },
        { hora: '4:30 pm', titulo: 'Apertura de regalos' },
      ],
      juegos: [
        { titulo: '¿Quién conoce mejor a mamá?', descripcion: 'Preguntas rápidas sobre el embarazo' },
        { titulo: 'Adivina la medida', descripcion: 'Adivina el tamaño de la pancita' },
      ],
      tiendas: [{ nombre: 'Amazon', detalle: 'Lista de regalos', url: '#' }],
      talla_sugerida: '0-3 meses',
      fecha_limite_rsvp: '2026-06-25',
    } satisfies BabyShowerData,
    fotos: ['/hero/baby-shower.jpg', '/hero/baby-shower.jpg'],
  },
}
