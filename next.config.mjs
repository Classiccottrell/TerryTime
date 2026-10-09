/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "files.cdn.printful.com" },
      // Product photos uploaded in the Stripe dashboard (the catalog lives in Stripe).
      { protocol: "https", hostname: "files.stripe.com" },
    ],
  },
};

export default nextConfig;
