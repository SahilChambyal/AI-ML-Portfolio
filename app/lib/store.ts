"use client";

import { create } from "zustand";
import { DEFAULT_PALETTE_ID } from "./palettes";

/**
 * High-frequency scroll state lives OUTSIDE React. The scroll listener
 * mutates it; the camera rig and HUD XP bar read it inside rAF loops.
 * Nothing re-renders at 60fps.
 */
export const scrollState = {
  /** Overall page progress, 0..1. */
  progress: 0,
  /** Index of the level currently in view (0..5), continuous. */
  levelFloat: 0,
  /** Normalized mouse position, -1..1, for camera parallax. */
  mouseX: 0,
  mouseY: 0,
};

export type QualityTier = "high" | "low";

interface AppState {
  paletteId: string;
  setPaletteId: (id: string) => void;

  /** Discrete current level for HUD highlighting (changes rarely). */
  level: number;
  setLevel: (level: number) => void;

  /** Which project card is hovered, linking DOM cards to 3D monuments. */
  hoveredProject: number | null;
  setHoveredProject: (i: number | null) => void;

  bootDone: boolean;
  setBootDone: () => void;

  webglFailed: boolean;
  setWebglFailed: () => void;

  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;

  quality: QualityTier;
  setQuality: (q: QualityTier) => void;
}

export const useAppStore = create<AppState>((set) => ({
  paletteId: DEFAULT_PALETTE_ID,
  setPaletteId: (paletteId) => set({ paletteId }),

  level: 0,
  setLevel: (level) => set({ level }),

  hoveredProject: null,
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),

  bootDone: false,
  setBootDone: () => set({ bootDone: true }),

  webglFailed: false,
  setWebglFailed: () => set({ webglFailed: true }),

  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  quality: "high",
  setQuality: (quality) => set({ quality }),
}));
