"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import { CAMERA_PATH } from "../../lib/levels";
import { useAppStore } from "../../lib/store";

// Detected once and cached — useSyncExternalStore needs a stable snapshot.
let webglSupport: boolean | null = null;

function getWebglSupport(): boolean {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

/**
 * Fixed full-viewport canvas behind the DOM. Transparent (`alpha`) so the
 * page background *is* the scene background — the DOM/WebGL color seam
 * cannot exist by construction. `flat` disables tone mapping so brand
 * hexes render exactly as the CSS tokens do.
 *
 * No 3D assets are fetched: the world is fully procedural, so there is
 * no loader and first paint is immediate.
 */
export function Scene() {
  // Server snapshot is false, so SSR/hydration render nothing; the client
  // re-render mounts the canvas once support is confirmed.
  const ready = useSyncExternalStore(noopSubscribe, getWebglSupport, () => false);
  const quality = useAppStore((s) => s.quality);
  const webglFailed = useAppStore((s) => s.webglFailed);
  const setWebglFailed = useAppStore((s) => s.setWebglFailed);

  useEffect(() => {
    if (!getWebglSupport()) setWebglFailed();
  }, [setWebglFailed]);

  if (!ready || webglFailed) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        flat
        dpr={quality === "high" ? [1, 2] : [1, 1.5]}
        camera={{ fov: 42, near: 0.1, far: 140, position: CAMERA_PATH[0].pos }}
        gl={{
          antialias: quality === "high",
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}
