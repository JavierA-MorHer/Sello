import Image from 'next/image'
import Link from 'next/link'
import { RotatingHero } from '@/components/marketing/RotatingHero'
import { HERO_SLIDES } from '@/lib/marketing/landing-content'

export function Hero() {
  return (
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
            Tu invitación digital,
            <br />
            como la imaginaste
          </h1>
          <p className="max-w-md font-body text-base leading-relaxed text-paper/85 sm:text-lg">
            Invitaciones digitales que se arman en minutos: contestas unas
            preguntas y la tuya queda lista para compartir por WhatsApp.
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
                Javier <span className="italic text-ink/50">&amp;</span> Nayeli
              </span>
              <span className="font-body text-sm text-ink/70">3 de octubre, 2026 · Mérida</span>
              <div className="mt-1 flex gap-2">
                <span className="rounded-full bg-clay/15 px-2.5 py-1 font-body text-[10px] font-semibold text-clay">
                  RSVP activo
                </span>
                <span className="rounded-full bg-ink/6 px-2.5 py-1 font-body text-[10px] font-semibold text-ink/60">
                  tu-link-personalizado.misello.com.mx
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
  )
}
