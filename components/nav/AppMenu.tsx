'use client'

import { useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { signOutAction } from '@/lib/auth/actions'

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function MenuLink({
  href,
  onNavigate,
  children,
}: {
  href: string
  onNavigate: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-sm px-3 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:bg-paper-2"
    >
      {children}
    </Link>
  )
}

/**
 * Menú hamburguesa compartido por todo el flujo autenticado (wizard, preview,
 * plantillas, mis-eventos, admin) — es la única forma de volver al inicio o
 * cambiar de sección sin depender de "← Atrás", que solo navega paso a paso.
 */
export function AppMenu({
  displayName,
  isAdmin = false,
  variant = 'light',
}: {
  displayName?: string | null
  isAdmin?: boolean
  variant?: 'light' | 'dark'
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [coords, setCoords] = useState({ top: 0, right: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)

  const triggerColor = variant === 'dark' ? 'text-paper hover:bg-paper/10' : 'text-ink hover:bg-ink/5'

  function close() {
    setOpen(false)
  }

  function toggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-sm transition-colors ${triggerColor}`}
      >
        {open ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40 bg-ink/30" onClick={close} />
            <div
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-50 w-64 rounded-sm border border-ink/10 bg-paper p-2 shadow-xl"
            >
              {displayName && (
                <p className="px-3 pt-1.5 pb-2 font-body text-xs text-ink/50">Hola, {displayName}</p>
              )}
              <MenuLink href="/" onNavigate={close}>
                Inicio
              </MenuLink>
              <MenuLink href="/plantillas" onNavigate={close}>
                Plantillas
              </MenuLink>
              <MenuLink href="/mis-eventos" onNavigate={close}>
                Mis eventos
              </MenuLink>
              {isAdmin && (
                <MenuLink href="/admin" onNavigate={close}>
                  Admin
                </MenuLink>
              )}
              <div className="my-1 h-px bg-ink/10" />
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => signOutAction())}
                className="w-full rounded-sm px-3 py-2.5 text-left font-body text-sm font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-50"
              >
                {isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  )
}
