# Sello — DESIGN.md para video (Remotion)

Sistema visual de Sello (invitaciones digitales, México) adaptado a video vertical para Reels, TikTok y Stories. Úsalo como fuente de verdad al construir composiciones en Remotion.

## 1. Esencia de marca
- **Qué es:** invitaciones digitales para bodas, XV años, baby shower, bautizo y cumpleaños. Se comparten por WhatsApp e incluyen RSVP, mapa y cuenta regresiva.
- **Tono:** editorial, cálido, sereno. Elegante sin ser solemne. Español de México, tuteo.
- **Lema/idea central:** "Cada celebración merece una invitación tan cuidada como el momento que anuncia."
- **Verbo de marca:** *sellar* ("Comparte tu sello", "Tres pasos para sellarlo").
- **Handle:** `@sello.invitaciones_digitales`

## 2. Formatos

| Uso | Tamaño | FPS | Duración |
|---|---|---|---|
| Reel / TikTok / Story | 1080×1920 | 30 | 15–30 s |
| Post de feed en video | 1080×1350 | 30 | 6–15 s |
| Cuadrado (ads) | 1080×1080 | 30 | 6–15 s |

**Zonas seguras (1080×1920):** 220 px libres arriba y 380 px abajo (UI de Instagram: caption, botones). 64 px de margen lateral. Todo el texto importante va dentro de `x 64–1016, y 220–1540`.

```ts
// remotion.config / Root.tsx
<Composition id="Reel" component={Reel} width={1080} height={1920} fps={30} durationInFrames={30*20} />
```

## 3. Color

### Marca (base de todo video)
| Token | Hex | Uso |
|---|---|---|
| `carbon` | `#1C1B1B` | Fondo oscuro principal, texto sobre claro |
| `crema` | `#FDF8F8` | Fondo claro principal, texto sobre oscuro |
| `acento` | `#A8927E` | Punto del logo, eyebrows, detalles. Nunca para párrafos largos sobre crema |
| `piedra` | `#E5E2E1` | Fondo alterno claro (citas, pausas) |
| `gris` | `#747878` | Texto secundario sobre crema |
| `linea` | `rgba(28,27,27,.14)` | Bordes y hairlines sobre claro |
| `lineaInv` | `rgba(253,248,248,.3)` | Bordes sobre carbón |

**Glow de fondo oscuro:** `radial-gradient(circle at 50% 30%, rgba(168,146,126,.16), transparent 60%)` sobre `carbon`.

**Reglas:** máximo 2 fondos por video (carbón + crema, o crema + piedra). Sin gradientes llamativos ni neón. Contraste mínimo 4.5:1 en texto pequeño.

### Paletas por plantilla (solo cuando el video muestra esa plantilla)
| Plantilla | Acento | Fondo | Tinta |
|---|---|---|---|
| Cumpleaños · mujer | `#8A3FA8` | `#FFFDF8` | `#2A1F2E` |
| Cumpleaños · hombre | `#C07A3E` | `#16171B` | `#F1EFEC` |
| Cumpleaños · neutro | `#C2553A` | `#FDFAF4` | `#241F1A` |

Para bodas, XV, baby shower y bautizo, toma los tokens de su `.dc.html` o de su handoff (`design_handoff_*/README.md`). La marca Sello (logo, cierre) siempre va en sus colores, no en los de la plantilla.

## 4. Tipografía

| Rol | Fuente | Peso | Notas |
|---|---|---|---|
| Display / titulares / logo | **Libre Caslon Text** | 400 (+ itálica) | `letter-spacing: -0.01em` a `-0.02em` |
| UI / eyebrows / cuerpo | **Plus Jakarta Sans** | 400, 500, 600 | Eyebrows en 600 |

```ts
import { loadFont as caslon } from "@remotion/google-fonts/LibreCaslonText";
import { loadFont as jakarta } from "@remotion/google-fonts/PlusJakartaSans";
export const { fontFamily: serif } = caslon();
export const { fontFamily: sans } = jakarta();
```

### Escala para 1080×1920
| Estilo | Fuente | Tamaño / interlineado | Extra |
|---|---|---|---|
| Hook (gancho) | Caslon | 96 / 1.1 | máx. 6–8 palabras |
| Titular | Caslon | 72 / 1.15 | `text-wrap: balance` |
| Cita | Caslon itálica | 60 / 1.4 | centrada |
| Subtítulo | Caslon | 44 / 1.25 | |
| Cuerpo | Jakarta 400 | 34 / 1.5 | `gris` sobre crema; `rgba(253,248,248,.6)` sobre carbón |
| Eyebrow | Jakarta 600 | 26 | MAYÚSCULAS, `letter-spacing: .22em`, color `acento` |
| Captions de voz | Jakarta 600 | 44 / 1.2 | ver §8 |

Nada por debajo de 26 px en 1080×1920.

## 5. Logo
- Wordmark **Sello** en Libre Caslon Text Regular, `letter-spacing: -2%`, seguido de un **punto circular** en `acento`: diámetro 16.7 % del tamaño de fuente, separación 8.3 %, apoyado en la línea base.
- **Icono:** círculo `acento` con una **S** en Caslon color `crema` (S al ~45 % del diámetro).
- Archivos: `logo/sello-principal.png`, `logo/sello-inverso.png` (sobre carbón), `logo/sello-una-tinta.png`, `logo/sello-icono.png`. Cópialos a `public/` en Remotion y cárgalos con `staticFile()`.
- Ancho mínimo 80 px; por debajo, solo el icono.
- No estirar, no rotar, no cambiar el color del punto, no poner sombras.

```tsx
const Wordmark = ({ size = 120, color = "#FDF8F8" }) => (
  <div style={{ display: "flex", alignItems: "baseline", fontFamily: serif, fontSize: size, color, letterSpacing: "-0.02em" }}>
    Sello
    <span style={{ width: size * 0.167, height: size * 0.167, borderRadius: 9999, background: "#A8927E", marginLeft: size * 0.083 }} />
  </div>
);
```

## 6. Layout y componentes
- **Composición centrada**, un mensaje por escena. Mucho aire: el texto ocupa como máximo el 60 % del alto útil.
- **Separador:** línea de 56×1 px en `linea`, o punto de 8 px en `acento` encima del texto.
- **Tarjetas:** borde de 1 px en `linea`, `border-radius: 12px`, sin sombra.
- **Píldora / CTA:** `border-radius: 9999px`, borde de 1 px en `lineaInv` sobre carbón o relleno `carbon` con texto `crema` sobre claro; padding de 28×56 px.
- **Pasos numerados:** círculo de 88 px en `carbon` (el último en `acento`) con número en Caslon.
- **Mockup de celular:** pantalla de 780×1690 px aprox. con `border-radius: 64px`, borde de 14 px en `#111`, centrado. Dentro va una **grabación de pantalla real** de la plantilla (`<OffthreadVideo>`), nunca una UI redibujada.

## 7. Movimiento
Lento, suave y editorial. Nada de rebotes, sacudidas, zooms agresivos ni glitch.

| Token | Valor |
|---|---|
| Easing por defecto | `Easing.bezier(0.22, 1, 0.36, 1)` (salida suave) |
| Entrada de texto | fade 0→1 + `translateY(24px → 0)`, 18 frames |
| Escalonado entre líneas | 6 frames |
| Salida | fade 1→0, 10 frames |
| Transición entre escenas | crossfade de 12 frames (`@remotion/transitions` `fade()`) |
| Ken Burns en fotos | scale 1 → 1.06 durante toda la escena |
| Punto del logo | aparece al final con `spring({ damping: 200 })` después del wordmark |

```ts
const enter = (frame: number, delay = 0) => {
  const p = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
  return { opacity: p, transform: `translateY(${(1 - p) * 24}px)` };
};
```

**Excepción festiva:** confeti o destellos solo cuando el video muestra la plantilla de cumpleaños o XV, y solo durante el clip de la plantilla, nunca en las escenas de marca.

## 8. Captions (subtítulos de voz)
- Plus Jakarta Sans 600, 44 px, `crema` sobre una caja `rgba(28,27,27,.72)` con `border-radius: 14px` y padding de 14×24, o `carbon` sin caja sobre fondo crema.
- Máximo 2 líneas y unas 5 palabras por bloque. La palabra activa va en `acento`.
- Posición fija en `y ≈ 1380–1500` (encima de la zona del caption de IG).
- Usa `@remotion/captions` con un `.srt` o `.json` de la voz.

## 9. Audio
- Música: piano, cuerdas suaves o lo-fi cálido, 80–100 BPM. Sin drops ni EDM.
- Voz en off cercana, en español mexicano, ritmo pausado.
- Música a -18 LUFS bajo la voz (`volume` ≈ 0.25 mientras hay voz).
- SFX opcional: un "tap" suave al cambiar de escena y un chime breve cuando aparece el logo.

## 10. Estructura de Reel estándar (20 s · 600 frames)

| Frames | Escena | Fondo | Contenido |
|---|---|---|---|
| 0–60 | Hook | carbón + glow | Gancho en Caslon 96, entrada inmediata (sin pantalla vacía) |
| 60–150 | Problema | crema | Eyebrow + titular 72 |
| 150–420 | Demo | carbón | Mockup de celular con screen recording real + 2–3 textos cortos |
| 420–510 | Beneficio | piedra | Cita en Caslon itálica o 3 pasos numerados |
| 510–600 | Cierre | carbón + glow | Icono → wordmark → punto → handle `@sello.invitaciones_digitales` en píldora |

**El primer frame ya debe tener el gancho visible**: Instagram usa ese frame como portada y para frenar el scroll.

## 11. Copy
- Frases cortas, de 6–10 palabras por pantalla.
- Palabras de la marca: *celebración, momento, cuidada, sellar, en minutos, por WhatsApp, confirmaciones*.
- Evita: "revolucionario", "increíble", anglicismos innecesarios, signos de exclamación en exceso.
- Ejemplos: "Crea tu invitación en minutos" · "Tres pasos para sellarlo" · "Un solo pago y queda lista para mandar por WhatsApp."

## 12. No hacer
- Emojis en pantalla, stickers o fuentes extra (Inter, Montserrat, Poppins, etc.).
- Más de un acento de color de marca por escena.
- UI de la invitación generada con IA o redibujada; usa siempre grabaciones reales.
- Texto dentro de las zonas no seguras.
- Animaciones con rebote, rotaciones 3D o efectos de glitch.

## 13. Estructura sugerida del proyecto Remotion
```
src/
  Root.tsx            // Composiciones: Reel, Feed, Square
  theme.ts            // colores, fuentes, easing (secciones 3, 4 y 7)
  components/
    Wordmark.tsx  Icono.tsx  Eyebrow.tsx  Phone.tsx  Captions.tsx  Pill.tsx
  scenes/
    Hook.tsx  Problema.tsx  Demo.tsx  Beneficio.tsx  Cierre.tsx
public/
  logo/…png  screens/plantilla-cumple.mp4  audio/musica.mp3
```

```ts
// theme.ts
export const c = { carbon: "#1C1B1B", crema: "#FDF8F8", acento: "#A8927E", piedra: "#E5E2E1", gris: "#747878", linea: "rgba(28,27,27,.14)", lineaInv: "rgba(253,248,248,.3)" };
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const safe = { top: 220, bottom: 380, side: 64 };
```
