"use client";

import { useEffect, useRef, useState } from "react";
import { LEVELS } from "../../lib/levels";
import { LINKS } from "../../lib/content";
import { scrollState, useAppStore } from "../../lib/store";
import { PaletteSwitcher } from "./PaletteSwitcher";
import { audio } from "../../lib/audio";

/**
 * The persistent game HUD. The container ignores pointer events; only the
 * controls themselves are interactive, so the page beneath stays fully
 * scrollable and selectable.
 */
export function Hud() {
  const level = useAppStore((s) => s.level);
  const xpRef = useRef<HTMLDivElement>(null);

  // Game store connections
  const gameActive = useAppStore((s) => s.gameActive);
  const setGameActive = useAppStore((s) => s.setGameActive);
  const gameScore = useAppStore((s) => s.gameScore);
  const gameShield = useAppStore((s) => s.gameShield);
  const gameCollectibles = useAppStore((s) => s.gameCollectibles);
  const highScore = useAppStore((s) => s.highScore);
  const resetGame = useAppStore((s) => s.resetGame);

  const [isMuted, setIsMuted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [checkpointMsg, setCheckpointMsg] = useState<string | null>(null);

  useEffect(() => {
    audio.loadMuteState();
    setIsMuted(audio.isMuted());
    const onMuteToggle = () => {
      setIsMuted(audio.isMuted());
    };
    document.addEventListener("mute-toggle", onMuteToggle);
    return () => document.removeEventListener("mute-toggle", onMuteToggle);
  }, []);

  useEffect(() => {
    let feedbackTimeout: NodeJS.Timeout;
    const handleCollect = (event: any) => {
      setFeedback(`+100 XP // DATA SYNCED: ${event.detail}`);
      if (feedbackTimeout) clearTimeout(feedbackTimeout);
      feedbackTimeout = setTimeout(() => setFeedback(null), 1200);
    };
    const handleCheckpoint = (event: any) => {
      setCheckpointMsg(`CHECKPOINT REACHED // ${event.detail} (+1000 XP)`);
      setTimeout(() => setCheckpointMsg(null), 3000);
    };

    document.addEventListener("node-collected", handleCollect);
    document.addEventListener("checkpoint-reached", handleCheckpoint);

    return () => {
      document.removeEventListener("node-collected", handleCollect);
      document.removeEventListener("checkpoint-reached", handleCheckpoint);
      if (feedbackTimeout) clearTimeout(feedbackTimeout);
    };
  }, []);

  // The XP bar tracks scroll at 60fps via rAF + transform — no re-renders.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (xpRef.current && !gameActive) {
        xpRef.current.style.transform = `scaleX(${scrollState.progress})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gameActive]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (gameActive) {
    const isGameOver = gameShield <= 0;

    return (
      <div className="fixed inset-0 z-40 pointer-events-none font-mono text-xs tracking-widest flex flex-col justify-between p-4 sm:p-8 select-none scanlines">
        {/* Game HUD Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <p className="text-foreground/50">SIMULATION MODE</p>
            <p className="text-accent font-semibold text-[11px] sm:text-xs mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-accent pulse-soft" />
              NEURAL RUNNER v1.0
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                audio.toggleMute();
                audio.playSelect();
                document.dispatchEvent(new CustomEvent("mute-toggle"));
              }}
              className="border border-foreground/25 px-2.5 py-1 text-foreground/75 hover:text-foreground hover:border-foreground transition-colors"
            >
              {isMuted ? "UNMUTE" : "MUTE"}
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setGameActive(false);
              }}
              className="bg-accent text-background px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors font-semibold"
            >
              EXIT
            </button>
          </div>
        </div>

        {/* Floating alerts */}
        {feedback && (
          <div className="absolute top-[22%] left-1/2 -translate-x-1/2 bg-accent/90 text-background px-4 py-2 border border-accent font-bold text-[10px] tracking-widest animate-bounce z-40 rounded shadow-lg pointer-events-auto">
            {feedback}
          </div>
        )}

        {checkpointMsg && (
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 bg-primary/95 text-background px-6 py-3 border border-primary font-bold text-[10px] sm:text-xs tracking-[0.25em] animate-pulse z-40 rounded shadow-xl text-center pointer-events-auto">
            {checkpointMsg}
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver ? (
          <div className="absolute inset-0 bg-background/95 pointer-events-auto flex items-center justify-center p-6 z-50">
            <div className="hud-corners border border-accent max-w-sm w-full bg-background/80 p-8 text-center space-y-6">
              <h2 className="text-accent text-xl font-bold tracking-[0.2em] animate-pulse">
                CONNECTION TERMINATED
              </h2>
              <p className="text-foreground/60 text-[11px] leading-relaxed">
                Your neural probe collided with firewall blockades. Data transfer incomplete.
              </p>
              <div className="border-y border-foreground/15 py-4 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-foreground/50">FINAL SCORE:</span>
                  <span className="text-primary font-bold">{gameScore} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">CORES UPLOADED:</span>
                  <span className="text-accent">{gameCollectibles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">PERSONAL BEST:</span>
                  <span className="text-foreground">{Math.max(highScore, gameScore)} XP</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => {
                    audio.playSelect();
                    resetGame();
                  }}
                  className="bg-primary text-background py-3 font-semibold hover:bg-accent transition-colors tracking-[0.2em]"
                >
                  START NEW RUN
                </button>
                <button
                  onClick={() => {
                    audio.playSelect();
                    setGameActive(false);
                  }}
                  className="border border-foreground/30 text-foreground/80 py-2.5 hover:border-foreground hover:text-foreground transition-colors"
                >
                  EXIT TO PORTFOLIO
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Onboarding instructions if score is 0 and player shield is 100 */
          gameScore === 0 && (
            <div className="absolute inset-x-4 top-[40%] -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:max-w-md border border-foreground/15 bg-background/90 p-6 text-center space-y-4 pointer-events-auto z-40 rounded">
              <p className="text-primary font-bold tracking-[0.2em]">NEURAL CORE SIMULATION</p>
              <p className="text-foreground/75 text-[11px] leading-relaxed">
                Use <span className="text-accent font-semibold">WASD / Arrow Keys</span> or drag your <span className="text-accent font-semibold">Mouse/Pointer</span> to pilot the probe.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left text-[10px] border-t border-foreground/10 pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                  <span>Collect Data Nodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 border border-accent/70 rotate-45 shrink-0" />
                  <span>Dodge Firewalls</span>
                </div>
              </div>
              <p className="text-[10px] text-foreground/45 animate-pulse pt-2">
                GLIDE FORWARD TO COMMENCE...
              </p>
            </div>
          )
        )}

        {/* Game HUD Footer / Stats Panel */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pointer-events-auto">
          {/* Shields */}
          <div className="min-w-0">
            <div className="flex justify-between text-[10px] text-foreground/50 mb-1">
              <span>SHIELD INTEGRITY</span>
              <span className={gameShield < 40 ? "text-accent animate-pulse font-bold" : "text-primary"}>
                {gameShield}%
              </span>
            </div>
            <div className="h-2.5 bg-foreground/10 border border-foreground/10 p-0.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 origin-left ${gameShield < 40 ? "bg-accent" : "bg-primary"}`}
                style={{ transform: `scaleX(${gameShield / 100})` }}
              />
            </div>
          </div>

          {/* Collectibles */}
          <div className="text-center pb-1 sm:pb-0">
            <span className="text-foreground/50 text-[10px]">DATA NODES COLLECTED</span>
            <div className="text-accent text-base sm:text-lg font-semibold tabular-nums mt-0.5">
              {gameCollectibles}
            </div>
          </div>

          {/* Score */}
          <div className="text-right min-w-0">
            <span className="text-foreground/50 text-[10px]">XP UPLOADED</span>
            <div className="text-foreground text-lg sm:text-xl font-bold tracking-wider tabular-nums mt-0.5">
              {gameScore} <span className="text-primary text-xs">XP</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none font-mono text-xs tracking-widest">
      {/* Top bar */}
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
          <button
            onClick={() => {
              audio.playSelect();
              resetGame();
              setGameActive(true);
            }}
            className="border border-accent px-3 py-1.5 text-accent hover:text-background hover:bg-accent transition-colors font-semibold"
          >
            PLAY ARCADE
          </button>
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
