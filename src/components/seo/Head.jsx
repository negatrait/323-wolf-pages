import { useEffect } from 'preact/hooks';
import { getRouteMeta } from '../../data/route-meta.js';

/**
 * SEO head component. Works in two modes:
 * - SSR (prerender): renders nothing visible, metadata injected via prerender.jsx
 * - Client (SPA navigation): uses useEffect to mutate document.head on route change
 */
export function Head({ title, description, canonical, ogImage, structuredData }) {
  // Client-side only: update document.head on SPA navigation
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      document.title = title;
      setMeta('description', description);
      setMeta('og:title', title);
      setMeta('og:description', description);
      setMeta('og:image', ogImage || 'https://sivussa.com/og-default.png');
      setMeta('og:url', canonical);
      setMeta('og:type', 'website');
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:title', title);
      setMeta('twitter:description', description);

      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;

      if (structuredData) {
        let script = document.getElementById('structured-data');
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
export function useRouteMeta(path) {
  return getRouteMeta(path);
}

function setMeta(prop, content) {
  let el =
    document.querySelector(`meta[property="${prop}"]`) ||
    document.querySelector(`meta[name="${prop}"]`);
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
