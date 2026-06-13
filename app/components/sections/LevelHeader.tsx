"use client";

import { motion } from "motion/react";

/** Shared section header: mono level tag + display heading. */
export function LevelHeader({ num, title, heading }: { num: string; title: string; heading: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-80px" }}
      className="mb-14 sm:mb-20"
    >
      <p className="font-mono text-xs tracking-[0.3em] text-accent mb-4 flex items-center gap-3">
        <span className="inline-block w-8 h-px bg-accent" />
        LEVEL {num} — {title}
      </p>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground">{heading}</h2>
    </motion.header>
  );
}
