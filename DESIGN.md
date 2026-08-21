---
name: Sello
description: Invitaciones digitales que se sellan, se envían y funcionan de verdad.
colors:
  tinta-postal: "#101a38"
  tinta-postal-media: "#182449"
  tinta-postal-clara: "#212f5c"
  papel-kraft: "#e8d9ae"
  papel-kraft-mate: "#bfae86"
  tinta-sobre-kraft: "#2a2110"
  rojo-matasellos: "#c23b22"
  rojo-matasellos-oscuro: "#9a2e19"
  rojo-matasellos-claro: "#e8623a"
  rojo-matasellos-sombra: "#5c180c"
typography:
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "normal"
  body:
    fontFamily: "Public Sans, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Public Sans, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.15em"
rounded:
  sm: "2px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.rojo-matasellos-oscuro}"
    textColor: "{colors.papel-kraft}"
    rounded: "{rounded.sm}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.rojo-matasellos-oscuro}"
    textColor: "{colors.papel-kraft}"
  chip-denomination:
    backgroundColor: "{colors.tinta-postal-clara}"
    textColor: "{colors.papel-kraft}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
---

# Design System: Sello

## Overview

**Creative North Star: "El Sello Postal"**

Cada invitación es una estampilla oficial: se diseña, se denomina (precio), se envía, y se matasella el instante en que un invitado confirma su asistencia. El sistema rechaza deliberadamente el cliché del sitio de bodas genérico — paleta crema/blush, serif cursiva, foto de pareja sonriendo, grid de features — y en su lugar construye sobre la tradición gráfica de la papelería postal y los documentos oficiales mexicanos: estampillas, matasellos, actas notariadas, sellos de goma de oficina.

La tinta índigo domina la superficie (no el papel kraft, que aparece solo donde el producto realmente sería papel: estampillas y tarjetas). El rojo matasellos es el único acento saturado, reservado casi por completo a los CTAs y al propio matasellos — su escasez es lo que le da peso. La tipografía combina un serif de alto contraste (grabado, tipo moneda/certificado) con una sans utilitaria (la misma familia que usa el gobierno de EUA para formularios oficiales), reforzando la tensión "oficial pero de autoservicio, rápido" que es la promesa central del producto.

**Key Characteristics:**
- Fondo dominante de tinta índigo oscura, nunca negro puro ni crema.
- El papel kraft vive solo en objetos que serían papel de verdad (estampillas, tarjetas de plantilla).
- Bordes perforados vía máscara SVG real (no un truco de gradiente CSS) en cada superficie "estampilla", siempre acompañados de un marco grabado de doble línea inset (ver `StampFrame`) — la perforación sola no se lee como estampilla.
- El rojo matasellos aparece en <10% de cualquier vista — CTAs y acentos puntuales de confirmación.
- Un matasellos circular superpuesto sobre la tarjeta-estampilla (componente `Postmark`) se probó y se descartó — el concepto no convenció en revisión, independientemente de su ejecución. No reintroducir sin dirección explícita del usuario.

## Colors

Paleta "Committed": la tinta índigo domina como color de página; el kraft y el rojo aparecen solo en objetos y acciones específicas, nunca como fondo general.

### Primary
- **Rojo Matasellos** (`#c23b22`): el color del sello — reservado a badges decorativos grandes (≥18px), el anillo del matasellos, y bordes de acento. Nunca en texto pequeño sobre tinta (solo 3.2:1 de contraste — falla el piso de 4.5:1 para texto de cuerpo).
- **Rojo Matasellos Oscuro** (`#9a2e19`): fondo real de todos los botones CTA. Se eligió sobre el rojo puro porque texto kraft sobre él da 5.4:1 de contraste, contra 3.8:1 del rojo puro.
- **Rojo Matasellos Claro** (`#e8623a`): variante para íconos/UI sobre superficies oscuras (`tinta-postal-clara`) donde el rojo oscuro cae a 2.4:1 — este da 3.8:1, cumpliendo el mínimo de componentes no-textuales (3:1).
- **Rojo Matasellos Sombra** (`#5c180c`): solo para la sombra "repisa" (`box-shadow`) del botón sello de goma — nunca como color de superficie.

### Neutral
- **Tinta Postal** (`#101a38`): fondo de página por defecto.
- **Tinta Postal Media** (`#182449`): fondo de sección alterna, para romper el ritmo de scroll.
- **Tinta Postal Clara** (`#212f5c`): superficie elevada — tarjetas de contenido dentro de una sección (ej. la tarjeta "Sello" en el comparativo, contenedores de listas).
- **Papel Kraft** (`#e8d9ae`): superficie de "estampilla disponible" — el único lugar donde el texto es oscuro sobre claro.
- **Papel Kraft Mate** (`#bfae86`): estampillas "próximamente" — deliberadamente más apagado que el kraft activo, para que la jerarquía disponible/no-disponible se lea sin depender de opacidad (ver Regla de Opacidad abajo).
- **Tinta sobre Kraft** (`#2a2110`): único color de texto permitido sobre cualquier superficie kraft.

### Named Rules
**La Regla de la Opacidad Prohibida.** Nunca usar `opacity` en un elemento contenedor para comunicar "deshabilitado" o "secundario" — reduce el contraste de TODO su contenido a la vez, y con frecuencia lo hunde bajo 4.5:1 sin que se note en el editor. Usar un tono neutro distinto (`papel-kraft-mate` en vez de `opacity-50` sobre `papel-kraft`) o texto a color sólido con menor peso tipográfico, nunca alpha.

## Typography

**Display Font:** Bodoni Moda (fallback: Georgia, serif)
**Body Font:** Public Sans (fallback: -apple-system, sans-serif)

**Character:** Bodoni Moda aporta el contraste alto grabado de moneda/certificado oficial — se usa en titulares, cifras de precio, y el wordmark. Public Sans es la misma familia que usa el gobierno de EUA (USWDS) para formularios oficiales civiles: utilitaria, legible, sin personalidad propia — deja que el serif cargue toda la voz de marca.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, 1.05): H1 del hero, titulares de sección, cifras de precio, numerales de estampilla.
- **Body** (400, 1rem, 1.6): párrafos de cuerpo, máximo ~65ch de medida.
- **Label** (700, 0.75rem, tracking 0.15em, mayúsculas): etiquetas de estado ("DISPONIBLE", "MXN · PAGO ÚNICO"), nunca en rojo matasellos a este tamaño.
- **Micro-impreso** (600, 8–9px, tracking 0.25em, mayúsculas): exclusivo del componente insignia "Sello Postal" — el texto diminuto de "SELLO"/"MÉXICO" en la esquina de la estampilla, imitando el micro-impreso real de una estampilla postal. No usar fuera de ese componente.

### Named Rules
**La Regla del Serif Solitario.** Bodoni Moda es la única voz de personalidad del sistema. Public Sans nunca lleva peso >600 ni tracking decorativo — si algo necesita presencia, se resuelve en el display, no forzando la sans a imitarlo.

## Layout

Contenedor máximo de 6xl (72rem) centrado, padding horizontal `px-4` en mobile subiendo a `px-6` desde `sm:`. Secciones alternan fondo `tinta-postal` / `tinta-postal-media` para marcar ritmo de scroll sin líneas divisorias fuertes — solo un `border-t border-kraft/10` sutil entre secciones. Grids de tarjetas van de 1 columna en mobile a 2 (`sm:`) y 4 (`lg:`) según el contenido. El hero es la única sección de dos columnas fijas (`lg:grid-cols-2`) — texto a la izquierda, la estampilla protagonista a la derecha.

## Elevation & Depth

Sistema mayormente plano con capas tonales (los tres tonos de tinta) en vez de sombras — la profundidad viene de qué tono de fondo usa cada superficie, no de blur. Dos excepciones estructurales, nunca decorativas:

### Shadow Vocabulary
- **Sello hero** (`box-shadow: 0 30px 60px -15px rgba(0,0,0,0.5)`): la única sombra ambiental del sistema, reservada al objeto protagonista del hero.
- **Botón sello de goma** (`box-shadow: 0 6px 0 var(--vermilion-shadow)`, sin blur): no es una sombra ambiental — es una repisa sólida que se comprime al presionar (`:active` la reduce a `0 1px 0`), simulando el golpe físico de un sello de goma. Ver Componentes → Botones.

### Named Rules
**La Regla del Golpe de Sello.** Ninguna sombra lleva blur excepto la del hero. Toda otra sombra es una repisa sólida (`0 Npx 0 color`) que responde al estado de presión — la profundidad existe para simular un objeto físico que se estampa, no para decorar.

## Shapes

- **Radio por defecto:** `rounded-sm` (2px) en tarjetas, botones y chips — casi recto, consistente con la papelería oficial.
- **Silueta de estampilla:** cada superficie "estampilla" (`bg-kraft`/`bg-kraft-2`, proporción `aspect-[4/5]`) lleva un borde perforado real, generado por una máscara SVG de luminancia (`StampMaskDefs.tsx`, 9 muescas horizontales × 11 verticales sobre un `<mask>` en `objectBoundingBox`), nunca un `border-radius` decorativo ni un `mask-image` de gradiente CSS repetido (esa técnica perfora toda la superficie, no solo el borde — descartada durante la construcción).
- **Grano de papel independiente del borde perforado:** la clase `.kraft-texture` (ruido `feTurbulence`) es la única que debe usarse en superficies kraft de proporción arbitraria (paneles de formulario, contenedores largos). `.stamp-edge` usa `objectBoundingBox`, que asume una proporción cercana a `aspect-[4/5]` — aplicarlo a un contenedor mucho más alto que ancho estira los dientes redondos en picos filosos y rotos. Aplicar ambas clases juntas solo en objetos que de verdad son una estampilla (hero, tarjetas de catálogo, vista previa de confirmación); un panel de formulario largo lleva solo `.kraft-texture` + `rounded-sm`.
- **Círculos concéntricos:** los badges de paso ("cómo funciona") usan un anillo doble (borde grueso + anillo tenue exterior), el único otro lenguaje de forma recurrente del sistema.

## Components

### Buttons
- **Shape:** `rounded-sm` (2px).
- **Primary:** fondo `rojo-matasellos-oscuro`, texto `papel-kraft`, padding `16px 28px` (desktop) / `6px 12px` (mobile, con label abreviado).
- **Hover / Active:** la clase `.stamp-button` simula un sello de goma — `translateY(-1px)` + sombra más alta en hover, `translateY(5px)` + sombra casi plana en `:active`. Ver Elevation → Regla del Golpe de Sello.

### Chips
- **Denominación de precio** (`chip-denomination`): fondo `tinta-postal-clara`, texto `papel-kraft`, mayúsculas, tracking 0.15em — usado para la categoría dentro de cada tarjeta de precio.
- **Estado de plantilla** ("DISPONIBLE"/"PRÓXIMAMENTE"): no es un chip con fondo propio, es texto label directo sobre la superficie kraft de la estampilla, diferenciado por el tono de papel (kraft vs. kraft-mate), nunca por opacidad.

### Cards / Containers
- **Corner Style:** `rounded-sm`.
- **Background:** `tinta-postal` por defecto; `tinta-postal-clara` para la tarjeta que debe leerse como "la opción fuerte" en un comparativo (ver el patrón "competencia" vs. "Sello").
- **Shadow Strategy:** ninguna — la jerarquía entre tarjetas se comunica con grosor de borde (`border` vs `border-2`) y tono de fondo, no con elevación.
- **Border:** `border-kraft/10` a `/15` para tarjetas neutras; `border-2 border-vermilion/60` para la tarjeta que debe destacar frente a una alternativa débil.

### Navigation
- Header transparente absoluto sobre el hero (mismo tono de tinta, sin costura visible). Wordmark "SELLO" en display a la izquierda, enlaces de ancla en `body` a 80% opacidad en el centro (ocultos bajo `sm:`), CTA sello de goma a la derecha con label abreviado en mobile (`Empezar` vs. `Arma tu invitación`) para evitar overflow horizontal.

### Inputs / Fields
- **Superficie del formulario:** un panel kraft grande (no una tarjeta blanca genérica) con borde perforado y textura de grano — llenar el formulario se siente como llenar un documento oficial real, no un formulario de SaaS. Ver `DynamicForm.tsx`.
- **Style:** sin caja — solo una línea inferior (`border-b-2 border-kraft-ink/25`), como la línea de llenado de un formulario en papel. El fondo es transparente, nunca blanco.
- **Focus:** la línea inferior cambia a `vermilion-dark`. Sin glow ni ring — el sistema no usa sombras decorativas.
- **Labels:** `Label` (ver Typography), asterisco de requerido en `vermilion-dark`, nunca en el rojo puro (falla contraste a ese tamaño).
- **Grupos y repeaters:** `fieldset` con borde `kraft-ink/15`, leyenda en `display`. Los ítems de un repeater llevan un fondo `kraft-2/40` (un tono ligeramente distinto al panel, nunca opacity) para separarse visualmente sin perder contraste; "Eliminar" es un link subrayado en `vermilion-dark`, "+ Agregar" es un botón con borde que se vuelve `vermilion-dark` en hover — nunca el botón sello de goma grande (ese es solo para la acción principal de la página).

### Sello Postal (signature component)
El componente insignia del sistema: `StampFrame` (envoltorio compartido) da a cada tarjeta-estampilla el borde perforado (máscara SVG) MÁS un marco grabado de doble línea inset (`inset-2.5` / `inset-[13px]`, obligatorio — sin el marco interior, la perforación por sí sola se lee como una tarjeta de orillas onduladas cualquiera, no como una estampilla postal), textura de grano de papel (`feTurbulence`), una viñeta ilustrada a línea fina, y una denominación de precio en la esquina inferior — usado en el hero (`HeroStamp`), el catálogo de plantillas y la pantalla de confirmación de `/crear`.

Se probó un matasellos circular (`Postmark`) superpuesto sobre la esquina de la tarjeta, con texto curvo vía `textPath` y una distorsión de "sello de goma gastado" (`feTurbulence` + `feDisplacementMap`). Se descartó en revisión — el concepto no convenció, no fue un problema de ejecución — y se eliminó del código. No reintroducir un matasellos superpuesto sin dirección explícita del usuario.

**Advertencia técnica — z-index dentro de `.kraft-texture`/`.ink-texture`:** ninguna de las dos clases usa un selector `> *` para subir el contenido real por encima del ruido de fondo — un selector así pisa el `position: absolute` de Tailwind en cualquier hijo decorativo (rompió el marco de `StampFrame`, colapsándolo a la altura de su borde). Cada usuario sube su propio contenido con `relative z-10` explícito en el JSX.

## Do's and Don'ts

### Do:
- **Do** reservar el rojo matasellos puro (`#c23b22`) para elementos ≥18px o decorativos grandes — nunca texto pequeño sobre tinta (falla 4.5:1).
- **Do** usar `rojo-matasellos-oscuro` (`#9a2e19`) como fondo real de cualquier botón CTA nuevo.
- **Do** construir cualquier nueva "superficie estampilla" reutilizando la máscara SVG compartida (`StampMaskDefs`), nunca un mask-image de gradiente CSS repetido.
- **Do** comunicar estados deshabilitados/secundarios con un tono sólido distinto (`papel-kraft-mate`), nunca con `opacity` en un contenedor.

### Don't:
- **Don't** agregar un kicker/eyebrow (línea pequeña en mayúsculas) arriba de ningún encabezado — el encabezado carga su propio peso.
- **Don't** usar un glifo Unicode (+, ×, ✓) como ícono — todo ícono se dibuja como SVG propio, mismo grosor de trazo que la ilustración del arco (1.4–1.6px).
- **Don't** introducir cream/blush/pastel en ninguna superficie — el mundo es tinta índigo + kraft + rojo matasellos, no la paleta de sitio de bodas genérico.
- **Don't** usar Bodoni Moda para texto de cuerpo largo, ni Public Sans con peso >600 para titulares — cada fuente tiene un solo trabajo.
