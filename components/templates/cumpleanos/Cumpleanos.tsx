'use client'

import { useEffect, useState } from 'react'
import { Instrument_Serif, Archivo } from 'next/font/google'
import { TemplatePhoto } from '../shared/TemplatePhoto'
import { CumpleanosRsvp } from './CumpleanosRsvp'
import { CumpleanosMensaje } from './CumpleanosMensaje'
import { MapaUbicacion } from '../shared/MapaUbicacion'
import type { CumpleanosData, CumpleanosTema } from './cumpleanos.types'
import { buildDirectionsUrl } from '@/lib/maps/urls'
import { SELLO_BADGE_TEXT, SELLO_BADGE_URL } from '@/lib/marketing/sello-badge'

const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-tpl-serif' })
const sans = Archivo({ weight: ['300', '400', '500', '600'], subsets: ['latin'], variable: '--font-tpl-sans' })

interface TemaTokens {
  accent: string
  paper: string
  soft: string
  ink: string
  inkMid: string
  inkSoft: string
  inkFaint: string
  hair: string
  hairStrong: string
  ph1: string
  ph2: string
  displayFamily: 'serif' | 'sans'
  displayWeight: number
  quoteItalic: boolean
  nameSize: number
  nameTrack: string
  nameUppercase: boolean
  ageTrack: string
  rsvpTitulo: string
  guirnalda: boolean
  destellos: boolean
  confettiFloat: boolean
  ageGlow: boolean
  dark: boolean
}

/** Ver plantillas-handoff/design_handoff_cumpleanos/README.md sección "Temas" — no son solo colores, cambian tipografía, tracking, copy y qué ornamento se dibuja. */
const TEMAS: Record<CumpleanosTema, TemaTokens> = {
  mujer: {
    accent: '#8a3fa8', paper: '#fffdf8', soft: '#f9f0e4', ink: '#2a1f2e', inkMid: '#4d3d52', inkSoft: '#6f5f74', inkFaint: '#a396a8',
    hair: '#ebdfd0', hairStrong: '#d8c8b4', ph1: '#f8f1e6', ph2: '#f0e6d8',
    displayFamily: 'serif', displayWeight: 400, quoteItalic: true,
    nameSize: 40, nameTrack: '-.02em', nameUppercase: false, ageTrack: '-.05em',
    rsvpTitulo: '¿Vienes a brillar?',
    guirnalda: true, destellos: true, confettiFloat: false, ageGlow: true, dark: false,
  },
  hombre: {
    accent: '#c07a3e', paper: '#16171b', soft: '#1e2026', ink: '#f1efec', inkMid: '#cfcac4', inkSoft: '#9d968e', inkFaint: '#6b655e',
    hair: '#2e3138', hairStrong: '#41454e', ph1: '#1c1e23', ph2: '#22252b',
    displayFamily: 'sans', displayWeight: 600, quoteItalic: false,
    nameSize: 34, nameTrack: '-.01em', nameUppercase: true, ageTrack: '-.04em',
    rsvpTitulo: '¿Caes?',
    guirnalda: false, destellos: false, confettiFloat: false, ageGlow: false, dark: true,
  },
  neutro: {
    accent: '#c2553a', paper: '#fdfaf4', soft: '#f4ede2', ink: '#241f1a', inkMid: '#4a4139', inkSoft: '#6e6459', inkFaint: '#a39a8e',
    hair: '#e8e0d3', hairStrong: '#d3c8b8', ph1: '#f6f0e6', ph2: '#ede5d8',
    displayFamily: 'serif', displayWeight: 400, quoteItalic: true,
    nameSize: 38, nameTrack: '-.02em', nameUppercase: false, ageTrack: '-.05em',
    rsvpTitulo: '¿Nos acompañas?',
    guirnalda: false, destellos: false, confettiFloat: true, ageGlow: false, dark: false,
  },
}

const CONFETTI_COLORS = ['#f0a512', '#8a3fa8', '#1e5fd0', '#f07ab0', '#1f8a5a', '#e0714f', '#d9a13b', '#7b6bd6', '#f4d35e', '#2ea3a3']
const SPARK_COLORS = ['#ffffff', '#f0d8a0', '#dcb0f5', '#ffe0ea']

const CONFETTI_COUNT: number = 46
const CONFETTI_PIECES = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const t = CONFETTI_COUNT === 1 ? 0 : i / (CONFETTI_COUNT - 1)
  // Abanico hacia arriba (−90° = recto arriba), con jitter determinístico para
  // que no queden en líneas perfectas.
  const jitter = ((i * 37) % 15) - 7
  const angleDeg = -157 + 134 * t + jitter
  const rad = (angleDeg * Math.PI) / 180
  const power = 150 + ((i * 53) % 135) // alcance del estallido, 150–285
  const peakX = Math.cos(rad) * power
  const peakY = Math.sin(rad) * power // negativo = arriba
  // La caída parte del apex: peakY es negativo, sumarle fallY lo trae de vuelta
  // hacia abajo con algo de deriva lateral (como una cinta que pierde impulso).
  const fallY = 150 + ((i * 41) % 160)
  const driftX = Math.round(peakX * 0.45 + (((i * 29) % 76) - 38))
  const shape = i % 3 // 0 cinta, 1 disco, 2 barra
  return {
    key: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape,
    size: 7 + ((i * 7) % 6), // 7–12px
    peakX: Math.round(peakX),
    peakY: Math.round(peakY),
    finalX: Math.round(peakX + driftX),
    finalY: Math.round(peakY + fallY),
    travelDur: 2.9 + ((i * 13) % 22) / 10, // 2.9–5.0s
    flutterDur: 0.5 + ((i * 11) % 10) / 10, // 0.5–1.4s por vuelta
    delay: ((i * 9) % 20) / 100, // 0–.19s escalonado
    tiltY: 0.25 + ((i * 17) % 7) / 10, // eje de volteo variado
  }
})

const SPARK_COUNT = 26
const SPARK_PIECES = Array.from({ length: SPARK_COUNT }, (_, i) => ({
  key: i,
  left: (i * 41) % 100,
  top: (i * 67) % 100,
  size: 4 + (i % 3) * 2,
  color: SPARK_COLORS[i % SPARK_COLORS.length],
  duration: 3.2 + ((i * 11) % 26) / 10,
  delay: ((i * 5) % 20) / 10,
}))

const SPARKLE_CLIP = 'polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)'

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

function useCountdown(fechaEvento?: string) {
  const [parts, setParts] = useState<{ dias: number; horas: number; min: number; seg: number } | null>(null)

  useEffect(() => {
    if (!fechaEvento) return
    const target = new Date(`${fechaEvento}T00:00:00`)
    if (Number.isNaN(target.getTime())) return

    function tick() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setParts({ dias: 0, horas: 0, min: 0, seg: 0 })
        return
      }
      setParts({
        dias: Math.floor(diff / 86_400_000),
        horas: Math.floor((diff % 86_400_000) / 3_600_000),
        min: Math.floor((diff % 3_600_000) / 60_000),
        seg: Math.floor((diff % 60_000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [fechaEvento])

  return parts
}

function Eyebrow({ children, color, tracking = '.26em' }: { children: React.ReactNode; color: string; tracking?: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-tpl-sans)',
        fontSize: 10,
        letterSpacing: tracking,
        paddingLeft: tracking,
        textTransform: 'uppercase',
        color,
      }}
    >
      {children}
    </span>
  )
}

function Sparkle({ size, color, style }: { size: number; color: string; style?: React.CSSProperties }) {
  return (
    <span
      data-cp-spark
      style={{
        position: 'absolute',
        width: size,
        height: size,
        background: color,
        clipPath: SPARKLE_CLIP,
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

export function Cumpleanos({
  custom_data,
  fotos = [],
  eventId = null,
}: {
  custom_data: CumpleanosData
  fotos?: string[]
  eventId?: string | null
}) {
  const d = custom_data
  const t = TEMAS[d.tema ?? 'mujer']
  const countdown = useCountdown(d.fecha_evento)
  const lugares = d.lugares_por_invitacion && d.lugares_por_invitacion > 0 ? d.lugares_por_invitacion : 2
  const mapaUrl = d.lugar_ubicacion ? buildDirectionsUrl(d.lugar_ubicacion) : null
  const primerNombre = d.nombre_festejado?.trim().split(' ')[0]

  const displayFont: React.CSSProperties = {
    fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)',
    fontWeight: t.displayWeight,
  }
  const quoteFont: React.CSSProperties = {
    fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)',
    fontStyle: t.quoteItalic ? 'italic' : 'normal',
    fontWeight: t.displayFamily === 'serif' ? 400 : 400,
  }

  return (
    <div
      className={`${serif.variable} ${sans.variable}`}
      style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, background: t.paper, color: t.ink, position: 'relative', overflow: 'hidden' }}
    >
      <style>{`
          @keyframes cp-in { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes cp-fade { from { opacity: 0; } to { opacity: 1; } }
          /* Trayectoria balística: estallido rápido (ease-out) hasta el apex,
             luego caída acelerada (ease-in), como gravedad real. El timing
             cambia por segmento con animation-timing-function dentro del keyframe. */
          @keyframes cp-conf-travel {
            0%   { transform: translate3d(0, 0, 0); opacity: 0; animation-timing-function: cubic-bezier(.11,.85,.28,1); }
            7%   { opacity: 1; }
            38%  { transform: translate3d(var(--peak-x), var(--peak-y), 0); animation-timing-function: cubic-bezier(.5,.02,.72,.5); }
            80%  { opacity: 1; }
            100% { transform: translate3d(var(--final-x), var(--final-y), 0); opacity: 0; }
          }
          /* Volteo continuo de la pieza: gira sobre un eje inclinado y "adelgaza"
             a mitad de vuelta (scaleY .82) para leerse de canto, como una cinta
             de papel cayendo. Corre en paralelo a la trayectoria (elemento hijo). */
          @keyframes cp-conf-flutter {
            0%   { transform: rotate3d(1, var(--ty), .12, 0deg) scaleY(1); }
            50%  { transform: rotate3d(1, var(--ty), .12, 180deg) scaleY(.82); }
            100% { transform: rotate3d(1, var(--ty), .12, 360deg) scaleY(1); }
          }
          @keyframes cp-spark {
            0%, 100% { transform: scale(.5); opacity: .15; }
            50% { transform: scale(1); opacity: .9; }
          }
          @keyframes cp-gem-sh {
            0%, 100% { transform: translateX(-140%) rotate(20deg); opacity: 0; }
            45%, 55% { opacity: .5; }
            50% { transform: translateX(140%) rotate(20deg); opacity: .6; }
          }
          @keyframes cp-conf-fl {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(12deg); }
          }
          [data-cp-confetti] {
            animation: cp-conf-travel var(--dur) linear var(--delay) both;
          }
          [data-cp-flutter] {
            animation: cp-conf-flutter var(--fdur) linear var(--delay) infinite;
          }
          [data-cp-spark] { animation: cp-spark 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            [data-cp-anim] { animation: cp-fade .01s ease-out both !important; }
            [data-cp-confetti], [data-cp-flutter], [data-cp-spark], [data-cp-gem], [data-cp-float] { animation: none !important; opacity: 0 !important; }
          }
        `}</style>

      {/* GUIRNALDA SUPERIOR (solo mujer) */}
      {t.guirnalda && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '13px 0 12px',
            background: 'radial-gradient(120% 140% at 50% 0, #fffefb 0 42%, #f7ecdd 100%)',
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 15,
                height: 15,
                borderRadius: 9999,
                background: 'radial-gradient(circle at 35% 30%, #fffefb, #e9d4ae)',
                boxShadow: '0 1px 2px rgba(0,0,0,.12)',
              }}
            />
          ))}
        </div>
      )}

      {/* HERO */}
      <section
        data-cp-anim
        style={{ position: 'relative', zIndex: 2, padding: '54px 30px 44px', textAlign: 'center', overflow: 'hidden', animation: 'cp-in 1s ease-out both' }}
      >
        {/* CONFETI DE ENTRADA — acotado al hero (lo que se ve al abrir la
              invitación), no a toda la página: en un scroll largo, "toda la
              tarjeta" del prototipo (una vista de 390×844) sería invisible si
              se ancla a la altura completa del documento. */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', perspective: 620 }}>
          {CONFETTI_PIECES.map((p) => {
            const w = p.shape === 0 ? Math.round(p.size * 0.55) : p.shape === 2 ? Math.round(p.size * 1.5) : p.size
            const h = p.shape === 0 ? Math.round(p.size * 1.5) : p.shape === 2 ? Math.round(p.size * 0.5) : p.size
            return (
              <span
                key={p.key}
                data-cp-confetti
                style={
                  {
                    position: 'absolute',
                    left: '50%',
                    bottom: 44,
                    '--peak-x': `${p.peakX}px`,
                    '--peak-y': `${p.peakY}px`,
                    '--final-x': `${p.finalX}px`,
                    '--final-y': `${p.finalY}px`,
                    '--dur': `${p.travelDur}s`,
                    '--delay': `${p.delay}s`,
                  } as React.CSSProperties
                }
              >
                <span
                  data-cp-flutter
                  style={
                    {
                      display: 'block',
                      width: w,
                      height: h,
                      borderRadius: p.shape === 1 ? 9999 : 1.5,
                      // Degradado sutil: el borde más claro simula el reflejo
                      // del papel al voltearse, refuerza la ilusión de 3D.
                      background: `linear-gradient(135deg, ${p.color} 0%, ${p.color} 55%, rgba(255,255,255,.55) 130%)`,
                      '--ty': p.tiltY,
                      '--fdur': `${p.flutterDur}s`,
                      '--delay': `${p.delay}s`,
                    } as React.CSSProperties
                  }
                />
              </span>
            )
          })}
        </div>

        {/* CHISPAS DE FONDO (solo mujer) — mismo motivo, acotadas al hero. */}
        {t.destellos && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            {SPARK_PIECES.map((s) => (
              <Sparkle
                key={s.key}
                size={s.size}
                color={s.color}
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  animation: `cp-spark ${s.duration}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {t.dark && (
          <>
            <span style={{ position: 'absolute', top: 0, left: 30, right: 30, height: 1, background: t.hair }} />
            <span style={{ position: 'absolute', bottom: 0, left: 30, right: 30, height: 1, background: t.hair }} />
          </>
        )}
        {t.destellos && (
          <>
            <Sparkle size={10} color="#f0d8a0" style={{ top: 18, left: 40, animation: 'cp-spark 3.6s ease-in-out .4s infinite' }} />
            <Sparkle size={8} color={t.accent} style={{ top: 30, right: 46, animation: 'cp-spark 4.4s ease-in-out 1.1s infinite' }} />
          </>
        )}
        {t.confettiFloat && (
          <>
            <span data-cp-float style={{ position: 'absolute', top: 14, left: 36, width: 16, height: 6, borderRadius: 9999, background: t.accent, animation: 'cp-conf-fl 7s ease-in-out infinite' }} />
            <span data-cp-float style={{ position: 'absolute', top: 46, right: 34, width: 9, height: 9, borderRadius: 9999, background: '#f0a512', animation: 'cp-conf-fl 8.2s ease-in-out .6s infinite' }} />
            <span data-cp-float style={{ position: 'absolute', top: 8, right: 70, width: 5, height: 16, borderRadius: 2, background: '#2ea3a3', animation: 'cp-conf-fl 6.5s ease-in-out .3s infinite' }} />
            <span data-cp-float style={{ position: 'absolute', bottom: 20, left: 60, width: 5, height: 16, borderRadius: 2, background: '#7b6bd6', animation: 'cp-conf-fl 9s ease-in-out .9s infinite' }} />
          </>
        )}

        <Eyebrow tracking=".36em" color={t.accent}>Cumple años</Eyebrow>

        <div style={{ position: 'relative', marginTop: 8, overflow: 'hidden' }}>
          <span style={{ fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)', fontWeight: t.displayWeight, fontSize: 104, lineHeight: 0.9, letterSpacing: t.ageTrack, color: t.accent }}>
            {d.edad}
          </span>
          {t.ageGlow && (
            <span
              data-cp-gem
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,.75) 50%, transparent 60%)',
                animation: 'cp-gem-sh 5.5s ease-in-out infinite',
              }}
            />
          )}
        </div>

        <h1
          style={{
            fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)',
            fontWeight: t.displayWeight,
            fontSize: t.nameSize,
            letterSpacing: t.nameTrack,
            textTransform: t.nameUppercase ? 'uppercase' : 'none',
            textWrap: 'balance',
            margin: '10px 0 0',
            color: t.ink,
          }}
        >
          {d.nombre_festejado}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, marginTop: 20 }}>
          <span style={{ width: 24, height: 1, background: t.hair }} />
          <span style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: t.inkSoft }}>
            {formatLargo(d.fecha_evento)}
          </span>
          <span style={{ width: 24, height: 1, background: t.hair }} />
        </div>
      </section>

      {/* MENSAJE / CITA */}
      {d.mensaje && (
        <section style={{ position: 'relative', zIndex: 2, padding: '0 34px 44px', textAlign: 'center' }}>
          <p style={{ ...quoteFont, fontSize: 22, lineHeight: '33px', color: t.inkMid, textWrap: 'pretty', margin: 0 }}>{d.mensaje}</p>
        </section>
      )}

      {/* CUENTA REGRESIVA */}
      {countdown && (
        <section style={{ position: 'relative', zIndex: 2, padding: '0 30px 44px' }}>
          <div style={{ background: t.soft, padding: '26px 20px', textAlign: 'center' }}>
            <Eyebrow color={t.accent}>Faltan</Eyebrow>
            <div style={{ display: 'flex', marginTop: 16 }}>
              {[
                { n: countdown.dias, l: 'Días' },
                { n: String(countdown.horas).padStart(2, '0'), l: 'Hrs' },
                { n: String(countdown.min).padStart(2, '0'), l: 'Min' },
                { n: String(countdown.seg).padStart(2, '0'), l: 'Seg' },
              ].map((c, i) => (
                <div key={c.l} style={{ flex: 1, padding: '0 4px', borderRight: i === 3 ? '1px solid transparent' : `1px solid ${t.hair}` }}>
                  <div style={{ fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)', fontWeight: t.displayWeight, fontSize: 32, color: t.ink }}>{c.n}</div>
                  <div style={{ fontFamily: 'var(--font-tpl-sans)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: t.inkSoft, marginTop: 6 }}>{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DONDE */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 30px 44px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Eyebrow color={t.accent}>Dónde</Eyebrow>
        <span style={{ fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)', fontWeight: t.displayWeight, fontSize: 28, lineHeight: '35px' }}>
          {d.lugar_ubicacion?.lugar}
        </span>
        <span style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, fontSize: 13, lineHeight: '20px', color: t.inkSoft }}>
          {d.lugar_ubicacion?.direccion}
        </span>
        {d.hora && <span style={{ ...quoteFont, fontSize: 19, color: t.accent }}>{d.hora}</span>}
        <MapaUbicacion ubicacion={d.lugar_ubicacion} className="mx-auto mt-2 h-36 w-full max-w-sm overflow-hidden" />
        {mapaUrl && (
          <a
            href={mapaUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: 'var(--font-tpl-sans)',
              alignSelf: 'center',
              marginTop: 8,
              fontSize: 10,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: t.accent,
              borderBottom: `1px solid ${t.accent}`,
              paddingBottom: 4,
              textDecoration: 'none',
            }}
          >
            Ver mapa
          </a>
        )}
      </section>

      {/* LA NOCHE */}
      {d.momentos && d.momentos.length > 0 && (
        <section style={{ position: 'relative', zIndex: 2, padding: '0 30px 44px' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <Eyebrow color={t.accent}>La noche</Eyebrow>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {d.momentos.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '14px 0', borderBottom: `1px solid ${t.hair}` }}>
                <span style={{ ...quoteFont, flex: 'none', width: 52, fontSize: 15, color: t.accent }}>{m.hora}</span>
                <span style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, flex: 1, fontSize: 15, letterSpacing: '.02em' }}>{m.titulo}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VESTIMENTA */}
      {d.dresscode && (
        <section style={{ position: 'relative', zIndex: 2, padding: '0 30px 44px' }}>
          <div style={{ border: `1px solid ${t.hair}`, padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Eyebrow color={t.accent}>Código de vestimenta</Eyebrow>
            <span style={{ fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)', fontWeight: t.displayWeight, fontSize: 24, lineHeight: '31px' }}>
              {d.dresscode}
            </span>
            {d.dresscode_nota && (
              <span style={{ fontFamily: 'var(--font-tpl-sans)', fontWeight: 300, fontSize: 14, lineHeight: '21px', color: t.inkMid }}>{d.dresscode_nota}</span>
            )}
          </div>
        </section>
      )}

      {/* GALERIA */}
      {fotos.length > 0 && (
        <section style={{ position: 'relative', zIndex: 2, padding: '0 0 44px' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <Eyebrow color={t.accent}>Galería</Eyebrow>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 30px 6px' }}>
            {fotos.map((src, i) => (
              <div key={i} style={{ flex: 'none', width: 164, height: 218, border: `1px solid ${t.hair}`, position: 'relative' }}>
                <TemplatePhoto src={src} alt="" sizes="164px" className="absolute inset-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MENSAJE DE CUMPLEAÑOS */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 30px 44px' }}>
        <div style={{ background: t.soft, padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Eyebrow color={t.accent}>Déjale unas líneas</Eyebrow>
            <div style={{ fontFamily: t.displayFamily === 'serif' ? 'var(--font-tpl-serif)' : 'var(--font-tpl-sans)', fontWeight: t.displayWeight, fontSize: 23, lineHeight: '30px', marginTop: 6 }}>
              Mensaje de cumpleaños
            </div>
          </div>
          <CumpleanosMensaje
            eventId={eventId}
            accent={t.accent}
            paper={t.paper}
            ink={t.ink}
            inkMid={t.inkMid}
            inkSoft={t.inkSoft}
            hairStrong={t.hairStrong}
            displayFont={displayFont}
            quoteFont={quoteFont}
            primerNombre={primerNombre}
          />
        </div>
      </section>

      {/* RSVP */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 30px 52px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <Eyebrow color={t.accent}>Confirma tu asistencia</Eyebrow>
        </div>
        <CumpleanosRsvp
          eventId={eventId}
          accent={t.accent}
          paper={t.paper}
          ink={t.ink}
          inkSoft={t.inkSoft}
          hairStrong={t.hairStrong}
          displayFont={displayFont}
          rsvpTitulo={t.rsvpTitulo}
          edad={d.edad}
          lugares={lugares}
          fechaLimite={formatCorto(d.fecha_limite_rsvp)}
        />

        {/* FIRMA */}
        <div style={{ marginTop: 38, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
          <a href={SELLO_BADGE_URL} target="_blank" rel="noreferrer" style={{ ...quoteFont, fontSize: 15, color: t.inkFaint, textDecoration: 'none' }}>
            {SELLO_BADGE_TEXT}
          </a>
          <span style={{ width: 4, height: 4, borderRadius: 9999, background: t.accent, marginLeft: 3 }} />
        </div>
      </section>

      {/* GUIRNALDA FINAL (solo mujer) */}
      {t.guirnalda && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '13px 0 12px',
            background: 'radial-gradient(120% 140% at 50% 100%, #fffefb 0 42%, #f7ecdd 100%)',
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 15,
                height: 15,
                borderRadius: 9999,
                background: 'radial-gradient(circle at 35% 30%, #fffefb, #e9d4ae)',
                boxShadow: '0 1px 2px rgba(0,0,0,.12)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
