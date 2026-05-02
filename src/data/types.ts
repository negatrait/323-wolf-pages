// src/data/types.ts — Content type contracts
// All field names are camelCase. HTML content fields end in "Html".

/** Site-wide configuration from site.md */
export interface SiteConfig {
  name: string;
  url: string;
  email: string;
  tagline: string;
}

/** Hero section from home/hero.md */
export interface HeroContent {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  contentHtml: string;
  seoTitle?: string;
  seoDescription?: string;
}

/** What You Get items from home/what-you-get.md body */
export interface WhatYouGetItem {
  icon: string;
  title: string;
  desc: string;
}

export interface WhatYouGetContent {
  title: string;
  items: WhatYouGetItem[];
  subscriberNote: string;
}

/** Problem section from home/problem.md */
export interface ProblemSection {
  title: string;
  items: string[];
}

export interface ProblemContent {
  title: string;
  subtitle: string;
  introHtml: string;
  sections: ProblemSection[];
}

/** How It Works from home/how-it-works.md frontmatter */
export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  title: string;
  heading?: string;
  headingHighlight?: string;
  intro?: string;
  steps: Step[];
  comparison: { other: string; sivussa: string };
  comparisonHeading?: string;
  comparisonHeadingHighlight?: string;
  comparisonTable?: { headers: string[]; rows: string[][] };
  whatYouGet?: Array<{ title: string; desc: string }>;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

/** Features from home/features.md */
export interface Feature {
  title: string;
  description: string;
}

export interface FeaturesHeader {
  title: string;
  subtitle: string;
}

/** Who Is This For from home/who-is-this-for.md */
export interface WhoIsThisForCard {
  title: string;
  desc: string;
}

export interface WhoIsThisForContent {
  title: string;
  cards: WhoIsThisForCard[];
}

/** Pricing from home/pricing.md */
export interface PricingTier {
  name: string;
  price: string;
  period: string;
  popular: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
}

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export interface PricingCompetitor {
  name: string;
  price: string;
  desc: string;
  highlight?: boolean;
}

export interface PricingCta {
  title: string;
  text: string;
  href: string;
}

/** Pricing legal terms — named fields, not Record<string,string> */
export interface PricingTerm {
  timing?: string;
  consumers?: string;
  withdrawal?: string;
  tosPp?: string;
}

export interface PricingFeatureTable {
  headers: string[];
  rows: string[][];
}

/** FAQ items from faq.md */
export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

/** Final CTA — derived from hero.md frontmatter */
export interface FinalCta {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

/** About page section variants from about.md body */
export interface AboutAgent {
  title: string;
  desc: string;
  descHtml: string;
}

export interface AboutValue {
  num: string;
  title: string;
  desc: string;
  descHtml: string;
}

export interface AboutTimelineEntry {
  title: string;
  content: string;
  contentHtml: string;
}

export interface AboutSection {
  title: string;
  subtitle?: string;
  intro?: string;
  content?: string;
  contentHtml?: string;
  agents?: AboutAgent[];
  values?: AboutValue[];
  timeline?: AboutTimelineEntry[];
  email?: string;
}

export interface AboutContent {
  title: string;
  subtitle?: string;
  intro: string;
  introHtml: string;
  sections: AboutSection[];
  email: string;
}

/** Blog post from blog/posts/*.md */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  date: string;
  category: string;
  readTime: string;
  html: string;
  excerpt: string;
}

export interface BlogConfig {
  title: string;
  description: string;
  categories: string[];
  searchPlaceholder: string;
  loadMoreText: string;
  loadMoreLink: string;
  posts: BlogPost[];
}

/** Blog post map entry (used by BlogPost page, no slug/excerpt) */
export interface BlogPostMapEntry {
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  date: string;
  category: string;
  readTime: string;
  html: string;
}

/** Nav from nav.md */
export interface NavLink {
  label: string;
  href: string;
}

export interface NavConfig {
  logoText: string;
  links: NavLink[];
}

/** Footer from footer.md */
export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/** Legal pages — rendered HTML only */
export interface LegalPage {
  html: string;
}

/** Per-route SEO metadata */
export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
}

/** Complete content bundle returned by loadAllContent() */
export interface AllContent {
  siteConfig: SiteConfig;
  homeHero: HeroContent;
  homeWhatYouGet: WhatYouGetContent;
  homeProblem: ProblemContent;
  homeHowItWorks: HowItWorksContent;
  homeFeatures: FeaturesHeader;
  features: Feature[];
  homeWhoIsThisFor: WhoIsThisForContent;
  homePricing: { title: string; subtitle: string };
  pricingTiers: PricingTier[];
  pricingFaq: PricingFaqItem[];
  pricingFeatureTable: PricingFeatureTable;
  pricingCompetitors: PricingCompetitor[];
  pricingCta: PricingCta;
  pricingTerms: PricingTerm[];
  homeFaq: { title: string };
  homeFinalCta: FinalCta;
  about: AboutContent;
  blogConfig: BlogConfig;
  blogPostsMap: Record<string, BlogPostMapEntry>;
  footerSections: FooterSection[];
  footerCopyright: string;
  navConfig: NavConfig;
  faqItems: FaqItem[];
  privacyPolicy: LegalPage;
  termsOfService: LegalPage;
  openSourceNotices: LegalPage;
  routeMeta: Record<string, RouteMeta>;
}
