import { FAQS } from '@/lib/marketing/landing-content'

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

export function FaqSection() {
  return (
    <section className="border-t border-ink\6 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl sm:text-4xl">Preguntas frecuentes.</h2>

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
  )
}
