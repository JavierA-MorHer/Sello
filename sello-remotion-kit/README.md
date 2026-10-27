# Sello · Kit de video para Remotion

## Contenido
- `DESIGN.md`: sistema visual completo (colores, tipos, movimiento, zonas seguras, estructura de Reel).
- `public/logo/`: logos PNG oficiales + `svg/` (wordmark carbón/crema, icono, punto).
- `public/fondos/`: fondos carbón, carbón con glow, crema y piedra en 1080×1920 / 1350 / 1080.
- `public/guias/`: overlays de zona segura (PNG transparentes) por formato.
- `guias/paleta.png`: hoja de paleta de referencia.
- `public/captions/ejemplo.json`: formato de palabras con tiempos para `<Captions>`.
- `public/screens/`: grabaciones reales de plantillas (generadas, no versionadas).
- `src/`: proyecto Remotion: theme, animaciones, componentes (Wordmark, Icono, Eyebrow, Pill, Phone, Captions, Steps, SafeZone) y escenas (Hook, Problema, Demo, Beneficio, Pasos, Cierre).
- `tools/`: scripts de captura de pantalla de la app real.

## Uso
```bash
npm install
npm run dev        # Remotion Studio
npm run render     # out/reel.mp4
npm run typecheck
```

## Grabaciones de la plantilla

La escena `Demo` muestra una grabación **real** de la plantilla (DESIGN.md §6:
nunca UI redibujada). Se genera desde la app de Next, no se graba a mano:

```bash
# 1) en la raíz del repo, con .env.local configurado
npm run dev
# 2) en sello-remotion-kit/
npm run capturar
```

`tools/capturar-plantilla.mjs` abre `/demo/<templateId>` en un viewport de
celular (420×910 a 2x), oculta el chrome de producto y el indicador de dev de
Next, recorre tres tramos con scroll lento y encoda cada uno a
`public/screens/*.mp4` con el ffmpeg que trae Remotion.

Los tramos y el `templateId` se configuran arriba del script. Por defecto usa
la plantilla **Boda** y graba portada + cuenta regresiva, ubicación + mapas, y
RSVP. Se salta la galería a propósito: los datos demo repiten la misma foto
seis veces y en video se nota.

`tools/mapa-secciones.mjs` imprime el offset de cada sección de una plantilla
— úsalo para recalcular los tramos si cambia el layout o si grabas otra
plantilla.

## Antes de publicar
1. (Opcional) Pon tu música en `public/audio/musica.mp3` y pasa `music: true`
   a la composición `Reel`. Sin eso el render sale mudo.
2. `showGuides` ya está en `false`; ponlo en `true` en Studio si necesitas ver
   las zonas seguras.
3. Edita los textos dentro de `src/scenes/`.

Las fuentes (Libre Caslon Text, Plus Jakarta Sans) se cargan solas con
`@remotion/google-fonts`. Los SVG del wordmark usan Libre Caslon vía web; para
diseño fuera de Remotion, prefiere los PNG.

## Notas
- El kit usa **React 19**: `@remotion/transitions` 4.0.5xx está compilado
  contra React 19 y el bundle falla con React 18.
- No hay composición `Feed` (1080×1350) todavía; las escenas están medidas
  para 1080×1920. Habría que reajustar zonas seguras antes de agregarla.
