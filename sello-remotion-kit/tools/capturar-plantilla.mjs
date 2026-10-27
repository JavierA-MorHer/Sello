/**
 * Graba la plantilla REAL del app local y la encoda a mp4 (DESIGN.md §6: el
 * mockup lleva grabación real, nunca UI redibujada).
 *
 * Graba por TRAMOS en vez de un scroll de punta a punta: así cada texto del
 * reel cae sobre la sección que está hablando, y se salta la galería (en los
 * datos demo repite la misma foto seis veces y en video se nota).
 *
 * Uso:  node tools/capturar-plantilla.mjs
 * Requiere el dev server de la app en :3000.
 */
import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const BASE = process.env.SELLO_BASE ?? "http://localhost:3000";
const ID = process.env.SELLO_TEMPLATE ?? "7a747ccd-6de0-4568-b483-8a09045d7f98"; // Boda

// 420x910 a 2x = 840x1820: misma proporción (1:2.167) que la pantalla de
// <Phone>, y ancho de layout móvil (por debajo del breakpoint sm: de Tailwind).
const VW = 420, VH = 910, DPR = 2, FPS = 30;

// Offsets tomados de tools/mapa-secciones.mjs sobre la plantilla Boda.
const TRAMOS = [
  // Cada tramo corta antes de donde empieza el siguiente: si se solapan, el
  // crossfade del reel repite la misma sección y se lee como un salto.
  { nombre: "boda-portada", desde: 0,    hasta: 780,  frames: 102 }, // portada + cuenta regresiva
  { nombre: "boda-lugar",   desde: 1400, hasta: 2020, frames: 102 }, // dónde y cuándo + mapas
  { nombre: "boda-rsvp",    desde: 4050, hasta: 4560, frames: 102 }, // confirmación de asistencia
];
const HOLD_IN = 18, HOLD_OUT = 16;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: DPR,
  locale: "es-MX",
  timezoneId: "America/Mexico_City",
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();
await page.goto(`${BASE}/demo/${ID}`, { waitUntil: "networkidle" });

// Oculta el chrome de producto (barra "← Plantillas / Crear la mía"): en el
// mockup queremos la invitación, no la navegación del sitio. Es CSS de este
// render, no se toca la app.
await page.addStyleTag({
  content: `.sticky{display:none!important}
            html{scroll-behavior:auto!important}
            *{caret-color:transparent!important}
            ::-webkit-scrollbar{display:none!important}
            /* indicador de dev tools de Next: no es parte de la invitación */
            nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}`,
});
// El overlay de Next vive en un custom element con shadow DOM y se vuelve a
// montar; el CSS no siempre basta, así que lo arrancamos del DOM.
const quitarOverlayNext = () =>
  page.evaluate(() =>
    document.querySelectorAll("nextjs-portal,[data-nextjs-toast],#__next-build-watcher")
      .forEach((n) => n.remove())
  );
await quitarOverlayNext();
await page.evaluate(() => document.fonts.ready);
// Pasada completa para que carguen las fotos y se disparen los reveals.
await page.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
});
await page.waitForTimeout(1500);

for (const t of TRAMOS) {
  const tmp = `out/frames-${t.nombre}`;
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });

  await page.evaluate((v) => window.scrollTo(0, v), t.desde);
  await page.waitForTimeout(1200); // que asiente el tramo antes del primer frame

  const mover = t.frames - HOLD_IN - HOLD_OUT;
  for (let f = 0; f < t.frames; f++) {
    const p = Math.min(1, Math.max(0, (f - HOLD_IN) / mover));
    // ease-in-out: arranca y frena suave, velocidad constante en medio (§7)
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const y = Math.round(t.desde + e * (t.hasta - t.desde));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    if (f % 15 === 0) await quitarOverlayNext();
    await page.screenshot({ path: `${tmp}/f${String(f).padStart(4, "0")}.png` });
  }
  console.log(`${t.nombre}: ${t.frames} frames (${t.desde}→${t.hasta}px)`);

  const dest = `public/screens/${t.nombre}.mp4`;
  // shell:true — en Windows spawnSync no resuelve npx sin shell.
  const r = spawnSync("npx",
    ["remotion", "ffmpeg", "-y", "-framerate", String(FPS), "-i", `${tmp}/f%04d.png`,
     "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", dest],
    { stdio: ["ignore", "ignore", "inherit"], shell: true });
  if (r.status !== 0) throw new Error(`ffmpeg falló en ${t.nombre}`);
  console.log(`  → ${dest}`);
}
await browser.close();
console.log("listo");
