"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { LINKS, PROJECTS } from "../../lib/content";
import { LEVELS } from "../../lib/levels";

/**
 * LEVEL 05 — the credits roll while the camera pulls back to reveal the
 * whole network. "Continue?" is the contact CTA.
 */
export function Credits() {
  return (
    <footer id="credits" className="relative min-h-screen px-6 sm:px-10 lg:px-32 py-32 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-6">LEVEL 05 — CREDITS</p>
          <h2 className="text-5xl sm:text-7xl tracking-tight text-foreground mb-4">
            CONTINUE<span className="text-accent blink">?</span>
          </h2>
          <p className="text-foreground/60 max-w-md mx-auto mb-10">
            The expedition ends here — the work doesn&apos;t. Insert contact to start a new run.
          </p>
          <a
            href={LINKS.email}
            className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] bg-primary text-background px-8 py-4 hover:bg-accent transition-colors"
          >
            <Mail className="h-4 w-4" />
            INSERT CONTACT
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-10 border-t border-foreground/10 pt-12 font-mono text-xs tracking-wider">
          <nav aria-label="Level navigation">
            <p className="text-foreground/40 tracking-[0.25em] mb-5">NAVIGATION</p>
            <ul className="space-y-3">
              {LEVELS.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-foreground/65 hover:text-accent transition-colors"
                  >
                    {l.num} — {l.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-foreground/40 tracking-[0.25em] mb-5">CHANNELS</p>
            <ul className="space-y-3">
              <li>
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="text-foreground/65 hover:text-accent transition-colors">
                  GITHUB ↗
                </a>
              </li>
              <li>
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/65 hover:text-accent transition-colors">
                  LINKEDIN ↗
                </a>
              </li>
              <li>
                <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="text-foreground/65 hover:text-accent transition-colors">
                  RESUME ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-foreground/40 tracking-[0.25em] mb-5">MISSIONS</p>
            <ul className="space-y-3">
              {PROJECTS.map((p) => (
                <li key={p.codename}>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-foreground/65 hover:text-accent transition-colors">
                    {p.codename} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/55 mt-16 text-center">
          © 2026 SAHIL CHAMBYAL — A PROCEDURAL WORLD · 0 KB OF 3D ASSETS · BUILT WITH THREE.JS
        </p>
      </div>
    </footer>
  );
}
