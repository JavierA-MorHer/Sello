import { interpolate, spring } from "remotion";
import { ease } from "./theme";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** fade + translateY(24→0) en 18 frames */
export const enter = (frame: number, delay = 0, dur = 18) => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { ...cl, easing: ease });
  return { opacity: p, transform: `translateY(${(1 - p) * 24}px)` };
};
/**
 * Entrada del gancho: ya visible en el frame 0 y solo asienta.
 * Instagram usa ese frame como portada del Reel, así que no puede salir en
 * negro (DESIGN.md §10).
 */
export const entradaFirme = (frame: number, dur = 20) => {
  const p = interpolate(frame, [0, dur], [0, 1], { ...cl, easing: ease });
  return { opacity: 1, transform: `translateY(${(1 - p) * 10}px)` };
};
/** fade out en 10 frames antes de 'end' */
export const exit = (frame: number, end: number, dur = 10) =>
  ({ opacity: interpolate(frame, [end - dur, end], [1, 0], cl) });
/** Ken Burns 1 → 1.06 */
export const kenBurns = (frame: number, total: number) =>
  ({ transform: `scale(${interpolate(frame, [0, total], [1, 1.06], cl)})` });
export const soft = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 } });
