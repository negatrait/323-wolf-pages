/**
 * Vite Content Plugin — Build-time markdown → typed JS constants
 *
 * Data flow:
 *   Markdown files → gray-matter (frontmatter + content) → marked (HTML) → exported constants → page components
 *
 * This plugin runs at build time only. It reads markdown from src/content/,
 * parses frontmatter, renders HTML via marked, and emits a virtual module
 * with typed JS constants that page components import.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { Marked } from 'marked';

// ─── Site Configuration ───────────────────────────────────────
// Loaded from src/content/site.md frontmatter at build time.
// Edit there — or via Pages CMS.
let SITE: { name: string; url: string; email: string; tagline: string };

function loadSiteConfig(contentDir: string) {
  const siteMd = loadMd(contentDir, 'site.md');
  SITE = {
    name: siteMd.frontmatter.name as string,
    url: siteMd.frontmatter.url as string,
    email: siteMd.frontmatter.email as string,
    tagline: siteMd.frontmatter.tagline as string,
  };
}

// ─── Interfaces ───────────────────────────────────────────────

/** Hero frontmatter (home/hero.md) */
interface HeroFrontmatter {
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_primary_href: string;
  cta_secondary: string;
  cta_secondary_href: string;
  seo_title?: string;
  seo_description?: string;
}

/** What-You-Get frontmatter (home/what-you-get.md) */
interface WhatYouGetFrontmatter {
  title: string;
}

/** Problem frontmatter (home/problem.md) */
interface ProblemFrontmatter {
  title: string;
  subtitle: string;
}

/** How-It-Works frontmatter (home/how-it-works.md) */
interface HowItWorksFrontmatter {
  title: string;
  heading?: string;
  heading_highlight?: string;
  intro?: string;
  steps: Array<{ number: number; title: string; description: string }>;
  comparison: { other: string; sivussa: string };
  comparison_heading?: string;
  comparison_heading_highlight?: string;
  comparison_table?: { headers: string[]; rows: string[][] };
  what_you_get?: Array<{ title: string; desc: string }>;
  cta_title?: string;
  cta_subtitle?: string;
  cta_text?: string;
  cta_href?: string;
}

/** Features frontmatter (home/features.md) */
interface FeaturesFrontmatter {
  title: string;
  subtitle: string;
  features: Array<{ icon: string; title: string; desc: string }>;
}

/** Who-Is-This-For frontmatter */
interface WhoIsThisForFrontmatter {
  title: string;
  cards: Array<{ title: string; description: string }>;
}

/** Pricing frontmatter (home/pricing.md) */
interface PricingFrontmatter {
  title: string;
  subtitle: string;
  tiers: Array<{
    name: string;
    price: string;
    period: string;
    popular: boolean;
    cta_text: string;
    cta_href: string;
    features: string[];
  }>;
  terms?: string[];
  faq?: Array<{ question: string; answer: string }>;
  feature_table?: { headers: string[]; rows: (string | boolean)[][] };
  competitors?: Array<{
    name: string;
    price: string;
    desc: string;
    highlight?: boolean;
  }>;
  cta_title?: string;
  cta_text?: string;
  cta_href?: string;
}

/** FAQ frontmatter */
interface FaqFrontmatter {
  title: string;
  faqs: Array<{ question: string; answer: string }>;
}

/** Blog post frontmatter */
interface BlogPostFrontmatter {
  title: string;
  description: string;
  seo_title?: string;
  seo_description?: string;
  date: string;
  category: string;
  readTime: string;
}

/** Blog index frontmatter */
interface BlogIndexFrontmatter {
  title: string;
  description: string;
  categories: string[];
  search_placeholder: string;
  load_more_text: string;
  load_more_link: string;
}

/** Generic page frontmatter */
interface PageFrontmatter {
  title: string;
  subtitle?: string;
  seo_title?: string;
  seo_description?: string;
}

/** About section parsed from markdown body */
interface AboutSection {
  title: string;
  subtitle?: string;
  intro?: string;
  content?: string;
  contentHtml?: string;
  agents?: Array<{ title: string; desc: string; descHtml?: string }>;
  values?: Array<{
    num: string;
    title: string;
    desc: string;
    descHtml?: string;
  }>;
  timeline?: Array<{ title: string; content: string; contentHtml?: string }>;
  email?: string;
}

// ─── Marked setup ─────────────────────────────────────────────

/**
 * Custom text renderer: escapes only HTML-significant chars (& < >).
 * Default Marked also escapes quotes/apostrophes, which causes double-encoding
 * when preact-render-to-string processes the output.
 */
const marked = new Marked({
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : undefined;
      const { value } = language
        ? hljs.highlight(text, { language })
        : hljs.highlightAuto(text);
      const langClass = language ? ` language-${language}` : '';
      return `<pre><code class="hljs${langClass}">${value}</code></pre>`;
    },
    text({ text, raw: _raw }) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
  },
});

// ─── HTML helpers (work on marked output) ─────────────────────

/** Strip all HTML tags and trim */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

/** Extract text content from `<li>` elements */
function extractLiText(html: string): string[] {
  return [...html.matchAll(/<li>(.+?)<\/li>/g)].map((m) => stripTags(m[1]));
}

/** Find the first `<p>` whose text content starts with `prefix` (case-insensitive) */
function findParagraph(html: string, prefix: string): string | undefined {
  for (const m of html.matchAll(/<p>(.+?)<\/p>/gs)) {
    if (stripTags(m[1]).toLowerCase().startsWith(prefix)) return m[1];
  }
  return undefined;
}

/** Extract `<h2>` + following `<ul>` sections from HTML */
function extractH2UlSections(
  html: string,
): Array<{ title: string; items: string[] }> {
  const sections: Array<{ title: string; items: string[] }> = [];
  const re = /<h2>([^<]+)<\/h2>\s*<ul>(.+?)<\/ul>/gs;
  for (const m of html.matchAll(re)) {
    sections.push({ title: m[1].trim(), items: extractLiText(m[2]) });
  }
  return sections;
}

// ─── Markdown loader ──────────────────────────────────────────

function loadMd<T = Record<string, unknown>>(
  contentDir: string,
  filePath: string,
): { frontmatter: T; html: string; raw: string } {
  const raw = fs.readFileSync(path.join(contentDir, filePath), 'utf-8');
  const { data, content } = matter(raw);
  return {
    frontmatter: data as T,
    html: marked.parse(content) as string,
    raw: content,
  };
}

// ─── Route Meta Builder ───────────────────────────────────────

function buildRouteMeta(
  contentDir: string,
  hero: any,
  pricingMd: any,
  faqMd: any,
  aboutMd: any,
  blogPostsMap: Record<string, any>,
): Record<string, { title: string; description: string; canonical: string }> {
  const howItWorksMd = loadMd(contentDir, 'home/how-it-works.md');
  const blogConfigMd = loadMd(contentDir, 'blog/index.md');

  const routes: Record<
    string,
    { title: string; description: string; canonical: string }
  > = {};

  const routeSources: Array<{ path: string; fm: any }> = [
    { path: '/', fm: hero },
    { path: '/how-it-works', fm: howItWorksMd.frontmatter },
    { path: '/pricing', fm: pricingMd },
    { path: '/about', fm: aboutMd },
    { path: '/faq', fm: faqMd },
    { path: '/blog', fm: blogConfigMd.frontmatter },
  ];

  for (const r of routeSources) {
    routes[r.path] = {
      title: r.fm?.seo_title || SITE.name,
      description: r.fm?.seo_description || '',
      canonical: `${SITE.url}${r.path === '/' ? '/' : r.path}`,
    };
  }

  for (const [slug, post] of Object.entries(blogPostsMap)) {
    const postPath = `/blog/${slug}`;
    routes[postPath] = {
      title:
        (post as any)?.seo_title ||
        `${(post as any).title} — ${SITE.name} Blog`,
      description:
        (post as any)?.seo_description || (post as any).description || '',
      canonical: `${SITE.url}${postPath}`,
    };
  }

  // Legal pages have no frontmatter — derive from site config
  routes['/open-source-notices'] = {
    title: `Open Source Notices — ${SITE.name}`,
    description: 'Third-party software licenses and acknowledgments.',
    canonical: `${SITE.url}/open-source-notices`,
  };
  routes['/privacy'] = {
    title: `Privacy Policy — ${SITE.name}`,
    description:
      'How your data is collected, used, and protected. GDPR compliant.',
    canonical: `${SITE.url}/privacy`,
  };
  routes['/terms'] = {
    title: `Terms of Service — ${SITE.name}`,
    description: 'Terms and conditions for using the audit service.',
    canonical: `${SITE.url}/terms`,
  };

  return routes;
}

// ─── Plugin ───────────────────────────────────────────────────

export default function contentPlugin() {
  const virtualModuleId = 'virtual:content';
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;

  return {
    name: 'vite-content-plugin',
    resolveId(id: string) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id: string) {
      if (id !== resolvedVirtualModuleId) return;

      const contentDir = path.resolve(process.cwd(), 'src/content');
      loadSiteConfig(contentDir);

      // ── HOME ──────────────────────────────────────────────

      const hero = loadMd<HeroFrontmatter>(contentDir, 'home/hero.md');
      const HOME_HERO = {
        title: hero.frontmatter.title,
        subtitle: hero.frontmatter.subtitle,
        cta_primary: hero.frontmatter.cta_primary,
        cta_primary_href: hero.frontmatter.cta_primary_href,
        cta_secondary: hero.frontmatter.cta_secondary,
        cta_secondary_href: hero.frontmatter.cta_secondary_href,
        content: hero.html,
        seo_title: hero.frontmatter.seo_title,
        seo_description: hero.frontmatter.seo_description,
      };

      // What You Get — items come from <li> elements, icon mapped by title
      const whatYouGet = loadMd<WhatYouGetFrontmatter>(
        contentDir,
        'home/what-you-get.md',
      );
      const iconMap: Record<string, string> = {
        'Full visibility audit': 'search',
        'Prioritized findings': 'assignment',
        'Specific guidance': 'psychology',
        'PDF report': 'email',
      };
      const whatYouGetItems = extractLiText(whatYouGet.html).map((text) => {
        const colonIdx = text.indexOf(':');
        if (colonIdx === -1)
          return { icon: 'check_circle', title: text, desc: '' };
        const title = text.slice(0, colonIdx).trim();
        return {
          icon: iconMap[title] || 'check_circle',
          title,
          desc: text.slice(colonIdx + 1).trim(),
        };
      });
      const subscriberNote = (() => {
        const p = findParagraph(whatYouGet.html, 'for subscribers');
        return p ? stripTags(p).replace(/^For subscribers:\s*/i, '') : '';
      })();
      const HOME_WHAT_YOU_GET = {
        title: whatYouGet.frontmatter.title,
        items: whatYouGetItems,
        subscriberNote,
      };

      // Problem — sections from <h2> + <ul> pairs
      const problem = loadMd<ProblemFrontmatter>(contentDir, 'home/problem.md');
      const HOME_PROBLEM = {
        title: problem.frontmatter.title,
        subtitle: problem.frontmatter.subtitle,
        intro: marked.parse(problem.html.split(/<h2>/)[0]),
        sections: extractH2UlSections(problem.html),
      };

      // How It Works — all data in frontmatter
      const howItWorks = loadMd<HowItWorksFrontmatter>(
        contentDir,
        'home/how-it-works.md',
      );
      const HOME_HOW_IT_WORKS = {
        title: howItWorks.frontmatter.title,
        heading: howItWorks.frontmatter.heading,
        headingHighlight: howItWorks.frontmatter.heading_highlight,
        intro: howItWorks.frontmatter.intro,
        steps: howItWorks.frontmatter.steps,
        comparison: howItWorks.frontmatter.comparison,
        comparisonHeading: howItWorks.frontmatter.comparison_heading,
        comparisonHeadingHighlight:
          howItWorks.frontmatter.comparison_heading_highlight,
        comparisonTable: howItWorks.frontmatter.comparison_table,
        whatYouGet: howItWorks.frontmatter.what_you_get,
        ctaTitle: howItWorks.frontmatter.cta_title,
        ctaSubtitle: howItWorks.frontmatter.cta_subtitle,
        ctaText: howItWorks.frontmatter.cta_text,
        ctaHref: howItWorks.frontmatter.cta_href,
      };

      // Features
      const features = loadMd<FeaturesFrontmatter>(
        contentDir,
        'home/features.md',
      );
      const HOME_FEATURES = {
        title: features.frontmatter.title,
        subtitle: features.frontmatter.subtitle,
      };
      const FEATURES = features.frontmatter.features;

      // Who Is This For
      const whoIsThisFor = loadMd<WhoIsThisForFrontmatter>(
        contentDir,
        'home/who-is-this-for.md',
      );
      const HOME_WHO_IS_THIS_FOR = {
        title: whoIsThisFor.frontmatter.title,
        cards: whoIsThisFor.frontmatter.cards.map((c) => ({
          title: c.title,
          desc: c.description,
        })),
      };

      // Pricing
      const pricing = loadMd<PricingFrontmatter>(contentDir, 'home/pricing.md');
      const HOME_PRICING = {
        title: pricing.frontmatter.title,
        subtitle: pricing.frontmatter.subtitle,
      };
      const PRICING_TIERS = pricing.frontmatter.tiers.map((t) => ({
        name: t.name,
        price: t.price,
        period: t.period,
        popular: t.popular,
        ctaText: t.cta_text,
        ctaHref: t.cta_href,
        features: t.features,
      }));

      const PRICING_FAQ = pricing.frontmatter.faq || [];
      const PRICING_FEATURE_TABLE = pricing.frontmatter.feature_table || {
        headers: [],
        rows: [],
      };
      const PRICING_COMPETITORS = pricing.frontmatter.competitors || [];
      const PRICING_CTA = {
        title: pricing.frontmatter.cta_title || '',
        text: pricing.frontmatter.cta_text || '',
        href: pricing.frontmatter.cta_href || '',
      };

      // FAQ
      const faq = loadMd<FaqFrontmatter>(contentDir, 'faq.md');
      const HOME_FAQ = { title: faq.frontmatter.title };

      // Final CTA
      const HOME_FINAL_CTA = {
        title: 'Stop guessing. Start with a real audit.',
        subtitle:
          'Get a comprehensive visibility audit with prioritized recommendations.',
        cta: hero.frontmatter.cta_primary,
        cta_href: hero.frontmatter.cta_primary_href,
      };

      // ── ABOUT ─────────────────────────────────────────────

      const about = loadMd<PageFrontmatter>(contentDir, 'about.md');
      const aboutSections = parseAboutSections(about.raw);
      const ABOUT = {
        title: about.frontmatter.title,
        subtitle: about.frontmatter.subtitle,
        intro:
          'We believe every business deserves visibility — not just the ones with €5,000/month agency budgets.',
        sections: aboutSections.map(mapAboutSection),
        email: SITE.email,
      };

      // ── BLOG ──────────────────────────────────────────────

      const blog = loadMd<BlogIndexFrontmatter>(contentDir, 'blog/index.md');
      const postsDir = path.join(contentDir, 'blog/posts');
      const posts = fs
        .readdirSync(postsDir)
        .filter((f) => f.endsWith('.md'))
        .map((filename) => {
          const slug = filename.replace('.md', '');
          const post = loadMd<BlogPostFrontmatter>(
            contentDir,
            path.join('blog/posts', filename),
          );
          return {
            slug,
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            date: post.frontmatter.date,
            category: post.frontmatter.category,
            readTime: post.frontmatter.readTime,
            html: post.html,
            excerpt: `${stripTags(post.html).substring(0, 200)}...`,
          };
        })
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      const blogPostsMap: Record<string, unknown> = {};
      for (const post of posts) {
        blogPostsMap[post.slug] = {
          title: post.title,
          description: post.description,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          date: post.date,
          category: post.category,
          readTime: post.readTime,
          html: post.html,
        };
      }

      const BLOG_CONFIG = {
        title: blog.frontmatter.title,
        description: blog.frontmatter.description,
        categories: blog.frontmatter.categories,
        searchPlaceholder: blog.frontmatter.search_placeholder,
        loadMoreText: blog.frontmatter.load_more_text,
        loadMoreLink: blog.frontmatter.load_more_link,
        posts,
      };

      // ── FOOTER & NAV ──────────────────────────────────────

      const footer = loadMd(contentDir, 'footer.md');
      const FOOTER_SECTIONS = footer.frontmatter.sections;
      const FOOTER_COPYRIGHT = footer.frontmatter.copyright;

      const nav = loadMd(contentDir, 'nav.md');
      const NAV_CONFIG = nav.frontmatter;

      // ── FAQ & LEGAL ───────────────────────────────────────

      const FAQ_ITEMS = faq.frontmatter.faqs;
      const PRIVACY_POLICY = {
        html: loadMd(contentDir, 'home/sivussa_privacy_policy.md').html,
      };
      const TERMS_OF_SERVICE = {
        html: loadMd(contentDir, 'home/sivussa_terms_of_service.md').html,
      };
      const OPEN_SOURCE_NOTICES = {
        html: loadMd(contentDir, 'home/sivussa_open_source_notices.md').html,
      };
      const PRICING_TERMS = pricing.frontmatter.terms || [];

      // ── EMIT ──────────────────────────────────────────────

      return [
        ['HOME_HERO', HOME_HERO],
        ['HOME_WHAT_YOU_GET', HOME_WHAT_YOU_GET],
        ['HOME_PROBLEM', HOME_PROBLEM],
        ['HOME_HOW_IT_WORKS', HOME_HOW_IT_WORKS],
        ['HOME_FEATURES', HOME_FEATURES],
        ['HOME_WHO_IS_THIS_FOR', HOME_WHO_IS_THIS_FOR],
        ['HOME_PRICING', HOME_PRICING],
        ['HOME_FAQ', HOME_FAQ],
        ['HOME_FINAL_CTA', HOME_FINAL_CTA],
        ['ABOUT', ABOUT],
        ['BLOG_CONFIG', BLOG_CONFIG],
        ['BLOG_POSTS_MAP', blogPostsMap],
        ['FOOTER_SECTIONS', FOOTER_SECTIONS],
        ['FOOTER_COPYRIGHT', FOOTER_COPYRIGHT],
        ['NAV_CONFIG', NAV_CONFIG],
        ['FAQ_ITEMS', FAQ_ITEMS],
        ['PRICING_TIERS', PRICING_TIERS],
        ['FEATURES', FEATURES],
        ['PRIVACY_POLICY', PRIVACY_POLICY],
        ['TERMS_OF_SERVICE', TERMS_OF_SERVICE],
        ['OPEN_SOURCE_NOTICES', OPEN_SOURCE_NOTICES],
        ['PRICING_TERMS', PRICING_TERMS],
        ['PRICING_FAQ', PRICING_FAQ],
        ['PRICING_FEATURE_TABLE', PRICING_FEATURE_TABLE],
        ['PRICING_COMPETITORS', PRICING_COMPETITORS],
        ['PRICING_CTA', PRICING_CTA],
        [
          'SITE_CONFIG',
          {
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
            tagline: hero.seo_title || SITE.name,
          },
        ],
        [
          'ROUTE_META',
          buildRouteMeta(
            contentDir,
            hero.frontmatter,
            pricing.frontmatter,
            faq.frontmatter,
            about.frontmatter,
            blogPostsMap,
          ),
        ],
      ]
        .map(([name, val]) => `export const ${name} = ${JSON.stringify(val)};`)
        .join('\n');
    },

    // ── GENERATE LLM CONTENT FILES ──────────────────────────
    // Builds llms.txt + llms-*.md from the same parsed content
    // used by page components. One source of truth.
    generateBundle() {
      const contentDir = path.resolve(process.cwd(), 'src/content');
      loadSiteConfig(contentDir);

      const heroMd = loadMd(contentDir, 'home/hero.md');
      const hero = heroMd.frontmatter;
      const problemMd = loadMd(contentDir, 'home/problem.md');
      const howItWorksMd = loadMd(contentDir, 'home/how-it-works.md');
      const hw = howItWorksMd.frontmatter;
      const pricingMd = loadMd(contentDir, 'home/pricing.md');
      const pm = pricingMd.frontmatter;
      const faqMd = loadMd(contentDir, 'faq.md');
      const aboutMd = loadMd(contentDir, 'about.md');
      const aboutSections = parseAboutSections(aboutMd.raw);

      // llms.txt — site index
      const llmsTxt = `# ${hero.seo_title || SITE.name}

> ${hero.seo_description || ''}

Visit ${SITE.url} for more information.

## Main

- [${SITE.name}](${SITE.url}/) - Landing page
- [How It Works](${SITE.url}/how-it-works) - How the service works
- [Pricing](${SITE.url}/pricing): Pricing information and plans

## Optional

- [About](${SITE.url}/about): About the organization
- [FAQ](${SITE.url}/faq): Frequently asked Questions with Answers
- [Blog](${SITE.url}/blog): Latest articles and updates
`;

      // llms-home.md
      const llmsHome = llmsTxt;

      // llms-how-it-works.md
      const stepsList = (hw.steps || [])
        .map((s: any) => `${s.number}. **${s.title}** — ${s.description}`)
        .join('\n');
      const tableRows = (hw.comparison_table?.rows || [])
        .map((r: string[]) => `| ${r.join(' | ')} |`)
        .join('\n');
      const tableHeaders =
        (hw.comparison_table?.headers || [])
          .map((h: string) => `| ${h} |`)
          .join('\n') +
        '\n' +
        (hw.comparison_table?.headers || []).map(() => '| --- ').join('') +
        '|';
      const llmsHowItWorks = `# How It Works — ${SITE.name}

${problemMd.raw.split('---').slice(2).join('---').trim()}

## The Process

${stepsList}

Starting at EUR 89/99. Visit [sivussa.com](${SITE.url}) to get started.
`;

      // llms-pricing.md
      const tierLines = (pm.tiers || [])
        .map(
          (t: any) =>
            `### ${t.name} — ${t.price} (${t.period})\n- ${t.features.join('\n- ')}\n- [${t.cta_text}](${t.cta_href})`,
        )
        .join('\n\n');
      const pricingFaqLines = (pm.faq || [])
        .map((f: any) => `**${f.question}**\n${f.answer}`)
        .join('\n\n');
      const llmsPricing = `# Pricing — ${SITE.name}

Transparent pricing. No hidden fees. Cancel anytime.

## Plans

${tierLines}

## FAQ

${pricingFaqLines}

Visit [sivussa.com/pricing](${SITE.url}/pricing) for full details.
`;

      // llms-faq.md
      const faqCategories: Record<string, any[]> = {};
      for (const item of faqMd.frontmatter.faqs || []) {
        const cat = item.category || 'General';
        if (!faqCategories[cat]) faqCategories[cat] = [];
        faqCategories[cat].push(item);
      }
      const faqSections = Object.entries(faqCategories)
        .map(([cat, items]) => {
          const qas = items
            .map((i: any) => `**${i.question}**\n${i.answer}`)
            .join('\n\n');
          return `## ${cat}\n\n${qas}`;
        })
        .join('\n\n');
      const llmsFaq = `# FAQ — ${SITE.name}

      Frequently asked questions about Sivussa visibility audits.

${faqSections}

Visit [sivussa.com](${SITE.url}) for more information.
`;

      // llms-about.md
      const aboutBody = aboutMd.raw.split('---').slice(2).join('---').trim();
      const llmsAbout = `# About ${SITE.name}

${aboutBody}
`;

      // Emit all as static assets
      const files: Record<string, string> = {
        'llms.txt': llmsTxt,
        'llms-home.md': llmsHome,
        'llms-how-it-works.md': llmsHowItWorks,
        'llms-pricing.md': llmsPricing,
        'llms-faq.md': llmsFaq,
        'llms-about.md': llmsAbout,
      };

      // ── SITEMAP ──────────────────────────────────────────
      const gitLogDate = (filePath: string): string => {
        try {
          const date = execSync(`git log -1 --format=%as -- "${filePath}"`, {
            encoding: 'utf-8',
          }).trim();
          return date || new Date().toISOString().split('T')[0];
        } catch {
          return new Date().toISOString().split('T')[0];
        }
      };

      const sitemapPages = [
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
          lastmod: gitLogDate(
            'src/content/home/sivussa_open_source_notices.md',
          ),
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

      const postsDir = path.join(contentDir, 'blog/posts');
      if (fs.existsSync(postsDir)) {
        for (const f of fs
          .readdirSync(postsDir)
          .filter((f: string) => f.endsWith('.md'))) {
          sitemapPages.push({
            loc: `/blog/${f.replace('.md', '')}`,
            lastmod: gitLogDate(`src/content/blog/posts/${f}`),
            changefreq: 'monthly',
          });
        }
      }

      const sitemapXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...sitemapPages.map(
          (p) =>
            `  <url><loc>${SITE.url}${p.loc}</loc><lastmod>${p.lastmod}</lastmod>${p.changefreq ? `<changefreq>${p.changefreq}</changefreq>` : ''}${p.priority ? `<priority>${p.priority}</priority>` : ''}</url>`,
        ),
        '</urlset>',
        '',
      ].join('\n');

      files['sitemap.xml'] = sitemapXml;

      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({
          type: 'asset',
          fileName,
          source,
        });
      }
    },
  };
}

// ─── About page parser ────────────────────────────────────────

interface RawAboutSection {
  title: string;
  content: string;
  contentHtml: string;
  subtitle: string;
  agents: Array<{ title: string; desc: string; descHtml: string }>;
  values: Array<{ num: string; title: string; desc: string; descHtml: string }>;
  timeline: Array<{ title: string; content: string; contentHtml: string }>;
  email: string;
}

/** Parse about.md raw markdown into sections by ## headings */
function parseAboutSections(raw: string): RawAboutSection[] {
  const lines = raw.split('\n');
  let current: RawAboutSection | null = null;
  const sections: RawAboutSection[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = {
        title: line.replace('## ', '').trim(),
        content: '',
        subtitle: '',
        agents: [],
        values: [],
        timeline: [],
        email: '',
      };
    } else if (!current) {
      // skip lines before first ## heading
    } else if (line.startsWith('### ')) {
      const sub = line.replace('### ', '').trim();
      if (['Short term', 'Medium term', 'Long term'].includes(sub)) {
        current.timeline.push({ title: sub, content: '' });
      } else if (sub.includes('Agent')) {
        current.agents.push({ title: sub, desc: '' });
      }
    } else if (line.match(/^\d{2}\.\s/)) {
      const m = line.match(/^(\d{2})\.\s+\*\*([^*]+)\*\*/);
      if (m) current.values.push({ num: m[1], title: m[2], desc: '' });
    } else if (line.trim()) {
      const text = line.trim();
      if (current.timeline.length > 0 && text) {
        current.timeline[current.timeline.length - 1].content += `${text} `;
      } else if (current.agents.length > 0 && text && !text.startsWith('-')) {
        current.agents[current.agents.length - 1].desc += `${text} `;
      } else if (current.values.length > 0 && text) {
        current.values[current.values.length - 1].desc += `${text} `;
      } else if (text.includes(SITE.email)) {
        current.email = SITE.email;
      } else if (!text.startsWith('-')) {
        current.content += `${text}\n`;
      }
    }
  }
  if (current) sections.push(current);

  // Render markdown content to HTML
  for (const s of sections) {
    s.content = s.content.trim();
    s.contentHtml = marked.parse(s.content);
    for (const a of s.agents) {
      a.desc = a.desc.trim();
      a.descHtml = marked.parse(a.desc);
    }
    for (const v of s.values) {
      v.desc = v.desc.trim();
      v.descHtml = marked.parse(v.desc);
    }
    for (const t of s.timeline) {
      t.content = t.content.trim();
      t.contentHtml = marked.parse(t.content);
    }
  }

  return sections;
}

/** Map raw about section to the output shape used by the About page component */
function mapAboutSection(s: RawAboutSection): AboutSection {
  const base = { title: s.title };
  if (s.title === 'Our approach') {
    return {
      ...base,
      subtitle: 'they fix',
      intro:
        'We built Sivussa to solve one problem: the gap between finding issues and actually clearing them.',
      agents: s.agents,
    };
  }
  if (s.title === 'Our Values') return { ...base, values: s.values };
  if (s.title === "What we're building")
    return { ...base, timeline: s.timeline };
  if (s.title === 'Questions? Want to say hello?')
    return { ...base, email: s.email };
  return { ...base, content: s.content, contentHtml: s.contentHtml };
}
