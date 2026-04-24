/**
 * Per-route SEO metadata.
 * Derived at build time from content frontmatter via the content plugin.
 * This module re-exports the build-time constant.
 */
import { ROUTE_META, SITE_CONFIG } from './load-content';

const routes = ROUTE_META as Record<string, { title: string; description: string; canonical: string }>;

export function getRouteMeta(path: string) {
  return routes[path] || routes['/'];
}

export { SITE_CONFIG };
