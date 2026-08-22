import { Italiana, Work_Sans, Beau_Rivage } from 'next/font/google'
import { TemplatePhoto } from './TemplatePhoto'
import { RsvpForm } from './RsvpForm'
import type { WeddingData } from './wedding.types'
import { buildMapsSearchUrl } from '@/lib/text/maps'

const display = Italiana({ weight: '400', subsets: ['latin'], variable: '--font-tpl-display' })
const script = Beau_Rivage({ weight: '400', subsets: ['latin'], variable: '--font-tpl-script' })
const body = Work_Sans({ subsets: ['latin'], variable: '--font-tpl-body' })

const IVORY = '#f5efe4'
const INK = '#1c2333'

function formatLargo(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatCorto(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(date)
}

// Italiana solo existe en peso 400 (sin variante bold) y sus trazos finos se
// pierden en textos medianos/pequeños sobre el marfil de fondo — un trazo
// sutil de contorno compensa el peso sin cambiar la tipografía.
const displayFont = { fontFamily: 'var(--font-tpl-display)', WebkitTextStroke: '0.4px currentColor' }
const scriptFont = { fontFamily: 'var(--font-tpl-script)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

export function BodaClasica({
  custom_data,
  fotos = [],
}: {
  custom_data: WeddingData
  fotos?: string[]
}) {
  const d = custom_data
  const portada = fotos[0] ?? '/demo/boda-placeholder.jpg'
  // La primera foto ya se usa como portada del hero — la galería muestra el resto.
  const galeria = fotos.slice(1)
  const ceremoniaMapaUrl = buildMapsSearchUrl(d.ceremonia_lugar, d.ceremonia_direccion)
  const recepcionMapaUrl = buildMapsSearchUrl(d.recepcion_lugar, d.recepcion_direccion)

  return (
    <div
      className={`${display.variable} ${script.variable} ${body.variable}`}
      style={{ backgroundColor: IVORY, color: INK }}
    >
      {/* HERO */}
      <section className="relative flex min-h-screen items-end justify-center overflow-hidden">
        <TemplatePhoto src={portada} alt="" priority sizes="100vw" className="absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${INK} 0%, rgba(28,35,51,0.35) 45%, rgba(28,35,51,0.05) 75%)`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 pb-16 text-center sm:pb-24">
          <p style={bodyFont} className="text-xs tracking-[0.35em] text-[#f5efe4]/80 uppercase">
            Nos casamos
          </p>
          <h1 style={displayFont} className="text-5xl leading-none text-[#f5efe4] sm:text-7xl">
            {d.nombre_novia}
            <span style={scriptFont} className="mx-3 text-3xl text-[#f5efe4]/90 sm:text-4xl">
              &amp;
            </span>
            {d.nombre_novio}
          </h1>
          <p style={bodyFont} className="text-sm tracking-[0.25em] text-[#f5efe4]/80 uppercase">
            {formatLargo(d.fecha_evento)}
          </p>
        </div>
      </section>

      {/* BIENVENIDA */}
      {d.frase_bienvenida && (
        <section className="px-6 py-20 sm:py-28">
          <p
            style={displayFont}
            className="mx-auto max-w-lg text-center text-2xl leading-relaxed sm:text-3xl"
          >
            {d.frase_bienvenida}
          </p>
        </section>
      )}

      {/* DETALLES */}
      <section className="border-t border-[#1c2333]/10 px-6 py-20 sm:py-28">
        <p style={bodyFont} className="text-center text-xs tracking-[0.3em] font-semibold text-[#1c2333]/60 uppercase">
          Los detalles
        </p>
        <h2 style={displayFont} className="mt-3 text-center text-3xl sm:text-4xl">
          Dónde y cuándo
        </h2>

        <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2">
          <div className="text-center">
            <p style={bodyFont} className="text-xs tracking-[0.2em] font-semibold text-[#1c2333]/60 uppercase">
              Ceremonia{d.hora_ceremonia ? ` · ${d.hora_ceremonia}` : ''}
            </p>
            <p style={displayFont} className="mt-3 text-2xl">
              {d.ceremonia_lugar}
            </p>
            <p style={bodyFont} className="mt-2 text-sm text-[#1c2333]/85">
              {d.ceremonia_direccion}
            </p>
            {ceremoniaMapaUrl && (
              <a
                href={ceremoniaMapaUrl}
                target="_blank"
                rel="noreferrer"
                style={bodyFont}
                className="mt-3 inline-block text-xs tracking-[0.15em] text-[#1c2333] underline decoration-[#1c2333]/30 underline-offset-4 uppercase"
              >
                Ver mapa
              </a>
            )}
          </div>

          <div className="text-center">
            <p style={bodyFont} className="text-xs tracking-[0.2em] font-semibold text-[#1c2333]/60 uppercase">
              Recepción
            </p>
            <p style={displayFont} className="mt-3 text-2xl">
              {d.recepcion_lugar}
            </p>
            <p style={bodyFont} className="mt-2 text-sm text-[#1c2333]/85">
              {d.recepcion_direccion}
            </p>
            {recepcionMapaUrl && (
              <a
                href={recepcionMapaUrl}
                target="_blank"
                rel="noreferrer"
                style={bodyFont}
                className="mt-3 inline-block text-xs tracking-[0.15em] text-[#1c2333] underline decoration-[#1c2333]/30 underline-offset-4 uppercase"
              >
                Ver mapa
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ITINERARIO */}
      {d.eventos && d.eventos.length > 0 && (
        <section className="border-t border-[#1c2333]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs tracking-[0.3em] font-semibold text-[#1c2333]/60 uppercase">
            El programa
          </p>
          <h2 style={displayFont} className="mt-3 text-center text-3xl sm:text-4xl">
            Itinerario
          </h2>

          <div className="relative mx-auto mt-14 w-fit max-w-full">
            <div className="absolute top-1 bottom-1 left-[3px] w-px bg-[#1c2333]/15" />
            <div className="flex flex-col gap-10">
              {d.eventos.map((evento, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute top-1.5 left-0 h-2 w-2 rounded-full bg-[#1c2333]" />
                  <p style={bodyFont} className="text-xs tracking-[0.15em] font-semibold text-[#1c2333]/60 uppercase">
                    {evento.hora}
                  </p>
                  <p style={displayFont} className="mt-1 text-xl">
                    {evento.titulo}
                  </p>
                  {evento.descripcion && (
                    <p style={bodyFont} className="mt-1 text-sm text-[#1c2333]/85">
                      {evento.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALERIA */}
      {galeria.length > 0 && (
        <section className="border-t border-[#1c2333]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs tracking-[0.3em] font-semibold text-[#1c2333]/60 uppercase">
            Momentos
          </p>
          <h2 style={displayFont} className="mt-3 mb-14 text-center text-3xl sm:text-4xl">
            Galería
          </h2>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {galeria.map((src, i) => (
              <TemplatePhoto
                key={i}
                src={src}
                alt=""
                sizes="(min-width: 640px) 33vw, 50vw"
                className={`relative aspect-square ${i === 0 ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto' : ''}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* MESA DE REGALOS */}
      {d.opciones && d.opciones.length > 0 && (
        <section className="border-t border-[#1c2333]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs tracking-[0.3em] font-semibold text-[#1c2333]/60 uppercase">
            Con cariño
          </p>
          <h2 style={displayFont} className="mt-3 text-center text-3xl sm:text-4xl">
            Mesa de regalos
          </h2>
          <p style={bodyFont} className="mx-auto mt-4 max-w-sm text-center text-sm text-[#1c2333]/85">
            Tu presencia es nuestro mejor regalo. Si aún así quieres tener un
            detalle con nosotros, aquí puedes encontrarnos.
          </p>

          <div className="mx-auto mt-10 flex max-w-md flex-col divide-y divide-[#1c2333]/10">
            {d.opciones.map((op, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <p style={displayFont} className="text-lg">
                  {op.tienda}
                </p>
                {op.url && (
                  <a
                    href={op.url}
                    target="_blank"
                    rel="noreferrer"
                    style={bodyFont}
                    className="text-xs tracking-[0.15em] text-[#1c2333] underline decoration-[#1c2333]/30 underline-offset-4 uppercase"
                  >
                    Ver
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className="px-6 py-20 sm:py-28" style={{ backgroundColor: INK }}>
        <p style={bodyFont} className="text-center text-xs tracking-[0.3em] text-[#f5efe4]/70 uppercase">
          Confirma tu lugar
        </p>
        <h2 style={displayFont} className="mt-3 mb-12 text-center text-3xl text-[#f5efe4] sm:text-4xl">
          RSVP
        </h2>
        <RsvpForm fechaLimite={formatCorto(d.fecha_limite_rsvp)} mensaje={d.mensaje_rsvp} />
      </section>

      {/* CIERRE */}
      <footer className="px-6 py-12 text-center">
        <p style={scriptFont} className="text-2xl text-[#1c2333]/85">
          {d.nombre_novia} &amp; {d.nombre_novio}
        </p>
        <p style={bodyFont} className="mt-2 text-xs tracking-[0.2em] text-[#1c2333]/55 uppercase">
          {formatLargo(d.fecha_evento)}
        </p>
      </footer>
    </div>
  )
}
