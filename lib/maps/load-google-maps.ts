'use client'

let loadPromise: Promise<typeof google> | null = null

/**
 * Carga el script de Google Maps (librería `places`) una sola vez, sin
 * importar cuántos `UbicacionField` haya montados a la vez en el formulario.
 */
export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps solo puede cargarse en el navegador'))
  }
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google)
  }
  if (loadPromise) return loadPromise

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return Promise.reject(new Error('Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'))
  }

  loadPromise = new Promise((resolve, reject) => {
    const callbackName = '__onGoogleMapsLoaded'
    const win = window as unknown as Record<string, () => void>
    win[callbackName] = () => {
      delete win[callbackName]
      resolve(window.google)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=${callbackName}&language=es`
    script.async = true
    script.onerror = () => {
      loadPromise = null
      reject(new Error('No se pudo cargar Google Maps'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
