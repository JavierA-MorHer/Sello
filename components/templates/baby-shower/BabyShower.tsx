'use client'

import { useEffect, useState } from 'react'
import { Baloo_2, Nunito } from 'next/font/google'
import type { BabyShowerData, BabyShowerTema } from './babyshower.types'
import { BabyShowerRsvp } from './BabyShowerRsvp'
import { MapaUbicacion } from '../shared/MapaUbicacion'
import { buildDirectionsUrl } from '@/lib/maps/urls'
import { SELLO_BADGE_TEXT, SELLO_BADGE_URL } from '@/lib/marketing/sello-badge'

const display = Baloo_2({ weight: ['500', '600', '700', '800'], subsets: ['latin'], variable: '--font-tpl-display' })
const body = Nunito({ weight: ['400', '600', '700'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-tpl-body' })

const INK = '#2e2a26'
const PAPER = '#fffdf6'
const INK_SOFT = '#5c554d'
const INK_FAINT = '#8a8177'
const YELLOW = '#ffc94a'

const TEMAS: Record<BabyShowerTema, { accent: string; heroBg: string; blobA: string; blobB: string; dot: string }> = {
  neutro: { accent: '#4fb6a5', heroBg: '#fdf3e3', blobA: 'rgba(79,182,165,.22)', blobB: 'rgba(255,201,74,.3)', dot: '#f2724c' },
  nino: { accent: '#4a86c9', heroBg: '#eef4fb', blobA: 'rgba(74,134,201,.2)', blobB: 'rgba(255,201,74,.32)', dot: '#f2724c' },
  nina: { accent: '#e0698e', heroBg: '#fdeef2', blobA: 'rgba(224,105,142,.2)', blobB: 'rgba(255,201,74,.32)', dot: '#4fb6a5' },
}

const PLAN_BGS = ['#fdf3e3', '#eaf6f3', '#fff4d6', '#fdeef2']
const GAME_BGS = ['#fff4d6', '#eaf6f3', '#fdeef2']
const STORE_BGS = ['#fff4d6', '#eaf6f3', '#fdeef2', '#fdf3e3']

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

function formatCorto(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(date)
}

function useCountdown(fechaEvento?: string, horaEvento?: string) {
  const [parts, setParts] = useState<{ dias: number; horas: number; min: number } | null>(null)

  useEffect(() => {
    if (!fechaEvento) return
    const target = new Date(`${fechaEvento}T${horaEvento || '00:00'}`)
    if (Number.isNaN(target.getTime())) return

    function tick() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setParts({ dias: 0, horas: 0, min: 0 })
        return
      }
      const dias = Math.floor(diff / 86_400_000)
      const horas = Math.floor((diff % 86_400_000) / 3_600_000)
      const min = Math.floor((diff % 3_600_000) / 60_000)
      setParts({ dias, horas, min })
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [fechaEvento, horaEvento])

  return parts
}

function SectionHeader({ title, accent }: { title: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ ...displayFont, fontWeight: 800, fontSize: 22 }}>{title}</span>
      <span
        style={{
          flex: 1,
          height: 3,
          borderRadius: 9999,
          background: `repeating-linear-gradient(90deg, ${accent} 0 7px, transparent 7px 14px)`,
        }}
      />
    </div>
  )
}

export function BabyShower({
  custom_data,
  eventId = null,
}: {
  custom_data: BabyShowerData
  fotos?: string[]
  eventId?: string | null
}) {
  const d = custom_data
  const tema = TEMAS[d.tema ?? 'neutro']
  const countdown = useCountdown(d.fecha_evento, d.hora_evento)
  const mapaUrl = d.lugar_ubicacion ? buildDirectionsUrl(d.lugar_ubicacion) : null

  return (
    <div className={`${display.variable} ${body.variable}`} style={{ ...bodyFont, background: PAPER, color: INK }}>
      <style>{`
        @keyframes bs-float{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-9px) rotate(-3deg)}}
        @keyframes bs-float2{0%,100%{transform:translateY(0) rotate(4deg)}50%{transform:translateY(-11px) rotate(4deg)}}
        @keyframes bs-wiggle{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
        @keyframes bs-pop{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}
        @media (prefers-reduced-motion: reduce) {
          [data-bs-anim] { animation: none !important; }
        }
      `}</style>

      {/* PORTADA */}
      <section style={{ position: 'relative', padding: '52px 26px 76px', background: tema.heroBg, overflow: 'hidden' }}>
        <span
          data-bs-anim
          style={{ position: 'absolute', top: -46, right: -46, width: 170, height: 170, borderRadius: 9999, background: tema.blobA }}
        />
        <span
          data-bs-anim
          style={{ position: 'absolute', bottom: 34, left: -56, width: 130, height: 130, borderRadius: 9999, background: tema.blobB }}
        />
        <span
          data-bs-anim
          style={{
            position: 'absolute',
            top: 120,
            left: 22,
            width: 14,
            height: 14,
            borderRadius: 9999,
            background: tema.dot,
            animation: 'bs-float 5s ease-in-out infinite',
          }}
        />
        <span
          data-bs-anim
          style={{
            position: 'absolute',
            top: 74,
            right: 56,
            width: 9,
            height: 9,
            borderRadius: 9999,
            background: tema.dot,
            animation: 'bs-float2 6.5s ease-in-out infinite',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <span
            data-bs-anim
            style={{
              ...displayFont,
              background: PAPER,
              border: `2px solid ${INK}`,
              borderRadius: 9999,
              padding: '7px 16px',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              boxShadow: `3px 3px 0 ${INK}`,
              animation: 'bs-wiggle 4s ease-in-out infinite',
            }}
          >
            Baby shower
          </span>
          <h1
            style={{
              ...displayFont,
              margin: 0,
              fontWeight: 800,
              fontSize: 56,
              lineHeight: '56px',
              letterSpacing: '-.02em',
              color: INK,
              textWrap: 'balance',
            }}
          >
            {d.nombre_bebe}
          </h1>
          {d.tagline && (
            <p style={{ ...bodyFont, margin: 0, fontStyle: 'italic', fontSize: 17, lineHeight: '25px', color: INK_SOFT, maxWidth: 250, textWrap: 'pretty' }}>
              {d.tagline}
            </p>
          )}
          {d.fecha_evento && (
            <div
              style={{
                display: 'flex',
                marginTop: 6,
                background: PAPER,
                border: `2px solid ${INK}`,
                borderRadius: 16,
                boxShadow: `4px 4px 0 ${INK}`,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 18px', textAlign: 'center', borderRight: `2px solid ${INK}` }}>
                <div style={{ ...displayFont, fontWeight: 800, fontSize: 24, lineHeight: 1 }}>
                  {new Date(`${d.fecha_evento}T00:00:00`).getDate()}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: INK_FAINT }}>
                  {new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(new Date(`${d.fecha_evento}T00:00:00`))}
                </div>
              </div>
              {d.hora_evento && (
                <div style={{ padding: '12px 18px', textAlign: 'center' }}>
                  <div style={{ ...displayFont, fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{d.hora_evento}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: INK_FAINT }}>
                    Hrs
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* DIVISOR FESTONEADO */}
      <div style={{ height: 26, background: tema.heroBg, position: 'relative', marginTop: -1 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: PAPER,
            WebkitMaskImage: 'radial-gradient(circle 15px at 15px 0, transparent 0 15px, #000 15px)',
            maskImage: 'radial-gradient(circle 15px at 15px 0, transparent 0 15px, #000 15px)',
            WebkitMaskSize: '30px 30px',
            maskSize: '30px 30px',
            WebkitMaskRepeat: 'repeat-x',
            maskRepeat: 'repeat-x',
          }}
        />
      </div>

      {/* DEDICATORIA */}
      <section style={{ padding: '42px 26px', textAlign: 'center' }}>
        <span style={{ ...displayFont, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: tema.accent }}>
          De parte de
        </span>
        <div style={{ ...displayFont, marginTop: 10, fontWeight: 700, fontSize: 26, lineHeight: '32px' }}>{d.padres}</div>
        {d.dedicatoria && (
          <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: '26px', color: INK_SOFT, textWrap: 'pretty' }}>{d.dedicatoria}</p>
        )}
      </section>

      {/* CUENTA REGRESIVA */}
      {countdown && (
        <section style={{ padding: '0 26px 42px' }}>
          <div
            style={{
              background: tema.accent,
              border: `2px solid ${INK}`,
              borderRadius: 22,
              boxShadow: `5px 5px 0 ${INK}`,
              padding: '26px 22px',
              textAlign: 'center',
              color: PAPER,
            }}
          >
            <span style={{ ...displayFont, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.85 }}>
              Ya casi llega
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14 }}>
              {[
                { n: countdown.dias, l: 'Días' },
                { n: countdown.horas, l: 'Hrs' },
                { n: countdown.min, l: 'Min' },
              ].map((c) => (
                <div key={c.l} style={{ flex: 1, background: PAPER, border: `2px solid ${INK}`, borderRadius: 14, padding: '12px 6px', color: INK }}>
                  <div style={{ ...displayFont, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{c.n}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: INK_FAINT, marginTop: 3 }}>
                    {c.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DONDE NOS VEMOS */}
      <section style={{ padding: '0 26px 42px' }}>
        <SectionHeader title="Dónde nos vemos" accent={tema.accent} />
        <div style={{ background: PAPER, border: `2px solid ${INK}`, borderRadius: 22, overflow: 'hidden', boxShadow: `5px 5px 0 ${INK}` }}>
          <MapaUbicacion
            ubicacion={d.lugar_ubicacion}
            className="h-[170px] w-full border-b-2 border-[#2e2a26]"
          />
          {!d.lugar_ubicacion?.lat && (
            <div
              style={{
                height: 170,
                background: 'repeating-linear-gradient(135deg, #f3efe4 0 9px, #e9e3d5 9px 18px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: `2px solid ${INK}`,
              }}
            >
              <span style={{ ...bodyFont, fontWeight: 700, fontSize: 10, letterSpacing: '.1em', color: INK_FAINT }}>MAPA DEL LUGAR</span>
            </div>
          )}
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ ...displayFont, fontWeight: 700, fontSize: 20, lineHeight: '26px' }}>{d.lugar_ubicacion?.lugar}</div>
            <div style={{ fontSize: 14, color: INK_SOFT, marginTop: 2 }}>{d.lugar_ubicacion?.direccion}</div>
            {mapaUrl && (
              <a
                href={mapaUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...displayFont,
                  marginTop: 14,
                  width: '100%',
                  border: `2px solid ${INK}`,
                  cursor: 'pointer',
                  background: YELLOW,
                  color: INK,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: 13,
                  borderRadius: 12,
                  boxShadow: `3px 3px 0 ${INK}`,
                  textAlign: 'center',
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                Abrir en mapas
              </a>
            )}
          </div>
        </div>
      </section>

      {/* EL PLAN DEL DIA */}
      {d.plan && d.plan.length > 0 && (
        <section style={{ padding: '0 26px 42px' }}>
          <SectionHeader title="El plan del día" accent={tema.accent} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {d.plan.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  background: PLAN_BGS[i % PLAN_BGS.length],
                  border: `2px solid ${INK}`,
                  borderRadius: 18,
                  padding: '14px 16px',
                }}
              >
                <span style={{ ...displayFont, flex: 'none', width: 52, fontWeight: 800, fontSize: 15, color: INK }}>{p.hora}</span>
                <span style={{ flex: 'none', width: 2, height: 26, borderRadius: 9999, background: 'rgba(46,42,38,.25)' }} />
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: '22px' }}>{p.titulo}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* JUGUEMOS */}
      {d.juegos && d.juegos.length > 0 && (
        <section style={{ padding: '0 0 42px' }}>
          <div style={{ padding: '0 26px' }}>
            <SectionHeader title="Juguemos" accent={tema.accent} />
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '6px 26px 10px' }}>
            {d.juegos.map((g, i) => (
              <div
                key={i}
                style={{
                  flex: 'none',
                  width: 190,
                  background: GAME_BGS[i % GAME_BGS.length],
                  border: `2px solid ${INK}`,
                  borderRadius: 20,
                  boxShadow: `4px 4px 0 ${INK}`,
                  padding: '20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    ...displayFont,
                    alignSelf: 'flex-start',
                    background: PAPER,
                    border: `2px solid ${INK}`,
                    borderRadius: 9999,
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ ...displayFont, fontWeight: 700, fontSize: 19, lineHeight: '23px' }}>{g.titulo}</span>
                {g.descripcion && (
                  <span style={{ fontSize: 14, lineHeight: '20px', color: INK_SOFT, textWrap: 'pretty' }}>{g.descripcion}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MESA DE REGALOS */}
      {d.tiendas && d.tiendas.length > 0 && (
        <section style={{ padding: '0 26px 42px' }}>
          <div
            style={{
              background: PAPER,
              border: `2px dashed ${INK}`,
              borderRadius: 22,
              padding: '24px 22px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <span style={{ ...displayFont, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: tema.accent }}>
              Mesa de regalos
            </span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: '23px', color: INK_SOFT, textWrap: 'pretty' }}>
              Lo más importante es que vengas. Si quieres traer algo, aquí están nuestras listas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 2 }}>
              {d.tiendas.map((s, i) => (
                <a
                  key={i}
                  href={s.url || undefined}
                  target={s.url ? '_blank' : undefined}
                  rel={s.url ? 'noreferrer' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: STORE_BGS[i % STORE_BGS.length],
                    border: `2px solid ${INK}`,
                    borderRadius: 14,
                    padding: '14px 16px',
                    textDecoration: 'none',
                    color: INK,
                    cursor: s.url ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ ...displayFont, fontWeight: 700, fontSize: 17 }}>{s.nombre}</div>
                    {s.detalle && <div style={{ fontSize: 12, color: INK_SOFT }}>{s.detalle}</div>}
                  </div>
                  {s.url && <span style={{ ...displayFont, fontWeight: 700, fontSize: 12, letterSpacing: '.08em' }}>ABRIR</span>}
                </a>
              ))}
            </div>
            {d.talla_sugerida && (
              <div style={{ marginTop: 6, paddingTop: 14, borderTop: '2px dashed rgba(46,42,38,.2)', fontSize: 13, color: INK_FAINT }}>
                Talla sugerida de ropa: {d.talla_sugerida}
              </div>
            )}
          </div>
        </section>
      )}

      {/* RSVP */}
      <section style={{ position: 'relative', padding: '44px 26px 54px', background: tema.heroBg, overflow: 'hidden' }}>
        <span
          data-bs-anim
          style={{ position: 'absolute', top: -40, left: -40, width: 140, height: 140, borderRadius: 9999, background: tema.blobA }}
        />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <span style={{ ...displayFont, fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: tema.accent }}>
            Confirma tu lugar
          </span>

          <BabyShowerRsvp eventId={eventId} accent={tema.accent} fechaLimite={formatCorto(d.fecha_limite_rsvp)} />

          <div
            style={{
              marginTop: 30,
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              ...displayFont,
              fontWeight: 700,
              fontSize: 15,
              color: 'rgba(46,42,38,.4)',
            }}
          >
            <a href={SELLO_BADGE_URL} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              {SELLO_BADGE_TEXT}
            </a>
            <span style={{ width: 5, height: 5, borderRadius: 9999, background: tema.accent, marginLeft: 3 }} />
          </div>
        </div>
      </section>
    </div>
  )
}
