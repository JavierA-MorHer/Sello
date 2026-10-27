import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { c, glow, type, safe } from "../theme";
import { enter } from "../anim";
import { Phone, PhoneClip } from "../components/Phone";

/**
 * Demo: tres tramos de grabación REAL de la plantilla Boda encadenados con
 * crossfade dentro de un mismo marco de celular. Cada texto cae sobre el
 * tramo del que habla (capturas hechas con tools/capturar-plantilla.mjs).
 */
const CLIP = 102;      // frames por tramo
const CRUCE = 12;      // crossfade entre tramos (§7)
const PASO = CLIP - CRUCE;
export const DEMO_FRAMES = CLIP * 3 - CRUCE * 2; // 282

const TRAMOS = [
  { src: "screens/boda-portada.mp4", texto: "Llega por WhatsApp y se abre así" },
  { src: "screens/boda-lugar.mp4", texto: "Ubicación, mapa y cómo llegar" },
  { src: "screens/boda-rsvp.mp4", texto: "Confirmaciones en tiempo real" },
];

// Geometría: celular arriba, texto en la banda baja. Todo dentro de la zona
// segura (texto entre y 220 y 1540, §2) y sin que el texto pise el mockup.
const PHONE_W = 520;                       // alto = 520 × 2.166 ≈ 1126
const PHONE_TOP = 240;                     // → base del celular en y ≈ 1366
const TEXTO_TOP = 1412;                    // → una línea de 44px cierra en ~1467

export const Demo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.carbon }}>
      <AbsoluteFill style={{ background: glow }} />

      <div style={{ position: "absolute", top: PHONE_TOP, left: 0, right: 0, display: "flex", justifyContent: "center", ...enter(f, 0, 24) }}>
        <Phone width={PHONE_W}>
          {TRAMOS.map((t, i) => (
            <Sequence key={t.src} from={i * PASO} durationInFrames={CLIP} layout="none">
              <Clip src={t.src} primero={i === 0} ultimo={i === TRAMOS.length - 1} />
            </Sequence>
          ))}
        </Phone>
      </div>

      {TRAMOS.map((t, i) => (
        <Sequence key={t.texto} from={i * PASO + 10} durationInFrames={PASO - 4} layout="none">
          <Linea texto={t.texto} dura={PASO - 4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Crossfade de 12 frames: entra salvo el primero, sale salvo el último. */
const Clip: React.FC<{ src: string; primero: boolean; ultimo: boolean }> = ({ src, primero, ultimo }) => {
  const f = useCurrentFrame();
  const dentro = primero ? 1 : interpolate(f, [0, CRUCE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fuera = ultimo ? 1 : interpolate(f, [CLIP - CRUCE, CLIP], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <PhoneClip src={src} opacity={Math.min(dentro, fuera)} />;
};

const Linea: React.FC<{ texto: string; dura: number }> = ({ texto, dura }) => {
  const f = useCurrentFrame();
  const salida = interpolate(f, [dura - 10, dura], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e = enter(f, 0);
  return (
    <div
      style={{
        position: "absolute",
        top: TEXTO_TOP,
        left: safe.side,
        right: safe.side,
        textAlign: "center",
        ...type.sub,
        color: c.crema,
        ...e,
        opacity: e.opacity * salida,
      }}
    >
      {texto}
    </div>
  );
};
