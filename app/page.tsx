import Link from 'next/link'
import { HeroStamp } from '@/components/marketing/HeroStamp'
import { StampFrame } from '@/components/marketing/StampFrame'
import { ConfirmedStamp } from '@/components/marketing/ConfirmedStamp'

const STEPS = [
  {
    n: '1',
    title: 'Elige tu serie',
    body: 'Boda, XV años, bautizo o genérico — cada plantilla define sus propios campos.',
  },
  {
    n: '2',
    title: 'Llena tus datos',
    body: 'Formulario dinámico con autosave: cierra el navegador cuando quieras, tu borrador te espera.',
  },
  {
    n: '3',
    title: 'Vista previa',
    body: 'Ve exactamente lo que verán tus invitados, con marca de agua hasta que actives tu evento.',
  },
  {
    n: '4',
    title: 'Se sella y se envía',
    body: 'Pagas una sola vez, se genera tu enlace único, y ya puedes compartirlo.',
  },
]

const GUESTS = [
  ['Familia Ramírez', '2 personas'],
  ['Luis & Andrea', '2 personas'],
  ['Tía Carmen', '1 persona'],
]

const PRICES = [
  {
    category: 'Boda',
    range: '$700–1,200',
    note: 'Ceremonia, recepción, itinerario, mesa de regalos, RSVP.',
  },
  {
    category: 'XV años y otros',
    range: '$500–900',
    note: 'Bautizos, cumpleaños y eventos familiares.',
  },
]

const FAQS = [
  {
    q: '¿Es una suscripción?',
    a: 'No. Pago único por evento. Tu invitación queda activa hasta varios meses después de la fecha del evento, sin cobros recurrentes.',
  },
  {
    q: '¿Mis invitados necesitan crear una cuenta para confirmar?',
    a: 'No. El RSVP es público — entran a tu enlace, confirman asistencia en segundos, y tú recibes la notificación.',
  },
  {
    q: '¿Puedo ver mi invitación antes de pagar?',
    a: 'Sí. El preview usa exactamente el mismo diseño que verán tus invitados, con una marca de agua que desaparece al activarse.',
  },
  {
    q: '¿Qué pasa cuando termina la vigencia?',
    a: 'Te avisamos por correo 30 y 7 días antes de que expire. Tu invitación deja de ser pública pero no se borra de inmediato.',
  },
]

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M10 3v14M3 10h14" />
    </svg>
  )
}

function StepBadge({ n }: { n: string }) {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-vermilion/40" />
      <div className="absolute inset-[5px] flex items-center justify-center rounded-full border-2 border-vermilion bg-ink font-display text-lg font-bold text-kraft">
        {n}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex-1 bg-ink text-kraft">
      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
          <span className="font-display text-lg font-bold tracking-wide text-kraft sm:text-xl">
            SELLO
          </span>
          <nav className="hidden items-center gap-8 font-body text-sm tracking-wide text-kraft/80 sm:flex">
            <a href="#como-funciona" className="hover:text-kraft">
              Cómo funciona
            </a>
            <a href="#plantillas" className="hover:text-kraft">
              Plantillas
            </a>
            <a href="#precios" className="hover:text-kraft">
              Precios
            </a>
          </nav>
          <Link
            href="/plantillas"
            className="stamp-button rounded-sm bg-vermilion-dark px-3 py-1.5 font-body text-xs font-semibold whitespace-nowrap text-kraft sm:px-4 sm:py-2 sm:text-sm"
          >
            <span className="sm:hidden">Empezar</span>
            <span className="hidden sm:inline">Arma tu invitación</span>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="ink-texture relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-40 sm:pb-32">
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl leading-[1.05] font-bold text-kraft sm:text-5xl lg:text-6xl">
              Arma tu invitación en minutos.
            </h1>
            <p className="mt-3 font-display text-2xl text-kraft/70 sm:text-3xl">
              Se sella. Se envía. Funciona de verdad.
            </p>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-kraft/70">
              Elige una plantilla, llena tus datos, y recibe un sitio real con
              confirmación de asistencia — no una imagen bonita que no hace
              nada.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/plantillas"
                className="stamp-button rounded-sm bg-vermilion-dark px-7 py-4 font-body text-base font-semibold text-kraft"
              >
                Arma tu invitación →
              </Link>
              <a
                href="#plantillas"
                className="font-body text-sm font-semibold tracking-wide text-kraft/80 underline decoration-kraft/30 underline-offset-4 hover:text-kraft"
              >
                Ver plantillas
              </a>
            </div>

            <p className="mt-8 font-body text-xs tracking-[0.15em] text-kraft/60 uppercase">
              Bodas · XV años · Bautizos — desde $500 MXN, pago único
            </p>
          </div>

          <HeroStamp />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="border-t border-kraft/10 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-lg font-display text-4xl font-bold text-kraft">
            De la plantilla al enlace, en cuatro pasos.
          </h2>

          <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden
              className="absolute top-7 right-0 left-0 hidden border-t border-dashed border-kraft/20 lg:block"
            />
            {STEPS.map((step) => (
              <div key={step.n} className="relative">
                <StepBadge n={step.n} />
                <h3 className="mt-5 font-display text-xl font-bold text-kraft">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-kraft/60">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIADOR */}
      <section className="border-t border-kraft/10 bg-ink-2 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-xl font-display text-4xl font-bold text-kraft">
            La mayoría vende una imagen. Sello entrega un sistema.
          </h2>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-sm border border-kraft/10 bg-ink p-8">
              <h3 className="font-display text-xl font-bold text-kraft/70">
                La competencia
              </h3>
              <div className="mt-6 flex aspect-[4/3] items-center justify-center rounded-sm border border-dashed border-kraft/20 bg-ink-3">
                <span className="font-display text-sm tracking-[0.3em] text-kraft/60">
                  SOLO IMAGEN — SIN INTERACCIÓN
                </span>
              </div>
              <p className="mt-5 font-body text-sm text-kraft/60">
                Un JPG o PDF bonito. Tus invitados no pueden confirmar nada, y
                tú no sabes quién va a llegar hasta el día del evento.
              </p>
            </div>

            <div className="rounded-sm border-2 border-vermilion/60 bg-ink-3 p-8">
              <h3 className="font-display text-xl font-bold text-kraft">Sello</h3>
              <div className="mt-6 space-y-2 rounded-sm border border-kraft/15 bg-ink p-4 font-body text-sm">
                {GUESTS.map(([name, size]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between border-b border-kraft/10 py-2 last:border-0"
                  >
                    <span className="text-kraft/80">{name}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs tracking-wide text-kraft/60">
                        {size}
                      </span>
                      <ConfirmedStamp className="h-6 w-6 text-vermilion-light" />
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 font-body text-sm text-kraft/70">
                Cada confirmación queda sellada en tiempo real. Ves quién
                confirmó, cuántos vienen, y recibes una notificación cada vez
                que alguien responde.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOGO */}
      <section id="plantillas" className="border-t border-kraft/10 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-lg font-display text-4xl font-bold text-kraft">
            Series de estampillas para cada evento.
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/plantillas" className="group">
              <StampFrame className="aspect-[4/5] bg-kraft transition-transform group-hover:-translate-y-1">
                <div className="flex h-full flex-col justify-between p-4 text-kraft-ink">
                  <span className="font-body text-[9px] tracking-[0.25em]">
                    SELLO
                  </span>
                  <span className="font-display text-2xl leading-tight font-bold">
                    Boda
                    <br />
                    Clásica
                  </span>
                  <span className="font-body text-[9px] font-semibold tracking-[0.2em]">
                    DISPONIBLE
                  </span>
                </div>
              </StampFrame>
            </Link>

            {['XV Años', 'Bautizo', 'Genérico'].map((name) => (
              <StampFrame key={name} className="aspect-[4/5] bg-kraft-2">
                <div className="flex h-full flex-col justify-between p-4 text-kraft-ink">
                  <span className="font-body text-[9px] tracking-[0.25em]">
                    SELLO
                  </span>
                  <span className="font-display text-2xl leading-tight font-bold">
                    {name}
                  </span>
                  <span className="font-body text-[9px] font-semibold tracking-[0.2em]">
                    PRÓXIMAMENTE
                  </span>
                </div>
              </StampFrame>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="border-t border-kraft/10 bg-ink-2 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-lg font-display text-4xl font-bold text-kraft">
            Un precio. Sin niveles, sin suscripción.
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {PRICES.map((p) => (
              <div
                key={p.category}
                className="flex items-center justify-between rounded-sm border border-kraft/15 p-8"
              >
                <div>
                  <p className="inline-block rounded-sm bg-ink-3 px-2 py-1 font-body text-xs font-bold tracking-[0.15em] text-kraft uppercase">
                    {p.category}
                  </p>
                  <p className="mt-4 max-w-[16rem] font-body text-sm text-kraft/60">
                    {p.note}
                  </p>
                </div>
                <div className="text-right font-display">
                  <div className="text-3xl font-bold text-kraft">{p.range}</div>
                  <div className="font-body text-xs tracking-[0.2em] text-kraft/60">
                    MXN · PAGO ÚNICO
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-kraft/10 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-bold text-kraft">
            Antes de que preguntes.
          </h2>

          <div className="mt-12 divide-y divide-kraft/10">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-body text-lg font-semibold text-kraft">
                  {f.q}
                  <PlusIcon className="ml-4 h-5 w-5 shrink-0 text-vermilion-light transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 font-body text-sm leading-relaxed text-kraft/60">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-kraft/10 px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="mx-auto max-w-xl font-display text-4xl font-bold text-kraft sm:text-5xl">
          Sella tu invitación hoy.
        </h2>
        <div className="mt-10">
          <Link
            href="/plantillas"
            className="stamp-button inline-block rounded-sm bg-vermilion-dark px-8 py-4 font-body text-base font-semibold text-kraft"
          >
            Arma tu invitación →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-kraft/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-body text-xs tracking-wide text-kraft/60 sm:flex-row">
          <span className="font-display text-base font-bold text-kraft/70">
            SELLO
          </span>
          <span>© {new Date().getFullYear()} Sello. Invitaciones digitales.</span>
        </div>
      </footer>
    </div>
  )
}
