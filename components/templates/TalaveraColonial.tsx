import { Piazzolla, Karla } from 'next/font/google'
import { ArchPhoto } from './ArchPhoto'
import { TalaveraBorder } from './TalaveraBorder'
import { TalaveraRsvpForm } from './TalaveraRsvpForm'
import type { WeddingData } from './wedding.types'

const display = Piazzolla({ subsets: ['latin'], variable: '--font-tal-display' })
const body = Karla({ subsets: ['latin'], variable: '--font-tal-body' })

const BLUE = '#204e70'
const CREAM = '#f7f2e7'
const OCHRE = '#c9932e'
const INK = '#2b2620'
// El ochre base (arriba) es para fondos/bordes decorativos, no para texto —
// contra crema da 2.44:1 y contra azul 3.23:1, ambos bajo el piso de 4.5:1
// (o 3:1 en texto grande). Estas dos variantes sí cumplen contraste real.
const OCHRE_ON_CREAM = '#8a5f1c'
const OCHRE_ON_BLUE = '#eec070'

function formatLargo(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    date
  )
}

function formatCorto(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(date)
}

const fontDisplay = { fontFamily: 'var(--font-tal-display)' }
const fontDisplayItalic = { fontFamily: 'var(--font-tal-display)', fontStyle: 'italic' as const }
const fontBody = { fontFamily: 'var(--font-tal-body)' }

const labelStyle = { ...fontBody, color: BLUE }
const mutedStyle = { ...fontBody, color: `${INK}b3` }
const linkStyle = { ...fontBody, color: BLUE }

export function TalaveraColonial({
  custom_data,
  fotos = [],
}: {
  custom_data: WeddingData
  fotos?: string[]
}) {
  const d = custom_data

  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <TalaveraBorder />

      {/* HERO */}
      <section className="px-6 py-16 sm:py-24">
        <p style={labelStyle} className="text-center text-xs tracking-[0.35em] uppercase">
          Nos casamos
        </p>

        <ArchPhoto
          src="/demo/boda-placeholder.jpg"
          alt=""
          priority
          sizes="(min-width: 640px) 420px, 80vw"
          className="mx-auto mt-8 aspect-[3/4] w-full max-w-xs shadow-[0_20px_45px_-15px_rgba(32,78,112,0.45)]"
        />

        <h1 style={fontDisplay} className="mt-8 text-center text-4xl sm:text-6xl">
          {d.nombre_novia}
          <span style={{ ...fontDisplayItalic, color: OCHRE_ON_CREAM }} className="mx-3">
            &amp;
          </span>
          {d.nombre_novio}
        </h1>
        <p style={mutedStyle} className="mt-3 text-center text-sm tracking-[0.25em] uppercase">
          {formatLargo(d.fecha_evento)}
        </p>
      </section>

      <TalaveraBorder />

      {/* BIENVENIDA */}
      {d.frase_bienvenida && (
        <section className="px-6 py-20 sm:py-28">
          <p style={fontDisplay} className="mx-auto max-w-lg text-center text-2xl leading-relaxed sm:text-3xl">
            {d.frase_bienvenida}
          </p>
        </section>
      )}

      <TalaveraBorder />

      {/* DETALLES */}
      <section className="px-6 py-20 sm:py-28">
        <p style={labelStyle} className="text-center text-xs tracking-[0.3em] uppercase">
          Los detalles
        </p>
        <h2 style={fontDisplay} className="mt-3 text-center text-3xl sm:text-4xl">
          Dónde y cuándo
        </h2>

        <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-2">
          {[
            {
              label: `Ceremonia · ${d.hora_ceremonia}`,
              lugar: d.ceremonia_lugar,
              direccion: d.ceremonia_direccion,
              mapa: d.ceremonia_mapa_url,
            },
            {
              label: 'Recepción',
              lugar: d.recepcion_lugar,
              direccion: d.recepcion_direccion,
              mapa: d.recepcion_mapa_url,
            },
          ].map((info) => (
            <div key={info.label} className="border p-6 text-center" style={{ borderColor: `${BLUE}33` }}>
              <p style={labelStyle} className="text-xs tracking-[0.2em] uppercase">
                {info.label}
              </p>
              <p style={fontDisplay} className="mt-3 text-2xl">
                {info.lugar}
              </p>
              <p style={mutedStyle} className="mt-2 text-sm">
                {info.direccion}
              </p>
              {info.mapa && (
                <a
                  href={info.mapa}
                  style={linkStyle}
                  className="mt-3 inline-block text-xs tracking-[0.15em] underline decoration-current/40 underline-offset-4 uppercase"
                >
                  Ver mapa
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <TalaveraBorder />

      {/* ITINERARIO */}
      {d.eventos && d.eventos.length > 0 && (
        <>
          <section className="px-6 py-20 sm:py-28">
            <p style={labelStyle} className="text-center text-xs tracking-[0.3em] uppercase">
              El programa
            </p>
            <h2 style={fontDisplay} className="mt-3 text-center text-3xl sm:text-4xl">
              Itinerario
            </h2>

            <div className="relative mx-auto mt-14 max-w-md">
              <div
                className="absolute top-1 bottom-1 left-[3px] w-px"
                style={{ backgroundColor: `${BLUE}26` }}
              />
              <div className="flex flex-col gap-10">
                {d.eventos.map((evento, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute top-1.5 left-0 h-2 w-2 rotate-45" style={{ backgroundColor: OCHRE }} />
                    <p style={labelStyle} className="text-xs tracking-[0.15em] uppercase">
                      {evento.hora}
                    </p>
                    <p style={fontDisplay} className="mt-1 text-xl">
                      {evento.titulo}
                    </p>
                    {evento.descripcion && (
                      <p style={mutedStyle} className="mt-1 text-sm">
                        {evento.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <TalaveraBorder />
        </>
      )}

      {/* GALERIA */}
      {fotos.length > 0 && (
        <>
          <section className="px-6 py-20 sm:py-28">
            <p style={labelStyle} className="text-center text-xs tracking-[0.3em] uppercase">
              Momentos
            </p>
            <h2 style={fontDisplay} className="mt-3 mb-14 text-center text-3xl sm:text-4xl">
              Galería
            </h2>

            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
              {fotos.map((src, i) => (
                <ArchPhoto key={i} src={src} alt="" sizes="(min-width: 640px) 33vw, 50vw" className="aspect-[3/4]" />
              ))}
            </div>
          </section>
          <TalaveraBorder />
        </>
      )}

      {/* MESA DE REGALOS */}
      {d.opciones && d.opciones.length > 0 && (
        <>
          <section className="px-6 py-20 sm:py-28">
            <p style={labelStyle} className="text-center text-xs tracking-[0.3em] uppercase">
              Con cariño
            </p>
            <h2 style={fontDisplay} className="mt-3 text-center text-3xl sm:text-4xl">
              Mesa de regalos
            </h2>
            <p style={mutedStyle} className="mx-auto mt-4 max-w-sm text-center text-sm">
              Tu presencia es nuestro mejor regalo. Si aún así quieres tener un
              detalle con nosotros, aquí puedes encontrarnos.
            </p>

            <div className="mx-auto mt-10 flex max-w-md flex-col divide-y" style={{ borderColor: `${BLUE}1f` }}>
              {d.opciones.map((op, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                  <div>
                    <p style={fontDisplay} className="text-lg">
                      {op.tienda}
                    </p>
                    {op.numero_mesa && (
                      <p style={{ ...fontBody, color: `${INK}b3` }} className="text-xs">
                        Mesa {op.numero_mesa}
                      </p>
                    )}
                  </div>
                  {op.url && (
                    <a
                      href={op.url}
                      style={linkStyle}
                      className="text-xs tracking-[0.15em] underline decoration-current/40 underline-offset-4 uppercase"
                    >
                      Ver
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
          <TalaveraBorder />
        </>
      )}

      {/* RSVP */}
      <section className="px-6 py-20 sm:py-28" style={{ backgroundColor: BLUE }}>
        <p style={{ ...fontBody, color: OCHRE_ON_BLUE }} className="text-center text-xs tracking-[0.3em] uppercase">
          Confirma tu lugar
        </p>
        <h2 style={{ ...fontDisplay, color: CREAM }} className="mt-3 mb-12 text-center text-3xl sm:text-4xl">
          RSVP
        </h2>
        <TalaveraRsvpForm fechaLimite={formatCorto(d.fecha_limite_rsvp)} mensaje={d.mensaje_rsvp} />
      </section>

      <TalaveraBorder />

      {/* CIERRE */}
      <footer className="px-6 py-12 text-center">
        <p style={{ ...fontDisplayItalic, color: BLUE }} className="text-2xl">
          {d.nombre_novia} &amp; {d.nombre_novio}
        </p>
        <p style={{ ...fontBody, color: `${INK}b3` }} className="mt-2 text-xs tracking-[0.2em] uppercase">
          {formatLargo(d.fecha_evento)}
        </p>
      </footer>
    </div>
  )
}
