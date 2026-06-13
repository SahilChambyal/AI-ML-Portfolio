"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { getPalette, applyPaletteToDOM, STORAGE_KEY, type Palette } from "./palettes";
import { useAppStore } from "./store";
import { setPaletteTargets } from "../components/three/palette3";

interface ThemeContextValue {
  setPalette: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({ setPalette: () => {} });

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * Keeps the three theme consumers in lockstep:
 *  1. CSS custom properties on <html> (DOM),
 *  2. the zustand store (HUD state),
 *  3. the WebGL color targets (scene lerps toward them in useFrame).
 * The inline script in layout.tsx has already applied the stored palette
 * before first paint; this provider re-syncs React + WebGL on mount.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setPaletteId = useAppStore((s) => s.setPaletteId);
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = useCallback(
    (palette: Palette, animate: boolean) => {
      // The whole-document cross-fade is a luxury: skip it on low-tier
      // devices and for reduced motion (the WebGL lerp still eases; the
      // DOM snapping is cheap and instant).
      const { quality, reducedMotion } = useAppStore.getState();
      if (animate && quality === "high" && !reducedMotion) {
        document.documentElement.classList.add("theme-anim");
        if (animTimer.current) clearTimeout(animTimer.current);
        animTimer.current = setTimeout(() => {
          document.documentElement.classList.remove("theme-anim");
        }, 500);
      }
      applyPaletteToDOM(palette);
      setPaletteTargets(palette);
      setPaletteId(palette.id);
    },
    [setPaletteId],
  );

  const setPalette = useCallback(
    (id: string) => {
      const palette = getPalette(id);
      try {
        localStorage.setItem(STORAGE_KEY, palette.id);
      } catch {
        // private browsing — theme still applies for the session
      }
      apply(palette, true);
    },
    [apply],
  );

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    apply(getPalette(stored), false);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => useAppStore.getState().setReducedMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);

    // Crude but dependable quality heuristic: small screens and low-core
    // machines get fewer particles, a lower DPR cap, and no DOM backdrop
    // blur. The inline theme script set data-quality pre-paint; re-derive
    // here to keep the store in sync (and correct it after a resize).
    const lowEnd =
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    useAppStore.getState().setQuality(lowEnd ? "low" : "high");
    document.documentElement.dataset.quality = lowEnd ? "low" : "high";

    return () => mq.removeEventListener("change", syncMotion);
  }, [apply]);

  return <ThemeContext.Provider value={{ setPalette }}>{children}</ThemeContext.Provider>;
}
