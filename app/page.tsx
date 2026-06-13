"use client";

import { MotionConfig } from "motion/react";
import { Scene } from "./components/three/Scene";
import { Hud } from "./components/hud/Hud";
import { BootScreen } from "./components/hud/BootScreen";
import { Cursor } from "./components/hud/Cursor";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { Education } from "./components/sections/Education";
import { Credits } from "./components/sections/Credits";
import { useScrollDriver } from "./lib/useScrollDriver";
import { useAppStore } from "./lib/store";

export default function Home() {
  useScrollDriver();
  const webglFailed = useAppStore((s) => s.webglFailed);

  return (
    <MotionConfig reducedMotion="user">
      {/* overflow-x-clip contains the brief horizontal spill from the
          whileInView entrance animations (cards start at x: ±40). `clip`
          (not `hidden`) avoids making this a scroll container, so the
          fixed canvas/HUD and the smooth-scroll behavior are unaffected. */}
      <div className="grain overflow-x-clip">
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-background focus:px-4 focus:py-2 font-mono text-xs"
        >
          Skip to content
        </a>

        {/* The designed no-WebGL fallback: a still, lit composition. */}
        {webglFailed && <div className="fixed inset-0 z-0 fallback-backdrop" aria-hidden="true" />}
        <Scene />
        <div className="vignette" aria-hidden="true" />

        <BootScreen />
        <Cursor />
        <Hud />

        <main className="relative z-10">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Education />
        </main>
        <Credits />
      </div>
    </MotionConfig>
  );
}
