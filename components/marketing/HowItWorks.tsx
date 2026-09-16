import { STEPS } from '@/lib/marketing/landing-content'

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <span className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
          Cómo funciona
        </span>
        <h2 className="mt-3 max-w-lg font-display text-3xl sm:text-4xl">
          Tres pasos para sellarlo.
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
  )
}
