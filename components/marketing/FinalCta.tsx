import Link from 'next/link'

export function FinalCta() {
  return (
    <section className="border-t border-ink/6 px-4 py-20 text-center sm:px-6 sm:py-24">
      <h2 className="mx-auto max-w-lg font-display text-3xl sm:text-4xl">Sella tu invitación hoy.</h2>
      <Link
        href="/crear"
        className="mt-9 inline-block rounded-sm bg-ink px-8 py-4 font-body text-base font-semibold text-paper transition-colors hover:bg-clay"
      >
        Arma tu invitación →
      </Link>
    </section>
  )
}
