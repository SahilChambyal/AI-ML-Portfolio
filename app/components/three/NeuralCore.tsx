"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { palette3 } from "./palette3";
import { useAppStore } from "../../lib/store";
import { pointsVertex, pointsFragment, fresnelVertex, fresnelFragment } from "./shaders";
import { mulberry32, randomOnSphere } from "./random";

/**
 * LEVEL 00 centerpiece — the "neural core". A breathing fresnel-shaded
 * icosahedron wrapped in a counter-rotating wire shell, signal particles
 * and synapse lines. Entirely procedural: zero asset payload.
 */
export function NeuralCore({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Points>(null);
  const core = useRef<THREE.Mesh>(null);

  const assets = useMemo(() => {
    const rand = mulberry32(42);

    const coreGeo = new THREE.IcosahedronGeometry(1.55, 24);
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: fresnelVertex,
      fragmentShader: fresnelFragment,
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0.045 },
        uBg: { value: palette3.bg },
        uPrimary: { value: palette3.primary },
        uAccent: { value: palette3.accent },
        uDark: palette3.dark,
      },
    });

    const shellGeo = new THREE.IcosahedronGeometry(2.35, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    shellMat.color = palette3.fg;

    // Signal particles orbiting on loose shells around the core.
    const count = quality === "high" ? 650 : 320;
    const positions = new Float32Array(count * 3);
    const aRand = new Float32Array(count);
    const aMix = new Float32Array(count);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      randomOnSphere(rand, 2.9 + rand() * 1.6, v);
      positions.set([v.x, v.y, v.z], i * 3);
      aRand[i] = rand();
      aMix[i] = rand() < 0.6 ? 0 : 1;
    }
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    orbitGeo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    orbitGeo.setAttribute("aMix", new THREE.BufferAttribute(aMix, 1));
    const orbitMat = new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.8 },
        uMaxSize: { value: 7.0 },
        uDrift: { value: 0.25 },
        uColorA: { value: palette3.accent },
        uColorB: { value: palette3.primary },
        uOpacity: { value: 0.85 },
      },
    });

    // Synapses: line segments between random points on the wire shell.
    const segCount = 70;
    const segPositions = new Float32Array(segCount * 6);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    for (let i = 0; i < segCount; i++) {
      randomOnSphere(rand, 2.35, a);
      randomOnSphere(rand, 2.35, b);
      segPositions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    }
    const synGeo = new THREE.BufferGeometry();
    synGeo.setAttribute("position", new THREE.BufferAttribute(segPositions, 3));
    const synMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.14 });
    synMat.color = palette3.fg;

    return { coreGeo, coreMat, shellGeo, shellMat, orbitGeo, orbitMat, synGeo, synMat };
  }, [quality]);

  useEffect(() => {
    return () => {
      assets.coreGeo.dispose();
      assets.coreMat.dispose();
      assets.shellGeo.dispose();
      assets.shellMat.dispose();
      assets.orbitGeo.dispose();
      assets.orbitMat.dispose();
      assets.synGeo.dispose();
      assets.synMat.dispose();
    };
  }, [assets]);

  useFrame((state, delta) => {
    // Freezing uTime under reduced motion stops the breathing displacement,
    // drift and twinkle — the scene becomes a still composition.
    if (useAppStore.getState().reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (core.current) {
      (core.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    if (orbit.current) {
      (orbit.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.06;
    }
    if (orbit.current) {
      orbit.current.rotation.y -= delta * 0.045;
      orbit.current.rotation.x += delta * 0.01;
    }
  });

  // Offset right of frame so the hero type owns the left half.
  return (
    <group ref={group} position={[1.9, 0.2, 0]}>
      <mesh ref={core} geometry={assets.coreGeo} material={assets.coreMat} />
      <mesh geometry={assets.shellGeo} material={assets.shellMat} />
      <lineSegments geometry={assets.synGeo} material={assets.synMat} />
      <points ref={orbit} geometry={assets.orbitGeo} material={assets.orbitMat} />
    </group>
  );
}
