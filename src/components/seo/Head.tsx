import { useEffect } from 'preact/hooks';
import { getRouteMeta, SITE_CONFIG } from '../../data/route-meta';

/**
 * SEO head component. Works in two modes:
 * - SSR (prerender): renders nothing visible, metadata injected via prerender.jsx
 * - Client (SPA navigation): uses useEffect to mutate document.head on route change
 */
interface HeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  structuredData?: unknown;
}

export function Head({
  title,
  description,
  canonical,
  ogImage,
  structuredData,
}: HeadProps) {
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
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;

      if (structuredData) {
        let script = document.getElementById(
          'structured-data',
        ) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = 'structured-data';
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);
      }
    }, [title, description, canonical, ogImage, structuredData]);
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

function setMeta(prop: string, content: string) {
  let el = (document.querySelector(`meta[property="${prop}"]`) ||
    document.querySelector(`meta[name="${prop}"]`)) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (prop.startsWith('og:') || prop.startsWith('twitter:')) {
      el.setAttribute('property', prop);
    } else {
      el.name = prop;
    }
    document.head.appendChild(el);
  }
  el.content = content;
}
