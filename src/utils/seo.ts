import { SITE_CONFIG } from '../data/load-content';

const { name: SITE_NAME, url: SITE_URL, email: SITE_EMAIL } = SITE_CONFIG;

export function buildMeta({
  title,
  description,
  canonical,
  ogImage = '/og-default.png',
}: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}) {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    canonical: `${SITE_URL}${canonical}`,
    ogImage: `${SITE_URL}${ogImage}`,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'AI-powered visibility audit tool for small businesses.',
    email: SITE_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Helsinki',
      addressCountry: 'FI',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function softwareAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'EUR',
        description: 'One-shot Plan',
      },
      {
        '@type': 'Offer',
        price: '89',
        priceCurrency: 'EUR',
        description: 'Quarterly Plan',
      },
      {
        '@type': 'Offer',
        price: '79',
        priceCurrency: 'EUR',
        description: 'Monthly Plan',
      },
    ],
  };
}
