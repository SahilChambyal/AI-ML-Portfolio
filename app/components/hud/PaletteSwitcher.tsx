"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PALETTES } from "../../lib/palettes";
import { useAppStore } from "../../lib/store";
import { useTheme } from "../../lib/theme";

/**
 * The "skin selector" — switching palettes recolors the DOM tokens and
 * the WebGL world together. Stays open after a pick so themes can be
 * browsed like character skins. Modal for real: focus is trapped while
 * open, restored to the trigger on close, and body scroll is locked so
 * the wheel always drives the palette list.
 */
export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const paletteId = useAppStore((s) => s.paletteId);
  const { setPalette } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Focus trap: aria-modal promises focus stays inside the dialog.
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    panel?.querySelector("button")?.focus();

    // Lock body scroll while the dialog is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Restore focus to the trigger only if it is still inside the panel,
      // so we don't steal it from a user who clicked elsewhere.
      if (!panel || panel.contains(document.activeElement)) {
        trigger?.focus();
      }
    };
  }, [open]);

  const current = PALETTES.find((p) => p.id === paletteId);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="border border-foreground/25 px-3 py-1.5 text-foreground/80 hover:text-foreground hover:border-accent transition-colors flex items-center gap-2"
      >
        <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
        SKIN
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              aria-label="Close theme selector"
              className="fixed inset-0 z-50 bg-background/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Theme selector"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-background/95 quality-high:bg-background/90 quality-high:backdrop-blur-xl border-l border-foreground/15 overflow-y-auto overscroll-contain scanlines"
            >
              <div className="sticky top-0 z-10 bg-background/95 px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
                <div>
                  <p className="text-foreground font-semibold tracking-[0.25em]">SELECT SKIN</p>
                  <p className="text-foreground/50 mt-1 text-[10px]">
                    {current ? `ACTIVE: ${current.name.toUpperCase()}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="border border-foreground/25 px-2.5 py-1 text-foreground/70 hover:border-accent hover:text-foreground transition-colors"
                >
                  ESC
                </button>
              </div>

              <ul className="p-4 grid grid-cols-1 gap-2">
                {PALETTES.map((p, i) => {
                  const active = p.id === paletteId;
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => setPalette(p.id)}
                        aria-pressed={active}
                        className={`w-full text-left px-4 py-3 border transition-colors flex items-center gap-4 ${
                          active
                            ? "border-accent bg-foreground/5"
                            : "border-foreground/10 hover:border-foreground/40"
                        }`}
                      >
                        {/* Swatch strip — the palette's five tokens. */}
                        <span className="flex w-16 h-8 shrink-0 border border-foreground/15 overflow-hidden">
                          {Object.values(p.colors).map((hex, j) => (
                            <span key={j} className="flex-1" style={{ backgroundColor: hex }} />
                          ))}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-foreground truncate">
                            <span className="text-foreground/40 mr-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                            {p.name.toUpperCase()}
                          </span>
                          <span className="block text-foreground/45 text-[10px] mt-0.5 truncate">{p.vibe.toUpperCase()}</span>
                        </span>
                        {active && <span className="ml-auto text-accent shrink-0">ACTIVE</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
