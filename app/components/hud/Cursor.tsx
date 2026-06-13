"use client";

import { useEffect, useRef } from "react";

/**
 * Game reticle cursor — a ring that eases after the pointer and tightens
 * over interactive elements. Driven by rAF + transforms only; hidden on
 * touch devices via the .custom-cursor CSS gate.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hot = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      hot = !!(e.target as Element | null)?.closest?.("a, button, [role='button']");
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 14}px, ${ry - 14}px) scale(${hot ? 0.6 : 1})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="custom-cursor fixed top-0 left-0 z-[90] w-7 h-7 rounded-full border border-accent pointer-events-none transition-[scale] will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0 z-[90] w-1 h-1 rounded-full bg-accent pointer-events-none will-change-transform"
        aria-hidden="true"
      />
    </>
  );
}
