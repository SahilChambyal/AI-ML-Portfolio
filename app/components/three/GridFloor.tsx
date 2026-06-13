"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { palette3 } from "./palette3";
import { gridVertex, gridFragment } from "./shaders";

/**
 * The world floor — an anti-aliased shader grid that dissolves radially,
 * grounding the monuments and giving scroll travel a speed reference.
 */
export function GridFloor() {
  const assets = useMemo(() => {
    const geo = new THREE.PlaneGeometry(110, 110, 1, 1);
    const mat = new THREE.ShaderMaterial({
      vertexShader: gridVertex,
      fragmentShader: gridFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uBg: { value: palette3.bg },
        uLine: { value: palette3.primary },
        uOpacity: { value: 0.3 },
      },
    });
    return { geo, mat };
  }, []);

  useEffect(() => {
    return () => {
      assets.geo.dispose();
      assets.mat.dispose();
    };
  }, [assets]);

  return (
    <mesh
      geometry={assets.geo}
      material={assets.mat}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.2, -18]}
    />
  );
}
