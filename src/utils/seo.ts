export function buildMeta({
  title,
  description,
  canonical,
  ogImage = '/og-default.png',
}) {
  return {
    title: `${title} | Sivussa`,
    description,
    canonical: `https://sivussa.com${canonical}`,
    ogImage: `https://sivussa.com${ogImage}`,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sivussa',
    url: 'https://sivussa.com',
    logo: 'https://sivussa.com/logo.png',
    description: 'AI-powered SEO/GEO/AEO audit tool for small businesses.',
    email: 'sivussa@sivussa.com',
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
    name: 'Sivussa',
    url: 'https://sivussa.com',
  };
}

export function faqPageJsonLd(items) {
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
    name: 'Sivussa',
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
