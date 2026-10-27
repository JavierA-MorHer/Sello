import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c, glow, type } from "../theme";
import { enter } from "../anim";
import { Icono } from "../components/Icono";
import { Wordmark } from "../components/Wordmark";
import { Pill } from "../components/Pill";

export const Cierre: React.FC<{ handle?: string }> = ({ handle = "@sello.invitaciones_digitales" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.carbon, alignItems: "center", justifyContent: "center", gap: 48 }}>
      <AbsoluteFill style={{ background: glow }} />
      <div style={enter(f, 0)}><Icono size={170} /></div>
      <div style={enter(f, 8)}><Wordmark size={140} animate delay={22} /></div>
      <div style={{ ...type.eyebrow, color: c.acento, ...enter(f, 16) }}>Invitaciones digitales</div>
      <div style={{ marginTop: 40, ...enter(f, 30) }}><Pill>{handle}</Pill></div>
    </AbsoluteFill>
  );
};
