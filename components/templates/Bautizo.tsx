import { Playfair_Display, Karla } from 'next/font/google'
import { TemplatePhoto } from './TemplatePhoto'
import { RsvpForm } from './RsvpForm'
import { EventCountdown } from './EventCountdown'
import type { BautizoData } from './bautizo.types'
import { MapaUbicacion } from './MapaUbicacion'
import { buildDirectionsUrl } from '@/lib/maps/urls'
import { SELLO_BADGE_TEXT, SELLO_BADGE_URL } from '@/lib/marketing/sello-badge'

const display = Playfair_Display({ subsets: ['latin'], variable: '--font-tpl-display' })
const body = Karla({ subsets: ['latin'], variable: '--font-tpl-body' })

const IVORY = '#eef4f6'
const INK = '#213947'

function formatLargo(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function formatCorto(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(date)
}

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

export function Bautizo({
  custom_data,
  fotos = [],
  eventId = null,
}: {
  custom_data: BautizoData
  fotos?: string[]
  eventId?: string | null
}) {
  const d = custom_data
  const portada = fotos[0] ?? '/demo/boda-placeholder.jpg'
  const galeria = fotos.slice(1)
  const iglesiaMapaUrl = d.iglesia_ubicacion ? buildDirectionsUrl(d.iglesia_ubicacion) : null
  const recepcionMapaUrl = d.recepcion_ubicacion ? buildDirectionsUrl(d.recepcion_ubicacion) : null

  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ backgroundColor: IVORY, color: INK }}
    >
      {/* HERO */}
      <section className="relative flex min-h-screen items-end justify-center overflow-hidden">
        <TemplatePhoto src={portada} alt="" priority sizes="100vw" className="absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${INK} 0%, rgba(33,57,71,0.4) 45%, rgba(33,57,71,0.05) 75%)` }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-16 text-center sm:pb-24">
          <p style={bodyFont} className="text-xs font-semibold tracking-[0.35em] text-[#eef4f6]/85 uppercase">
            Mi bautizo
          </p>
          <h1 style={displayFont} className="text-6xl leading-none text-[#eef4f6] sm:text-8xl">
            {d.nombre_bebe}
          </h1>
          <p style={bodyFont} className="text-sm tracking-[0.25em] text-[#eef4f6]/85 uppercase">
            {formatLargo(d.fecha_evento)}
          </p>
          {d.nombre_padres && (
            <p style={bodyFont} className="text-sm text-[#eef4f6]/75">
              Hijo/a de {d.nombre_padres}
            </p>
          )}
        </div>
      </section>

      <EventCountdown fechaEvento={d.fecha_evento} />

      {/* BIENVENIDA */}
      {d.frase_bienvenida && (
        <section className="px-6 py-20 sm:py-28">
          <p style={displayFont} className="mx-auto max-w-lg text-center text-2xl leading-relaxed sm:text-3xl">
            {d.frase_bienvenida}
          </p>
        </section>
      )}

      {/* DETALLES */}
      <section className="border-t border-[#213947]/10 px-6 py-20 sm:py-28">
        <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#213947]/60 uppercase">
          Los detalles
        </p>
        <h2 style={displayFont} className="mt-3 text-center text-3xl sm:text-4xl">
          Dónde y cuándo
        </h2>

        <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2">
          <div className="text-center">
            <p style={bodyFont} className="text-xs font-semibold tracking-[0.2em] text-[#213947]/60 uppercase">
              Misa{d.hora_misa ? ` · ${d.hora_misa}` : ''}
            </p>
            <p style={displayFont} className="mt-3 text-2xl">
              {d.iglesia_ubicacion?.lugar}
            </p>
            <p style={bodyFont} className="mt-2 text-sm text-[#213947]/85">
              {d.iglesia_ubicacion?.direccion}
            </p>
            <MapaUbicacion
              ubicacion={d.iglesia_ubicacion}
              className="mx-auto mt-4 h-40 max-w-sm overflow-hidden rounded-sm border border-[#213947]/10"
            />
            {iglesiaMapaUrl && (
              <a
                href={iglesiaMapaUrl}
                target="_blank"
                rel="noreferrer"
                style={bodyFont}
                className="mt-3 inline-block text-xs font-semibold tracking-[0.15em] text-[#213947] underline decoration-[#213947]/30 underline-offset-4 uppercase"
              >
                Cómo llegar
              </a>
            )}
          </div>

          {d.recepcion_ubicacion && (
            <div className="text-center">
              <p style={bodyFont} className="text-xs font-semibold tracking-[0.2em] text-[#213947]/60 uppercase">
                Recepción
              </p>
              <p style={displayFont} className="mt-3 text-2xl">
                {d.recepcion_ubicacion.lugar}
              </p>
              <p style={bodyFont} className="mt-2 text-sm text-[#213947]/85">
                {d.recepcion_ubicacion.direccion}
              </p>
              <MapaUbicacion
                ubicacion={d.recepcion_ubicacion}
                className="mx-auto mt-4 h-40 max-w-sm overflow-hidden rounded-sm border border-[#213947]/10"
              />
              {recepcionMapaUrl && (
                <a
                  href={recepcionMapaUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={bodyFont}
                  className="mt-3 inline-block text-xs font-semibold tracking-[0.15em] text-[#213947] underline decoration-[#213947]/30 underline-offset-4 uppercase"
                >
                  Cómo llegar
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ITINERARIO */}
      {d.eventos && d.eventos.length > 0 && (
        <section className="border-t border-[#213947]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#213947]/60 uppercase">
            El programa
          </p>
          <h2 style={displayFont} className="mt-3 text-center text-3xl sm:text-4xl">
            Itinerario
          </h2>

          <div className="mx-auto mt-14 flex max-w-md flex-col gap-6">
            {d.eventos.map((evento, i) => (
              <div key={i} className="flex items-start gap-4">
                <span
                  style={bodyFont}
                  className="mt-0.5 flex-none rounded-full border border-[#213947]/20 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#213947]/75"
                >
                  {evento.hora}
                </span>
                <div className="flex flex-col gap-0.5 pt-1">
                  <p style={displayFont} className="text-xl leading-snug">
                    {evento.titulo}
                  </p>
                  {evento.descripcion && (
                    <p style={bodyFont} className="text-sm text-[#213947]/85">
                      {evento.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PADRINOS */}
      {d.padrinos && d.padrinos.length > 0 && (
        <section className="border-t border-[#213947]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#213947]/60 uppercase">
            Con cariño
          </p>
          <h2 style={displayFont} className="mt-3 mb-14 text-center text-3xl sm:text-4xl">
            Padrinos
          </h2>

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 text-center sm:grid-cols-3">
            {d.padrinos.map((p, i) => (
              <div key={i}>
                <p style={displayFont} className="text-lg">
                  {p.nombre}
                </p>
                {p.rol && (
                  <p style={bodyFont} className="mt-1 text-xs tracking-[0.1em] text-[#213947]/60 uppercase">
                    {p.rol}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALERIA */}
      {galeria.length > 0 && (
        <section className="border-t border-[#213947]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#213947]/60 uppercase">
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
        <section className="border-t border-[#213947]/10 px-6 py-20 sm:py-28">
          <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#213947]/60 uppercase">
            Con cariño
          </p>
          <h2 style={displayFont} className="mt-3 text-center text-3xl sm:text-4xl">
            Mesa de regalos
          </h2>
          <p style={bodyFont} className="mx-auto mt-4 max-w-sm text-center text-sm text-[#213947]/85">
            Tu presencia es nuestro mejor regalo. Si aún así quieres tener un detalle, aquí puedes encontrarnos.
          </p>

          <div className="mx-auto mt-10 flex max-w-md flex-col divide-y divide-[#213947]/10">
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
                    className="text-xs font-semibold tracking-[0.15em] text-[#213947] underline decoration-[#213947]/30 underline-offset-4 uppercase"
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
        <p style={bodyFont} className="text-center text-xs font-semibold tracking-[0.3em] text-[#eef4f6]/70 uppercase">
          Confirma tu lugar
        </p>
        <h2 style={displayFont} className="mt-3 mb-12 text-center text-3xl text-[#eef4f6] sm:text-4xl">
          RSVP
        </h2>
        <RsvpForm eventId={eventId} fechaLimite={formatCorto(d.fecha_limite_rsvp)} mensaje={d.mensaje_rsvp} />
      </section>

      {/* CIERRE */}
      <footer className="px-6 py-12 text-center">
        <p style={displayFont} className="text-2xl text-[#213947]/85">
          {d.nombre_bebe}
        </p>
        <p style={bodyFont} className="mt-2 text-xs font-semibold tracking-[0.2em] text-[#213947]/55 uppercase">
          {formatLargo(d.fecha_evento)}
        </p>
        <a
          href={SELLO_BADGE_URL}
          target="_blank"
          rel="noreferrer"
          style={bodyFont}
          className="mt-6 inline-block text-[10px] font-semibold tracking-[0.15em] text-[#213947]/35 uppercase no-underline hover:text-[#213947]/60"
        >
          {SELLO_BADGE_TEXT}
        </a>
      </footer>
    </div>
  )
}
