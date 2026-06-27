/** Sub-path the site is served from, e.g. "/TerryTime" on a project page. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * True when running inside a static export (GitHub Pages). The server-only
 * API routes don't exist in this build, so client features that depend on
 * them degrade to a friendly notice instead of hitting a dead endpoint.
 */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

/** Prefix a public asset path with the base path for plain (non-next) links. */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
