import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/6 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-body text-xs text-ink/50 sm:flex-row">
        <Image src="/brand/sello-una-tinta.png" alt="Sello" width={98} height={42} />
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a
            href="https://www.instagram.com/sello.invitaciones_digitales/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61593693431448"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Facebook
          </a>
          <a href="#contacto" className="transition-colors hover:text-ink">
            Contacto
          </a>
          <Link href="/privacidad" className="transition-colors hover:text-ink">
            Aviso de privacidad
          </Link>
          <span>Términos</span>
        </div>
        <span>© {new Date().getFullYear()} Sello</span>
      </div>
    </footer>
  )
}
