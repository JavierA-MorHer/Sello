import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c, glow, type, safe } from "../theme";
import { entradaFirme } from "../anim";

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.carbon, padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 40 }}>
      <AbsoluteFill style={{ background: glow }} />
      {/* Gancho visible desde el frame 0: es la portada del Reel (§10) */}
      <div style={{ ...type.hook, color: c.crema, textWrap: "balance", position: "relative", ...entradaFirme(f) }}>
        La fiesta empieza cuando llega la invitación.
      </div>
    </AbsoluteFill>
  );
};
