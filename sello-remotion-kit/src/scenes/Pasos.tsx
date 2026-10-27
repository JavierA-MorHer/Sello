import { AbsoluteFill, useCurrentFrame } from "remotion";
import { c, type, safe } from "../theme";
import { enter } from "../anim";
import { Eyebrow } from "../components/Eyebrow";
import { Steps } from "../components/Steps";
export const Pasos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.crema, padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 40 }}>
      <div style={enter(f, 0)}><Eyebrow>Cómo funciona</Eyebrow></div>
      <div style={{ ...type.titular, color: c.carbon, marginBottom: 32, ...enter(f, 4) }}>Tres pasos para sellarlo</div>
      <Steps delay={10} items={[
        { t: "Elige tu estilo", d: "Cada plantilla ya luce impecable." },
        { t: "Cuenta tu historia", d: "Nombres, fecha, lugar y fotos." },
        { t: "Comparte tu sello", d: "Lista para mandar por WhatsApp." },
      ]} />
    </AbsoluteFill>
  );
};
