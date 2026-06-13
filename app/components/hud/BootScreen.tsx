"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "../../lib/store";

const BOOT_LINES = [
  "INITIALIZING NEURAL INTERFACE",
  "LOADING WORLD GEOMETRY · 0 KB ASSETS · PROCEDURAL",
  "CALIBRATING CAMERA RIG",
  "SYNCING THEME TOKENS → WEBGL",
  "PILOT VERIFIED: SAHIL CHAMBYAL",
];

const BOOT_MS = 1900;

/**
 * A designed entrance, not a loading bar: the world is procedural so there
 * is nothing to actually load — this is a sub-2s title card that masks
 * canvas warm-up. Click/keypress skips. Shown once per session, never
 * under prefers-reduced-motion (?noboot is an escape hatch for captures).
 *
 * The bar and counter are driven through refs, not state: this runs in
 * the same window the GPU is compiling shaders, so React work is kept to
 * at most one render per boot line.
 */
export function BootScreen() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [lineCount, setLineCount] = useState(1);
  const setBootDone = useAppStore((s) => s.setBootDone);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noboot = new URLSearchParams(window.location.search).has("noboot");
    let seen = false;
    try {
      seen = sessionStorage.getItem("nf-booted") === "1";
    } catch {
      // ignore
    }
    if (reduced || seen || noboot) {
      setVisible(false);
      setBootDone();
      return;
    }
    setVisible(true);

    let raf = 0;
    let done = false;
    let lastLines = 1;
    const start = performance.now();

    const teardown = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
    };

    const finish = () => {
      if (done) return;
      done = true;
      teardown();
      try {
        sessionStorage.setItem("nf-booted", "1");
      } catch {
        // ignore
      }
      setVisible(false);
      setBootDone();
    };

    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / BOOT_MS);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (counterRef.current) counterRef.current.textContent = `${Math.round(p * 100)}%`;
      const lines = Math.min(BOOT_LINES.length, Math.floor(p * BOOT_LINES.length) + 1);
      if (lines !== lastLines) {
        lastLines = lines;
        setLineCount(lines);
      }
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);
    return teardown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Neural Frontier"
          className="fixed inset-0 z-[80] bg-background flex items-center justify-center font-mono text-xs tracking-widest scanlines"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-[min(480px,85vw)]">
            <p className="text-foreground text-base sm:text-lg tracking-[0.35em] mb-8">
              NEURAL FRONTIER<span className="text-accent">_</span>
            </p>

            <div className="space-y-2 mb-8 min-h-[90px]" aria-hidden="true">
              {BOOT_LINES.slice(0, lineCount).map((line) => (
                <p key={line} className="text-foreground/55">
                  <span className="text-accent mr-2">▸</span>
                  {line}
                </p>
              ))}
            </div>

            <div className="h-px bg-foreground/15" aria-hidden="true">
              <div ref={barRef} className="h-full bg-accent origin-left" style={{ transform: "scaleX(0)" }} />
            </div>
            <div className="flex justify-between mt-3 text-foreground/40" aria-hidden="true">
              <span ref={counterRef} className="tabular-nums">
                0%
              </span>
              <span className="blink">PRESS ANY KEY TO SKIP</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
