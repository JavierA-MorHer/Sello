import { FeedbackForm } from '@/components/marketing/FeedbackForm'

export function ContactSection() {
  return (
    <section id="contacto" className="border-t border-ink/6 bg-paper-2 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <span className="font-body text-xs font-semibold tracking-[0.16em] text-ink/50 uppercase">
          Contacto
        </span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">¿Te quedó una duda?</h2>
        <p className="mt-3 font-body text-base leading-relaxed text-ink/70">
          Escríbenos y te contestamos. Si algo te gustaría que Sello hiciera y
          todavía no lo hace, también queremos saberlo.
        </p>

        <div className="mt-8">
          <FeedbackForm />
        </div>

        <p className="mt-6 font-body text-sm text-ink/50">
          Si prefieres, escríbenos directo a{' '}
          <a
            href="mailto:hola@misello.com.mx"
            className="text-clay transition-colors hover:text-clay-light"
          >
            hola@misello.com.mx
          </a>
          .
        </p>
      </div>
    </section>
  )
}
