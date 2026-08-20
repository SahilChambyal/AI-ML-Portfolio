import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

/**
 * One URL, because there is one route. Hard-coded lastModified rather than
 * `new Date()`: a lastmod that changes on every deploy is noise Google learns
 * to ignore. Bump this when the page content actually changes.
 */
const LAST_MODIFIED = new Date("2026-08-20");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL, // exactly matches the emitted canonical — no trailing-slash variant
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
