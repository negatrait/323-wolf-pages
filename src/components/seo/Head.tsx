import { useEffect } from 'preact/hooks';
import { getRouteMeta, SITE_CONFIG } from '../../data/route-meta';

interface HeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  structuredData?: Record<string, unknown>;
}

/**
 * SEO head component. Works in two modes:
 * - SSR (prerender): renders nothing visible, metadata injected via prerender.tsx
 * - Client (SPA navigation): uses useEffect to mutate document.head on route change
 */
export function Head({ title, description, canonical, ogImage }: HeadProps) {
  // Client-side only: update document.head on SPA navigation
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      document.title = title;
      setMeta('description', description);
      setMeta('og:title', title);
      setMeta('og:description', description);
      setMeta('og:image', ogImage || `${SITE_CONFIG.url}/og-default.png`);
      setMeta('og:url', canonical);
      setMeta('og:type', 'website');
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:title', title);
      setMeta('twitter:description', description);

      let link = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link') as HTMLLinkElement;
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }, [title, description, canonical, ogImage]);
  }

  return null;
}

/**
 * Convenience: build Head props from a route path.
 * Used by page components that just need default route metadata.
 */
export function useRouteMeta(path: string) {
  return getRouteMeta(path);
}

function setMeta(prop: string, content: string): void {
  let el: Element | null =
    document.querySelector(`meta[property="${prop}"]`) ||
    document.querySelector(`meta[name="${prop}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (prop.startsWith('og:') || prop.startsWith('twitter:')) {
      el.setAttribute('property', prop);
    } else {
      (el as HTMLMetaElement).name = prop;
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
