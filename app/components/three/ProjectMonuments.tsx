"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { palette3 } from "./palette3";
import { useAppStore } from "../../lib/store";
import { mulberry32 } from "./random";

const MONUMENT_X = [-5.6, 0, 5.6];
const MONUMENT_Z = -16;

function makeStandardMat(roughness = 0.38, metalness = 0.15): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    roughness,
    metalness,
    flatShading: true,
    emissiveIntensity: 0.15,
  });
  // Shared palette colors by reference — theme switches sweep these live.
  mat.color = palette3.primary;
  mat.emissive = palette3.accent;
  return mat;
}

/**
 * LEVEL 02 — one procedural monument per mission. Hovering the matching
 * DOM card raises the monument's "energy": emissive glow, scale breath
 * and spin all ease up. The forms are project metaphors, not decoration:
 * an organic crystal (crop vision), a tri-axis orbital (tri-source RAG),
 * a stacked data obelisk (price regression).
 */
export function ProjectMonuments() {
  const group0 = useRef<THREE.Group>(null);
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const energy = useRef([0, 0, 0]);
  const obeliskRef = useRef<THREE.InstancedMesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringCoreRef = useRef<THREE.Mesh>(null);

  const assets = useMemo(() => {
    const rand = mulberry32(2025);
    const dispose: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T): T => {
      dispose.push(x);
      return x;
    };

    // 01 BIO-CORE — clustered crystals.
    const crystalGeos = [0.95, 0.62, 0.45].map((r) => track(new THREE.DodecahedronGeometry(r, 0)));
    const crystalMat = track(makeStandardMat(0.3, 0.05));

    // 02 TRI-RING — three rings, three retrieval sources. Low metalness:
    // there is no environment map, so high values just read as gray.
    const ringGeo = track(new THREE.TorusGeometry(1.15, 0.045, 12, 72));
    const ringMat = track(makeStandardMat(0.3, 0.2));
    const ringCoreGeo = track(new THREE.IcosahedronGeometry(0.42, 1));
    const ringCoreMat = track(makeStandardMat(0.3, 0.1));

    // 03 DATA OBELISK — a column of bars, like a histogram set on end.
    const barGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const barMat = track(makeStandardMat(0.45, 0.2));
    const barCount = 13;
    const barScales = Array.from({ length: barCount }, (_, i) => {
      const falloff = 1 - Math.abs(i - barCount / 2) / barCount;
      return 0.55 + falloff * 1.3 + rand() * 0.25;
    });

    // Pedestal ring shared by all three.
    const pedestalGeo = track(new THREE.TorusGeometry(2.0, 0.022, 8, 64));
    const pedestalMat = track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.4 }));
    pedestalMat.color = palette3.accent;

    return { crystalGeos, crystalMat, ringGeo, ringMat, ringCoreGeo, ringCoreMat, barGeo, barMat, barCount, barScales, pedestalGeo, pedestalMat, dispose };
  }, []);

  useEffect(() => {
    return () => assets.dispose.forEach((d) => d.dispose());
  }, [assets]);

  // Lay out the obelisk instances once.
  useEffect(() => {
    const mesh = obeliskRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < assets.barCount; i++) {
      const s = assets.barScales[i];
      m.makeScale(s, 0.16, s * 0.8);
      m.setPosition(0, i * 0.24 - 0.4, 0);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [assets]);

  useFrame((state, delta) => {
    const hovered = useAppStore.getState().hoveredProject;
    const reduced = useAppStore.getState().reducedMotion;
    const t = state.clock.elapsedTime;
    const monuments = [group0.current, group1.current, group2.current];

    for (let i = 0; i < 3; i++) {
      const target = hovered === i ? 1 : 0;
      energy.current[i] += (target - energy.current[i]) * (1 - Math.exp(-delta * 6));
      const e = energy.current[i];
      const g = monuments[i];
      if (!g) continue;

      if (!reduced) {
        g.rotation.y += delta * (0.12 + e * 0.5);
        g.position.y = 0.9 + Math.sin(t * 0.5 + i * 2.1) * 0.12 * (reduced ? 0 : 1);
      }
      const s = 1 + e * 0.07;
      g.scale.setScalar(s);
    }

    // One material instance set per monument — drive each glow through the
    // mesh refs so the materials stay imperative-land objects.
    const e = energy.current;
    const matOf = (m: THREE.Mesh | THREE.InstancedMesh | null) =>
      m ? (m.material as THREE.MeshStandardMaterial) : null;
    const crystal = matOf(crystalRef.current);
    if (crystal) crystal.emissiveIntensity = 0.15 + e[0] * 0.9;
    const ring = matOf(ringRef.current);
    if (ring) ring.emissiveIntensity = 0.15 + e[1] * 0.9;
    const ringCore = matOf(ringCoreRef.current);
    if (ringCore) ringCore.emissiveIntensity = 0.2 + e[1] * 1.1;
    const bars = matOf(obeliskRef.current);
    if (bars) bars.emissiveIntensity = 0.15 + e[2] * 0.9;
  });

  return (
    <group position={[0, 0, MONUMENT_Z]}>
      {/* 01 BIO-CORE */}
      <group ref={group0} position={[MONUMENT_X[0], 0.9, 0]}>
        <mesh ref={crystalRef} geometry={assets.crystalGeos[0]} material={assets.crystalMat} />
        <mesh geometry={assets.crystalGeos[1]} material={assets.crystalMat} position={[0.55, 0.75, 0.2]} rotation={[0.4, 0.8, 0.2]} />
        <mesh geometry={assets.crystalGeos[2]} material={assets.crystalMat} position={[-0.55, -0.6, 0.35]} rotation={[0.9, 0.2, 0.5]} />
      </group>

      {/* 02 TRI-RING */}
      <group ref={group1} position={[MONUMENT_X[1], 0.9, 0]}>
        <mesh ref={ringCoreRef} geometry={assets.ringCoreGeo} material={assets.ringCoreMat} />
        <mesh ref={ringRef} geometry={assets.ringGeo} material={assets.ringMat} />
        <mesh geometry={assets.ringGeo} material={assets.ringMat} rotation={[Math.PI / 3, Math.PI / 4, 0]} scale={1.18} />
        <mesh geometry={assets.ringGeo} material={assets.ringMat} rotation={[-Math.PI / 3, -Math.PI / 4, 0]} scale={1.36} />
      </group>

      {/* 03 DATA OBELISK */}
      <group ref={group2} position={[MONUMENT_X[2], 0.9, 0]}>
        <instancedMesh ref={obeliskRef} args={[assets.barGeo, assets.barMat, assets.barCount]} />
      </group>

      {/* Pedestal rings ground each monument on the grid floor. */}
      {MONUMENT_X.map((x, i) => (
        <mesh key={i} geometry={assets.pedestalGeo} material={assets.pedestalMat} position={[x, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
}
