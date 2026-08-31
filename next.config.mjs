/** @type {import('next').NextConfig} */

// When STATIC_EXPORT=true, Next builds a fully static site into ./out that can
// be served from any static host (e.g. GitHub Pages). Server-only features
// (the Stripe/newsletter API routes under app/api) are not part of this build.
const isStaticExport = process.env.STATIC_EXPORT === "true";

// For project pages (https://<user>.github.io/<repo>/) the site is served from
// a sub-path. NEXT_PUBLIC_BASE_PATH carries it to both the framework and the
// browser. Leave empty for a root deploy (custom domain or user/org page).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && {
    output: "export",
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
  }),
  images: {
    // GitHub Pages has no image optimization server; art is first-party SVGs
    // + placeholder JPGs that gain nothing from optimization anyway.
    unoptimized: isStaticExport,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "files.cdn.printful.com" },
    ],
  },
};

export default nextConfig;
