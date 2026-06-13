import * as THREE from "three";
import { getPalette, isDarkPalette, type Palette } from "../../lib/palettes";

/**
 * The WebGL half of the theme system. Materials and shader uniforms hold
 * references to these THREE.Color instances; `tickPalette` eases them
 * toward the active palette every frame, so switching themes sweeps the
 * whole 3D world without touching React or rebuilding materials.
 */
export const palette3 = {
  bg: new THREE.Color(),
  fg: new THREE.Color(),
  primary: new THREE.Color(),
  muted: new THREE.Color(),
  accent: new THREE.Color(),
  /** 0 = light palette, 1 = dark palette (eased) — shaders use this to keep
   * particles/glows legible on light backgrounds. */
  dark: { value: 1 },
};

const target = {
  bg: new THREE.Color(),
  fg: new THREE.Color(),
  primary: new THREE.Color(),
  muted: new THREE.Color(),
  accent: new THREE.Color(),
  dark: 1,
};

// Initialize both current and target so the first frame is already correct.
setPaletteTargets(getPalette(null));
palette3.bg.copy(target.bg);
palette3.fg.copy(target.fg);
palette3.primary.copy(target.primary);
palette3.muted.copy(target.muted);
palette3.accent.copy(target.accent);
palette3.dark.value = target.dark;

export function setPaletteTargets(p: Palette): void {
  target.bg.set(p.colors.background);
  target.fg.set(p.colors.foreground);
  target.primary.set(p.colors.primary);
  target.muted.set(p.colors.muted);
  target.accent.set(p.colors.accent);
  target.dark = isDarkPalette(p) ? 1 : 0;
}

/** Frame-rate-independent exponential ease toward the target palette. */
export function tickPalette(delta: number): void {
  const k = 1 - Math.exp(-delta * 5);
  palette3.bg.lerp(target.bg, k);
  palette3.fg.lerp(target.fg, k);
  palette3.primary.lerp(target.primary, k);
  palette3.muted.lerp(target.muted, k);
  palette3.accent.lerp(target.accent, k);
  palette3.dark.value += (target.dark - palette3.dark.value) * k;
}
