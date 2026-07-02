/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Art here is first-party SVGs + placeholder JPGs that gain nothing from
    // optimization. Serving them unoptimized keeps them always-fresh (no
    // optimizer cache to go stale when art is swapped) and lets SVGs render
    // without the optimizer path.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
