"use client";

import { useFrame } from "@react-three/fiber";
import { tickPalette, palette3 } from "./palette3";
import { CameraRig } from "./CameraRig";
import { NeuralCore } from "./NeuralCore";
import { ParticleField } from "./ParticleField";
import { ProjectMonuments } from "./ProjectMonuments";
import { SkillConstellation } from "./SkillConstellation";
import { ArchiveRings } from "./ArchiveRings";
import { GridFloor } from "./GridFloor";
import { useAppStore } from "../../lib/store";

/**
 * The whole world, composed. No fog on purpose: the LEVEL 05 pull-back
 * is meant to reveal the entire network at once. Depth is conveyed by
 * particle attenuation and the radial grid fade instead.
 */
export function Experience() {
  const quality = useAppStore((s) => s.quality);

  useFrame((_, delta) => {
    tickPalette(delta);
  });

  return (
    <>
      <CameraRig />

      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 9, 4]} intensity={1.35} />
      {/* Accent rim light parked at the missions zone, colored by theme —
          seasoning, not sauce: just enough to tint edges. The color is
          assigned by reference via ref (a JSX color prop would copy the
          value once and never follow the palette lerp). */}
      <pointLight
        ref={(light) => {
          if (light) light.color = palette3.accent;
        }}
        position={[0, 5, -13]}
        intensity={9}
        distance={22}
      />

      <NeuralCore quality={quality} />
      <ParticleField quality={quality} />
      <ProjectMonuments />
      <SkillConstellation />
      <ArchiveRings />
      <GridFloor />
    </>
  );
}
