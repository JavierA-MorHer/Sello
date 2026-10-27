import { useCurrentFrame } from "remotion";
import { c, serif, sans } from "../theme";
import { enter } from "../anim";
export const Steps: React.FC<{ items: { t: string; d: string }[]; delay?: number }> = ({ items, delay = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56, width: "100%" }}>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, ...enter(f, delay + i * 8) }}>
          <span style={{ width: 88, height: 88, borderRadius: 9999, flexShrink: 0, background: i === items.length - 1 ? c.acento : c.carbon, color: c.crema, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 38 }}>{i + 1}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: serif, fontSize: 46, color: c.carbon }}>{s.t}</span>
            <span style={{ fontFamily: sans, fontSize: 30, color: c.gris, lineHeight: 1.45 }}>{s.d}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
