import { renderToString } from 'preact-render-to-string';
import { h } from 'preact';
import { App } from './app.jsx';
import { getRouteMeta } from './data/route-meta.js';
import { organizationJsonLd, websiteJsonLd, softwareAppJsonLd } from './utils/seo.js';

// Homepage gets structured data; other pages get none by default
const homepageSchemas = [organizationJsonLd(), websiteJsonLd(), softwareAppJsonLd()];

export async function prerender(data) {
  const html = renderToString(h(App));
  const route = data.url || '/';
  const meta = getRouteMeta(route);

  const headElements = new Set();

  // Core meta
  headElements.add({ type: 'meta', props: { name: 'description', content: meta.description } });
  headElements.add({ type: 'meta', props: { property: 'og:title', content: meta.title } });
  headElements.add({ type: 'meta', props: { property: 'og:description', content: meta.description } });
  headElements.add({ type: 'meta', props: { property: 'og:url', content: meta.canonical } });
  headElements.add({ type: 'link', props: { rel: 'canonical', href: meta.canonical } });
  headElements.add({ type: 'meta', props: { property: 'twitter:title', content: meta.title } });
  headElements.add({ type: 'meta', props: { property: 'twitter:description', content: meta.description } });

  // JSON-LD (homepage only)
  if (route === '/') {
    for (const schema of homepageSchemas) {
      headElements.add({
        type: 'script',
        props: { type: 'application/ld+json' },
        children: JSON.stringify(schema, null, 2),
      });
    }
  }

  return {
    html,
    links: new Set(),
    head: {
      lang: 'en',
      title: meta.title,
      elements: headElements,
    },
  };
}
