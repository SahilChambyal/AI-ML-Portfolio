"use client";

import { useEffect, useRef } from "react";
import { LEVELS } from "../../lib/levels";
import { LINKS } from "../../lib/content";
import { scrollState, useAppStore } from "../../lib/store";
import { PaletteSwitcher } from "./PaletteSwitcher";

/**
 * The persistent game HUD. The container ignores pointer events; only the
 * controls themselves are interactive, so the page beneath stays fully
 * scrollable and selectable.
 */
export function Hud() {
  const level = useAppStore((s) => s.level);
  const xpRef = useRef<HTMLDivElement>(null);

  // The XP bar tracks scroll at 60fps via rAF + transform — no re-renders.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (xpRef.current) {
        xpRef.current.style.transform = `scaleX(${scrollState.progress})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none font-mono text-xs tracking-widest">
      {/* Top bar (plain divs: header/footer here would add stray
          banner/contentinfo landmarks next to the real page footer) */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between gap-3 px-4 sm:px-8 pt-5">
        <div className="pointer-events-auto select-none min-w-0">
          <p className="text-foreground font-semibold tracking-[0.2em] sm:tracking-[0.25em] truncate">SAHIL CHAMBYAL</p>
          <p className="text-foreground/50 mt-1 flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-accent pulse-soft" />
            <span className="truncate">
              <span className="hidden sm:inline">CLASS: </span>AI/ML ENGINEER
            </span>
          </p>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <PaletteSwitcher />
          <a
            href={LINKS.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block border border-foreground/25 px-3 py-1.5 text-foreground/80 hover:text-background hover:bg-primary hover:border-primary transition-colors"
          >
            RESUME
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-background px-3 py-1.5 hover:bg-accent transition-colors"
          >
            CONNECT
          </a>
        </div>
      </div>

      {/* Left rail — level navigation */}
      <nav
        aria-label="Levels"
        className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 pointer-events-auto"
      >
        {LEVELS.map((l, i) => {
          const active = level === i;
          return (
            <button
              key={l.id}
              onClick={() => jumpTo(l.id)}
              aria-current={active ? "true" : undefined}
              className={`group flex items-center gap-3 text-left transition-colors ${
                active ? "text-accent" : "text-foreground/40 hover:text-foreground"
              }`}
            >
              <span className={`block h-px transition-all duration-500 ${active ? "w-8 bg-accent" : "w-4 bg-foreground/40 group-hover:bg-foreground"}`} />
              <span className="tabular-nums">{l.num}</span>
              <span
                className={`transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-60 group-focus-visible:opacity-100"
                }`}
              >
                {l.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom bar — XP / progress */}
      <div className="absolute bottom-0 inset-x-0 px-4 sm:px-8 pb-5">
        <div className="flex items-end justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0 max-w-xs">
            <p className="text-foreground/50 mb-2">XP // PROGRESS</p>
            <div className="h-1 bg-foreground/15 overflow-hidden">
              <div ref={xpRef} className="h-full bg-accent origin-left" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
          <p className="text-foreground/60 select-none whitespace-nowrap shrink-0">
            LV <span className="text-accent tabular-nums">{LEVELS[level].num}</span>
            <span className="hidden sm:inline"> / 05 — {LEVELS[level].title}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
