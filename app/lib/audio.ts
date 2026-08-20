"use client";

/**
 * A lightweight procedural audio synthesizer using the Web Audio API.
 * Synthesizes retro-futuristic sound effects dynamically on the client,
 * keeping asset payload at exactly 0 KB. Safe for SSR.
 */

let ctx: AudioContext | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
      return null;
    }
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export const audio = {
  isMuted: () => muted,
  
  toggleMute: (): boolean => {
    muted = !muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nf-muted", muted ? "1" : "0");
      } catch (e) {
        // ignore
      }
    }
    return muted;
  },

  loadMuteState: (): void => {
    if (typeof window !== "undefined") {
      try {
        muted = localStorage.getItem("nf-muted") === "1";
      } catch (e) {
        // ignore
      }
    }
  },

  /** High-pitch electronic click beep for buttons and selection */
  playSelect: () => {
    if (muted) return;
    const c = getContext();
    if (!c) return;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, c.currentTime); // A5

    gain.gain.setValueAtTime(0.04, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start();
    osc.stop(c.currentTime + 0.08);
  },

  /** Double-tone frequency sweep for data node collections */
  playCollect: () => {
    if (muted) return;
    const c = getContext();
    if (!c) return;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "triangle";
    // Pitch sweep: start at C5 and hop to G5
    osc.frequency.setValueAtTime(523.25, c.currentTime); 
    osc.frequency.setValueAtTime(783.99, c.currentTime + 0.07);

    gain.gain.setValueAtTime(0.06, c.currentTime);
    gain.gain.setValueAtTime(0.06, c.currentTime + 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start();
    osc.stop(c.currentTime + 0.24);
  },

  /** Low sawtooth sweep with lowpass filter for firewall impact crashes */
  playHit: () => {
    if (muted) return;
    const c = getContext();
    if (!c) return;

    const osc = c.createOscillator();
    const gain = c.createGain();
    const filter = c.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, c.currentTime + 0.3);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(280, c.currentTime);

    gain.gain.setValueAtTime(0.12, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);

    osc.start();
    osc.stop(c.currentTime + 0.35);
  },

  /** Ascending major triad chord arpeggio for checkpoint gates */
  playCheckpoint: () => {
    if (muted) return;
    const c = getContext();
    if (!c) return;

    const now = c.currentTime;
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.02);
      
      osc.connect(gain);
      gain.connect(c.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Play quick ascending arpeggio: C5 -> E5 -> G5 -> C6
    playNote(523.25, now, 0.25);
    playNote(659.25, now + 0.07, 0.25);
    playNote(783.99, now + 0.14, 0.25);
    playNote(1046.50, now + 0.21, 0.45);
  },

  /** Pulsing alarm buzz for low shields */
  playLowShield: () => {
    if (muted) return;
    const c = getContext();
    if (!c) return;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, c.currentTime);
    osc.frequency.linearRampToValueAtTime(220, c.currentTime + 0.12);

    gain.gain.setValueAtTime(0.03, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start();
    osc.stop(c.currentTime + 0.15);
  }
};
