"use client";

import { motion } from "motion/react";
import { LevelHeader } from "./LevelHeader";
import { EDUCATION, ACHIEVEMENTS } from "../../lib/content";

/** LEVEL 04 — the archive: education log and achievements unlocked. */
export function Education() {
  return (
    <section id="education" className="relative min-h-screen px-6 sm:px-10 lg:px-32 py-32">
      <div className="max-w-6xl mx-auto">
        <LevelHeader num="04" title="ARCHIVE" heading="Education & achievements" />

        <div className="grid lg:grid-cols-2 gap-6 *:min-w-0">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-60px" }}
            className="hud-corners bg-background/85 quality-high:bg-background/65 quality-high:backdrop-blur-md border border-foreground/10 p-7 sm:p-9"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] text-accent mb-8">EDUCATION LOG</p>
            <div className="space-y-10">
              {EDUCATION.map((e) => (
                <div key={e.degree}>
                  <h3 className="text-lg text-foreground mb-1.5">{e.degree}</h3>
                  <p className="text-foreground/75 mb-2">{e.field}</p>
                  <p className="font-mono text-xs text-foreground/50">{e.detail}</p>
                  {e.extra && <p className="font-mono text-xs text-foreground/50 mt-1">{e.extra}</p>}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-60px" }}
            className="hud-corners bg-background/85 quality-high:bg-background/65 quality-high:backdrop-blur-md border border-foreground/10 p-7 sm:p-9"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] text-accent mb-8">ACHIEVEMENTS UNLOCKED</p>
            <ul className="space-y-6">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.title} className="flex gap-4">
                  <span aria-hidden="true" className="text-accent mt-0.5">
                    ✦
                  </span>
                  <div>
                    <h3 className="text-foreground">{a.title}</h3>
                    <p className="font-mono text-xs text-foreground/50 mt-1">{a.org}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
