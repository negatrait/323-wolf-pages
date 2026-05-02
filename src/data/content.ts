/**
 * Content loader — pure TypeScript, no Vite coupling.
 * Reads markdown files from disk, returns typed content objects.
 * Used by both the Vite virtual module plugin (dev HMR) and prerender.
 *
 * Single pass per file. All field names normalized to camelCase at parse time.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseAbout } from './parse-about';
import {
  extractH2UlSections,
  extractLiText,
  findParagraph,
  loadMd,
  marked,
  stripTags,
} from './parse-markdown';
import type {
  AllContent,
  BlogPostMapEntry,
  FaqItem,
  Feature,
  FeaturesHeader,
  FinalCta,
  FooterSection,
  HeroContent,
  HowItWorksContent,
  NavConfig,
  PricingCompetitor,
  PricingCta,
  PricingFaqItem,
  PricingFeatureTable,
  PricingTerm,
  PricingTier,
  ProblemContent,
  RouteMeta,
  SiteConfig,
  WhatYouGetContent,
  WhoIsThisForContent,
} from './types';

// ─── Frontmatter interfaces (snake_case, matching YAML keys) ───────

interface SiteFm {
  name: string;
  url: string;
  email: string;
  tagline?: string;
}

interface HeroFm {
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_primary_href: string;
  cta_secondary: string;
  cta_secondary_href: string;
  seo_title?: string;
  seo_description?: string;
  final_cta_title?: string;
  final_cta_subtitle?: string;
}

interface WhatYouGetFm {
  title: string;
  icon_map?: Record<string, string>;
  default_icon?: string;
}

interface ProblemFm {
  title: string;
  subtitle: string;
}

interface HowItWorksFm {
  title: string;
  heading?: string;
  heading_highlight?: string;
  intro?: string;
  steps: Array<{ number: number; title: string; description: string }>;
  comparison: { other: string; sivussa: string };
  comparison_heading?: string;
  comparison_heading_highlight?: string;
  comparison_table?: {
    headers: string[];
    rows: Array<Record<string, string>>;
  };
  what_you_get?: Array<{ title: string; desc: string }>;
  cta_title?: string;
  cta_subtitle?: string;
  cta_text?: string;
  cta_href?: string;
  seo_title?: string;
  seo_description?: string;
}

interface FeaturesFm {
  title: string;
  subtitle: string;
  features: Array<{ title: string; description: string }>;
}

interface WhoIsThisForFm {
  title: string;
  cards: Array<{ title: string; description: string }>;
}

interface PricingFm {
  title: string;
  subtitle: string;
  seo_title?: string;
  seo_description?: string;
  tiers: Array<{
    name: string;
    price: string;
    period: string;
    popular: boolean;
    cta_text: string;
    cta_href: string;
    features: string[];
  }>;
  terms?: Array<Record<string, string>>;
  faq?: Array<{ question: string; answer: string }>;
  feature_table?: {
    headers: string[];
    rows: Array<Record<string, string>>;
  };
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

interface FaqFm {
  title: string;
  seo_title?: string;
  seo_description?: string;
  faqs: Array<{ question: string; answer: string; category?: string }>;
}

interface BlogIndexFm {
  title: string;
  description: string;
  seo_title?: string;
  seo_description?: string;
  categories: string[];
  search_placeholder: string;
  load_more_text: string;
  load_more_link: string;
}

interface BlogPostFm {
  title: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  date: string;
  category: string;
  readTime: string;
}

interface FooterFm {
  sections: FooterSection[];
  copyright: string;
}

interface NavFm {
  logo_text: string;
  links: Array<{ label: string; href: string }>;
}

interface PageFm {
  title: string;
  subtitle?: string;
  seo_title?: string;
  seo_description?: string;
}

// ─── Table row converter ───────────────────────────────────────

/**
 * Convert YAML table rows from Record<string,string> objects
 * (keys "0","1","2",...) to string[][] at parse time.
 * Components no longer need Object.values() workarounds.
 */
function tableRowsToArrays(
  rows: Array<Record<string, string>> | undefined,
): string[][] {
  if (!rows) return [];
  return rows.map((row) => {
    const keys = Object.keys(row).sort(
      (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10),
    );
    return keys.map((k) => String(row[k] ?? ''));
  });
}

// ─── Main loader ────────────────────────────────────────────

/** Load all content from markdown files. Pure, synchronous, single pass per file. */
export function loadAllContent(contentDir: string): AllContent {
  // ── Site config ──
  const siteMd = loadMd<SiteFm>(contentDir, 'site.md');
  const site = siteMd.frontmatter;

  // ── Hero ──
  const heroMd = loadMd<HeroFm>(contentDir, 'home/hero.md');
  const hf = heroMd.frontmatter;

  // Fix: tagline reads from hero seo_title via frontmatter, not bare object
  const siteConfig: SiteConfig = {
    name: site.name,
    url: site.url,
    email: site.email,
    tagline: hf.seo_title || site.tagline || site.name,
  };

  const homeHero: HeroContent = {
    title: hf.title,
    subtitle: hf.subtitle,
    ctaPrimary: hf.cta_primary,
    ctaPrimaryHref: hf.cta_primary_href,
    ctaSecondary: hf.cta_secondary,
    ctaSecondaryHref: hf.cta_secondary_href,
    contentHtml: heroMd.html,
    seoTitle: hf.seo_title,
    seoDescription: hf.seo_description,
  };

  // ── Final CTA (from hero frontmatter, zero hardcoded text) ──
  const homeFinalCta: FinalCta = {
    title: hf.final_cta_title || hf.title,
    subtitle: hf.final_cta_subtitle || hf.subtitle,
    ctaText: hf.cta_primary,
    ctaHref: hf.cta_primary_href,
  };

  // ── What You Get ──
  const whatYouGetMd = loadMd<WhatYouGetFm>(contentDir, 'home/what-you-get.md');
  const iconMap: Record<string, string> =
    whatYouGetMd.frontmatter.icon_map || {};
  const defaultIcon = whatYouGetMd.frontmatter.default_icon || 'check_circle';
  const whatYouGetItems = extractLiText(whatYouGetMd.html).map((text) => {
    const colonIdx = text.indexOf(':');
    if (colonIdx === -1) return { icon: defaultIcon, title: text, desc: '' };
    const title = text.slice(0, colonIdx).trim();
    return {
      icon: iconMap[title] || defaultIcon,
      title,
      desc: text.slice(colonIdx + 1).trim(),
    };
  });
  const subscriberNote = (() => {
    const p = findParagraph(whatYouGetMd.html, 'for subscribers');
    return p ? stripTags(p).replace(/^For subscribers:\s*/i, '') : '';
  })();
  const homeWhatYouGet: WhatYouGetContent = {
    title: whatYouGetMd.frontmatter.title,
    items: whatYouGetItems,
    subscriberNote,
  };

  // ── Problem ──
  // Fix: intro was double-parsed through marked. Now we split raw markdown
  // before first ## and render once.
  const problemMd = loadMd<ProblemFm>(contentDir, 'home/problem.md');
  const rawIntro = problemMd.raw.split(/^## /m)[0]?.trim() || '';
  const homeProblem: ProblemContent = {
    title: problemMd.frontmatter.title,
    subtitle: problemMd.frontmatter.subtitle,
    introHtml: marked.parse(rawIntro) as string,
    sections: extractH2UlSections(problemMd.html),
  };

  // ── How It Works ──
  const howMd = loadMd<HowItWorksFm>(contentDir, 'home/how-it-works.md');
  const hw = howMd.frontmatter;
  const homeHowItWorks: HowItWorksContent = {
    title: hw.title,
    heading: hw.heading,
    headingHighlight: hw.heading_highlight,
    intro: hw.intro,
    steps: hw.steps,
    comparison: hw.comparison,
    comparisonHeading: hw.comparison_heading,
    comparisonHeadingHighlight: hw.comparison_heading_highlight,
    // Convert table rows from Record<string,string> to string[][] at parse time
    comparisonTable: hw.comparison_table
      ? {
          headers: hw.comparison_table.headers,
          rows: tableRowsToArrays(hw.comparison_table.rows),
        }
      : undefined,
    whatYouGet: hw.what_you_get,
    ctaTitle: hw.cta_title,
    ctaSubtitle: hw.cta_subtitle,
    ctaText: hw.cta_text,
    ctaHref: hw.cta_href,
  };

  // ── Features ──
  const featuresMd = loadMd<FeaturesFm>(contentDir, 'home/features.md');
  const homeFeatures: FeaturesHeader = {
    title: featuresMd.frontmatter.title,
    subtitle: featuresMd.frontmatter.subtitle,
  };
  const features: Feature[] = featuresMd.frontmatter.features;

  // ── Who Is This For ──
  const whoMd = loadMd<WhoIsThisForFm>(contentDir, 'home/who-is-this-for.md');
  const homeWhoIsThisFor: WhoIsThisForContent = {
    title: whoMd.frontmatter.title,
    cards: whoMd.frontmatter.cards.map((c) => ({
      title: c.title,
      desc: c.description,
    })),
  };

  // ── Pricing ──
  const pricingMd = loadMd<PricingFm>(contentDir, 'home/pricing.md');
  const pm = pricingMd.frontmatter;
  const homePricing = { title: pm.title, subtitle: pm.subtitle };

  const pricingTiers: PricingTier[] = pm.tiers.map((t) => ({
    name: t.name,
    price: t.price,
    period: t.period,
    popular: t.popular,
    ctaText: t.cta_text,
    ctaHref: t.cta_href,
    features: t.features,
  }));

  const pricingFaq: PricingFaqItem[] = pm.faq || [];

  // Convert feature_table rows from Record<string,string> to string[][]
  const pricingFeatureTable: PricingFeatureTable = {
    headers: pm.feature_table?.headers || [],
    rows: tableRowsToArrays(pm.feature_table?.rows),
  };

  const pricingCompetitors: PricingCompetitor[] = pm.competitors || [];

  const pricingCta: PricingCta = {
    title: pm.cta_title || '',
    text: pm.cta_text || '',
    href: pm.cta_href || '',
  };

  // Convert terms from Record<string,string>[] to PricingTerm[] with named fields
  const pricingTerms: PricingTerm[] = (pm.terms || []).map((t) => ({
    timing: t.timing,
    consumers: t.consumers,
    withdrawal: t.withdrawal,
    tosPp: t.tos_pp,
  }));

  // ── FAQ ──
  const faqMd = loadMd<FaqFm>(contentDir, 'faq.md');
  const homeFaq = { title: faqMd.frontmatter.title };
  const faqItems: FaqItem[] = faqMd.frontmatter.faqs;

  // ── About ──
  const aboutMd = loadMd<PageFm>(contentDir, 'about.md');
  const aboutParsed = parseAbout(aboutMd.raw, site.email);
  const about = {
    title: aboutMd.frontmatter.title,
    subtitle: aboutMd.frontmatter.subtitle,
    intro: aboutParsed.intro,
    introHtml: aboutParsed.introHtml,
    sections: aboutParsed.sections,
    email: site.email,
  };

  // ── Blog ──
  const blogMd = loadMd<BlogIndexFm>(contentDir, 'blog/index.md');
  const postsDir = path.join(contentDir, 'blog/posts');
  const posts = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace('.md', '');
      const post = loadMd<BlogPostFm>(
        contentDir,
        path.join('blog/posts', filename),
      );
      const pf = post.frontmatter;
      return {
        slug,
        title: pf.title,
        description: pf.description || '',
        seoTitle: pf.seo_title,
        seoDescription: pf.seo_description,
        date: pf.date,
        category: pf.category,
        readTime: pf.readTime,
        html: post.html,
        excerpt: `${stripTags(post.html).substring(0, 200)}...`,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Fix: blogPostsMap now includes seoTitle/seoDescription from frontmatter
  const blogPostsMap: Record<string, BlogPostMapEntry> = {};
  for (const post of posts) {
    blogPostsMap[post.slug] = {
      title: post.title,
      description: post.description,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      date: post.date,
      category: post.category,
      readTime: post.readTime,
      html: post.html,
    };
  }

  const blogConfig = {
    title: blogMd.frontmatter.title,
    description: blogMd.frontmatter.description,
    categories: blogMd.frontmatter.categories,
    searchPlaceholder: blogMd.frontmatter.search_placeholder,
    loadMoreText: blogMd.frontmatter.load_more_text,
    loadMoreLink: blogMd.frontmatter.load_more_link,
    posts,
  };

  // ── Footer & Nav ──
  const footerMd = loadMd<FooterFm>(contentDir, 'footer.md');
  const footerSections: FooterSection[] = footerMd.frontmatter.sections;
  const footerCopyright: string = footerMd.frontmatter.copyright;

  const navMd = loadMd<NavFm>(contentDir, 'nav.md');
  const navConfig: NavConfig = {
    logoText: navMd.frontmatter.logo_text,
    links: navMd.frontmatter.links,
  };

  // ── Legal pages ──
  const privacyPolicy = {
    html: loadMd(contentDir, 'home/sivussa_privacy_policy.md').html,
  };
  const termsOfService = {
    html: loadMd(contentDir, 'home/sivussa_terms_of_service.md').html,
  };
  const openSourceNotices = {
    html: loadMd(contentDir, 'home/sivussa_open_source_notices.md').html,
  };

  // ── Route meta ──
  const routeMeta = buildRouteMeta(
    siteConfig,
    hf,
    hw,
    pm,
    faqMd.frontmatter,
    aboutMd.frontmatter,
    blogMd.frontmatter,
    blogPostsMap,
  );

  return {
    siteConfig,
    homeHero,
    homeWhatYouGet,
    homeProblem,
    homeHowItWorks,
    homeFeatures,
    features,
    homeWhoIsThisFor,
    homePricing,
    pricingTiers,
    pricingFaq,
    pricingFeatureTable,
    pricingCompetitors,
    pricingCta,
    pricingTerms,
    homeFaq,
    homeFinalCta,
    about,
    blogConfig,
    blogPostsMap,
    footerSections,
    footerCopyright,
    navConfig,
    faqItems,
    privacyPolicy,
    termsOfService,
    openSourceNotices,
    routeMeta,
  };
}

// ─── Route meta builder ────────────────────────────────────────

interface SeoSource {
  seo_title?: string;
  seo_description?: string;
}

function buildRouteMeta(
  site: SiteConfig,
  hero: SeoSource,
  howItWorks: SeoSource,
  pricing: SeoSource,
  faq: SeoSource & { title: string },
  about: SeoSource,
  blog: SeoSource,
  blogPostsMap: Record<string, BlogPostMapEntry>,
): Record<string, RouteMeta> {
  const routes: Record<string, RouteMeta> = {};

  const sources: Array<{ path: string; fm?: SeoSource }> = [
    { path: '/', fm: hero },
    { path: '/how-it-works', fm: howItWorks },
    { path: '/pricing', fm: pricing },
    { path: '/about', fm: about },
    { path: '/faq', fm: faq },
    { path: '/blog', fm: blog },
  ];

  for (const r of sources) {
    routes[r.path] = {
      title: r.fm?.seo_title || site.name,
      description: r.fm?.seo_description || '',
      canonical: `${site.url}${r.path === '/' ? '/' : r.path}`,
    };
  }

  // Blog posts
  for (const [slug, post] of Object.entries(blogPostsMap)) {
    const postPath = `/blog/${slug}`;
    routes[postPath] = {
      title: post.seoTitle || `${post.title} \u2014 ${site.name} Blog`,
      description: post.seoDescription || post.description || '',
      canonical: `${site.url}${postPath}`,
    };
  }

  // Legal pages — descriptions derived from site name, not hardcoded service text
  routes['/open-source-notices'] = {
    title: `Open Source Notices \u2014 ${site.name}`,
    description: 'Third-party software licenses and acknowledgments.',
    canonical: `${site.url}/open-source-notices`,
  };
  routes['/privacy'] = {
    title: `Privacy Policy \u2014 ${site.name}`,
    description:
      'How your data is collected, used, and protected. GDPR compliant.',
    canonical: `${site.url}/privacy`,
  };
  routes['/terms'] = {
    title: `Terms of Service \u2014 ${site.name}`,
    description: 'Terms and conditions for using the audit service.',
    canonical: `${site.url}/terms`,
  };

  return routes;
}
