import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Aviso de privacidad (LFPDPPP).
 *
 * OJO — borrador redactado a partir de lo que el producto realmente hace
 * (Supabase, Stripe, Resend, Vercel, Google OAuth/Maps y el pixel de Meta).
 * NO está revisado por un abogado. Antes de cobrarle a clientes reales hay
 * que llenar RESPONSABLE (razón social y domicilio, que la ley exige de
 * forma expresa) y darle una pasada legal.
 *
 * Si se agrega o quita un tercero que trate datos, este archivo se actualiza
 * junto con el código — no después.
 */
const RESPONSABLE = {
  nombre: 'Sello',
  // TODO: razón social y domicilio fiscal completos — requisito de la LFPDPPP.
  razonSocial: 'Sello',
  domicilio: 'México',
  contacto: 'hola@misello.com.mx',
}

const ULTIMA_ACTUALIZACION = '28 de agosto de 2026'

export const metadata: Metadata = {
  title: 'Aviso de privacidad',
  description:
    'Cómo Sello recaba, usa y protege los datos personales de quienes crean invitaciones digitales y de sus invitados.',
  alternates: { canonical: '/privacidad' },
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl">{titulo}</h2>
      <div className="mt-4 space-y-4 font-body text-base leading-relaxed text-ink/70">
        {children}
      </div>
    </section>
  )
}

export default function PrivacidadPage() {
  return (
    <div className="flex-1 bg-paper text-ink">
      <header className="border-b border-ink/6 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/">
            <Image src="/brand/sello-principal.png" alt="Sello" width={98} height={42} />
          </Link>
        </div>
      </header>

      <main className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
            Legal
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Aviso de privacidad</h1>
          <p className="mt-4 font-body text-sm text-ink/50">
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>

          <Seccion titulo="Quién es responsable de tus datos">
            <p>
              {RESPONSABLE.razonSocial} (&ldquo;{RESPONSABLE.nombre}&rdquo;), con
              domicilio en {RESPONSABLE.domicilio}, es responsable del tratamiento de los
              datos personales que nos compartes, conforme a la Ley Federal de Protección
              de Datos Personales en Posesión de los Particulares.
            </p>
            <p>
              Para cualquier tema de privacidad puedes escribirnos a{' '}
              <span className="text-ink">{RESPONSABLE.contacto}</span> o usar el
              formulario de contacto de la página principal.
            </p>
          </Seccion>

          <Seccion titulo="Qué datos recabamos">
            <p>
              <strong className="font-semibold text-ink">De quien crea la invitación:</strong>{' '}
              tu correo electrónico y, si entras con Google, tu nombre y foto de perfil.
              Además, todo lo que escribes en tu invitación: nombres, fecha, lugar,
              ubicación, textos e imágenes que subas.
            </p>
            <p>
              <strong className="font-semibold text-ink">De tus invitados:</strong> el
              nombre y la respuesta que dejan al confirmar asistencia, junto con los datos
              adicionales que tu invitación les pida (número de acompañantes,
              comentarios). Estos datos los recabamos por cuenta tuya y solo tú los ves.
            </p>
            <p>
              <strong className="font-semibold text-ink">De pago:</strong> el cobro lo
              procesa Stripe. Nosotros nunca vemos ni almacenamos números de tarjeta;
              únicamente guardamos el monto pagado y la fecha.
            </p>
            <p>
              <strong className="font-semibold text-ink">Técnicos:</strong> dirección IP,
              tipo de navegador y páginas visitadas, para seguridad y para medir el
              resultado de nuestra publicidad.
            </p>
          </Seccion>

          <Seccion titulo="Para qué los usamos">
            <p>
              Para crear y publicar tu invitación, mostrarte quién confirmó asistencia,
              cobrarte el pago único, mandarte correos sobre tu evento (confirmación de
              pago y avisos antes de que venza), dar soporte cuando lo pides, y entender
              qué anuncios y qué páginas nos traen clientes.
            </p>
            <p>
              No vendemos tus datos ni los de tus invitados, y no los usamos para mandarte
              publicidad de terceros.
            </p>
          </Seccion>

          <Seccion titulo="Con quién los compartimos">
            <p>
              Solo con los proveedores necesarios para que el servicio funcione, cada uno
              con su propia política de privacidad:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="font-semibold text-ink">Supabase</strong> — guarda la
                base de datos y las fotos de tu invitación.
              </li>
              <li>
                <strong className="font-semibold text-ink">Vercel</strong> — aloja y sirve
                el sitio.
              </li>
              <li>
                <strong className="font-semibold text-ink">Stripe</strong> — procesa el
                pago.
              </li>
              <li>
                <strong className="font-semibold text-ink">Resend</strong> — envía los
                correos del servicio.
              </li>
              <li>
                <strong className="font-semibold text-ink">Google</strong> — inicio de
                sesión y el mapa de la ubicación del evento.
              </li>
              <li>
                <strong className="font-semibold text-ink">
                  Meta (Facebook e Instagram)
                </strong>{' '}
                — medición de nuestra publicidad. Le enviamos eventos de navegación y de
                compra; el correo, cuando se incluye, viaja cifrado (SHA-256), nunca en
                claro.
              </li>
            </ul>
          </Seccion>

          <Seccion titulo="Cookies y tecnologías similares">
            <p>
              Usamos cookies propias para mantener tu sesión iniciada — sin ellas no
              podrías entrar a tu cuenta. Usamos también cookies de Meta (
              <code className="font-mono text-sm">_fbp</code> y{' '}
              <code className="font-mono text-sm">_fbc</code>) para saber si llegaste
              desde uno de nuestros anuncios.
            </p>
            <p>
              Puedes bloquearlas desde la configuración de tu navegador. Si bloqueas las
              de sesión, no podrás iniciar sesión; si bloqueas las de medición, el
              servicio funciona igual.
            </p>
          </Seccion>

          <Seccion titulo="Cuánto tiempo los conservamos">
            <p>
              Tu invitación y las confirmaciones de tus invitados permanecen activas
              durante la vigencia de tu evento. Al vencer, la invitación deja de ser
              pública. Conservamos los registros de facturación el tiempo que exige la ley
              fiscal.
            </p>
          </Seccion>

          <Seccion titulo="Tus derechos ARCO">
            <p>
              Puedes solicitar en cualquier momento el Acceso, Rectificación, Cancelación
              u Oposición al tratamiento de tus datos personales, así como revocar tu
              consentimiento. Escríbenos a{' '}
              <span className="text-ink">{RESPONSABLE.contacto}</span> indicando tu
              solicitud y el correo con el que creaste tu cuenta. Te respondemos dentro de
              los plazos que marca la ley.
            </p>
          </Seccion>

          <Seccion titulo="Cambios a este aviso">
            <p>
              Si cambiamos este aviso, publicaremos la nueva versión en esta misma página
              con su fecha de actualización. Si el cambio es importante, además te
              avisaremos por correo.
            </p>
          </Seccion>

          <div className="mt-16 border-t border-ink/8 pt-8">
            <Link
              href="/"
              className="font-body text-sm font-semibold text-clay hover:text-clay-light"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
