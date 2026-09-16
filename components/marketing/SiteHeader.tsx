import Image from 'next/image'
import Link from 'next/link'
import { AppMenu } from '@/components/nav/AppMenu'

export function SiteHeader({
  hasUser,
  displayName,
  isAdmin,
}: {
  hasUser: boolean
  displayName: string | null
  isAdmin: boolean
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <Image src="/brand/sello-principal.png" alt="Sello" width={98} height={42} priority />
        {hasUser ? (
          <AppMenu displayName={displayName} isAdmin={isAdmin} variant="dark" />
        ) : (
          <Link href="/login" className="font-body text-sm font-medium text-paper/85 hover:text-paper">
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
