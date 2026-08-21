import Image from 'next/image'

/**
 * Envoltorio de foto compartido por la plantilla Boda Clásica: aplica el
 * grado de color cálido de la firma visual (une fotos de cualquier origen
 * bajo el mismo tono, sin importar cómo las haya tomado el usuario) — el
 * dispositivo de diseño que le da cohesión a fotos subidas por clientes
 * distintos.
 */
export function TemplatePhoto({
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
  // Nota: este div NO trae `relative` por defecto — el `fill` de next/image
  // necesita un ancestro posicionado (relative o absolute), y si aquí
  // forzáramos `relative` mientras el llamador pasa `absolute inset-0` (como
  // hace el hero), ambas clases de `position` chocan y Tailwind puede dejar
  // el contenedor sin `position` efectivo, colapsándolo a altura cero. Cada
  // usuario de este componente debe incluir `relative` o `absolute inset-0`
  // en su propio className.
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover [filter:sepia(0.22)_saturate(1.15)_contrast(1.04)_brightness(1.02)]"
      />
    </div>
  )
}
