import { useEffect } from 'preact/hooks';

export function Head({ title, description, canonical, ogImage, structuredData }) {
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

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    // Structured data
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

  return null;
}

function setMeta(prop, content) {
  // Try property first (og:), then name
  let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
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
