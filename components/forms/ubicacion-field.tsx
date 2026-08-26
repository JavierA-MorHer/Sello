'use client'

import { useEffect, useRef, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import type { UbicacionField as UbicacionFieldType, UbicacionValue } from '@/lib/templates/types'
import { loadGoogleMaps } from '@/lib/maps/load-google-maps'

const inputClass =
  'rounded-sm border border-ink/15 bg-paper px-3.5 py-3 font-body text-base text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-clay'

export function UbicacionField({
  field,
  name,
  control,
}: {
  field: UbicacionFieldType
  name: string
  control: Control<any>
}) {
  const { field: controllerField } = useController({ control, name })
  const value: UbicacionValue | undefined = controllerField.value

  const inputRef = useRef<HTMLInputElement>(null)
  const [inputText, setInputText] = useState(value?.direccion ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    let listener: google.maps.MapsEventListener | undefined

    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !inputRef.current) return

        const autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
          fields: ['name', 'formatted_address', 'geometry', 'place_id'],
        })

        listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          const location = place.geometry?.location
          if (!location) return

          const nextValue: UbicacionValue = {
            lugar: place.name ?? '',
            direccion: place.formatted_address ?? '',
            lat: location.lat(),
            lng: location.lng(),
            place_id: place.place_id ?? '',
          }
          controllerField.onChange(nextValue)
          setInputText(nextValue.direccion)
        })

        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      listener?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- el autocomplete se monta una sola vez por input
  }, [])

  function handleTextChange(text: string) {
    setInputText(text)
    // Si el usuario edita a mano después de elegir un lugar, invalidamos las
    // coordenadas para no guardar un pin que ya no corresponde al texto.
    if (value) controllerField.onChange(undefined)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={field.placeholder ?? 'Busca el lugar o la dirección…'}
        className={inputClass}
        autoComplete="off"
      />
      {status === 'error' && (
        <span className="font-body text-xs text-error">
          No se pudo cargar el buscador de direcciones. Revisa tu conexión.
        </span>
      )}
      {status === 'ready' && !value && (
        <span className="font-body text-xs text-ink/40">
          Elige una opción de la lista para fijar el pin en el mapa.
        </span>
      )}
    </div>
  )
}
