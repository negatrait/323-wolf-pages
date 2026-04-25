/// <reference types="vite/client" />

declare module 'virtual:content' {
  export const SITE_CONFIG: {
    name: string;
    url: string;
    email: string;
    tagline: string;
  };
  export const ROUTE_META: Record<
    string,
    { title: string; description: string; canonical: string }
  >;
  export const HOME_HERO: {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_primary_href: string;
    cta_secondary: string;
    cta_secondary_href: string;
    content: string;
    seo_title?: string;
    seo_description?: string;
  };
  export const HOME_WHAT_YOU_GET: {
    title: string;
    items: Array<{ icon: string; title: string; desc: string }>;
    subscriberNote: string;
  };
  export const HOME_PROBLEM: {
    title: string;
    subtitle: string;
    intro: string;
    sections: Array<{ title: string; items: string[] }>;
  };
  export const HOME_HOW_IT_WORKS: {
    title: string;
    heading?: string;
    headingHighlight?: string;
    intro?: string;
    steps: Array<{ number: number; title: string; description: string }>;
    comparison: { other: string; sivussa: string };
    comparisonHeading?: string;
    comparisonHeadingHighlight?: string;
    comparisonTable?: { headers: string[]; rows: string[][] };
    whatYouGet?: Array<{ title: string; desc: string }>;
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaText?: string;
    ctaHref?: string;
  };
  export const HOME_FEATURES: { title: string; subtitle: string };
  export const HOME_WHO_IS_THIS_FOR: {
    title: string;
    cards: Array<{ title: string; desc: string }>;
  };
  export const HOME_PRICING: { title: string; subtitle: string };
  export const HOME_FAQ: { title: string };
  export const HOME_FINAL_CTA: {
    title: string;
    subtitle: string;
    cta: string;
    cta_href: string;
  };
  export const ABOUT: {
    title: string;
    subtitle?: string;
    intro: string;
    sections: Array<{
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
      timeline?: Array<{
        title: string;
        content: string;
        contentHtml?: string;
      }>;
      email?: string;
    }>;
    email: string;
  };
  export const BLOG_CONFIG: {
    title: string;
    description: string;
    categories: string[];
    searchPlaceholder: string;
    loadMoreText: string;
    loadMoreLink: string;
    posts: Array<{
      slug: string;
      title: string;
      description: string;
      date: string;
      category: string;
      readTime: string;
      html: string;
      excerpt: string;
    }>;
  };
  export const BLOG_POSTS_MAP: Record<
    string,
    {
      title: string;
      description: string;
      seo_title?: string;
      seo_description?: string;
      date: string;
      category: string;
      readTime: string;
      html: string;
    }
  >;
  export const FOOTER_SECTIONS: unknown;
  export const FOOTER_COPYRIGHT: string;
  export const NAV_CONFIG: {
    logo_text: string;
    links: Array<{ href: string; label: string; external?: boolean }>;
  };
  export const FAQ_ITEMS: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
  export const PRICING_TIERS: Array<{
    name: string;
    price: string;
    period: string;
    popular: boolean;
    ctaText: string;
    ctaHref: string;
    features: string[];
  }>;
  export const FEATURES: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
  export const PRIVACY_POLICY: { html: string };
  export const TERMS_OF_SERVICE: { html: string };
  export const OPEN_SOURCE_NOTICES: { html: string };
  export const PRICING_TERMS: Array<Record<string, string>>;
  export const PRICING_FAQ: Array<{ question: string; answer: string }>;
  export const PRICING_FEATURE_TABLE: {
    headers: string[];
    rows: (string | boolean)[][];
  };
  export const PRICING_COMPETITORS: Array<{
    name: string;
    price: string;
    desc: string;
    highlight?: boolean;
  }>;
  export const PRICING_CTA: { title: string; text: string; href: string };
}

// Preact JSX allows `class` instead of `className`
declare namespace JSX {
  interface HTMLAttributes<T> {
    class?: string;
    for?: string;
  }
}

declare module 'preact-iso' {
  export function hydrate(app: preact.VNode): void;
  export function render(app: preact.VNode, container: Element): void;
  export function useLocation(): { url: string; path: string };
  export function LocationProvider(props: {
    children: preact.ComponentChildren;
  }): preact.VNode;
  export function Router(props: {
    children?: preact.ComponentChildren;
  }): preact.VNode;
}

declare global {
  namespace preact {
    interface Attributes {
      path?: string;
      default?: boolean;
    }
  }
}
