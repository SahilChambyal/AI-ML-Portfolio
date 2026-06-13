"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CAMERA_PATH } from "../../lib/levels";
import { scrollState, useAppStore } from "../../lib/store";

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Scroll-driven dolly. The camera eases along the level keyframes as the
 * page scrolls (native scroll stays in charge — we only follow it), with
 * a small mouse parallax on top. Reduced motion collapses the easing so
 * the camera simply *is* where the page is, without travel.
 */
export function CameraRig() {
  const pos = useRef(new THREE.Vector3(...CAMERA_PATH[0].pos));
  const look = useRef(new THREE.Vector3(...CAMERA_PATH[0].look));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const lookAnchor = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const reduced = useAppStore.getState().reducedMotion;
    const t = THREE.MathUtils.clamp(scrollState.levelFloat, 0, CAMERA_PATH.length - 1);
    const i = Math.min(Math.floor(t), CAMERA_PATH.length - 2);
    const f = smoothstep(t - i);

    const a = CAMERA_PATH[i];
    const b = CAMERA_PATH[i + 1];

    targetPos.current.fromArray(a.pos).lerp(targetLook.current.fromArray(b.pos), f);
    // reuse targetLook for b.pos above, now compute the real look target
    lookAnchor.current.fromArray(a.look).lerp(targetLook.current.fromArray(b.look), f);

    // Frame-rate independent damping; reduced motion snaps almost instantly
    // so there is no travel sensation, just a settled frame.
    const k = reduced ? 1 : 1 - Math.exp(-delta * 2.6);
    pos.current.lerp(targetPos.current, k);
    look.current.lerp(lookAnchor.current, k);

    // Gentle parallax — amplitude conservative on purpose (motion comfort).
    const px = reduced ? 0 : scrollState.mouseX * 0.45;
    const py = reduced ? 0 : scrollState.mouseY * 0.25;

    state.camera.position.set(pos.current.x + px, pos.current.y - py, pos.current.z);
    state.camera.lookAt(look.current);
  });

  return null;
}
