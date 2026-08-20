import { ImageResponse } from "next/og";
import { PERSON } from "./lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sahil Chambyal — AI/ML Engineer";

/**
 * Build-time social card. Rendered rather than shipped as a PNG so it can
 * never drift from lib/seo.ts. Keyed to the default `cyberpunk-obsidian`
 * palette because a social card cannot read localStorage.
 *
 * Satori supports flexbox only — every element needs an explicit display.
 */
export default function OpengraphImage() {
  const bg = "#030712";
  const fg = "#F3F4F6";
  const primary = "#06B6D4";
  const accent = "#F43F5E";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          backgroundImage: `radial-gradient(ellipse 60% 70% at 75% 40%, ${primary}22, transparent 70%)`,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, background: accent, transform: "rotate(45deg)" }} />
          <div style={{ fontSize: 24, letterSpacing: 6, color: accent }}>PLAYER ONE</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, color: fg, lineHeight: 1.05, letterSpacing: -2 }}>
            {PERSON.name}
          </div>
          <div style={{ fontSize: 44, color: primary, marginTop: 12, letterSpacing: -1 }}>
            {PERSON.jobTitle}
          </div>
          <div style={{ fontSize: 28, color: "#F3F4F699", marginTop: 24, maxWidth: 860, lineHeight: 1.4 }}>
            Memory-augmented LLMs · Multilingual RAG · Vision Transformers
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#F3F4F677", letterSpacing: 3 }}>
          <div style={{ display: "flex" }}>SAHILCHAMBYAL.COM</div>
          <div style={{ display: "flex", color: primary }}>99.5% VAL ACC · 200 QPS · 183M PARAMS</div>
        </div>
      </div>
    ),
    size,
  );
}
