import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

/**
 * Open to everything. The AI crawlers are listed explicitly rather than left
 * to the wildcard: being cited in AI answers is a stated goal here, and an
 * explicit allow is the record of that decision.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
