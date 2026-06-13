"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { LevelHeader } from "./LevelHeader";
import { PROJECTS } from "../../lib/content";
import { useAppStore } from "../../lib/store";

/**
 * LEVEL 02 — the missions. Hovering (or keyboard-focusing) a card charges
 * the matching monument in the 3D layer behind the panel.
 */
export function Projects() {
  const setHoveredProject = useAppStore((s) => s.setHoveredProject);

  return (
    <section id="projects" className="relative px-6 sm:px-10 lg:px-32 py-32">
      <div className="max-w-6xl mx-auto">
        <LevelHeader num="02" title="MISSIONS" heading="Featured work" />

        <div className="space-y-14">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.codename}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, margin: "-60px" }}
              onMouseEnter={() => setHoveredProject(i)}
              onMouseLeave={() => setHoveredProject(null)}
              onFocus={() => setHoveredProject(i)}
              onBlur={() => setHoveredProject(null)}
              className="hud-corners bg-background/85 quality-high:bg-background/65 quality-high:backdrop-blur-md border border-foreground/10 hover:border-foreground/25 transition-colors duration-500"
            >
              <div className="p-7 sm:p-10 grid lg:grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <div className="font-mono text-xs tracking-[0.25em] flex items-center justify-between mb-6">
                    <span className="text-accent">
                      MISSION {String(i + 1).padStart(2, "0")}
                      {" // "}
                      {project.codename}
                    </span>
                    <span className="text-foreground/45">{project.date}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl tracking-tight text-foreground mb-2">{project.title}</h3>
                  <p className="text-foreground/55 mb-6">{project.subtitle}</p>
                  <p className="text-foreground/80 leading-relaxed mb-8">{project.description}</p>

                  <div className="mb-8">
                    <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/45 mb-3">LOADOUT</p>
                    <ul className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <li
                          key={tech}
                          className="font-mono text-xs border border-foreground/20 text-foreground/80 px-3 py-1.5"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/45 mb-4 pt-6 border-t border-foreground/10">
                      MISSION STATS
                    </p>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 mb-8">
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <dd className="font-mono text-lg sm:text-xl text-primary">{m.value}</dd>
                          <dt className="text-xs text-foreground/50 mt-1">{m.label}</dt>
                        </div>
                      ))}
                    </dl>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] bg-primary text-background px-6 py-3 hover:bg-accent transition-colors"
                    >
                      VIEW DEPLOYMENT
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {project.images.map((image, j) => (
                    <div key={image} className="relative aspect-video border border-foreground/10 overflow-hidden">
                      <Image
                        src={image}
                        alt={`${project.title} — screenshot ${j + 1}`}
                        fill
                        sizes="(max-width: 1024px) 90vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
