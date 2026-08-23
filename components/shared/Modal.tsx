'use client'

import { createPortal } from 'react-dom'

/** Modal genérico del sistema de diseño — reemplaza window.alert/window.confirm, que rompen la estética. */
export function Modal({
  title,
  children,
  actions,
  onClose,
}: {
  title: string
  children: React.ReactNode
  actions: React.ReactNode
  onClose: () => void
}) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-ink/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-sm border border-ink/10 bg-paper p-6 shadow-xl">
          <h2 className="font-display text-xl">{title}</h2>
          <div className="mt-2 font-body text-sm leading-relaxed text-ink/70">{children}</div>
          <div className="mt-6 flex justify-end gap-2.5">{actions}</div>
        </div>
      </div>
    </>,
    document.body
  )
}
