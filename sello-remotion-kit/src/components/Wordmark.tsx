import { useCurrentFrame, useVideoConfig } from "remotion";
import { c, serif } from "../theme";
import { soft } from "../anim";

/** Logo Sello: wordmark + punto (16.7% del cuerpo, separado 8.3%, en línea base). animate=true hace aparecer el punto al final. */
export const Wordmark: React.FC<{ size?: number; color?: string; animate?: boolean; delay?: number }> =
  ({ size = 120, color = c.crema, animate = false, delay = 0 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = animate ? soft(frame, fps, delay) : 1;
  const d = size * 0.167;
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontFamily: serif, fontSize: size, color, letterSpacing: "-0.02em", lineHeight: 1 }}>
      Sello
      <span style={{ width: d, height: d, borderRadius: 9999, background: c.acento, marginLeft: size * 0.083, transform: `scale(${s})`, flexShrink: 0 }} />
    </div>
  );
};
