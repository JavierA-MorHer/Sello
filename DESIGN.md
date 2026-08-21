---
name: Sello
description: Invitaciones digitales que se sienten hechas a mano, no un formulario de SaaS.
colors:
  paper: "#fdf8f8"
  paper-2: "#f1edec"
  paper-3: "#ebe7e6"
  ink: "#1c1b1b"
  clay: "#a8927e"
  clay-light: "#b9a390"
  error: "#ba1a1a"
typography:
  display:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(2rem, 4.5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  sm: "4px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.paper}"
  chip-badge:
    backgroundColor: "{colors.clay}/15"
    textColor: "{colors.clay}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Sello

## Overview

**Creative North Star: "Papelería cálida, producto real"**

Sello vende una invitación que de verdad funciona — RSVP en tiempo real, enlace único, autosave — no solo una imagen bonita. El sistema visual usa una base clara y cálida (papel, no tinta oscura ni blanco de oficina) con un serif de contraste alto para nombres, fechas y titulares, y una sans utilitaria para todo lo demás. Un único acento (arcilla/taupe) marca los CTAs, las etiquetas y los elementos interactivos — se usa con moderación para que conserve peso.

Este sistema reemplazó una dirección anterior ("El Sello Postal": tinta índigo, papel kraft, rojo matasellos, bordes perforados de estampilla) que se descartó por completo — no quedan componentes ni tokens de esa iteración en el código.

**Key Characteristics:**
- Fondo de página claro y cálido (`paper`, nunca blanco puro ni crema amarillento) — el color por defecto de cualquier superficie.
- Bloques oscuros (`ink`) se reservan para secciones de alto contraste puntuales: precio, confirmación de RSVP, headers superpuestos sobre foto — nunca como fondo general de página.
- Un solo acento de marca (`clay`): CTAs secundarios, labels en mayúsculas, badges, focus de inputs, links. Su escasez relativa es lo que le da peso — si todo es clay, nada lo es.
- Fotografía real (no ilustración ni iconografía decorativa) protagoniza el hero — sin vignettes ni gráficos SVG de "marca".
- Errores usan un rojo dedicado (`error`, `#ba1a1a`) distinto del acento de marca — nunca `clay` para comunicar un error.

## Colors

### Primary
- **Papel** (`#fdf8f8`): fondo de página por defecto y de cualquier superficie de contenido (tarjetas, paneles de formulario).
- **Papel 2** (`#f1edec`): fondo de sección alterna, para separar bloques sin usar una línea divisoria dura.
- **Papel 3** (`#ebe7e6`): superficies de placeholder/skeleton (fotos pendientes, mapas sin cargar).
- **Tinta** (`#1c1b1b`): color de texto por defecto sobre papel, y fondo de los bloques de alto contraste (precio, RSVP, headers sobre foto). Sirve doble función — nunca ambigua porque el contexto (texto vs. contenedor) lo deja claro.
- **Arcilla** (`#a8927e`): único acento de marca — CTAs secundarios, labels, badges, bordes de foco, links. Con suficiente contraste sobre `paper` para texto pequeño (a diferencia del rojo matasellos del sistema anterior, que fallaba ese piso).
- **Arcilla clara** (`#b9a390`): hover de cualquier elemento con fondo `clay`.
- **Error** (`#ba1a1a`): exclusivo para mensajes de error de formulario/pago. Nunca se usa para otra cosa, para que el usuario lo reconozca sin ambigüedad.

### Named Rules
**La Regla del Acento Único.** `clay` es el único color con función de marca. Si una superficie nueva necesita destacar, la respuesta casi nunca es "otro acento" — es tipografía display, tamaño, o un fondo `ink`.

## Typography

**Display Font:** Libre Caslon Text (fallback: Georgia, serif) — incluye una variante itálica usada para conectores ("&", "y") entre nombres.
**Body Font:** Plus Jakarta Sans (fallback: system-ui, sans-serif)

### Hierarchy
- **Display** (400, `clamp(2rem, 4.5vw, 3.5rem)`, 1.08): H1 de hero, titulares de sección, nombres de pareja/festejado, cifras de precio.
- **Body** (400, 1rem, 1.6): párrafos de cuerpo, máximo ~65ch de medida.
- **Label** (600, 0.75rem, tracking 0.14em, mayúsculas): etiquetas de estado y de sección ("RSVP ACTIVO", "CÓMO FUNCIONA"), en `ink/50-60` o `clay` según si es informativa o de acento.

### Named Rules
**La Regla del Serif con Voz.** Libre Caslon Text es la única fuente con personalidad (incluida su itálica). Plus Jakarta Sans nunca pasa de peso 600 ni lleva tracking decorativo grande — dos fuentes, dos trabajos, sin superposición.

## Layout

Contenedor máximo de 6xl (72rem) para landing, 4xl para bloques de precio/checkout, 2xl para formularios — más angosto entre más "una sola tarea" es la pantalla. Padding horizontal `px-4` en mobile subiendo a `px-6` desde `sm:`. Secciones alternan `paper` / `paper-2` para marcar ritmo de scroll, con `border-t border-ink/6` como única separación.

## Elevation & Depth

Sistema mayormente plano. Las tarjetas se diferencian por borde (`border-ink/6` a `/15`) y, cuando flotan sobre una foto (la tarjeta de vista previa del hero), una sombra suave (`shadow-[0_12px_40px_rgba(28,27,27,0.12)]`) — nunca sombras duras ni múltiples capas de elevación.

## Shapes

- **Radio por defecto:** `rounded-sm` (4px) en tarjetas, botones, inputs y chips.
- **Tarjetas de plantilla:** proporción `aspect-[5/7]`, marco interior fino en `clay/40` alrededor del nombre — sin bordes perforados ni máscaras SVG (ese lenguaje era exclusivo del sistema anterior y no se reintroduce).
- **Badges de estado:** píldora (`rounded-full`) — `clay/15` de fondo + texto `clay` para estados positivos ("RSVP activo"), `ink/6` + texto `ink/60` para estados neutrales/informativos.

## Components

### Buttons
- **Shape:** `rounded-sm`.
- **Primary:** fondo `ink`, texto `paper`, hover a `clay` (transición de color simple, sin efecto de "sello" ni desplazamiento).
- **Secondary (sobre bloque oscuro):** fondo `clay`, texto `ink`, hover a `clay-light`.
- **Terciario:** sin fondo, borde `ink/15` a `ink/30`, o link subrayado en `clay`.

### Cards / Containers
- **Corner Style:** `rounded-sm`.
- **Background:** `paper` por defecto; `ink` para el bloque que debe leerse como el punto de máximo contraste de la pantalla (precio, RSVP, confirmación).
- **Border:** `border-ink/6` a `/15` según qué tanto debe separarse del fondo.

### Navigation
- Header transparente absoluto sobre el hero fotográfico. Wordmark "Sello" en display a la izquierda, un solo link ("Entrar") a la derecha — sin menú de anclas; la landing es corta y se navega con scroll.

### Inputs / Fields
- **Style:** caja completa — `border border-ink/15`, `rounded-sm`, fondo `paper`. (El sistema anterior usaba solo una línea inferior; se abandonó junto con el resto de la estética "papel oficial".)
- **Focus:** el borde cambia a `clay`. Sin ring ni glow.
- **Labels:** `Label` (ver Typography) en `ink/60`; asterisco de requerido en `clay`.
- **Grupos y repeaters:** `fieldset` con borde `ink/10`; los ítems de un repeater usan fondo `paper-3/50` para separarse sin depender de opacity sobre el texto. "Eliminar" es un link subrayado en `error` (no `clay` — es una acción destructiva, no de marca); "+ Agregar" es un botón con borde que se vuelve `clay` en hover.

## Do's and Don'ts

### Do:
- **Do** usar `ink` como fondo de página/texto por defecto y reservar `ink` como fondo de bloque solo para el punto de máximo contraste de cada pantalla.
- **Do** usar `clay` para todo lo que sea interactivo o de marca (CTAs secundarios, focus, labels, links) — y nada más.
- **Do** usar `error` (nunca `clay`) para cualquier mensaje de error.

### Don't:
- **Don't** reintroducir bordes perforados, máscaras SVG de "estampilla", tinta índigo o rojo matasellos — esa dirección se evaluó y se reemplazó por completo.
- **Don't** usar Libre Caslon Text para texto de cuerpo largo, ni Plus Jakarta Sans con peso >600 para titulares.
- **Don't** agregar una segunda familia tipográfica o un segundo acento de color sin revisar antes con el dueño de producto.
