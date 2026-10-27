import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c, type, safe } from "../theme";
import { enter } from "../anim";

export const Beneficio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.piedra, padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 40 }}>
      <span style={{ width: 12, height: 12, borderRadius: 9999, background: c.acento, ...enter(f, 0) }} />
      <div style={{ ...type.cita, color: c.carbon, textWrap: "pretty", ...enter(f, 4) }}>
        Cada celebración merece una invitación tan cuidada como el momento que anuncia.
      </div>
      <div style={{ width: 56, height: 1, background: "rgba(28,27,27,.3)", ...enter(f, 10) }} />
    </AbsoluteFill>
  );
};
