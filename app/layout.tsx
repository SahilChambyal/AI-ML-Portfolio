import type { Metadata } from "next";
// Self-hosted Geist (Vercel's `geist` package) — font files ship with the
// package, so the build never reaches out to Google Fonts. Exposes the same
// --font-geist-sans / --font-geist-mono CSS variables globals.css expects.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { PALETTES, DEFAULT_PALETTE_ID, STORAGE_KEY, isDarkPalette } from "./lib/palettes";
import { ThemeProvider } from "./lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahil Chambyal | AI/ML Engineer Portfolio",
  description:
    "AI/ML Engineer developing scalable AI/ML and intelligent systems that redefine how organizations process and understand information.",
  keywords: ["AI", "ML", "Machine Learning", "Deep Learning", "Python", "Portfolio", "Sahil Chambyal"],
  authors: [{ name: "Sahil Chambyal" }],
  icons: {
    icon: [{ url: "/sahil-favicon.png", type: "image/png", sizes: "94x94" }],
    shortcut: "/sahil-favicon.png",
    apple: "/sahil-favicon.png",
  },
  openGraph: {
    title: "Sahil Chambyal | AI/ML Engineer Portfolio",
    description:
      "AI/ML Engineer developing scalable AI/ML and intelligent systems that redefine how organizations process and understand information.",
    type: "website",
  },
  twitter: {
    // "summary" not "summary_large_image": no card image asset exists yet.
    card: "summary",
    title: "Sahil Chambyal | AI/ML Engineer Portfolio",
    description: "AI/ML Engineer developing scalable AI/ML and intelligent systems.",
  },
};

/**
 * Inline no-FOUC script: applies the stored palette's tokens before first
 * paint. The palette map is serialized from lib/palettes.ts at build time,
 * so there is exactly one source of truth.
 */
function themeScript(): string {
  const map: Record<string, [string, string, string, string, string, string]> = {};
  for (const p of PALETTES) {
    map[p.id] = [
      p.colors.background,
      p.colors.foreground,
      p.colors.primary,
      p.colors.muted,
      p.colors.accent,
      isDarkPalette(p) ? "dark" : "light",
    ];
  }
  return `(function(){try{var m=${JSON.stringify(map)};var id=localStorage.getItem(${JSON.stringify(
    STORAGE_KEY,
  )});var p=m[id]||m[${JSON.stringify(DEFAULT_PALETTE_ID)}];if(!m[id])id=${JSON.stringify(
    DEFAULT_PALETTE_ID,
  )};var r=document.documentElement;var s=r.style;s.setProperty("--background",p[0]);s.setProperty("--foreground",p[1]);s.setProperty("--primary",p[2]);s.setProperty("--muted",p[3]);s.setProperty("--accent",p[4]);r.dataset.palette=id;r.dataset.mode=p[5];var low=matchMedia("(max-width: 768px)").matches||(navigator.hardwareConcurrency||8)<=4;r.dataset.quality=low?"low":"high";}catch(e){}})()`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
