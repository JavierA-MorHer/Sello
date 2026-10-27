import { c, serif } from "../theme";
export const Icono: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <div style={{ width: size, height: size, borderRadius: 9999, background: c.acento, color: c.crema, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: size * 0.45, boxShadow: "inset 0 -4px 12px rgba(28,27,27,.2)" }}>S</div>
);
