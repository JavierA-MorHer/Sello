const TILE_WIDTH = 320
const TILE_HEIGHT = 200

const WATERMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_WIDTH}" height="${TILE_HEIGHT}">
  <text x="50%" y="50%" transform="rotate(-30 ${TILE_WIDTH / 2} ${TILE_HEIGHT / 2})" text-anchor="middle" dominant-baseline="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="2.5" fill="rgba(28,27,27,0.4)">SELLO · SIN PUBLICAR</text>
</svg>`

const WATERMARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(WATERMARK_SVG)}`

/**
 * Cubre a la plantilla renderizada con una marca de agua repetida, sin
 * importar qué tan alta sea la página (fondo tileable, no una lista finita
 * de elementos). Se usa mientras el evento no se ha pagado/publicado.
 */
export function PreviewWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        backgroundImage: `repeating-linear-gradient(-45deg, rgba(28,27,27,.05) 0px, rgba(28,27,27,.05) 2px, transparent 2px, transparent 132px), url("${WATERMARK_DATA_URI}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}
