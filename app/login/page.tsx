'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { LoginPanel } from '@/components/auth/LoginPanel'

function LoginContent() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/plantillas'

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-sm">
        <Image
          src="/brand/sello-una-tinta.png"
          alt="Sello"
          width={140}
          height={60}
          priority
          className="mx-auto"
        />

        <div className="mt-8 rounded-sm border border-ink/8 bg-paper p-8 text-ink">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display text-2xl">Inicia sesión</h1>
              <p className="mt-2 font-body text-sm text-ink/60">
                Entra para guardar tu invitación y ver tus eventos.
              </p>
            </div>

            <LoginPanel next={next} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
