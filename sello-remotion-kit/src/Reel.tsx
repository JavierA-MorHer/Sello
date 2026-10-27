import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Hook } from "./scenes/Hook";
import { Problema } from "./scenes/Problema";
import { Demo } from "./scenes/Demo";
import { Beneficio } from "./scenes/Beneficio";
import { Cierre } from "./scenes/Cierre";
import { SafeZone } from "./components/SafeZone";

const T = linearTiming({ durationInFrames: 12 });
/** Estructura estándar 20 s (ver DESIGN.md §10). Cambia showGuides a false antes de renderizar. */
export const Reel: React.FC<{ showGuides?: boolean; music?: boolean }> = ({ showGuides = false, music = false }) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={66}><Hook /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={102}><Problema /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={282}><Demo /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={102}><Beneficio /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={96}><Cierre /></TransitionSeries.Sequence>
    </TransitionSeries>
    {music && <Audio src={staticFile("audio/musica.mp3")} volume={0.25} />}
    <SafeZone show={showGuides} />
  </AbsoluteFill>
);
