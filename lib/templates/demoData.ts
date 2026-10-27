import type { WeddingData } from '@/components/templates/boda/wedding.types'
import type { SaveTheDateData } from '@/components/templates/boda/boda-save-the-date.types'
import type { XvAnosData } from '@/components/templates/xv-anos/xvanos.types'
import type { BautizoData } from '@/components/templates/bautizo/bautizo.types'
import type { BabyShowerData } from '@/components/templates/baby-shower/babyshower.types'
import type { CumpleanosData } from '@/components/templates/cumpleanos/cumpleanos.types'

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
      ceremonia_ubicacion: {
        lugar: 'Hacienda San Rafael',
        direccion: 'Carretera a Tequisquiapan km 4.5, Querétaro',
        lat: 20.5888,
        lng: -100.3899,
        place_id: '',
      },
      recepcion_ubicacion: {
        lugar: 'Jardín Los Encinos',
        direccion: 'Misma hacienda, salón principal',
        lat: 20.5888,
        lng: -100.3899,
        place_id: '',
      },
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
  BodaSaveTheDate: {
    custom_data: {
      tema: 'salvia',
      portada: 'tipografica',
      // Sin sobre en el demo: el thumbnail del catálogo (/demo?bare=1) mostraría
      // solo el sello en vez de la portada.
      sobre: 'no',
      cuenta_regresiva: 'si',
      nombre_novia: 'Camila',
      nombre_novio: 'Sebastián',
      fecha_evento: '2027-05-15',
      ciudad: 'San Miguel de Allende',
      mensaje_calendario: 'Nos casamos y queremos que estés ahí. Aparta el día; los detalles vienen pronto.',
      hora_ceremonia: '17:00',
      ceremonia_ubicacion: {
        lugar: 'Parroquia de San Miguel Arcángel',
        direccion: 'Principal s/n, Zona Centro, San Miguel de Allende',
        lat: 20.9144,
        lng: -100.7452,
        place_id: '',
      },
      hora_recepcion: '19:30',
      recepcion_ubicacion: {
        lugar: 'Hacienda Los Laureles',
        direccion: 'Camino a Atotonilco km 4, San Miguel de Allende',
        lat: 20.9144,
        lng: -100.7452,
        place_id: '',
      },
      itinerario: [
        { hora: '17:00', titulo: 'Ceremonia religiosa' },
        { hora: '19:30', titulo: 'Cóctel de bienvenida' },
        { hora: '20:30', titulo: 'Entrada de los novios y cena' },
        { hora: '22:00', titulo: 'Primer baile y brindis' },
        { hora: '22:30', titulo: 'Fiesta' },
      ],
      vestimenta: 'Formal',
      vestimenta_nota: 'Vestido largo o de coctel y traje oscuro. Te pedimos reservar el blanco para la novia.',
      tiendas: [
        { nombre: 'Liverpool', detalle: 'Evento 51234567', url: '#' },
        { nombre: 'Amazon', detalle: 'Lista de bodas', url: '#' },
      ],
      transferencia_banco: 'BBVA',
      transferencia_clabe: '012180001234567890',
      pases_por_invitacion: 2,
      fecha_limite_rsvp: '2027-04-15',
    } satisfies SaveTheDateData,
    fotos: Array(3).fill('/demo/boda-save-the-date.jpg'),
  },
  XvAnos: {
    custom_data: {
      tema: 'esmeralda',
      nombre_festejada: 'Regina',
      fecha_evento: '2026-09-12',
      padres: 'Sr. Ricardo Torres y Sra. Fernanda López',
      padrinos: 'Sr. y Sra. Hernández Castillo',
      dedicatoria: 'Hoy celebro quince años de vida rodeada de quienes más amo. Gracias por ser parte de mi historia.',
      iglesia_ubicacion: {
        lugar: 'Parroquia de San José',
        direccion: 'Av. Reforma 210, Mérida',
        lat: 20.9674,
        lng: -89.5926,
        place_id: '',
      },
      iglesia_hora: '5:00 pm',
      recepcion_ubicacion: {
        lugar: 'Salón Jardín Botánico',
        direccion: 'Calle 60 #480, Mérida',
        lat: 20.9674,
        lng: -89.5926,
        place_id: '',
      },
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
      tema: 'agua',
      nombre_bebe: 'Julieta',
      fecha_evento: '2026-10-17',
      cita: 'Dejad que los niños vengan a mí.',
      cita_ref: 'Marcos 10:14',
      papas: 'Daniela Ortega y Rodrigo Lara',
      padrinos_bautizo: 'Sofía Ortega y Emilio Vega',
      padrinos_ofrenda: [
        { rol: 'Ropón', nombre: 'Tía Rosario' },
        { rol: 'Vela', nombre: 'Abuelos Lara' },
        { rol: 'Medalla', nombre: 'Familia Ortega' },
        { rol: 'Concha', nombre: 'Tío Gabriel' },
      ],
      hora_misa: '12:00 pm',
      iglesia_ubicacion: {
        lugar: 'Parroquia de Santa María',
        direccion: 'Hidalgo 84, Centro, Querétaro',
        lat: 20.5888,
        lng: -100.3899,
        place_id: '',
      },
      recepcion_hora: '2:00 pm',
      recepcion_ubicacion: {
        lugar: 'Casa de los abuelos',
        direccion: 'Cerrada del Olivo 12, Jurica',
        lat: 20.5888,
        lng: -100.3899,
        place_id: '',
      },
      detalle_titulo: 'Vestir de blanco',
      detalle_nota: 'Nos encantaría vernos todos de blanco en las fotos de ese día.',
      opciones: [{ tienda: 'Liverpool', url: '#' }, { tienda: 'Amazon', url: '#' }],
      lugares_por_invitacion: 4,
      fecha_limite_rsvp: '2026-10-05',
    } satisfies BautizoData,
    fotos: ['/hero/bautizo.jpg', '/hero/bautizo.jpg', '/hero/bautizo.jpg', '/hero/bautizo.jpg'],
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
      lugar_ubicacion: {
        lugar: 'Terraza Jardín Rosa',
        direccion: 'Av. de las Flores 88, Guadalajara',
        lat: 20.6597,
        lng: -103.3496,
        place_id: '',
      },
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
  Cumpleanos: {
    custom_data: {
      tema: 'mujer',
      nombre_festejado: 'Renata',
      edad: 30,
      fecha_evento: '2026-11-28',
      mensaje: 'Cumplir años sola no tiene chiste. Ven a celebrarlo conmigo.',
      lugar_ubicacion: {
        lugar: 'Terraza Cielo',
        direccion: 'Av. Chapultepec 120, Guadalajara',
        lat: 20.6736,
        lng: -103.344,
        place_id: '',
      },
      hora: '9:00 pm',
      momentos: [
        { hora: '9:00', titulo: 'Bienvenida y coctel' },
        { hora: '10:00', titulo: 'Cena' },
        { hora: '11:00', titulo: 'Pastel y brindis' },
        { hora: '11:30', titulo: 'Baile' },
        { hora: '2:00', titulo: 'Tornafiesta' },
      ],
      dresscode: 'Trae tu brillo',
      dresscode_nota: 'Lentejuela, pedrería, lo que más destelle.',
      lugares_por_invitacion: 2,
      fecha_limite_rsvp: '2026-11-14',
    } satisfies CumpleanosData,
    fotos: ['/hero/cumpleanos.jpg', '/hero/cumpleanos.jpg'],
  },
}
