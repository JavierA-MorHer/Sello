'use client'

import { useEffect, useState } from 'react'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import type { SaveTheDateData, SaveTheDateTema } from './boda-save-the-date.types'
import { BodaSaveTheDateRsvp } from './BodaSaveTheDateRsvp'
import { TemplatePhoto } from '../shared/TemplatePhoto'
import { MapaUbicacion } from '../shared/MapaUbicacion'
import { buildDirectionsUrl } from '@/lib/maps/urls'
import { SELLO_BADGE_URL } from '@/lib/marketing/sello-badge'

const display = Cormorant_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-tpl-display',
})
const body = Manrope({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-tpl-body' })

export interface SaveTheDateTheme {
  bg: string
  tint: string
  ink: string
  accent: string
  soft: string
  line: string
}

const TEMAS: Record<SaveTheDateTema, SaveTheDateTheme> = {
  salvia: { bg: '#f6f4ee', tint: '#e8eadf', ink: '#262a22', accent: '#5f6c53', soft: '#6e716a', line: 'rgba(38,42,34,.16)' },
  terracota: { bg: '#f9f3ec', tint: '#f1e3d7', ink: '#2c211c', accent: '#a5553b', soft: '#76675f', line: 'rgba(44,33,28,.16)' },
  tinta: { bg: '#f5f3ee', tint: '#e3e6ec', ink: '#1f2738', accent: '#2f4166', soft: '#6a6f7a', line: 'rgba(31,39,56,.16)' },
}

/** Texto sobre acento o tinta. */
const CREAM = '#fbf8f2'
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const DEFAULT_MENSAJE = 'Nos casamos y queremos que estés ahí. Aparta el día; los detalles vienen pronto.'

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

const pad = (n: number) => String(n).padStart(2, '0')

function parseFecha(iso?: string) {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  return { Y: Number(m[1]), M: Number(m[2]), D: Number(m[3]) }
}

/** "17:00" → "5:00 pm". Si no es HH:MM (datos viejos o texto libre) se muestra tal cual. */
function formatHora(hora?: string) {
  const m = hora?.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return hora ?? ''
  const h = Number(m[1])
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? 'am' : 'pm'}`
}

function formatCorta(iso?: string) {
  const f = parseFecha(iso)
  return f ? `${f.D} de ${MESES[f.M - 1]}` : ''
}

/** Escapa texto para una línea de iCalendar (RFC 5545 §3.3.11). */
function icsText(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function useCountdown(target: number | null) {
  const [ms, setMs] = useState<number | null>(null)

  // Solo en el cliente: el render del servidor y el del navegador diferirían
  // por el paso del tiempo (hydration mismatch).
  useEffect(() => {
    if (target === null) return
    const tick = () => setMs(target - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (ms === null || ms <= 0) return null
  return [
    { n: String(Math.floor(ms / 86_400_000)), l: 'Días' },
    { n: pad(Math.floor(ms / 3_600_000) % 24), l: 'Hrs' },
    { n: pad(Math.floor(ms / 60_000) % 60), l: 'Min' },
    { n: pad(Math.floor(ms / 1000) % 60), l: 'Seg' },
  ]
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '.3em',
        paddingLeft: '.3em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {children}
    </span>
  )
}

function CopiarButton({ value, color }: { value: string; color: string }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(value)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permiso de portapapeles (iframe, navegador viejo): el dato sigue visible para copiarlo a mano.
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      style={{
        border: 0,
        background: 'none',
        cursor: 'pointer',
        padding: 0,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.1em',
        color,
      }}
    >
      <span aria-live="polite">{copiado ? 'COPIADO' : 'COPIAR'}</span>
    </button>
  )
}

export function BodaSaveTheDate({
  custom_data,
  fotos = [],
  eventId = null,
}: {
  custom_data: SaveTheDateData
  fotos?: string[]
  eventId?: string | null
}) {
  const d = custom_data
  const t = TEMAS[d.tema ?? 'salvia'] ?? TEMAS.salvia
  const bride = d.nombre_novia || 'Novia'
  const groom = d.nombre_novio || 'Novio'
  const iniciales = `${bride[0]}·${groom[0]}`
  const fecha = parseFecha(d.fecha_evento)
  const portadaFoto = fotos[0]
  const galeria = fotos.slice(1)
  const usarFoto = d.portada === 'foto' && Boolean(portadaFoto)
  const conSobre = d.sobre !== 'no'
  const conCuenta = d.cuenta_regresiva !== 'no'
  const pases = d.pases_por_invitacion && d.pases_por_invitacion > 0 ? d.pases_por_invitacion : 2

  const [abierto, setAbierto] = useState(false)
  const [sobreFuera, setSobreFuera] = useState(false)

  // Mientras el sobre está cerrado no tiene sentido scrollear lo que hay debajo.
  useEffect(() => {
    if (!conSobre || abierto) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [conSobre, abierto])

  useEffect(() => {
    if (!abierto) return
    const id = setTimeout(() => setSobreFuera(true), 700)
    return () => clearTimeout(id)
  }, [abierto])

  const horaCuenta = d.hora_ceremonia?.match(/^(\d{1,2}):(\d{2})$/)
  const target = fecha
    ? new Date(fecha.Y, fecha.M - 1, fecha.D, horaCuenta ? Number(horaCuenta[1]) : 0, horaCuenta ? Number(horaCuenta[2]) : 0).getTime()
    : null
  const cuenta = useCountdown(conCuenta ? target : null)

  // Calendario del mes, empezando en lunes.
  const celdas: (number | null)[] = []
  if (fecha) {
    const offset = (new Date(fecha.Y, fecha.M - 1, 1).getDay() + 6) % 7
    const total = new Date(fecha.Y, fecha.M, 0).getDate()
    for (let i = 0; i < offset; i++) celdas.push(null)
    for (let n = 1; n <= total; n++) celdas.push(n)
  }

  // Agregar al calendario: evento de día completo (DTEND es exclusivo, por eso el día siguiente).
  const titulo = `Boda de ${bride} y ${groom}`
  const lugarCalendario = [d.ceremonia_ubicacion?.lugar, d.ciudad].filter(Boolean).join(', ')
  let gcalUrl: string | null = null
  let icsUrl: string | null = null
  if (fecha) {
    const sig = new Date(fecha.Y, fecha.M - 1, fecha.D + 1)
    const d0 = `${fecha.Y}${pad(fecha.M)}${pad(fecha.D)}`
    const d1 = `${sig.getFullYear()}${pad(sig.getMonth() + 1)}${pad(sig.getDate())}`
    const params = new URLSearchParams({ action: 'TEMPLATE', text: titulo, dates: `${d0}/${d1}` })
    if (lugarCalendario) params.set('location', lugarCalendario)
    gcalUrl = `https://calendar.google.com/calendar/render?${params.toString()}`
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sello//Invitacion//ES',
      'BEGIN:VEVENT',
      `UID:${d0}-${encodeURIComponent(bride + groom)}@misello.com.mx`,
      `DTSTAMP:${d0}T000000Z`,
      `DTSTART;VALUE=DATE:${d0}`,
      `DTEND;VALUE=DATE:${d1}`,
      `SUMMARY:${icsText(titulo)}`,
      ...(lugarCalendario ? [`LOCATION:${icsText(lugarCalendario)}`] : []),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    icsUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
  }

  const sedes = [
    { tipo: 'Ceremonia', hora: d.hora_ceremonia, ubicacion: d.ceremonia_ubicacion },
    { tipo: 'Recepción', hora: d.hora_recepcion, ubicacion: d.recepcion_ubicacion },
  ].filter((s) => s.ubicacion?.lugar)

  const clabe = d.transferencia_clabe?.replace(/\s+/g, '')
  const hayRegalos = (d.tiendas && d.tiendas.length > 0) || Boolean(clabe)

  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ ...bodyFont, background: t.bg, color: t.ink, ['--std-line' as string]: t.line }}
    >
      <style>{`
        .std-root a:hover { opacity: .75 }
        .std-sobre { transition: opacity .7s ease, transform .7s ease }
        @media (prefers-reduced-motion: reduce) { .std-sobre { transition: none } }
        .std-carrusel::-webkit-scrollbar { display: none }
      `}</style>

      <div className="std-root" style={{ maxWidth: 430, margin: '0 auto' }}>
        {/* PORTADA */}
        {usarFoto ? (
          <section style={{ position: 'relative', height: 700, overflow: 'hidden' }}>
            <TemplatePhoto src={portadaFoto} alt="" priority sizes="430px" className="absolute inset-0" />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(20,18,15,.05) 30%, rgba(20,18,15,.7) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                bottom: 40,
                color: CREAM,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <h1 style={{ ...displayFont, fontWeight: 400, fontSize: 72, lineHeight: 0.9, letterSpacing: '-.02em', margin: 0 }}>
                Save <span style={{ fontStyle: 'italic', fontSize: 44 }}>the</span> Date
              </h1>
              <div style={{ width: 40, height: 1, background: 'rgba(251,248,242,.6)' }} />
              <div style={{ ...displayFont, fontSize: 28, lineHeight: '34px' }}>
                {bride} <span style={{ fontStyle: 'italic' }}>&amp;</span> {groom}
              </div>
              {fecha && (
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase' }}>
                  {fecha.D} de {MESES[fecha.M - 1]}, {fecha.Y}
                  {d.ciudad ? ` · ${d.ciudad}` : ''}
                </span>
              )}
            </div>
          </section>
        ) : (
          <section style={{ padding: 16, background: t.tint }}>
            <div style={{ border: `1px solid ${t.line}`, padding: 5, borderRadius: '200px 200px 6px 6px' }}>
              <div
                style={{
                  border: `1px solid ${t.line}`,
                  borderRadius: '196px 196px 3px 3px',
                  padding: '44px 22px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 26,
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    ...displayFont,
                    width: 54,
                    height: 54,
                    borderRadius: 9999,
                    background: t.accent,
                    color: CREAM,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  {iniciales}
                </span>
                <h1 style={{ ...displayFont, fontWeight: 400, lineHeight: 0.9, letterSpacing: '-.02em', fontSize: 76, margin: 0 }}>
                  Save <span style={{ fontStyle: 'italic', fontSize: 46, color: t.accent }}>the</span> Date
                </h1>
                {portadaFoto && (
                  <div
                    style={{
                      position: 'relative',
                      width: 210,
                      height: 260,
                      borderRadius: '9999px 9999px 4px 4px',
                      overflow: 'hidden',
                      boxShadow: `0 0 0 5px ${t.tint}, 0 0 0 6px ${t.line}`,
                    }}
                  >
                    <TemplatePhoto src={portadaFoto} alt="" priority sizes="210px" className="absolute inset-0" />
                  </div>
                )}
                {fecha && (
                  <div style={{ ...displayFont, display: 'flex', alignItems: 'center', gap: 16, fontSize: 40, lineHeight: 1 }}>
                    <span>{pad(fecha.D)}</span>
                    <span style={{ width: 1, height: 34, background: t.line }} />
                    <span>{pad(fecha.M)}</span>
                    <span style={{ width: 1, height: 34, background: t.line }} />
                    <span>{String(fecha.Y).slice(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <div style={{ ...displayFont, fontSize: 30, lineHeight: '36px' }}>
                    {bride} <span style={{ fontStyle: 'italic', color: t.accent }}>&amp;</span> {groom}
                  </div>
                  {d.ciudad && (
                    <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: t.soft }}>
                      {d.ciudad}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CALENDARIO */}
        {fecha && (
          <section style={{ padding: '52px 30px', borderTop: `1px solid ${t.line}`, textAlign: 'center' }}>
            <div style={{ ...displayFont, fontStyle: 'italic', fontSize: 26, lineHeight: 1 }}>
              {MESES[fecha.M - 1][0].toUpperCase() + MESES[fecha.M - 1].slice(1)} {fecha.Y}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', rowGap: 6, marginTop: 22 }}>
              {SEMANA.map((w, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', color: t.soft, paddingBottom: 8 }}>
                  {w}
                </span>
              ))}
              {celdas.map((n, i) => {
                const hit = n === fecha.D
                return (
                  <div
                    key={i}
                    style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
                  >
                    {hit && <span style={{ position: 'absolute', width: 38, height: 38, borderRadius: 9999, background: t.accent }} />}
                    <span style={{ position: 'relative', color: hit ? CREAM : t.ink, fontWeight: hit ? 600 : 400 }}>{n ?? ''}</span>
                  </div>
                )
              })}
            </div>
            <p style={{ ...displayFont, margin: '24px 0 0', fontSize: 21, lineHeight: '30px', textWrap: 'pretty' }}>
              {d.mensaje_calendario || DEFAULT_MENSAJE}
            </p>
          </section>
        )}

        {/* CUENTA REGRESIVA */}
        {cuenta && (
          <section style={{ padding: '40px 24px', background: t.ink, color: t.bg, textAlign: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.3em', paddingLeft: '.3em', textTransform: 'uppercase', opacity: 0.65 }}>
              Faltan
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginTop: 16 }}>
              {cuenta.map((k) => (
                <div key={k.l} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                  <span style={{ ...displayFont, fontSize: 42, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{k.n}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.6 }}>{k.l}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AGREGAR AL CALENDARIO */}
        {gcalUrl && icsUrl && (
          <section style={{ padding: '48px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <Eyebrow color={t.accent}>Guárdala en tu calendario</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  border: `1px solid ${t.ink}`,
                  borderRadius: 9999,
                  padding: 15,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '.04em',
                  color: t.ink,
                }}
              >
                Google Calendar
              </a>
              <a
                href={icsUrl}
                download="save-the-date.ics"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  border: `1px solid ${t.line}`,
                  borderRadius: 9999,
                  padding: 15,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '.04em',
                  color: t.ink,
                }}
              >
                Apple / Outlook
              </a>
            </div>
          </section>
        )}

        {/* DÓNDE */}
        {sedes.length > 0 && (
          <section style={{ padding: '52px 30px', borderTop: `1px solid ${t.line}` }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <Eyebrow color={t.accent}>Dónde</Eyebrow>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {sedes.map((s) => (
                <div key={s.tipo} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: t.soft }}>
                    {s.tipo}
                    {s.hora ? ` · ${formatHora(s.hora)}` : ''}
                  </span>
                  <div style={{ ...displayFont, fontSize: 30, lineHeight: '34px' }}>{s.ubicacion.lugar}</div>
                  {s.ubicacion.direccion && (
                    <span style={{ fontSize: 13, lineHeight: '20px', color: t.soft }}>{s.ubicacion.direccion}</span>
                  )}
                  <MapaUbicacion
                    ubicacion={s.ubicacion}
                    className="h-[170px] w-full overflow-hidden rounded-[14px] border border-(--std-line)"
                  />
                  {s.ubicacion.lat && s.ubicacion.lng ? (
                    <a
                      href={buildDirectionsUrl(s.ubicacion)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        alignSelf: 'center',
                        textDecoration: 'none',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: t.accent,
                        borderBottom: `1px solid ${t.accent}`,
                        paddingBottom: 3,
                      }}
                    >
                      Cómo llegar
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ITINERARIO */}
        {d.itinerario && d.itinerario.length > 0 && (
          <section style={{ padding: '52px 30px', background: t.ink, color: t.bg }}>
            <div style={{ textAlign: 'center', marginBottom: 28, opacity: 0.65 }}>
              <Eyebrow color="inherit">Itinerario</Eyebrow>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {d.itinerario.map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '72px minmax(0, 1fr)',
                    gap: 18,
                    alignItems: 'baseline',
                    padding: '14px 0',
                    borderTop: '1px solid rgba(255,255,255,.14)',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em', opacity: 0.7, textAlign: 'right' }}>
                    {formatHora(it.hora)}
                  </span>
                  <span style={{ ...displayFont, fontSize: 22, lineHeight: '28px' }}>{it.titulo}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VESTIMENTA */}
        {d.vestimenta && (
          <section style={{ padding: '52px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <Eyebrow color={t.accent}>Código de vestimenta</Eyebrow>
            <div style={{ ...displayFont, fontSize: 34, lineHeight: 1 }}>{d.vestimenta}</div>
            {d.vestimenta_nota && (
              <span style={{ fontSize: 13, lineHeight: '20px', color: t.soft, maxWidth: 270, textWrap: 'pretty' }}>{d.vestimenta_nota}</span>
            )}
          </section>
        )}

        {/* NUESTRA HISTORIA */}
        {galeria.length > 0 && (
          <section style={{ padding: '52px 0', borderTop: `1px solid ${t.line}` }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Eyebrow color={t.accent}>Nuestra historia</Eyebrow>
            </div>
            <div className="std-carrusel" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 30px 6px', scrollbarWidth: 'none' }}>
              {galeria.map((src, i) => (
                <div key={i} style={{ position: 'relative', flex: 'none', width: 220, height: 290, borderRadius: 14, overflow: 'hidden' }}>
                  <TemplatePhoto src={src} alt="" sizes="220px" className="absolute inset-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MESA DE REGALOS */}
        {hayRegalos && (
          <section style={{ padding: '52px 30px', borderTop: `1px solid ${t.line}`, textAlign: 'center' }}>
            <Eyebrow color={t.accent}>Mesa de regalos</Eyebrow>
            <p style={{ ...displayFont, margin: '14px 0 22px', fontSize: 21, lineHeight: '29px', textWrap: 'pretty' }}>
              Tu presencia es nuestro mejor regalo. Si quieres darnos algo más, aquí están nuestras opciones.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.tiendas?.map((s, i) => {
                const card = {
                  border: `1px solid ${t.line}`,
                  borderRadius: 14,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  textAlign: 'left' as const,
                  textDecoration: 'none',
                  color: t.ink,
                }
                const contenido = (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{s.nombre}</span>
                      {s.detalle && <span style={{ fontSize: 12, color: t.soft }}>{s.detalle}</span>}
                    </div>
                    {s.url && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: t.accent }}>ABRIR</span>}
                  </>
                )
                return s.url ? (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={card}>
                    {contenido}
                  </a>
                ) : (
                  <div key={i} style={card}>
                    {contenido}
                  </div>
                )
              })}
              {clabe && (
                <div
                  style={{
                    border: `1px solid ${t.line}`,
                    borderRadius: 14,
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>Transferencia</span>
                    <span style={{ fontSize: 12, color: t.soft, overflowWrap: 'anywhere' }}>
                      {d.transferencia_banco ? `${d.transferencia_banco} · ` : ''}CLABE {clabe.replace(/(\d{4})(?=\d)/g, '$1 ')}
                    </span>
                  </div>
                  <CopiarButton value={clabe} color={t.accent} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* RSVP */}
        <section style={{ padding: '48px 30px 40px', borderTop: `1px solid ${t.line}`, textAlign: 'center' }}>
          <BodaSaveTheDateRsvp
            eventId={eventId}
            theme={t}
            iniciales={iniciales}
            pases={pases}
            fechaLimite={formatCorta(d.fecha_limite_rsvp)}
          />

          {/* FIRMA */}
          <a
            href={SELLO_BADGE_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 44,
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: t.soft,
              textDecoration: 'none',
            }}
          >
            <span>Hecho con Sello</span>
            <span style={{ width: 4, height: 4, borderRadius: 9999, background: '#a8927e', marginLeft: 3 }} />
          </a>
        </section>
      </div>

      {/* SOBRE DE APERTURA */}
      {conSobre && !sobreFuera && (
        <div
          className="std-sobre"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: t.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            textAlign: 'center',
            opacity: abierto ? 0 : 1,
            transform: abierto ? 'scale(1.04)' : 'scale(1)',
            pointerEvents: abierto ? 'none' : 'auto',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.32em', paddingLeft: '.32em', textTransform: 'uppercase', color: t.soft }}>
            Para ti
          </span>
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-label="Abrir la invitación"
            style={{
              ...displayFont,
              cursor: 'pointer',
              width: 132,
              height: 132,
              borderRadius: 9999,
              border: 0,
              background: t.accent,
              color: CREAM,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              lineHeight: 1,
              boxShadow: 'inset 0 0 0 6px rgba(251,248,242,.18)',
            }}
          >
            {iniciales}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ ...displayFont, fontStyle: 'italic', fontSize: 26 }}>Tenemos algo que contarte</div>
            <span style={{ fontSize: 12, color: t.soft }}>Toca el sello para abrir</span>
          </div>
        </div>
      )}
    </div>
  )
}
