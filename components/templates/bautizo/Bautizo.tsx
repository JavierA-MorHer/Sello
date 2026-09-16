import { Cormorant_Garamond, Karla } from 'next/font/google'
import { TemplatePhoto } from '../shared/TemplatePhoto'
import { BautizoRsvp } from './BautizoRsvp'
import { MapaUbicacion } from '../shared/MapaUbicacion'
import type { BautizoData, BautizoTema } from './bautizo.types'
import { buildDirectionsUrl } from '@/lib/maps/urls'
import { SELLO_BADGE_TEXT, SELLO_BADGE_URL } from '@/lib/marketing/sello-badge'

const display = Cormorant_Garamond({
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-tpl-display',
})
const body = Karla({ weight: ['300', '400', '500'], subsets: ['latin'], variable: '--font-tpl-body' })

const INK = '#2b3a42'
const INK_MED = '#3d5058'
const INK_SOFT = '#4d5f68'
const GRAY_TEXT = '#61737d'
const GRAY_LABEL = '#7d8f98'
const GRAY_PLACEHOLDER = '#8b9ba3'
const GRAY_SIGNATURE = '#9aa9b0'

/**
 * Ocho tokens por tema (ver plantillas-handoff/design_handoff_bautizo/README.md
 * sección "Temas") — accent es la versión oscura para texto/información,
 * tint la clara y exclusiva de los ornamentos decorativos del hero. No
 * mezclar: una revisión de accesibilidad descartó tint en texto pequeño.
 */
const TEMAS: Record<BautizoTema, {
  accent: string
  tint: string
  paper: string
  soft: string
  hair: string
  hairStrong: string
  ph1: string
  ph2: string
}> = {
  agua: { accent: '#3f6980', tint: '#7ea8bd', paper: '#f7f9fa', soft: '#e9f0f3', hair: '#dbe4e8', hairStrong: '#c3d2d8', ph1: '#eef3f5', ph2: '#e4ebee' },
  oliva: { accent: '#556349', tint: '#8a9a7b', paper: '#f8f9f5', soft: '#eef1e9', hair: '#e0e5da', hairStrong: '#c8d1bf', ph1: '#f0f3ec', ph2: '#e7ebe1' },
  arena: { accent: '#7a5b39', tint: '#c1a184', paper: '#fbf8f4', soft: '#f3ece4', hair: '#e7ded4', hairStrong: '#d4c5b5', ph1: '#f4efe8', ph2: '#ebe3d9' },
}

const displayFont = { fontFamily: 'var(--font-tpl-display)' }
const bodyFont = { fontFamily: 'var(--font-tpl-body)' }

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

function Eyebrow({ children, tracking = '.28em', color }: { children: React.ReactNode; tracking?: string; color: string }) {
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
  const t = TEMAS[d.tema ?? 'agua']
  const fotoArco = fotos[0]
  const galeria = fotos.slice(1)
  const iglesiaMapaUrl = d.iglesia_ubicacion ? buildDirectionsUrl(d.iglesia_ubicacion) : null
  const recepcionMapaUrl = d.recepcion_ubicacion ? buildDirectionsUrl(d.recepcion_ubicacion) : null
  const lugares = d.lugares_por_invitacion && d.lugares_por_invitacion > 0 ? d.lugares_por_invitacion : 4
  const ofrendas = d.padrinos_ofrenda ?? []

  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ ...bodyFont, fontWeight: 300, background: t.paper, color: INK }}
    >
      <style>{`
          @keyframes bt-in { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes bt-flame {
            0%, 100% { transform: translateY(0) scale(1); opacity: .9; }
            50% { transform: translateY(-2px) scale(1.08); opacity: 1; }
          }
          @keyframes bt-ripple {
            0% { transform: scale(.6); opacity: .55; }
            100% { transform: scale(1.9); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            [data-bt-anim] { animation: opacity-only .01s ease-out both !important; }
            [data-bt-flame], [data-bt-ripple] { animation: none !important; }
          }
          @keyframes opacity-only { from { opacity: 0; } to { opacity: 1; } }
        `}</style>

        {/* PORTADA */}
        <section
          data-bt-anim
          style={{ padding: '62px 32px 46px', textAlign: 'center', position: 'relative', overflow: 'hidden', animation: 'bt-in 1s ease-out both' }}
        >
          <span
            data-bt-flame
            style={{
              position: 'absolute',
              top: 26,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 5,
              height: 5,
              borderRadius: 9999,
              background: t.tint,
              animation: 'bt-flame 3.4s ease-in-out infinite',
            }}
          />
          <span
            data-bt-ripple
            style={{
              position: 'absolute',
              top: 16,
              left: '50%',
              marginLeft: -13,
              width: 26,
              height: 26,
              borderRadius: 9999,
              border: `1px solid ${t.tint}`,
              animation: 'bt-ripple 4.2s ease-out infinite',
            }}
          />

          <Eyebrow tracking=".4em" color={t.accent}>El bautizo de</Eyebrow>
          <h1 style={{ ...displayFont, fontWeight: 300, fontSize: 58, lineHeight: '60px', letterSpacing: '-.02em', textWrap: 'balance', margin: '18px 0 0' }}>
            {d.nombre_bebe}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 22 }}>
            <span style={{ width: 28, height: 1, background: t.hair }} />
            <span style={{ ...displayFont, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: GRAY_TEXT }}>
              {formatLargo(d.fecha_evento)}
            </span>
            <span style={{ width: 28, height: 1, background: t.hair }} />
          </div>
        </section>

        {/* FOTO EN ARCO */}
        <section style={{ padding: '0 32px 48px' }}>
          <div
            style={{
              position: 'relative',
              height: 330,
              borderRadius: '160px 160px 6px 6px',
              overflow: 'hidden',
              border: `1px solid ${t.hair}`,
            }}
          >
            {fotoArco ? (
              <TemplatePhoto src={fotoArco} alt="" sizes="430px" className="absolute inset-0" />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: 20,
                  background: `repeating-linear-gradient(135deg, ${t.ph1} 0 10px, ${t.ph2} 10px 20px)`,
                }}
              >
                <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.22em', color: GRAY_PLACEHOLDER }}>FOTO DEL BEBÉ</span>
              </div>
            )}
          </div>
        </section>

        {/* CITA BIBLICA */}
        {d.cita && (
          <section style={{ padding: '0 40px 48px', textAlign: 'center' }}>
            <p style={{ ...displayFont, fontStyle: 'italic', fontWeight: 300, fontSize: 24, lineHeight: '36px', color: INK_MED, textWrap: 'pretty', margin: 0 }}>
              {d.cita}
            </p>
            {d.cita_ref && (
              <p style={{ marginTop: 16 }}>
                <Eyebrow tracking=".24em" color={t.accent}>{d.cita_ref}</Eyebrow>
              </p>
            )}
          </section>
        )}

        {/* PRESENTACION */}
        <section style={{ padding: '0 32px 48px' }}>
          <div
            style={{
              borderTop: `1px solid ${t.hair}`,
              borderBottom: `1px solid ${t.hair}`,
              padding: '34px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 26,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ ...bodyFont, fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: GRAY_LABEL, marginBottom: 9 }}>
                Sus papás
              </div>
              <div style={{ ...displayFont, fontWeight: 400, fontSize: 22, lineHeight: '30px' }}>{d.papas}</div>
            </div>
            {d.padrinos_bautizo && (
              <div>
                <div style={{ ...bodyFont, fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: GRAY_LABEL, marginBottom: 9 }}>
                  Sus padrinos de bautizo
                </div>
                <div style={{ ...displayFont, fontWeight: 400, fontSize: 22, lineHeight: '30px' }}>{d.padrinos_bautizo}</div>
              </div>
            )}
          </div>
        </section>

        {/* PADRINOS DE OFRENDAS */}
        {ofrendas.length > 0 && (
          <section style={{ padding: '0 32px 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Eyebrow color={t.accent}>Nos acompañan</Eyebrow>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                background: t.hair,
                border: `1px solid ${t.hair}`,
              }}
            >
              {ofrendas.map((of, i) => (
                <div
                  key={i}
                  style={{
                    background: t.paper,
                    padding: '20px 14px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    gridColumn: i === ofrendas.length - 1 && ofrendas.length % 2 !== 0 ? 'span 2' : undefined,
                  }}
                >
                  <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: GRAY_LABEL }}>{of.rol}</span>
                  <span style={{ ...displayFont, fontWeight: 400, fontSize: 17, lineHeight: '23px' }}>{of.nombre}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MOMENTOS */}
        <section style={{ padding: '0 32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, textAlign: 'center' }}>
            <Eyebrow color={t.accent}>Ceremonia</Eyebrow>
            <span style={{ ...displayFont, fontWeight: 400, fontSize: 26, lineHeight: '33px', marginTop: 2 }}>{d.iglesia_ubicacion?.lugar}</span>
            <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '20px', color: GRAY_TEXT }}>{d.iglesia_ubicacion?.direccion}</span>
            {d.hora_misa && (
              <span style={{ ...displayFont, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: t.accent, marginTop: 3 }}>{d.hora_misa}</span>
            )}
            <MapaUbicacion ubicacion={d.iglesia_ubicacion} className="mx-auto mt-2 h-36 w-full max-w-sm overflow-hidden" />
            {iglesiaMapaUrl && (
              <a
                href={iglesiaMapaUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...bodyFont,
                  alignSelf: 'center',
                  marginTop: 10,
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
          </div>

          {d.recepcion_ubicacion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, textAlign: 'center' }}>
              <Eyebrow color={t.accent}>Comida</Eyebrow>
              <span style={{ ...displayFont, fontWeight: 400, fontSize: 26, lineHeight: '33px', marginTop: 2 }}>{d.recepcion_ubicacion.lugar}</span>
              <span style={{ ...bodyFont, fontWeight: 300, fontSize: 13, lineHeight: '20px', color: GRAY_TEXT }}>{d.recepcion_ubicacion.direccion}</span>
              {d.recepcion_hora && (
                <span style={{ ...displayFont, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: t.accent, marginTop: 3 }}>{d.recepcion_hora}</span>
              )}
              <MapaUbicacion ubicacion={d.recepcion_ubicacion} className="mx-auto mt-2 h-36 w-full max-w-sm overflow-hidden" />
              {recepcionMapaUrl && (
                <a
                  href={recepcionMapaUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...bodyFont,
                    alignSelf: 'center',
                    marginTop: 10,
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
            </div>
          )}
        </section>

        {/* UN DETALLE */}
        {d.detalle_nota && (
          <section style={{ padding: '0 32px 48px' }}>
            <div style={{ background: t.soft, padding: '30px 26px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Eyebrow color={t.accent}>Un detalle</Eyebrow>
              <span style={{ ...displayFont, fontWeight: 400, fontSize: 23, lineHeight: '30px' }}>
                {d.detalle_titulo || 'Vestir de blanco'}
              </span>
              <span style={{ ...bodyFont, fontWeight: 300, fontSize: 14, lineHeight: '22px', color: INK_SOFT, textWrap: 'pretty' }}>
                {d.detalle_nota}
              </span>
            </div>
          </section>
        )}

        {/* GALERIA */}
        {galeria.length > 0 && (
          <section style={{ padding: '0 0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Eyebrow color={t.accent}>Galería</Eyebrow>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 32px 6px' }}>
              {galeria.map((src, i) => (
                <div key={i} style={{ flex: 'none', width: 158, height: 210, border: `1px solid ${t.hair}`, position: 'relative' }}>
                  <TemplatePhoto src={src} alt="" sizes="158px" className="absolute inset-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MESA DE REGALOS */}
        {d.opciones && d.opciones.length > 0 && (
          <section style={{ padding: '0 32px 48px', textAlign: 'center' }}>
            <div style={{ border: `1px solid ${t.hair}`, padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Eyebrow color={t.accent}>Mesa de regalos</Eyebrow>
              <p style={{ ...bodyFont, fontWeight: 300, fontSize: 14, lineHeight: '22px', color: INK_SOFT, textWrap: 'pretty', margin: 0 }}>
                Con que vengas a acompañarnos es más que suficiente. Si quieres traer algo, aquí están nuestras listas.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 4 }}>
                {d.opciones.map((op, i) => (
                  <a
                    key={i}
                    href={op.url || undefined}
                    target={op.url ? '_blank' : undefined}
                    rel={op.url ? 'noreferrer' : undefined}
                    style={{
                      border: `1px solid ${t.hair}`,
                      padding: '15px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: INK,
                    }}
                  >
                    <span style={{ ...displayFont, fontWeight: 400, fontSize: 17 }}>{op.tienda}</span>
                    {op.url && (
                      <span style={{ ...bodyFont, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: t.accent }}>Abrir</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RSVP */}
        <section style={{ padding: '0 32px 56px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Eyebrow color={t.accent}>Confirma tu asistencia</Eyebrow>
          </div>
          <BautizoRsvp
            eventId={eventId}
            accent={t.accent}
            hair={t.hair}
            hairStrong={t.hairStrong}
            lugares={lugares}
            fechaLimite={formatCorto(d.fecha_limite_rsvp)}
            lugar={d.iglesia_ubicacion?.lugar}
            hora={d.hora_misa}
          />
        </section>

        {/* FIRMA */}
        <div style={{ marginTop: 40, paddingBottom: 40, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
          <a
            href={SELLO_BADGE_URL}
            target="_blank"
            rel="noreferrer"
            style={{ ...displayFont, fontSize: 15, color: GRAY_SIGNATURE, textDecoration: 'none' }}
          >
            {SELLO_BADGE_TEXT}
          </a>
        <span style={{ width: 4, height: 4, borderRadius: 9999, background: t.accent, marginLeft: 3 }} />
      </div>
    </div>
  )
}
