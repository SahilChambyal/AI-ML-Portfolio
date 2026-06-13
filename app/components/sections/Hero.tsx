"use client";

import { motion } from "motion/react";
import { ArrowDown, Github } from "lucide-react";
import { useAppStore } from "../../lib/store";
import { LINKS } from "../../lib/content";

/**
 * LEVEL 00 — the title screen. Type sits left, the neural core holds the
 * right of frame in the 3D layer behind. Entrance is gated on the boot
 * sequence so the reveal reads as one choreographed beat.
 */
export function Hero() {
  const bootDone = useAppStore((s) => s.bootDone);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 36 },
    animate: bootDone ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  });

  return (
    <section id="hero" className="relative min-h-screen flex items-center px-6 sm:px-10 lg:px-32 pt-24">
      {/* Soft scrim so display type stays readable over the 3D core. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 28% 50%, color-mix(in srgb, var(--background) 72%, transparent), transparent 75%)",
        }}
      />

      <div className="relative max-w-5xl">
        <motion.p
          {...reveal(0.1)}
          className="font-mono text-xs tracking-[0.3em] text-accent mb-8 flex items-center gap-3"
        >
          <span className="inline-block w-2 h-2 rotate-45 bg-accent" />
          PLAYER ONE READY — AI/ML ENGINEER
        </motion.p>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-10">
          <motion.span {...reveal(0.25)} className="block text-foreground">
            BUILDING
          </motion.span>
          <motion.span {...reveal(0.4)} className="block text-foreground/55">
            INTELLIGENT SYSTEMS
          </motion.span>
          <motion.span {...reveal(0.55)} className="block text-foreground">
            THAT MATTER<span className="text-accent">.</span>
          </motion.span>
        </h1>

        <motion.p {...reveal(0.75)} className="text-lg sm:text-xl text-foreground/75 max-w-xl leading-relaxed mb-12">
          Developing scalable AI/ML and intelligent systems that redefine how organizations
          process and understand information.
        </motion.p>

        <motion.div {...reveal(0.9)} className="flex flex-wrap gap-4 font-mono text-xs tracking-[0.2em]">
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-background px-7 py-3.5 hover:bg-accent transition-colors flex items-center gap-3"
          >
            START MISSIONS
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-foreground/30 text-foreground px-7 py-3.5 hover:border-accent hover:text-accent transition-colors flex items-center gap-3"
          >
            <Github className="h-3.5 w-3.5" />
            GITHUB
          </a>
        </motion.div>
      </div>

      <motion.p
        {...reveal(1.3)}
        aria-hidden="true"
        className="absolute bottom-20 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-foreground/45"
      >
        SCROLL TO ENTER THE NETWORK ▾
      </motion.p>
    </section>
  );
}
