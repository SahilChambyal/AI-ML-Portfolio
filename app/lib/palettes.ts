/**
 * Single source of truth for the 20 theme palettes.
 * Drives both the DOM (CSS custom properties, applied by ThemeProvider /
 * the inline no-FOUC script in layout.tsx) and the WebGL scene
 * (lerped THREE.Color uniforms, see components/three/palette3.ts).
 */

export interface Palette {
  id: string;
  name: string;
  vibe: string;
  colors: {
    background: string;
    primary: string;
    foreground: string;
    muted: string;
    accent: string;
  };
}

export const PALETTES: Palette[] = [
  {
    id: "radical-minimalist",
    name: "Radical Minimalist",
    vibe: "High-contrast editorial",
    colors: { background: "#000000", primary: "#FFFFFF", foreground: "#F5F5F7", muted: "#8E8E93", accent: "#FF3B30" },
  },
  {
    id: "neo-brutalist-acid",
    name: "Neo-Brutalist Acid",
    vibe: "Experimental Web3 energy",
    colors: { background: "#0B0B0C", primary: "#CCFF00", foreground: "#FFFFFF", muted: "#1E1F22", accent: "#7000FF" },
  },
  {
    id: "desert-warmth",
    name: "Desert Warmth & Clay",
    vibe: "Earthy architectural calm",
    colors: { background: "#F9F6F0", primary: "#2C221E", foreground: "#1A1311", muted: "#D4C5B9", accent: "#C05C3E" },
  },
  {
    id: "cyberpunk-obsidian",
    name: "Cyberpunk Obsidian",
    vibe: "High-tech immersive",
    colors: { background: "#030712", primary: "#06B6D4", foreground: "#F3F4F6", muted: "#1F2937", accent: "#F43F5E" },
  },
  {
    id: "swiss-luxury",
    name: "Swiss Luxury Editorial",
    vibe: "Structured typographic luxury",
    colors: { background: "#FFFFFF", primary: "#111111", foreground: "#1C1C1E", muted: "#E5E5EA", accent: "#8A7A5F" },
  },
  {
    id: "nordic-sage",
    name: "Nordic Sage & Moss",
    vibe: "Calm sustainable green",
    colors: { background: "#F4F6F4", primary: "#1C352D", foreground: "#12221C", muted: "#CBD5E1", accent: "#A3E635" },
  },
  {
    id: "deep-oceanic",
    name: "Deep Oceanic & Gold",
    vibe: "Sophisticated executive depth",
    colors: { background: "#0A192F", primary: "#64FFDA", foreground: "#CCD6F6", muted: "#233554", accent: "#F59E0B" },
  },
  {
    id: "vintage-cream",
    name: "Vintage Cream & Navy",
    vibe: "Boutique storytelling warmth",
    colors: { background: "#FFFDF9", primary: "#0F172A", foreground: "#1E293B", muted: "#E2E8F0", accent: "#3B82F6" },
  },
  {
    id: "kinetic-ultraviolet",
    name: "Kinetic Ultraviolet",
    vibe: "High-energy showreel",
    colors: { background: "#090514", primary: "#A855F7", foreground: "#FAFAFA", muted: "#1E1B4B", accent: "#10B981" },
  },
  {
    id: "bauhaus-primary",
    name: "Bauhaus Primary",
    vibe: "Retro-modernist geometry",
    colors: { background: "#F2F0EA", primary: "#E11D48", foreground: "#0F172A", muted: "#2563EB", accent: "#FBBF24" },
  },
  {
    id: "monochromatic-charcoal",
    name: "Monochromatic Charcoal",
    vibe: "Subtle gallery minimal",
    colors: { background: "#121212", primary: "#E5E5E5", foreground: "#FFFFFF", muted: "#2A2A2A", accent: "#666666" },
  },
  {
    id: "sunset-ochre",
    name: "Sunset Ochre & Plum",
    vibe: "Artistic cinematic warmth",
    colors: { background: "#1E111F", primary: "#F97316", foreground: "#FFE4E6", muted: "#3B223F", accent: "#F472B6" },
  },
  {
    id: "industrial-concrete",
    name: "Clean Industrial Concrete",
    vibe: "Engineered minimal studio",
    colors: { background: "#EAEAEA", primary: "#000000", foreground: "#1B1B1D", muted: "#94A3B8", accent: "#FF5722" },
  },
  {
    id: "ethereal-dream",
    name: "Ethereal Dream",
    vibe: "Pastel generative dark",
    colors: { background: "#0B0F19", primary: "#C084FC", foreground: "#F1F5F9", muted: "#1E293B", accent: "#818CF8" },
  },
  {
    id: "new-olive",
    name: "The New Olive",
    vibe: "Organic corporate trust",
    colors: { background: "#FAF9F5", primary: "#36454F", foreground: "#2F3E36", muted: "#E6E4DD", accent: "#D97706" },
  },
  {
    id: "midnight-bordeaux",
    name: "Midnight Bordeaux",
    vibe: "High-fashion noir luxury",
    colors: { background: "#110307", primary: "#991B1B", foreground: "#FDF4F5", muted: "#2D0C13", accent: "#F59E0B" },
  },
  {
    id: "hyper-minimal-mint",
    name: "Hyper-Minimal Mint",
    vibe: "Clean clinical innovation",
    colors: { background: "#FFFFFF", primary: "#059669", foreground: "#0F172A", muted: "#F1F5F9", accent: "#34D399" },
  },
  {
    id: "brutalist-sand",
    name: "Brutalist Sand & Monorail",
    vibe: "Urban streetwear texture",
    colors: { background: "#DCD7C9", primary: "#2C3E35", foreground: "#1A2421", muted: "#A29B8B", accent: "#E07A5F" },
  },
  {
    id: "cosmic-void",
    name: "Cosmic Void & Neon Coral",
    vibe: "Audio-reactive WebGL native",
    colors: { background: "#050505", primary: "#FF6B6B", foreground: "#F8FAFC", muted: "#1A1A1A", accent: "#4D96FF" },
  },
  {
    id: "soft-serenity",
    name: "Soft Serenity",
    vibe: "Warm mindful minimalism",
    colors: { background: "#FDFBF7", primary: "#4A4E69", foreground: "#22223B", muted: "#F0EFEB", accent: "#9A8C98" },
  },
];

export const DEFAULT_PALETTE_ID = "cyberpunk-obsidian";

export const STORAGE_KEY = "nf-palette";

export function getPalette(id: string | null | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID)!;
}

/** WCAG-ish relative luminance — used to decide if a palette reads as dark. */
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

export function isDarkPalette(p: Palette): boolean {
  return luminance(p.colors.background) < 0.4;
}

/** Applies a palette's tokens to the document root. */
export function applyPaletteToDOM(p: Palette): void {
  const root = document.documentElement;
  root.style.setProperty("--background", p.colors.background);
  root.style.setProperty("--foreground", p.colors.foreground);
  root.style.setProperty("--primary", p.colors.primary);
  root.style.setProperty("--muted", p.colors.muted);
  root.style.setProperty("--accent", p.colors.accent);
  root.dataset.palette = p.id;
  root.dataset.mode = isDarkPalette(p) ? "dark" : "light";
}
