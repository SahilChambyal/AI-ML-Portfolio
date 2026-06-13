"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { palette3 } from "./palette3";
import { useAppStore } from "../../lib/store";
import { pointsVertex, pointsFragment } from "./shaders";
import { mulberry32 } from "./random";

/**
 * Ambient dust spanning the whole journey volume. A single draw call;
 * drift lives in the vertex shader. Colors blend foreground→accent so
 * the field stays legible on light palettes (dark specks) and dark ones
 * (bright signals) without branching.
 */
export function ParticleField({ quality }: { quality: "high" | "low" }) {
  const points = useRef<THREE.Points>(null);

  const assets = useMemo(() => {
    const rand = mulberry32(7);
    const count = quality === "high" ? 2400 : 1100;

    const positions = new Float32Array(count * 3);
    const aRand = new Float32Array(count);
    const aMix = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() * 2 - 1) * 30;
      positions[i * 3 + 1] = -2 + rand() * 16;
      positions[i * 3 + 2] = 14 - rand() * 68;
      aRand[i] = rand();
      aMix[i] = rand() < 0.82 ? 0 : 1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    geo.setAttribute("aMix", new THREE.BufferAttribute(aMix, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.5 },
        uMaxSize: { value: 5.0 },
        uDrift: { value: 0.6 },
        uColorA: { value: palette3.fg },
        uColorB: { value: palette3.accent },
        uOpacity: { value: 0.38 },
      },
    });

    return { geo, mat };
  }, [quality]);

  useEffect(() => {
    return () => {
      assets.geo.dispose();
      assets.mat.dispose();
    };
  }, [assets]);

  useFrame((state) => {
    if (useAppStore.getState().reducedMotion) return;
    if (points.current) {
      (points.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return <points ref={points} geometry={assets.geo} material={assets.mat} frustumCulled={false} />;
}
