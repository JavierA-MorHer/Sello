import { OffthreadVideo, staticFile } from "remotion";

/**
 * Mockup de celular (DESIGN.md §6). Dentro va SIEMPRE grabación real de la
 * plantilla, nunca UI redibujada.
 *
 * Con `children` el marco queda fijo y tú controlas qué va en la pantalla
 * (p. ej. varios clips encadenados): así el crossfade ocurre solo en el
 * contenido y el bisel no parpadea.
 */
export const Phone: React.FC<{
  src?: string;
  width?: number;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src = "screens/plantilla.mp4", width = 780, startFrom = 0, children }) => {
  const h = width * 2.166;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        borderRadius: width * 0.082,
        border: "14px solid #111",
        overflow: "hidden",
        background: "#000",
        boxShadow: "0 40px 120px rgba(0,0,0,.45)",
      }}
    >
      {children ?? (
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
};

/** Un clip a pantalla completa dentro del marco, con crossfade de entrada/salida. */
export const PhoneClip: React.FC<{ src: string; opacity: number }> = ({ src, opacity }) => (
  <OffthreadVideo
    src={staticFile(src)}
    muted
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }}
  />
);
