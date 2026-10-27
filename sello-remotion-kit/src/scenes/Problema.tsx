import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c, type, safe } from "../theme";
import { enter } from "../anim";
import { Eyebrow } from "../components/Eyebrow";
export const Problema: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.crema, padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 40 }}>
      <div style={enter(f, 0)}><Eyebrow>Lo de siempre</Eyebrow></div>
      <div style={{ ...type.titular, color: c.carbon, textWrap: "balance", ...enter(f, 6) }}>
        La de papel se pierde. Y nunca sabes quién va.
      </div>
    </AbsoluteFill>
  );
};
