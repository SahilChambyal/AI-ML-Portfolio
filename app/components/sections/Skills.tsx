"use client";

import { motion } from "motion/react";
import { LevelHeader } from "./LevelHeader";
import { SKILLS } from "../../lib/content";

/** LEVEL 03 — the skill tree, mirrored by the constellation behind it. */
export function Skills() {
  return (
    <section id="skills" className="relative min-h-screen px-6 sm:px-10 lg:px-32 py-32">
      <div className="max-w-6xl mx-auto">
        <LevelHeader num="03" title="SKILL TREE" heading="Unlocked abilities" />

        <div className="grid lg:grid-cols-3 gap-6 *:min-w-0">
          {SKILLS.map((cluster, i) => (
            <motion.div
              key={cluster.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-60px" }}
              className="hud-corners bg-background/85 quality-high:bg-background/65 quality-high:backdrop-blur-md border border-foreground/10 p-7 sm:p-8"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] text-accent mb-2">
                NODE CLUSTER {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-xl tracking-tight text-foreground mb-7">{cluster.title}</h3>
              <ul className="flex flex-wrap gap-2.5">
                {cluster.items.map((skill) => (
                  <li
                    key={skill}
                    className="font-mono text-xs border border-foreground/20 text-foreground/85 px-3 py-2 flex items-center gap-2 hover:border-accent hover:text-accent transition-colors"
                  >
                    <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rotate-45 bg-accent/70" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
