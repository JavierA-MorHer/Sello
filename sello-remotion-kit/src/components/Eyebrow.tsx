import { c, type } from "../theme";
export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = c.acento }) => (
  <div style={{ ...type.eyebrow, color, paddingLeft: ".22em" }}>{children}</div>
);
