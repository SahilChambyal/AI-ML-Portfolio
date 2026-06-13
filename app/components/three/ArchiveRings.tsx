"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { palette3 } from "./palette3";
import { useAppStore } from "../../lib/store";

/**
 * LEVEL 04 — a quiet ring corridor the camera looks into while reading
 * the education/achievements archive. Five concentric gates, slowly
 * counter-rotating. Calm by design: this level is for reading.
 */
export function ArchiveRings() {
  const group = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const geo = new THREE.TorusGeometry(3.2, 0.025, 8, 80);
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.3 });
    mat.color = palette3.primary;
    const accentGeo = new THREE.TorusGeometry(3.2, 0.012, 8, 80);
    const accentMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 });
    accentMat.color = palette3.accent;
    return { geo, mat, accentGeo, accentMat };
  }, []);

  useEffect(() => {
    return () => {
      assets.geo.dispose();
      assets.mat.dispose();
      assets.accentGeo.dispose();
      assets.accentMat.dispose();
    };
  }, [assets]);

  useFrame((_, delta) => {
    if (useAppStore.getState().reducedMotion) return;
    const g = group.current;
    if (!g) return;
    g.children.forEach((ring, i) => {
      ring.rotation.z += delta * 0.05 * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group ref={group} position={[0, 1.2, -46]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          geometry={i === 2 ? assets.accentGeo : assets.geo}
          material={i === 2 ? assets.accentMat : assets.mat}
          position={[0, 0, -i * 2.4]}
          scale={1 + i * 0.18}
        />
      ))}
    </group>
  );
}
