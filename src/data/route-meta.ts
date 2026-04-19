/**
 * Per-route SEO metadata.
 * Single source of truth for both prerender (SSR) and client-side Head component.
 */
const routes = {
  '/': {
    title:
      'Sivussa — AI-native visibility specialists clearing your structural blockers',
    description:
      'AI specialists audit your site and provide copy-paste ready remedies to clear structural blockers preventing your ranking from rising. SEO, GEO, and AEO analysis. Starting at EUR 99.',
    canonical: 'https://sivussa.com/',
  },
  '/how-it-works': {
    title: 'How Sivussa Works — 4 Simple Steps to Better Visibility',
    description:
      'Learn how Sivussa audits your website. Purchase audit, identify issues, get report with prioritized fixes, apply and track progress. Simple 4-step process.',
    canonical: 'https://sivussa.com/how-it-works',
  },
  '/pricing': {
    title: 'Pricing — SEO Remedy Plans | One-time or Recurring',
    description:
      'Affordable SEO, GEO, and AEO audits. One-time €99, quarterly €99, monthly €89. Prioritized recommendations, PDF reports, expert guidance.',
    canonical: 'https://sivussa.com/pricing',
  },
  '/about': {
    title: 'About Sivussa — AI-Native SEO Specialists from Finland',
    description:
      'Meet the team behind Sivussa. AI-native SEO specialists from Finland providing actionable recommendations to clear your visibility blockers.',
    canonical: 'https://sivussa.com/about',
  },
  '/faq': {
    title: 'FAQ — Common Questions About Sivussa SEO Audits',
    description:
      'Get answers to common questions about Sivussa SEO, GEO, and AEO audits. Pricing, how it works, technical details, and more.',
    canonical: 'https://sivussa.com/faq',
  },
  '/blog': {
    title: 'Blog — SEO, GEO, and AEO Insights',
    description:
      'Technical breakdowns of search protocols, algorithmic shifts, and data optimization. Learn about SEO, GEO, and AEO best practices.',
    canonical: 'https://sivussa.com/blog',
  },
  '/blog/audited-ourselves': {
    title: "We Audited Ourselves — Here's What We Found",
    description:
      'Sivussa team runs an SEO/GEO/AEO audit on their own site. Discover the issues found and how we fixed them for better visibility.',
    canonical: 'https://sivussa.com/blog/audited-ourselves',
  },
  '/open-source-notices': {
    title: 'Open Source Notices — Sivussa',
    description:
      'Third-party software licenses and acknowledgments for Sivussa.',
    canonical: 'https://sivussa.com/open-source-notices',
  },
};

export function getRouteMeta(path) {
  return routes[path] || routes['/'];
}
