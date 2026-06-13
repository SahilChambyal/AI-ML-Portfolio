"use client";

import { useEffect } from "react";
import { LEVELS } from "./levels";
import { scrollState, useAppStore } from "./store";

/**
 * Feeds the high-frequency singleton (`scrollState`) that the camera rig
 * and XP bar consume, and the discrete `level` store value the HUD
 * highlights. Native scroll stays untouched — we only observe it.
 */
export function useScrollDriver(): void {
  useEffect(() => {
    let anchors: number[] = [];

    const measure = () => {
      const vh = window.innerHeight;
      anchors = LEVELS.map((level) => {
        const el = document.getElementById(level.id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        // Scroll position at which this level "owns" the viewport.
        return Math.max(0, rect.top + window.scrollY - vh * 0.35);
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollState.progress = Math.min(1, y / max);

      // Piecewise-linear level index across section anchors.
      let lf = 0;
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (y >= b) {
          lf = i + 1;
        } else if (y >= a) {
          lf = i + (y - a) / Math.max(1, b - a);
          break;
        }
      }
      scrollState.levelFloat = lf;

      const discrete = Math.min(LEVELS.length - 1, Math.round(lf));
      if (useAppStore.getState().level !== discrete) {
        useAppStore.getState().setLevel(discrete);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    onScroll();

    // Re-measure when layout shifts (images load, viewport resizes).
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);
}
