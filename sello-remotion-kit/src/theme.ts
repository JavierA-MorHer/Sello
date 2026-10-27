import { Easing } from "remotion";
import { loadFont as caslon } from "@remotion/google-fonts/LibreCaslonText";
import { loadFont as jakarta } from "@remotion/google-fonts/PlusJakartaSans";

export const serif = caslon("normal", { weights: ["400"] }).fontFamily;
caslon("italic", { weights: ["400"] });
export const sans = jakarta("normal", { weights: ["400", "500", "600"] }).fontFamily;

export const c = {
  carbon: "#1C1B1B", crema: "#FDF8F8", acento: "#A8927E", piedra: "#E5E2E1", gris: "#747878",
  linea: "rgba(28,27,27,.14)", lineaInv: "rgba(253,248,248,.3)", cuerpoInv: "rgba(253,248,248,.6)",
};
export const glow = "radial-gradient(circle at 50% 30%, rgba(168,146,126,.16), transparent 60%)";
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const safe = { top: 220, bottom: 380, side: 64 };
export const type = {
  hook: { fontFamily: serif, fontSize: 96, lineHeight: 1.1, letterSpacing: "-0.02em" },
  titular: { fontFamily: serif, fontSize: 72, lineHeight: 1.15, letterSpacing: "-0.01em" },
  cita: { fontFamily: serif, fontSize: 60, lineHeight: 1.4, fontStyle: "italic" as const },
  sub: { fontFamily: serif, fontSize: 44, lineHeight: 1.25 },
  cuerpo: { fontFamily: sans, fontSize: 34, lineHeight: 1.5 },
  eyebrow: { fontFamily: sans, fontSize: 26, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase" as const },
};
export const plantillas = {
  cumpleMujer: { acento: "#8A3FA8", fondo: "#FFFDF8", tinta: "#2A1F2E" },
  cumpleHombre: { acento: "#C07A3E", fondo: "#16171B", tinta: "#F1EFEC" },
  cumpleNeutro: { acento: "#C2553A", fondo: "#FDFAF4", tinta: "#241F1A" },
};
