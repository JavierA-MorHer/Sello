import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getPriceRangeForCategory } from '@/lib/templates/pricing'
import { TemplateCard } from '@/components/marketing/TemplateCard'
import { RotatingHero, type HeroSlide } from '@/components/marketing/RotatingHero'

const HERO_SLIDES: HeroSlide[] = [
  { src: '/hero/boda.jpg', alt: 'Novios el día de su boda — invitación digital de Sello' },
  { src: '/hero/xv-anos.jpg', alt: 'Festejada de XV años — invitación digital de Sello' },
  { src: '/hero/bautizo.jpg', alt: 'Bautizo — invitación digital de Sello' },
  { src: '/hero/baby-shower.jpg', alt: 'Baby shower — invitación digital de Sello' },
]

const STEPS = [
  {
    n: '1',
    title: 'Eliges tu plantilla',
    body: 'Formal, moderna o cálida. Todas se ven bien en el celular.',
  },
  {
    n: '2',
    title: 'Llenas el formulario',
    body: 'Pasos cortos con autosave: nombres, fecha, lugar, fotos y dedicatoria.',
  },
  {
    n: '3',
    title: 'Pagas y compartes',
    body: 'Un solo pago libera tu link. Lo mandas por WhatsApp y listo.',
  },
]

const INCLUYE = [
  'Formulario dinámico con autosave — cierra y retoma cuando quieras',
  'Vista previa idéntica a la invitación final, antes de pagar',
  'Confirmación de asistencia (RSVP) en tiempo real',
  'Enlace único para compartir por WhatsApp',
  'Cambios ilimitados hasta la fecha de tu evento',
  'Pago único — sin suscripción ni renovaciones',
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
    a: 'Te avisamos por correo antes de que expire. Tu invitación deja de ser pública pero no se borra de inmediato.',
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

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: templates } = await supabase
    .from('templates')
    .select('id, name, category')
    .eq('active', true)
    .order('created_at', { ascending: true })
    .limit(6)

  return (
    <div className="flex-1 bg-paper text-ink">
      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
          <Image src="/brand/sello-principal.png" alt="Sello" width={98} height={42} priority />
          <Link href="/login" className="font-body text-sm font-medium text-paper/85 hover:text-paper">
            Entrar
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] sm:h-[620px]">
          <RotatingHero slides={HERO_SLIDES} />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(28,27,27,.45) 0%, rgba(28,27,27,.06) 34%, rgba(28,27,27,.5) 76%, rgba(28,27,27,.72) 100%)',
            }}
          />
          <div className="rise-in relative z-10 mx-auto flex h-full max-w-3xl flex-col justify-end gap-4 px-4 pb-16 sm:px-6 sm:pb-20">
            <span className="font-body text-xs font-semibold tracking-[0.16em] text-paper/80 uppercase">
              Bodas · XV años · Bautizos · Baby showers
            </span>
            <h1 className="max-w-lg text-4xl leading-[1.05] text-paper sm:text-6xl">
              Tu invitación,
              <br />
              como la imaginaste
            </h1>
            <p className="max-w-md font-body text-base leading-relaxed text-paper/85 sm:text-lg">
              Contestas unas preguntas y tu invitación queda lista para
              compartir por WhatsApp.
            </p>
          </div>
        </div>

        {/* TARJETA DE VISTA PREVIA */}
        <div className="relative z-10 mx-auto -mt-14 max-w-3xl px-4 sm:px-6">
          <div className="rise-in flex flex-col gap-5 rounded-sm border border-ink/6 bg-paper p-6 shadow-[0_12px_40px_rgba(28,27,27,0.12)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[4px] border border-ink/6 sm:h-24 sm:w-[76px]">
                <Image src="/hero/boda.jpg" alt="" fill sizes="76px" className="object-cover object-[50%_40%]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-display text-xl leading-none sm:text-2xl">
                  Camila <span className="italic text-ink/50">&amp;</span> Sebastián
                </span>
                <span className="font-body text-sm text-ink/70">3 de octubre, 2026 · Mérida</span>
                <div className="mt-1 flex gap-2">
                  <span className="rounded-full bg-clay/15 px-2.5 py-1 font-body text-[10px] font-semibold text-clay">
                    RSVP activo
                  </span>
                  <span className="rounded-full bg-ink/6 px-2.5 py-1 font-body text-[10px] font-semibold text-ink/60">
                    camila-sebastian.sello.com
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/crear"
              className="shrink-0 rounded-sm bg-ink px-6 py-3.5 text-center font-body text-sm font-semibold text-paper transition-colors hover:bg-clay"
            >
              Crear mi invitación →
            </Link>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <span className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
            Cómo funciona
          </span>
          <h2 className="mt-3 max-w-lg font-display text-3xl sm:text-4xl">
            De la plantilla al enlace, en tres pasos.
          </h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 font-display text-sm">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-lg">{step.title}</h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/60">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANTILLAS */}
      <section id="plantillas" className="border-t border-ink/6 bg-paper-2 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
                Plantillas
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">Elige la que se parezca a tu evento.</h2>
            </div>
            <Link href="/plantillas" className="hidden shrink-0 font-body text-sm font-semibold text-clay hover:text-clay-light sm:block">
              Ver todas →
            </Link>
          </div>

          <div className="mt-12 flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
            {(templates ?? []).map((template) => (
              <TemplateCard
                key={template.id}
                name={template.name}
                tag={template.category}
                priceRange={getPriceRangeForCategory(template.category)}
                href={`/crear/${template.id}`}
                className="w-[150px] shrink-0 sm:w-auto"
              />
            ))}
          </div>

          <Link href="/plantillas" className="mt-8 block font-body text-sm font-semibold text-clay sm:hidden">
            Ver todas →
          </Link>
        </div>
      </section>

      {/* PRECIO */}
      <section id="precios" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-8 rounded-sm bg-ink p-8 text-paper sm:p-12">
            <span className="font-body text-xs font-semibold tracking-[0.16em] text-paper/60 uppercase">
              Precio
            </span>
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-6 border-b border-paper/10 pb-8">
              <div>
                <div className="font-display text-3xl">{getPriceRangeForCategory('boda')}</div>
                <div className="mt-1 font-body text-xs tracking-[0.14em] text-paper/60 uppercase">
                  Boda · MXN, pago único
                </div>
              </div>
              <div>
                <div className="font-display text-3xl">{getPriceRangeForCategory('xv_anos')}</div>
                <div className="mt-1 font-body text-xs tracking-[0.14em] text-paper/60 uppercase">
                  XV años, bautizos y más
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {INCLUYE.map((item) => (
                <div key={item} className="flex items-start gap-2.5 font-body text-sm leading-snug text-paper/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/crear"
              className="self-start rounded-sm bg-clay px-7 py-3.5 font-body text-sm font-semibold text-ink transition-colors hover:bg-clay-light"
            >
              Crear mi invitación →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink/6 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl">Antes de que preguntes.</h2>

          <div className="mt-10 divide-y divide-ink/8">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg">
                  {f.q}
                  <PlusIcon className="h-4 w-4 shrink-0 text-clay transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-ink/6 px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="mx-auto max-w-lg font-display text-3xl sm:text-4xl">Sella tu invitación hoy.</h2>
        <Link
          href="/crear"
          className="mt-9 inline-block rounded-sm bg-ink px-8 py-4 font-body text-base font-semibold text-paper transition-colors hover:bg-clay"
        >
          Arma tu invitación →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/6 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-body text-xs text-ink/50 sm:flex-row">
          <Image src="/brand/sello-una-tinta.png" alt="Sello" width={98} height={42} />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>Instagram</span>
            <span>WhatsApp</span>
            <span>hola@sello.com</span>
            <span>Aviso de privacidad</span>
            <span>Términos</span>
          </div>
          <span>© {new Date().getFullYear()} Sello</span>
        </div>
      </footer>
    </div>
  )
}
