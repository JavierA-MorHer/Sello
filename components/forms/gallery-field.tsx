'use client'

import { useRef, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import type { GalleryField as GalleryFieldType } from '@/lib/templates/types'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/images/compress'

const BUCKET = 'event-photos'
const DEFAULT_MAX = 12

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = url.indexOf(marker)
  return index === -1 ? null : url.slice(index + marker.length)
}

export function GalleryField({
  field,
  name,
  control,
  eventId,
}: {
  field: GalleryFieldType
  name: string
  control: Control<any>
  eventId: string
}) {
  const { field: controllerField } = useController({ control, name, defaultValue: [] })
  const photos: string[] = controllerField.value ?? []
  const max = field.max ?? DEFAULT_MAX
  const canAddMore = photos.length < max

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const room = max - photos.length
    const selected = Array.from(files).slice(0, room)
    if (selected.length === 0) return

    setUploading(true)
    setError(null)
    const supabase = createClient()

    try {
      const uploaded: string[] = []
      for (const file of selected) {
        const blob = await compressImage(file)
        const path = `${eventId}/${crypto.randomUUID()}.jpg`
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
      controllerField.onChange([...photos, ...uploaded])
    } catch {
      setError('No se pudieron subir una o más fotos. Intenta de nuevo.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove(index: number) {
    const url = photos[index]
    controllerField.onChange(photos.filter((_, i) => i !== index))

    const path = pathFromPublicUrl(url)
    if (path) {
      const supabase = createClient()
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((url, index) => (
          <div
            key={url}
            className="relative aspect-[4/5] overflow-hidden rounded-sm border border-ink/8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- foto de usuario ya optimizada en el cliente antes de subirse */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2 py-1 font-body text-[9px] font-semibold tracking-[0.08em] text-paper uppercase">
                Portada
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label="Quitar foto"
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 font-body text-xs text-paper transition-colors hover:bg-error"
            >
              ×
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/5] flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed border-ink/25 bg-paper-2 px-2 text-center font-body text-xs font-semibold text-ink/50 transition-colors hover:border-clay hover:text-clay disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? 'Subiendo…' : '+ Agregar foto'}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <span className="font-body text-xs text-ink/40">
        {photos.length} de {max} fotos · la primera es la portada
      </span>
      {error && <span className="font-body text-xs text-error">{error}</span>}
    </div>
  )
}
