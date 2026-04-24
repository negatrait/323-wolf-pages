import { h } from 'preact';
import { renderToString } from 'preact-render-to-string';
import { App } from './app';
import { getRouteMeta } from './data/route-meta';
import { SITE_CONFIG } from './data/load-content';
import {
  organizationJsonLd,
  softwareAppJsonLd,
  websiteJsonLd,
  faqPageJsonLd,
} from './utils/seo';
import { FAQ_ITEMS, BLOG_POSTS_MAP } from './data/load-content';

// Global schemas on every page
const globalSchemas = [organizationJsonLd(), websiteJsonLd()];

export async function prerender(data) {
  const html = renderToString(h(App));
  const route = data.url || '/';
  const meta = getRouteMeta(route);

  const headElements = new Set();

  // Core meta
  headElements.add({
    type: 'meta',
    props: { name: 'description', content: meta.description },
  });
  headElements.add({
    type: 'meta',
    props: { property: 'og:title', content: meta.title },
  });
  headElements.add({
    type: 'meta',
    props: { property: 'og:description', content: meta.description },
  });
  headElements.add({
    type: 'meta',
    props: { property: 'og:url', content: meta.canonical },
  });
  headElements.add({
    type: 'link',
    props: { rel: 'canonical', href: meta.canonical },
  });
  headElements.add({
    type: 'meta',
    props: { property: 'twitter:title', content: meta.title },
  });
  headElements.add({
    type: 'meta',
    props: { property: 'twitter:description', content: meta.description },
  });

  // Global JSON-LD on every page
  for (const schema of globalSchemas) {
    headElements.add({
      type: 'script',
      props: { type: 'application/ld+json' },
      children: JSON.stringify(schema),
    });
  }

  // Route-specific JSON-LD
  if (route === '/') {
    headElements.add({
      type: 'script',
      props: { type: 'application/ld+json' },
      children: JSON.stringify(softwareAppJsonLd()),
    });
  }

  if (route === '/faq') {
    headElements.add({
      type: 'script',
      props: { type: 'application/ld+json' },
      children: JSON.stringify(faqPageJsonLd(FAQ_ITEMS)),
    });
  }

  // Blog posts get Article schema
  const blogSlug = route.startsWith('/blog/') ? route.replace('/blog/', '') : null;
  if (blogSlug && blogSlug !== '' && BLOG_POSTS_MAP[blogSlug]) {
    const post = BLOG_POSTS_MAP[blogSlug];
    headElements.add({
      type: 'script',
      props: { type: 'application/ld+json' },
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        author: { '@type': 'Organization', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
        publisher: { '@type': 'Organization', name: SITE_CONFIG.name, logo: { '@type': 'ImageObject', url: `${SITE_CONFIG.url}/logo.png` } },
        description: post.description || '',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_CONFIG.url}/blog/${blogSlug}` },
      }),
    });
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
