/**
 * Vite Content Plugin — thin wrapper around the typed content loader.
 *
 * Responsibilities:
 * 1. Provide virtual:content module by calling loadAllContent()
 * 2. Watch src/content/ for HMR in dev mode
 * 3. Generate sitemap.xml + llms files in generateBundle
 *
 * All parsing, typing, and transformation lives in src/data/content.ts.
 */
import path from 'node:path';
import type { Plugin } from 'vite';
import { loadAllContent } from './src/data/content';
import { generateStaticFiles } from './src/data/static-gen';
import type { AllContent } from './src/data/types';

export default function contentPlugin(): Plugin {
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
      const content: AllContent = loadAllContent(contentDir);

      // Serialize each export as a named constant
      const exports: Array<[string, unknown]> = [
        ['SITE_CONFIG', content.siteConfig],
        ['HOME_HERO', content.homeHero],
        ['HOME_WHAT_YOU_GET', content.homeWhatYouGet],
        ['HOME_PROBLEM', content.homeProblem],
        ['HOME_HOW_IT_WORKS', content.homeHowItWorks],
        ['HOME_FEATURES', content.homeFeatures],
        ['FEATURES', content.features],
        ['HOME_WHO_IS_THIS_FOR', content.homeWhoIsThisFor],
        ['HOME_PRICING', content.homePricing],
        ['PRICING_TIERS', content.pricingTiers],
        ['PRICING_FAQ', content.pricingFaq],
        ['PRICING_FEATURE_TABLE', content.pricingFeatureTable],
        ['PRICING_COMPETITORS', content.pricingCompetitors],
        ['PRICING_CTA', content.pricingCta],
        ['PRICING_TERMS', content.pricingTerms],
        ['HOME_FAQ', content.homeFaq],
        ['HOME_FINAL_CTA', content.homeFinalCta],
        ['ABOUT', content.about],
        ['BLOG_CONFIG', content.blogConfig],
        ['BLOG_POSTS_MAP', content.blogPostsMap],
        ['FOOTER_SECTIONS', content.footerSections],
        ['FOOTER_COPYRIGHT', content.footerCopyright],
        ['NAV_CONFIG', content.navConfig],
        ['FAQ_ITEMS', content.faqItems],
        ['PRIVACY_POLICY', content.privacyPolicy],
        ['TERMS_OF_SERVICE', content.termsOfService],
        ['OPEN_SOURCE_NOTICES', content.openSourceNotices],
        ['ROUTE_META', content.routeMeta],
      ];

      return exports
        .map(([name, val]) => `export const ${name} = ${JSON.stringify(val)};`)
        .join('\n');
    },

    generateBundle() {
      const contentDir = path.resolve(process.cwd(), 'src/content');
      const content = loadAllContent(contentDir);
      const files = generateStaticFiles(content, contentDir);

      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
  };
}
