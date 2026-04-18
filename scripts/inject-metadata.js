import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const distDir = path.join(__dirname, 'dist');
const contentDir = path.join(__dirname, 'src/content');

// Additional JSON-LD schemas
const websiteSchema = {
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
};

const softwareAppSchema = {
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
};

// Page metadata mapping
const pageMetadata = {
  '/': {
    title: 'Sivussa — AI-native visibility specialists clearing your structural blockers',
    description: 'AI specialists audit your site and provide copy-paste ready remedies to clear structural blockers preventing your ranking from rising. SEO, GEO, and AEO analysis. Starting at EUR 99.',
    canonical: 'https://sivussa.com/'
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

function injectMetadata(html, metadata) {
  const { title, description, canonical } = metadata;

  // Replace title
  let newHtml = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );

  // Replace meta description (handle both /> and > variants)
  newHtml = newHtml.replace(
    /<meta name="description" content="[^"]+"\s*\/?>/,
    `<meta name="description" content="${description}" >`
  );

  // Replace og:title
  newHtml = newHtml.replace(
    /<meta property="og:title" content="[^"]+"\s*\/?>/,
    `<meta property="og:title" content="${title}" >`
  );

  // Replace og:description
  newHtml = newHtml.replace(
    /<meta property="og:description" content="[^"]+"\s*\/?>/,
    `<meta property="og:description" content="${description}" >`
  );

  // Replace og:url
  newHtml = newHtml.replace(
    /<meta property="og:url" content="[^"]+"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" >`
  );

  // Replace canonical
  newHtml = newHtml.replace(
    /<link rel="canonical" href="[^"]+"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" >`
  );

  // Replace twitter:title if it exists
  newHtml = newHtml.replace(
    /<meta property="twitter:title" content="[^"]+"\s*\/?>/,
    `<meta property="twitter:title" content="${title}" >`
  );

  // Replace twitter:description if it exists
  newHtml = newHtml.replace(
    /<meta property="twitter:description" content="[^"]+"\s*\/?>/,
    `<meta property="twitter:description" content="${description}" >`
  );

  return newHtml;
}

function injectSchemas(html, route) {
  // Only add WebSite and SoftwareApplication schemas to the homepage
  if (route !== '/') {
    return html;
  }

  // Check if WebSite schema already exists
  if (html.includes('"@type": "WebSite"')) {
    console.log('  ℹ️  WebSite schema already exists');
  } else {
    // Find the last </script> in the head and insert after it
    const websiteSchemaHtml = `\n  <script type="application/ld+json">\n  ${JSON.stringify(websiteSchema, null, 2)}\n  </script>`;
    html = html.replace(
      /(<\/script>\s*)(<link rel=)/,
      `$1${websiteSchemaHtml}\n$2`
    );
    console.log('  ✅ Added WebSite schema');
  }

  // Check if SoftwareApplication schema already exists
  if (html.includes('"@type": "SoftwareApplication"')) {
    console.log('  ℹ️  SoftwareApplication schema already exists');
  } else {
    const softwareSchemaHtml = `\n  <script type="application/ld+json">\n  ${JSON.stringify(softwareAppSchema, null, 2)}\n  </script>`;
    html = html.replace(
      /(<\/script>\s*)(<link rel=)/,
      `$1${softwareSchemaHtml}\n$2`
    );
    console.log('  ✅ Added SoftwareApplication schema');
  }

  return html;
}

function processFile(filePath, route) {
  const metadata = pageMetadata[route];
  if (!metadata) {
    console.log(`⚠️  No metadata found for route: ${route}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  let newHtml = injectMetadata(html, metadata);
  newHtml = injectSchemas(newHtml, route);
  fs.writeFileSync(filePath, newHtml, 'utf-8');
  console.log(`✅ Injected metadata for: ${route}`);
}

// Main execution
console.log('🔧 Injecting SEO metadata into prerendered HTML files...\n');

// Process index.html (home)
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  processFile(indexPath, '/');
}

// Process nested routes
for (const [route, metadata] of Object.entries(pageMetadata)) {
  if (route === '/') continue;

  // Convert route to file path
  const filePath = path.join(distDir, route.replace(/^\//, ''), 'index.html');

  if (fs.existsSync(filePath)) {
    processFile(filePath, route);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

console.log('\n✨ Metadata injection complete!');
