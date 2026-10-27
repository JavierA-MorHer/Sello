import { Composition } from "remotion";
import { Reel } from "./Reel";
import { Pasos } from "./scenes/Pasos";
import { Cierre } from "./scenes/Cierre";

export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30} durationInFrames={600} defaultProps={{ showGuides: false, music: false }} />
    <Composition id="Pasos" component={Pasos} width={1080} height={1920} fps={30} durationInFrames={150} />
    <Composition id="Cierre" component={Cierre} width={1080} height={1920} fps={30} durationInFrames={96} />
  </>
);
