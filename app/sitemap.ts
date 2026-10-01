import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://terryterrylarryberry.com";

// "/" is listed once for the A/B split rather than both stores, so search engines
// index one canonical entry point and the test isn't split across URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/lifestyle`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
