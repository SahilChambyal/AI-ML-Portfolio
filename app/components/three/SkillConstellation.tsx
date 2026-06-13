"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { palette3 } from "./palette3";
import { useAppStore } from "../../lib/store";
import { pointsVertex, pointsFragment } from "./shaders";
import { mulberry32 } from "./random";

// Lifted above the missions sightline so it doesn't photobomb LEVEL 02,
// and kept tight enough that its orbit never sweeps into the archive.
const CENTER = new THREE.Vector3(1.2, 3.8, -30);

// Cluster sizes mirror the skill lists in the Skills section:
// languages (7), frameworks (7), platforms (8).
const CLUSTERS = [
  { hub: new THREE.Vector3(-2.4, -0.6, 0), nodes: 7 },
  { hub: new THREE.Vector3(0, 1.4, -0.8), nodes: 7 },
  { hub: new THREE.Vector3(2.4, -0.9, 0.4), nodes: 8 },
];

/**
 * LEVEL 03 — a literal skill tree: three solid hub nodes (languages,
 * frameworks, platforms) with glowing leaf nodes wired back to their hub.
 * Leaves use the shared soft-sprite shader so the constellation speaks
 * the same visual language as the rest of the network. Three draw calls.
 */
export function SkillConstellation() {
  const group = useRef<THREE.Group>(null);
  const hubsRef = useRef<THREE.InstancedMesh>(null);

  const assets = useMemo(() => {
    const rand = mulberry32(303);

    const hubGeo = new THREE.IcosahedronGeometry(0.3, 1);
    const hubMat = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.15,
      flatShading: true,
      emissiveIntensity: 0.3,
    });
    hubMat.color = palette3.primary;
    hubMat.emissive = palette3.primary;

    const totalNodes = CLUSTERS.reduce((n, c) => n + c.nodes, 0);
    const leafPositions = new Float32Array(totalNodes * 3);
    const aRand = new Float32Array(totalNodes);
    const aMix = new Float32Array(totalNodes);
    const linePositions = new Float32Array(totalNodes * 6);

    let i = 0;
    for (const cluster of CLUSTERS) {
      for (let n = 0; n < cluster.nodes; n++) {
        // Scatter leaves on a loose shell around the hub.
        const dir = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
        const p = cluster.hub.clone().addScaledVector(dir, 0.8 + rand() * 1.1);
        leafPositions.set([p.x, p.y, p.z], i * 3);
        aRand[i] = rand();
        aMix[i] = rand() < 0.5 ? 0 : 1;
        linePositions.set([cluster.hub.x, cluster.hub.y, cluster.hub.z, p.x, p.y, p.z], i * 6);
        i++;
      }
    }

    const leafGeo = new THREE.BufferGeometry();
    leafGeo.setAttribute("position", new THREE.BufferAttribute(leafPositions, 3));
    leafGeo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    leafGeo.setAttribute("aMix", new THREE.BufferAttribute(aMix, 1));
    const leafMat = new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 1.1 },
        uMaxSize: { value: 22.0 },
        uDrift: { value: 0.07 },
        uColorA: { value: palette3.accent },
        uColorB: { value: palette3.primary },
        uOpacity: { value: 0.95 },
      },
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.22 });
    lineMat.color = palette3.fg;

    return { hubGeo, hubMat, leafGeo, leafMat, lineGeo, lineMat };
  }, []);

  useEffect(() => {
    return () => {
      assets.hubGeo.dispose();
      assets.hubMat.dispose();
      assets.leafGeo.dispose();
      assets.leafMat.dispose();
      assets.lineGeo.dispose();
      assets.lineMat.dispose();
    };
  }, [assets]);

  useEffect(() => {
    const m = new THREE.Matrix4();
    if (hubsRef.current) {
      CLUSTERS.forEach((c, i) => {
        m.makeTranslation(c.hub.x, c.hub.y, c.hub.z);
        hubsRef.current!.setMatrixAt(i, m);
      });
      hubsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [assets]);

  const leavesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (useAppStore.getState().reducedMotion) return;
    if (leavesRef.current) {
      (leavesRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (group.current) group.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={CENTER} ref={group}>
      <instancedMesh ref={hubsRef} args={[assets.hubGeo, assets.hubMat, CLUSTERS.length]} />
      <points ref={leavesRef} geometry={assets.leafGeo} material={assets.leafMat} />
      <lineSegments geometry={assets.lineGeo} material={assets.lineMat} />
    </group>
  );
}
