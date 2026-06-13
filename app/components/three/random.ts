import * as THREE from "three";

/** Deterministic PRNG — keeps the world layout identical across remounts. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform random point on a sphere of the given radius, written into `out`. */
export function randomOnSphere(rand: () => number, radius: number, out: THREE.Vector3): THREE.Vector3 {
  const u = rand() * 2 - 1;
  const phi = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return out.set(s * Math.cos(phi) * radius, u * radius, s * Math.sin(phi) * radius);
}
