"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { LevelHeader } from "./LevelHeader";
import { LINKS } from "../../lib/content";

const STATS = [
  { key: "LOCATION", value: "Punjab, India" },
  { key: "EMAIL", value: "sahil.chambyal@outlook.com" },
  { key: "STATUS", value: "Available for opportunities" },
];

/** LEVEL 01 — the pilot's character sheet. */
export function About() {
  return (
    <section id="about" className="relative min-h-screen px-6 sm:px-10 lg:px-32 py-32">
      <div className="max-w-6xl mx-auto">
        <LevelHeader num="01" title="THE PILOT" heading="Character profile" />

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 *:min-w-0">
          {/* Pilot ID card */}
          <motion.figure
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 hud-corners bg-background/85 quality-high:bg-background/65 quality-high:backdrop-blur-md border border-foreground/10 p-5"
          >
            <div className="relative aspect-[4/5] overflow-hidden scanlines">
              <Image
                src="/sahil-photo.png"
                alt="Portrait of Sahil Chambyal"
                fill
                sizes="(max-width: 1024px) 90vw, 35vw"
                className="object-cover grayscale"
              />
              {/* Duotone tint keyed to the active accent. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-accent mix-blend-color opacity-30 pointer-events-none"
              />
            </div>
            <figcaption className="font-mono text-[10px] tracking-[0.25em] text-foreground/50 mt-4 flex justify-between">
              <span>PILOT ID // SC-07</span>
              <span className="text-accent">VERIFIED</span>
            </figcaption>
          </motion.figure>

          {/* Bio + stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-3 bg-background/85 quality-high:bg-background/65 quality-high:backdrop-blur-md border border-foreground/10 p-8 sm:p-10 flex flex-col"
          >
            <p className="text-lg sm:text-xl text-foreground/85 leading-relaxed mb-6">
              I focus on advancing memory-augmented LLMs and AI agents, currently building
              project-specific hierarchical memory systems for more coherent, long-term reasoning.
            </p>
            <p className="text-lg sm:text-xl text-foreground/85 leading-relaxed mb-10">
              My past work spans vision models, multilingual RAG systems, and large-scale
              regressors, shaping my interest in scalable intelligence and how models store,
              update, and use structured knowledge effectively.
            </p>

            {/* Stat rows stack on mobile (no room for a dotted leader) and
                become label · leader · value on sm+. break-all keeps the
                long email from forcing horizontal overflow. */}
            <dl className="font-mono text-sm space-y-5 sm:space-y-4 mb-10">
              {STATS.map((s) => (
                <div key={s.key} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="text-foreground/45 text-xs tracking-[0.25em] sm:w-28 shrink-0">{s.key}</dt>
                  <span aria-hidden="true" className="hidden sm:block flex-1 border-b border-dotted border-foreground/20" />
                  <dd className="text-foreground break-all min-w-0 sm:text-right">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto flex flex-wrap gap-4 font-mono text-xs tracking-[0.2em]">
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-foreground/30 text-foreground px-5 py-3 hover:border-accent hover:text-accent transition-colors flex items-center gap-2.5"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LINKEDIN
              </a>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-foreground/30 text-foreground px-5 py-3 hover:border-accent hover:text-accent transition-colors flex items-center gap-2.5"
              >
                <Github className="h-3.5 w-3.5" />
                GITHUB
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
