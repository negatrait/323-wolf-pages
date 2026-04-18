import { renderToString } from 'preact-render-to-string';
import { h } from 'preact';
import { App } from './app.jsx';

// Page metadata mapping
const pageMetadata = {
  '/': {
    title: 'Sivussa — AI-native visibility specialists clearing your structural blockers',
    description: 'AI specialists audit your site and provide copy-paste ready remedies to clear structural blockers preventing your ranking from rising. SEO, GEO, and AEO analysis. Starting at EUR 99.',
    canonical: 'https://sivussa.com/',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Sivussa',
        url: 'https://sivussa.com',
        description: 'AI-powered SEO, GEO, and AEO audit tool for small businesses.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sivussa.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Sivussa',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: [
          { '@type': 'Offer', price: '99', priceCurrency: 'EUR', description: 'One-shot Plan' },
          { '@type': 'Offer', price: '99', priceCurrency: 'EUR', description: 'Quarterly Plan' },
          { '@type': 'Offer', price: '89', priceCurrency: 'EUR', description: 'Monthly Plan' }
        ],
        description: 'AI-powered SEO, GEO, and AEO audits with prioritized recommendations.'
      }
    ]
  },
  '/how-it-works': {
    title: 'How Sivussa Works — 4 Simple Steps to Better Visibility',
    description: 'Learn how Sivussa audits your website. Purchase audit, identify issues, get report with prioritized fixes, apply and track progress. Simple 4-step process.',
    canonical: 'https://sivussa.com/how-it-works'
  },
  '/pricing': {
    title: 'Pricing — SEO Audit Plans | One-time, Quarterly & Monthly',
    description: 'Affordable SEO, GEO, and AEO audits. One-time €99, quarterly €99, monthly €89. Prioritized recommendations, PDF reports, expert guidance.',
    canonical: 'https://sivussa.com/pricing'
  },
  '/about': {
    title: 'About Sivussa — AI-Native SEO Specialists from Finland',
    description: 'Meet the team behind Sivussa. AI-native SEO specialists from Finland providing actionable recommendations to clear your visibility blockers.',
    canonical: 'https://sivussa.com/about'
  },
  '/faq': {
    title: 'FAQ — Common Questions About Sivussa SEO Audits',
    description: 'Get answers to common questions about Sivussa SEO, GEO, and AEO audits. Pricing, how it works, technical details, and more.',
    canonical: 'https://sivussa.com/faq'
  },
  '/blog': {
    title: 'Blog — SEO, GEO, and AEO Insights',
    description: 'Technical breakdowns of search protocols, algorithmic shifts, and data optimization. Learn about SEO, GEO, and AEO best practices.',
    canonical: 'https://sivussa.com/blog'
  },
  '/blog/audited-ourselves': {
    title: 'We Audited Ourselves — Here\'s What We Found',
    description: 'Sivussa team runs an SEO/GEO/AEO audit on their own site. Discover the issues found and how we fixed them for better visibility.',
    canonical: 'https://sivussa.com/blog/audited-ourselves'
  },
  '/privacy': {
    title: 'Privacy Policy — Sivussa',
    description: 'How Sivussa collects, uses, and protects your data. GDPR compliant privacy policy.',
    canonical: 'https://sivussa.com/privacy'
  },
  '/terms': {
    title: 'Terms of Service — Sivussa',
    description: 'Terms and conditions for using Sivussa SEO/GEO/AEO audit service.',
    canonical: 'https://sivussa.com/terms'
  },
  '/open-source-notices': {
    title: 'Open Source Notices — Sivussa',
    description: 'Third-party software licenses and acknowledgments for Sivussa.',
    canonical: 'https://sivussa.com/open-source-notices'
  }
};

export async function prerender(data) {
  const html = renderToString(h(App));

  // Get metadata for current route
  const route = data.url || '/';
  const metadata = pageMetadata[route] || pageMetadata['/'];

  // Build head elements
  const headElements = new Set();

  // Add meta description
  if (metadata.description) {
    headElements.add({
      type: 'meta',
      props: { name: 'description', content: metadata.description }
    });
  }

  // Add Open Graph tags
  headElements.add({
    type: 'meta',
    props: { property: 'og:title', content: metadata.title }
  });

  headElements.add({
    type: 'meta',
    props: { property: 'og:description', content: metadata.description }
  });

  headElements.add({
    type: 'meta',
    props: { property: 'og:url', content: metadata.canonical }
  });

  // Add canonical link
  headElements.add({
    type: 'link',
    props: { rel: 'canonical', href: metadata.canonical }
  });

  // Add Twitter Card tags
  headElements.add({
    type: 'meta',
    props: { property: 'twitter:title', content: metadata.title }
  });

  headElements.add({
    type: 'meta',
    props: { property: 'twitter:description', content: metadata.description }
  });

  // Add JSON-LD schemas if present (only for homepage)
  if (metadata.schemas) {
    metadata.schemas.forEach(schema => {
      const schemaJson = JSON.stringify(schema, null, 2);
      headElements.add({
        type: 'script',
        props: { type: 'application/ld+json' },
        children: schemaJson
      });
    });
  }

  return {
    html,
    links: new Set(),
    head: {
      lang: 'en',
      title: metadata.title,
      elements: headElements
    }
  };
}
