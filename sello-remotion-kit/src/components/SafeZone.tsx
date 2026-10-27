import { AbsoluteFill, Img, staticFile } from "remotion";
/** Overlay de guía. Úsalo solo en Studio: <SafeZone show={true}/>. Nunca en el render final. */
export const SafeZone: React.FC<{ show?: boolean; format?: "1080x1920" | "1080x1350" | "1080x1080" }> = ({ show = false, format = "1080x1920" }) =>
  show ? <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}><Img src={staticFile(`guias/safe-zone-${format}.png`)} /></AbsoluteFill> : null;
