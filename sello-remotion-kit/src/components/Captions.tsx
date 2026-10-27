import { useCurrentFrame, useVideoConfig } from "remotion";
import { c, sans } from "../theme";

export type Word = { text: string; startMs: number; endMs: number };
/** Subtítulos: bloques de ~5 palabras, palabra activa en acento, fijos en y≈1380–1500. */
export const Captions: React.FC<{ words: Word[]; perBlock?: number; onLight?: boolean }> = ({ words, perBlock = 5, onLight = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const blocks: Word[][] = [];
  for (let i = 0; i < words.length; i += perBlock) blocks.push(words.slice(i, i + perBlock));
  const block = blocks.find(b => ms >= b[0].startMs && ms <= b[b.length - 1].endMs);
  if (!block) return null;
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 1380, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 900, textAlign: "center", fontFamily: sans, fontWeight: 600, fontSize: 44, lineHeight: 1.2,
        padding: onLight ? 0 : "14px 24px", borderRadius: 14, background: onLight ? "transparent" : "rgba(28,27,27,.72)",
        color: onLight ? c.carbon : c.crema }}>
        {block.map((w, i) => (
          <span key={i} style={{ color: ms >= w.startMs && ms <= w.endMs ? c.acento : undefined }}>{w.text}{" "}</span>
        ))}
      </div>
    </div>
  );
};
