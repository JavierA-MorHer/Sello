import { BodaClasica } from '@/components/templates/BodaClasica'
import type { WeddingData } from '@/components/templates/wedding.types'

// Datos de ejemplo solo para revisar el diseño de la plantilla — esta ruta
// es temporal, no forma parte del producto (el preview real vendrá de
// Supabase, con el mismo componente BodaClasica).
const SAMPLE_DATA: WeddingData = {
  nombre_novia: 'María',
  nombre_novio: 'Diego',
  frase_bienvenida:
    'Con la bendición de Dios y de nuestras familias, nos casamos — y queremos que tú seas parte de este día.',
  fecha_evento: '2026-11-14',
  hora_ceremonia: '5:00 pm',
  ceremonia_lugar: 'Hacienda San Rafael',
  ceremonia_direccion: 'Carretera a Tequisquiapan km 4.5, Querétaro',
  ceremonia_mapa_url: '#',
  recepcion_lugar: 'Jardín Los Encinos',
  recepcion_direccion: 'Misma hacienda, salón principal',
  recepcion_mapa_url: '#',
  eventos: [
    { hora: '5:00 pm', titulo: 'Ceremonia religiosa', descripcion: 'Bajo el arco del jardín principal' },
    { hora: '6:30 pm', titulo: 'Coctel de bienvenida', descripcion: 'Bebidas y aperitivos en la terraza' },
    { hora: '8:00 pm', titulo: 'Cena y recepción' },
    { hora: '10:00 pm', titulo: 'Baile', descripcion: '¡A celebrar hasta que el cuerpo aguante!' },
  ],
  opciones: [
    { tienda: 'Liverpool', url: '#', numero_mesa: '123456' },
    { tienda: 'Amazon', url: '#' },
    { tienda: 'Sobre de regalo' },
  ],
  fecha_limite_rsvp: '2026-10-15',
  mensaje_rsvp: 'Por favor confirma antes del 15 de octubre para poder organizar todo con cariño.',
}

const FOTO = '/demo/boda-placeholder.jpg'
const GALERIA = [FOTO, FOTO, FOTO, FOTO, FOTO, FOTO]

export default function DemoBodaClasicaPage() {
  return <BodaClasica custom_data={SAMPLE_DATA} fotos={GALERIA} />
}
