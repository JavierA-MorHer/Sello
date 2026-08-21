import Image from 'next/image'

/**
 * Foto enmarcada en arco de misión colonial (radio grande solo en las
 * esquinas superiores) — la referencia a los vanos de las haciendas
 * poblanas, y el reemplazo de esta plantilla al tratamiento de color de
 * TemplatePhoto: aquí la foto queda en color natural, la forma es la firma.
 */
export function ArchPhoto({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div className={`relative overflow-hidden rounded-t-[999px] ${className ?? ''}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  )
}
