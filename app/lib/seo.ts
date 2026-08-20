/**
 * Single source of truth for everything an indexer, a social unfurler, or an
 * AI answer engine reads about this site.
 *
 * SITE_URL must match (a) the Vercel primary domain and (b) the Search Console
 * property, or the self-referencing canonical will point at a host that
 * redirects. Today the apex 307s to www, so www is the canonical host.
 */

import { PROJECTS, EDUCATION, SKILLS } from "./content";

export const SITE_URL = "https://www.sahilchambyal.com";

export const PERSON = {
  name: "Sahil Chambyal",
  jobTitle: "AI/ML Engineer",
  email: "sahil.chambyal@outlook.com",
  location: { city: "Punjab", country: "IN", countryName: "India" },
  /**
   * sameAs is the entity-consolidation signal: it tells Google that this
   * domain, the LinkedIn profile currently outranking it, and the GitHub
   * account are one person rather than three.
   */
  sameAs: [
    "https://www.linkedin.com/in/sahil-chambyal07/",
    "https://github.com/sahilchambyal",
    "https://www.kaggle.com/sahilchambyal",
  ],
} as const;

/** The definitional answer block — kept identical on-page and in schema. */
export const SUMMARY =
  "Sahil Chambyal is an AI/ML Engineer based in Punjab, India, specialising in " +
  "memory-augmented LLMs, multilingual RAG systems, and computer vision models.";

export const TITLE = "Sahil Chambyal — AI/ML Engineer (RAG, LLMs, Computer Vision)";

export const DESCRIPTION =
  "Sahil Chambyal is an AI/ML Engineer building memory-augmented LLMs, multilingual " +
  "RAG systems and vision models. Patent-filed ViT model, 99.5% validation accuracy.";

/**
 * ProfilePage + Person + WebSite as one @graph. ProfilePage is the type Google
 * documents for a page *about* a person, and it is what carries the entity
 * through to knowledge-panel and AI-answer citation.
 *
 * Every field here corresponds to something rendered visibly on the page —
 * marking up anything else is a structured-data violation.
 */
export function buildJsonLd() {
  const personId = `${SITE_URL}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: PERSON.name,
        /**
         * Decomposed name parts are the actual mechanism by which Google
         * associates a partial-name query ("Chambyal") with a full Person
         * entity. Keyword-stuffing the page with name fragments does not do
         * this and would read as spam; structured name parts do.
         */
        givenName: "Sahil",
        familyName: "Chambyal",
        /** The handle he is known by on GitHub and Kaggle — lets an AI system
         *  that meets "sahilchambyal" on those platforms resolve it to him. */
        alternateName: "sahilchambyal",
        url: SITE_URL,
        mainEntityOfPage: { "@id": `${SITE_URL}/#profilepage` },
        image: `${SITE_URL}/sahil-photo.png`,
        jobTitle: PERSON.jobTitle,
        description: SUMMARY,
        email: `mailto:${PERSON.email}`,
        sameAs: [...PERSON.sameAs],
        address: {
          "@type": "PostalAddress",
          addressRegion: PERSON.location.city,
          addressCountry: PERSON.location.country,
        },
        alumniOf: EDUCATION.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.detail.split(" · ")[0],
        })),
        knowsAbout: [
          "Machine Learning",
          "Deep Learning",
          "Large Language Models",
          "Retrieval-Augmented Generation",
          "Vision Transformers",
          "Computer Vision",
          "Natural Language Processing",
          "MLOps",
          ...SKILLS.flatMap((s) => s.items),
        ],
        knowsLanguage: ["en"],
        // Only the projects actually rendered on the page.
        subjectOf: PROJECTS.map((p) => ({ "@id": `${SITE_URL}/#${p.codename.toLowerCase()}` })),
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        mainEntity: { "@id": personId },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${PERSON.name} — ${PERSON.jobTitle}`,
        description: DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      ...PROJECTS.map((p) => ({
        "@type": "CreativeWork",
        "@id": `${SITE_URL}/#${p.codename.toLowerCase()}`,
        name: p.title,
        headline: p.title,
        description: p.description,
        url: p.link,
        creator: { "@id": personId },
        author: { "@id": personId },
        keywords: p.tech.join(", "),
        image: p.images.map((i) => `${SITE_URL}${i}`),
      })),
    ],
  };
}
