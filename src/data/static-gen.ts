/**
 * Static file generation — sitemap.xml + llms.txt + llms-*.md
 * Extracted from the old monolith plugin's generateBundle().
 * Called by the Vite plugin's generateBundle hook.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { AllContent } from './types';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority?: string;
}

function gitLogDate(filePath: string): string {
  try {
    const date = execSync(`git log -1 --format=%as -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    return date || new Date().toISOString().split('T')[0]!;
  } catch {
    return new Date().toISOString().split('T')[0]!;
  }
}

export function generateStaticFiles(
  content: AllContent,
  contentDir: string,
): Record<string, string> {
  const site = content.siteConfig;
  const files: Record<string, string> = {};

  // ── llms.txt ──
  const llmsTxt = `# ${content.homeHero.seoTitle || site.name}

> ${content.homeHero.seoDescription || ''}

Visit ${site.url} for more information.

## Main

- [${site.name}](${site.url}/) - Landing page
- [How It Works](${site.url}/how-it-works) - How the service works
- [Pricing](${site.url}/pricing): Pricing information and plans

## Optional

- [About](${site.url}/about): About the organization
- [FAQ](${site.url}/faq): Frequently asked Questions with Answers
- [Blog](${site.url}/blog): Latest articles and updates
`;
  files['llms.txt'] = llmsTxt;
  files['llms-home.md'] = llmsTxt;

  // ── llms-how-it-works.md ──
  const stepsList = content.homeHowItWorks.steps
    .map((s) => `${s.number}. **${s.title}** \u2014 ${s.description}`)
    .join('\n');
  // Read raw problem markdown for the llms file
  const problemRaw = fs
    .readFileSync(path.join(contentDir, 'home/problem.md'), 'utf-8')
    .split('---')
    .slice(2)
    .join('---')
    .trim();
  files['llms-how-it-works.md'] = `# How It Works \u2014 ${site.name}

${problemRaw}

## The Process

${stepsList}
`;

  // ── llms-pricing.md ──
  const tierLines = content.pricingTiers
    .map(
      (t) =>
        `### ${t.name} \u2014 ${t.price} (${t.period})\n- ${t.features.join('\n- ')}\n- [${t.ctaText}](${t.ctaHref})`,
    )
    .join('\n\n');
  const pricingFaqLines = content.pricingFaq
    .map((f) => `**${f.question}**\n${f.answer}`)
    .join('\n\n');
  files['llms-pricing.md'] = `# Pricing \u2014 ${site.name}

## Plans

${tierLines}

## FAQ

${pricingFaqLines}

Visit [${site.name}/pricing](${site.url}/pricing) for full details.
`;

  // ── llms-faq.md ──
  const faqCategories: Record<
    string,
    Array<{ question: string; answer: string }>
  > = {};
  for (const item of content.faqItems) {
    const cat = item.category || 'General';
    if (!faqCategories[cat]) faqCategories[cat] = [];
    faqCategories[cat]!.push(item);
  }
  const faqSections = Object.entries(faqCategories)
    .map(([cat, items]) => {
      const qas = items
        .map((i) => `**${i.question}**\n${i.answer}`)
        .join('\n\n');
      return `## ${cat}\n\n${qas}`;
    })
    .join('\n\n');
  files['llms-faq.md'] = `# FAQ \u2014 ${site.name}

Frequently asked questions about ${site.name} visibility audits.

${faqSections}

Visit [${site.name}](${site.url}) for more information.
`;

  // ── llms-about.md ──
  const aboutBody = fs
    .readFileSync(path.join(contentDir, 'about.md'), 'utf-8')
    .split('---')
    .slice(2)
    .join('---')
    .trim();
  files['llms-about.md'] = `# About ${site.name}

${aboutBody}
`;

  // ── sitemap.xml ──
  const sitemapPages: SitemapEntry[] = [
    {
      loc: '/',
      lastmod: gitLogDate('src/content/home/hero.md'),
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: '/how-it-works',
      lastmod: gitLogDate('src/content/home/how-it-works.md'),
      changefreq: 'monthly',
      priority: '0.5',
    },
    {
      loc: '/pricing',
      lastmod: gitLogDate('src/content/home/pricing.md'),
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      loc: '/about',
      lastmod: gitLogDate('src/content/about.md'),
      changefreq: 'monthly',
      priority: '0.6',
    },
    {
      loc: '/faq',
      lastmod: gitLogDate('src/content/faq.md'),
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: '/blog',
      lastmod: gitLogDate('src/content/blog/index.md'),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: '/open-source-notices',
      lastmod: gitLogDate('src/content/home/sivussa_open_source_notices.md'),
      changefreq: 'yearly',
      priority: '0.1',
    },
    {
      loc: '/privacy',
      lastmod: gitLogDate('src/content/home/sivussa_privacy_policy.md'),
      changefreq: 'yearly',
      priority: '0.1',
    },
    {
      loc: '/terms',
      lastmod: gitLogDate('src/content/home/sivussa_terms_of_service.md'),
      changefreq: 'yearly',
      priority: '0.1',
    },
  ];

  // Blog posts — fix: now include priority
  const postsDir = path.join(contentDir, 'blog/posts');
  if (fs.existsSync(postsDir)) {
    for (const f of fs
      .readdirSync(postsDir)
      .filter((f: string) => f.endsWith('.md'))) {
      sitemapPages.push({
        loc: `/blog/${f.replace('.md', '')}`,
        lastmod: gitLogDate(`src/content/blog/posts/${f}`),
        changefreq: 'monthly',
        priority: '0.5',
      });
    }
  }

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapPages.map(
      (p) =>
        `  <url><loc>${site.url}${p.loc}</loc><lastmod>${p.lastmod}</lastmod>${p.changefreq ? `<changefreq>${p.changefreq}</changefreq>` : ''}${p.priority ? `<priority>${p.priority}</priority>` : ''}</url>`,
    ),
    '</urlset>',
    '',
  ].join('\n');
  files['sitemap.xml'] = sitemapXml;

  return files;
}
