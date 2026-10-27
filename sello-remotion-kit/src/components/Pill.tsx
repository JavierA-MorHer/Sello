import { c, sans } from "../theme";
/** Píldora con handle o CTA. dark=true para fondo carbón. */
export const Pill: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "28px 56px", borderRadius: 9999,
    border: dark ? `1px solid ${c.lineaInv}` : "none", background: dark ? "transparent" : c.carbon,
    color: c.crema, fontFamily: sans, fontSize: 34, letterSpacing: ".04em" }}>
    <span style={{ width: 28, height: 28, borderRadius: 9999, background: c.acento }} />
    {children}
  </div>
);
