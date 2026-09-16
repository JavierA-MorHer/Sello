'use client'

import { useEffect, useState } from 'react'
import { Bodoni_Moda, Jost } from 'next/font/google'
import type { XvAnosData, XvAnosTema } from './xvanos.types'
import { XvAnosRsvp } from './XvAnosRsvp'
import { TemplatePhoto } from '../shared/TemplatePhoto'
import { MapaUbicacion } from '../shared/MapaUbicacion'
import { buildDirectionsUrl } from '@/lib/maps/urls'
import { SELLO_BADGE_TEXT, SELLO_BADGE_URL } from '@/lib/marketing/sello-badge'

const display = Bodoni_Moda({ weight: ['400', '500'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-tpl-display' })
const body = Jost({ weight: ['300', '400', '500'], subsets: ['latin'], variable: '--font-tpl-body' })

const IVORY = '#f7f1e8'
const LABEL_GRAY = '#9a90a0'
const BORDER = 'rgba(201,162,94,.22)'

const TEMAS: Record<XvAnosTema, { dark: string; gold: string }> = {
  noche: { dark: '#17121a', gold: '#c9a25e' },
  esmeralda: { dark: '#0f1a17', gold: '#c9a25e' },
  vino: { dark: '#1c1013', gold: '#d8a9a0' },
}

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

function formatLarga(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function formatCorta(iso?: string) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(date)
}

function useCountdown(fechaEvento?: string, horaEvento?: string) {
  const [parts, setParts] = useState<{ dias: number; horas: number; min: number; seg: number } | null>(null)

  useEffect(() => {
    if (!fechaEvento) return
    const target = new Date(`${fechaEvento}T${horaEvento || '00:00'}`)
    if (Number.isNaN(target.getTime())) return

    function tick() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setParts({ dias: 0, horas: 0, min: 0, seg: 0 })
        return
      }
      const dias = Math.floor(diff / 86_400_000)
      const horas = Math.floor((diff % 86_400_000) / 3_600_000)
      const min = Math.floor((diff % 3_600_000) / 60_000)
      const seg = Math.floor((diff % 60_000) / 1000)
      setParts({ dias, horas, min, seg })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [fechaEvento, horaEvento])

  return parts
}

function Eyebrow({ children, tracking = '.32em', color }: { children: React.ReactNode; tracking?: string; color: string }) {
  return (
    <span
      style={{
        ...bodyFont,
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

export function XvAnos({
  custom_data,
  fotos = [],
  eventId = null,
}: {
  custom_data: XvAnosData
  fotos?: string[]
  eventId?: string | null
}) {
  const d = custom_data
  const tema = TEMAS[d.tema ?? 'noche']
  const countdown = useCountdown(d.fecha_evento, undefined)
  const pases = d.pases_por_invitacion && d.pases_por_invitacion > 0 ? d.pases_por_invitacion : 4
  const retrato = fotos[0]
  const galeria = fotos.slice(1)
  const iglesiaMapaUrl = d.iglesia_ubicacion ? buildDirectionsUrl(d.iglesia_ubicacion) : null
  const recepcionMapaUrl = d.recepcion_ubicacion ? buildDirectionsUrl(d.recepcion_ubicacion) : null

  return (
    <div className={`${display.variable} ${body.variable}`} style={{ ...bodyFont, fontWeight: 300, background: tema.dark, color: IVORY }}>
      <style>{`
        @keyframes xv-in { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          [data-xv-anim] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* PORTADA */}
      <section style={{ position: 'relative', padding: '64px 30px 58px', textAlign: 'center', overflow: 'hidden', animation: 'xv-in 1s ease-out both' }} data-xv-anim>
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1,
            height: 44,
            background: `linear-gradient(${tema.gold}, transparent)`,
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: 106,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,162,94,.35), transparent)',
          }}
        />

        <Eyebrow tracking=".42em" color={tema.gold}>
          Mis quince años
        </Eyebrow>
        <div style={{ margin: '26px 0 22px' }}>
          <span style={{ ...displayFont, fontSize: 118, lineHeight: 0.86, letterSpacing: '-.04em', color: tema.gold }}>XV</span>
        </div>
        <p style={{ ...displayFont, fontStyle: 'italic', fontSize: 19, letterSpacing: '.05em', color: 'rgba(247,241,232,.6)', marginTop: 6 }}>
          {formatLarga(d.fecha_evento)}
        </p>
        <span style={{ display: 'block', width: 44, height: 1, background: 'rgba(201,162,94,.5)', margin: '22px auto' }} />
        <h1 style={{ ...displayFont, fontSize: 42, lineHeight: '47px', letterSpacing: '-.01em', textWrap: 'balance', margin: 0 }}>
          {d.nombre_festejada}
        </h1>
      </section>

      {/* RETRATO */}
      <div style={{ height: 300, overflow: 'hidden', borderTop: '1px solid rgba(201,162,94,.18)', borderBottom: '1px solid rgba(201,162,94,.18)', position: 'relative' }}>
        {retrato ? (
          <TemplatePhoto src={retrato} alt="" sizes="430px" className="absolute inset-0" />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'repeating-linear-gradient(135deg, #1c1620 0 10px, #221a26 10px 20px)',
            }}
          >
            <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.24em', color: LABEL_GRAY }}>RETRATO DE LA QUINCEAÑERA</span>
          </div>
        )}
      </div>

      {/* PRESENTACION */}
      <section style={{ padding: '52px 30px', textAlign: 'center' }}>
        <Eyebrow color={tema.gold}>Con la bendición de</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 22 }}>
          <div>
            <div style={{ ...bodyFont, fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: LABEL_GRAY, marginBottom: 7 }}>
              Mis padres
            </div>
            <div style={{ ...displayFont, fontSize: 19, lineHeight: '27px', color: IVORY }}>{d.padres}</div>
          </div>
          {d.padrinos && (
            <div>
              <div style={{ ...bodyFont, fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: LABEL_GRAY, marginBottom: 7 }}>
                Mis padrinos
              </div>
              <div style={{ ...displayFont, fontSize: 19, lineHeight: '27px', color: IVORY }}>{d.padrinos}</div>
            </div>
          )}
        </div>
      </section>

      {/* DEDICATORIA */}
      {d.dedicatoria && (
        <section style={{ padding: '0 30px 52px' }}>
          <div style={{ borderTop: '1px solid rgba(201,162,94,.18)', borderBottom: '1px solid rgba(201,162,94,.18)', padding: '38px 20px', textAlign: 'center' }}>
            <p style={{ ...displayFont, fontStyle: 'italic', fontSize: 21, lineHeight: '33px', color: 'rgba(247,241,232,.88)', textWrap: 'pretty', margin: 0 }}>
              {d.dedicatoria}
            </p>
          </div>
        </section>
      )}

      {/* CUENTA REGRESIVA */}
      {countdown && (
        <section style={{ padding: '0 30px 52px', textAlign: 'center' }}>
          <Eyebrow color={tema.gold}>Faltan</Eyebrow>
          <div style={{ display: 'flex', marginTop: 18 }}>
            {[
              { n: countdown.dias, l: 'Días' },
              { n: String(countdown.horas).padStart(2, '0'), l: 'Hrs' },
              { n: String(countdown.min).padStart(2, '0'), l: 'Min' },
              { n: String(countdown.seg).padStart(2, '0'), l: 'Seg' },
            ].map((c, i) => (
              <div
                key={c.l}
                style={{
                  flex: 1,
                  padding: '0 4px',
                  borderRight: i === 3 ? '1px solid transparent' : '1px solid rgba(201,162,94,.18)',
                }}
              >
                <div style={{ ...displayFont, fontSize: 36, lineHeight: 1, color: tema.gold }}>{c.n}</div>
                <div style={{ ...bodyFont, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: LABEL_GRAY, marginTop: 8 }}>
                  {c.l}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEDES */}
      <section style={{ padding: '0 30px 52px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ border: `1px solid ${BORDER}`, padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.26em', textTransform: 'uppercase', color: tema.gold }}>Misa de acción de gracias</span>
          <span style={{ ...displayFont, fontSize: 24, lineHeight: '31px', marginTop: 2 }}>{d.iglesia_ubicacion?.lugar}</span>
          <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '20px', color: 'rgba(247,241,232,.6)' }}>{d.iglesia_ubicacion?.direccion}</span>
          {d.iglesia_hora && (
            <span style={{ ...displayFont, fontStyle: 'italic', fontSize: 17, color: tema.gold, marginTop: 4 }}>{d.iglesia_hora}</span>
          )}
          <MapaUbicacion
            ubicacion={d.iglesia_ubicacion}
            className="mt-3 h-36 w-full overflow-hidden rounded"
          />
          {iglesiaMapaUrl && (
            <a
              href={iglesiaMapaUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                ...bodyFont,
                alignSelf: 'center',
                marginTop: 12,
                fontSize: 10,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: tema.gold,
                borderBottom: '1px solid rgba(201,162,94,.6)',
                paddingBottom: 4,
                textDecoration: 'none',
              }}
            >
              Cómo llegar
            </a>
          )}
        </div>
        <div style={{ border: `1px solid ${BORDER}`, padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.26em', textTransform: 'uppercase', color: tema.gold }}>Recepción</span>
          <span style={{ ...displayFont, fontSize: 24, lineHeight: '31px', marginTop: 2 }}>{d.recepcion_ubicacion?.lugar}</span>
          <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '20px', color: 'rgba(247,241,232,.6)' }}>{d.recepcion_ubicacion?.direccion}</span>
          {d.recepcion_hora && (
            <span style={{ ...displayFont, fontStyle: 'italic', fontSize: 17, color: tema.gold, marginTop: 4 }}>{d.recepcion_hora}</span>
          )}
          <MapaUbicacion
            ubicacion={d.recepcion_ubicacion}
            className="mt-3 h-36 w-full overflow-hidden rounded"
          />
          {recepcionMapaUrl && (
            <a
              href={recepcionMapaUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                ...bodyFont,
                alignSelf: 'center',
                marginTop: 12,
                fontSize: 10,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: tema.gold,
                borderBottom: '1px solid rgba(201,162,94,.6)',
                paddingBottom: 4,
                textDecoration: 'none',
              }}
            >
              Cómo llegar
            </a>
          )}
        </div>
      </section>

      {/* PROGRAMA */}
      {d.programa && d.programa.length > 0 && (
        <section style={{ padding: '0 30px 52px' }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <Eyebrow color={tema.gold}>La noche</Eyebrow>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {d.programa.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 18,
                  alignItems: 'baseline',
                  padding: '15px 0',
                  borderBottom: '1px solid rgba(201,162,94,.13)',
                }}
              >
                <span style={{ ...displayFont, fontStyle: 'italic', flex: 'none', width: 56, fontSize: 15, color: tema.gold }}>{p.hora}</span>
                <span style={{ ...bodyFont, fontWeight: 300, flex: 1, fontSize: 15, letterSpacing: '.02em' }}>{p.titulo}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VESTIMENTA */}
      {d.vestimenta && (
        <section style={{ padding: '0 30px 52px' }}>
          <div style={{ border: `1px solid ${BORDER}`, padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ ...bodyFont, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: tema.gold }}>Vestimenta</span>
            <span style={{ ...displayFont, fontSize: 22, lineHeight: '28px' }}>{d.vestimenta}</span>
            {d.vestimenta_nota && (
              <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '19px', color: 'rgba(247,241,232,.72)' }}>
                {d.vestimenta_nota}
              </span>
            )}
          </div>
        </section>
      )}

      {/* GALERIA */}
      {galeria.length > 0 && (
        <section style={{ padding: '0 0 52px' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <Eyebrow color={tema.gold}>Galería</Eyebrow>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 30px 6px' }}>
            {galeria.map((src, i) => (
              <div key={i} style={{ flex: 'none', width: 172, height: 230, border: `1px solid rgba(201,162,94,.18)`, position: 'relative' }}>
                <TemplatePhoto src={src} alt="" sizes="172px" className="absolute inset-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MESA DE REGALOS */}
      {d.tiendas && d.tiendas.length > 0 && (
        <section style={{ padding: '0 30px 52px', textAlign: 'center' }}>
          <div style={{ border: `1px solid ${BORDER}`, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.26em', textTransform: 'uppercase', color: tema.gold }}>Mesa de regalos</span>
            <p style={{ ...bodyFont, fontWeight: 300, fontSize: 14, lineHeight: '22px', color: 'rgba(247,241,232,.7)', textWrap: 'pretty', margin: 0 }}>
              Tu presencia es mi mejor regalo. Si quieres darme algo más, aquí están mis listas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 6 }}>
              {d.tiendas.map((t, i) => (
                <a
                  key={i}
                  href={t.url || undefined}
                  target={t.url ? '_blank' : undefined}
                  rel={t.url ? 'noreferrer' : undefined}
                  style={{
                    border: `1px solid rgba(201,162,94,.18)`,
                    padding: '15px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: IVORY,
                  }}
                >
                  <span style={{ ...displayFont, fontSize: 16 }}>{t.nombre}</span>
                  {t.url && (
                    <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: tema.gold }}>
                      Abrir
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      <section style={{ padding: '0 30px 60px', textAlign: 'center' }}>
        <div style={{ marginBottom: 22 }}>
          <Eyebrow color={tema.gold}>Confirma tu asistencia</Eyebrow>
        </div>
        <XvAnosRsvp eventId={eventId} gold={tema.gold} dark={tema.dark} pases={pases} fechaLimite={formatCorta(d.fecha_limite_rsvp)} />
      </section>

      {/* FIRMA */}
      <div
        style={{
          marginTop: -8,
          paddingBottom: 44,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          ...displayFont,
          fontSize: 14,
          color: 'rgba(247,241,232,.28)',
        }}
      >
        <a href={SELLO_BADGE_URL} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          {SELLO_BADGE_TEXT}
        </a>
        <span style={{ width: 4, height: 4, borderRadius: 9999, background: tema.gold, marginLeft: 3 }} />
      </div>
    </div>
  )
}
