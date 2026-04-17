import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export default function contentPlugin() {
  const virtualModuleId = 'virtual:content';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-content-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const contentDir = path.resolve(process.cwd(), 'src/content');

        function loadMd(filePath) {
          const full = path.join(contentDir, filePath);
          const raw = fs.readFileSync(full, 'utf-8');
          const { data: frontmatter, content } = matter(raw);
          const html = marked.parse(content);
          return { frontmatter, html, raw: content };
        }

        // Helper: strip all HTML tags from a string
        function strip(html) {
          return html.replace(/<[^>]+>/g, '').trim();
        }

        // Helper: extract text from <li> items, stripping inner tags
        function extractLiItems(html) {
          const items = [];
          const re = /<li>(.+?)<\/li>/g;
          let m;
          while ((m = re.exec(html)) !== null) {
            items.push(strip(m[1]));
          }
          return items;
        }

        // Helper: extract paragraphs from html
        function extractParagraphs(html) {
          const ps = [];
          const re = /<p>(.+?)<\/p>/gs;
          let m;
          while ((m = re.exec(html)) !== null) {
            ps.push(m[1]);
          }
          return ps;
        }

        // ===== HOME PAGE =====

        // Hero
        const hero = loadMd('home/hero.md');
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

        // What You Get
        const whatYouGet = loadMd('home/what-you-get.md');
        const whatYouGetItems = extractLiItems(whatYouGet.html).map(text => {
          // Format: "Bold Title: Description" (tags already stripped)
          const colonIdx = text.indexOf(':');
          if (colonIdx === -1) return { icon: 'check_circle', title: text, desc: '' };
          const title = text.slice(0, colonIdx).trim();
          const desc = text.slice(colonIdx + 1).trim();
          const iconMap = {
            'Full visibility audit': 'search',
            'Prioritized findings': 'assignment',
            'Specific guidance': 'psychology',
            'PDF report': 'email',
          };
          return { icon: iconMap[title] || 'check_circle', title, desc };
        });

        // Subscriber note: find paragraph containing "For subscribers" (after stripping tags)
        const subscriberParas = extractParagraphs(whatYouGet.html);
        const subscriberNote = subscriberParas.find(p => strip(p).toLowerCase().startsWith('for subscribers'));
        const HOME_WHAT_YOU_GET = {
          title: whatYouGet.frontmatter.title,
          items: whatYouGetItems,
          subscriberNote: subscriberNote ? strip(subscriberNote).replace(/^For subscribers:\s*/i, '') : '',
        };

        // Problem
        const problem = loadMd('home/problem.md');
        const problemSections = [];
        const sectionRegex = /<h2>(SEO|GEO|AEO)[^<]*<\/h2>\s*<ul>(.+?)<\/ul>/gs;
        let sectionMatch;
        while ((sectionMatch = sectionRegex.exec(problem.html)) !== null) {
          const headingText = sectionMatch[0].match(/<h2>([^<]+)<\/h2>/)?.[1]?.trim() || sectionMatch[1];
          const items = extractLiItems(sectionMatch[2]);
          problemSections.push({ title: headingText, items });
        }

        // Intro: first paragraph(s) before first h2
        const problemIntroRaw = problem.html.split(/<h2>/)[0];
        const problemIntroHtml = marked.parse(problemIntroRaw);
        const HOME_PROBLEM = {
          title: problem.frontmatter.title,
          subtitle: problem.frontmatter.subtitle,
          intro: problemIntroHtml,
          sections: problemSections,
        };

        // How It Works
        const howItWorks = loadMd('home/how-it-works.md');
        const HOME_HOW_IT_WORKS = {
          title: howItWorks.frontmatter.title,
          steps: howItWorks.frontmatter.steps,
          comparison: howItWorks.frontmatter.comparison,
        };

        // Features
        const features = loadMd('home/features.md');
        const HOME_FEATURES = {
          title: features.frontmatter.title,
          subtitle: features.frontmatter.subtitle,
        };
        const FEATURES = features.frontmatter.features;

        // Who Is This For
        const whoIsThisFor = loadMd('home/who-is-this-for.md');
        const HOME_WHO_IS_THIS_FOR = {
          title: whoIsThisFor.frontmatter.title,
          cards: whoIsThisFor.frontmatter.cards.map(c => ({
            title: c.title,
            desc: c.description,
          })),
        };

        // Pricing
        const pricing = loadMd('home/pricing.md');
        const HOME_PRICING = {
          title: pricing.frontmatter.title,
          subtitle: pricing.frontmatter.subtitle,
        };
        const PRICING_TIERS = pricing.frontmatter.tiers.map(t => ({
          name: t.name,
          price: t.price,
          period: t.period,
          popular: t.popular,
          ctaText: t.cta_text,
          ctaHref: t.cta_href,
          features: t.features,
        }));

        // FAQ
        const faq = loadMd('faq.md');
        const HOME_FAQ = { title: faq.frontmatter.title };

        // Final CTA
        const HOME_FINAL_CTA = {
          title: 'Stop guessing. Start with a real audit.',
          subtitle: 'Get a comprehensive visibility audit with prioritized recommendations.',
          cta: hero.frontmatter.cta_primary,
          cta_href: hero.frontmatter.cta_primary_href,
        };

        // ===== ABOUT PAGE =====
        const about = loadMd('about.md');
        const linesAbout = about.raw.split('\n');
        let currentSection = null;
        const aboutSections = [];

        const introEnd = linesAbout.findIndex(l => l.startsWith('## '));
        const introLines = linesAbout.slice(1, introEnd >= 0 ? introEnd : linesAbout.length).filter(l => l.trim() && !l.startsWith('#'));
        const aboutIntro = introLines.join('\n').trim();

        for (let i = 0; i < linesAbout.length; i++) {
          const line = linesAbout[i];
          if (line.startsWith('## ')) {
            if (currentSection) aboutSections.push(currentSection);
            currentSection = {
              title: line.replace('## ', '').trim(),
              content: '',
              subtitle: '',
              agents: [],
              values: [],
              timeline: [],
              email: '',
            };
          } else if (currentSection) {
            if (line.startsWith('### ')) {
              const subLine = line.replace('### ', '').trim();
              if (subLine === 'Short term' || subLine === 'Medium term' || subLine === 'Long term') {
                currentSection.timeline.push({ title: subLine, content: '' });
              } else if (subLine.includes('Agent')) {
                currentSection.agents.push({ title: subLine, desc: '' });
              }
            } else if (line.match(/^\d{2}\.\s/)) {
              const valueMatch = line.match(/^(\d{2})\.\s+\*\*([^*]+)\*\*/);
              if (valueMatch) {
                currentSection.values.push({ num: valueMatch[1], title: valueMatch[2], desc: '' });
              }
            } else if (line.trim()) {
              const text = line.trim();
              if (currentSection.timeline.length > 0 && text) {
                currentSection.timeline[currentSection.timeline.length - 1].content += text + ' ';
              } else if (currentSection.agents.length > 0 && text && !text.startsWith('-')) {
                currentSection.agents[currentSection.agents.length - 1].desc += text + ' ';
              } else if (currentSection.values.length > 0 && text) {
                currentSection.values[currentSection.values.length - 1].desc += text + ' ';
              } else if (text.includes('[sivussa@sivussa.com]')) {
                currentSection.email = 'sivussa@sivussa.com';
              } else if (!text.startsWith('-')) {
                currentSection.content += text + '\n';
              }
            }
          }
        }
        if (currentSection) aboutSections.push(currentSection);

        aboutSections.forEach(s => {
          s.content = s.content.trim();
          s.contentHtml = marked.parse(s.content);
          s.agents.forEach(a => { a.desc = a.desc.trim(); a.descHtml = marked.parse(a.desc); });
          s.values.forEach(v => { v.desc = v.desc.trim(); v.descHtml = marked.parse(v.desc); });
          s.timeline.forEach(t => { t.content = t.content.trim(); t.contentHtml = marked.parse(t.content); });
        });

        const ABOUT = {
          title: about.frontmatter.title,
          subtitle: about.frontmatter.subtitle,
          intro: 'We believe every business deserves visibility — not just the ones with €5,000/month agency budgets.',
          sections: aboutSections.map(s => {
            if (s.title === 'Our approach') {
              return { title: s.title, subtitle: 'they fix', intro: 'We built Sivussa to solve one problem: the gap between finding issues and actually clearing them.', agents: s.agents };
            } else if (s.title === 'Our Values') {
              return { title: s.title, values: s.values };
            } else if (s.title === 'What we\'re building') {
              return { title: s.title, timeline: s.timeline };
            } else if (s.title === 'Questions? Want to say hello?') {
              return { title: s.title, email: s.email };
            } else {
              return { title: s.title, content: s.content, contentHtml: s.contentHtml };
            }
          }),
          email: 'sivussa@sivussa.com',
        };

        // ===== BLOG =====
        const blog = loadMd('blog/index.md');
        const BLOG_CONFIG = {
          title: blog.frontmatter.title,
          description: blog.frontmatter.description,
          categories: blog.frontmatter.categories,
          searchPlaceholder: blog.frontmatter.search_placeholder,
          loadMoreText: blog.frontmatter.load_more_text,
          loadMoreLink: blog.frontmatter.load_more_link,
          posts: [
            { title: 'How AI SEO Agents Write Fixes Your Developer Can Paste in 5 Minutes', category: 'AUDIT INSIGHTS', excerpt: 'Traditional SEO tools dump 200 issues on you and wish you luck. AI agents flip the model — they write the JSON-LD, meta tags, and schema markup for your specific site.', date: 'Apr 2026', readTime: '5 MIN READ', link: 'https://blog.sivussa.com' },
            { title: 'Why Your Google Business Profile Isn\'t Showing Up (And the Exact Fix)', category: 'LOCAL SEARCH', excerpt: 'Three out of four local businesses have incomplete or incorrect Google Business Profiles. That means Google Maps skips them entirely.', date: 'Apr 2026', readTime: '6 MIN READ', link: 'https://blog.sivussa.com' },
            { title: 'How to Get ChatGPT and Perplexity to Cite Your Website', category: 'SEO BASICS', excerpt: 'AI answer engines are the new search frontier. If your content isn\'t structured for AI citation, ChatGPT and Perplexity will reference your competitors instead.', date: 'Mar 2026', readTime: '7 MIN READ', link: 'https://blog.sivussa.com' },
            { title: 'SEO Audit vs SEO Remediation: Why the Fix Matters More Than the Finding', category: 'AUDIT INSIGHTS', excerpt: 'An audit tells you what\'s broken. Remediation actually fixes it. Most businesses pay for audits and never implement the changes because they\'re too technical.', date: 'Mar 2026', readTime: '5 MIN READ', link: 'https://blog.sivussa.com' },
            { title: 'The Complete JSON-LD Guide for Small Business Websites', category: 'SEO BASICS', excerpt: 'Structured data is the single highest-impact SEO fix for most small businesses. Here\'s what to add, where to put it, and ready-to-use templates for 10 common business types.', date: 'Mar 2026', readTime: '8 MIN READ', link: 'https://blog.sivussa.com' },
            { title: 'Voice Search in 2026: How AI Agents Optimize for Siri and Google Assistant', category: 'LOCAL SEARCH', excerpt: 'Voice queries are longer, more conversational, and heavily local. "Hey Siri, find a plumber near me" returns one result — not ten.', date: 'Feb 2026', readTime: '6 MIN READ', link: 'https://blog.sivussa.com' },
          ],
        };

        // ===== FOOTER & NAV =====
        const footer = loadMd('footer.md');
        const FOOTER_SECTIONS = footer.frontmatter.sections;
        const FOOTER_COPYRIGHT = footer.frontmatter.copyright;

        const nav = loadMd('nav.md');
        const NAV_CONFIG = nav.frontmatter;

        // ===== FAQ =====
        const FAQ_ITEMS = faq.frontmatter.faqs;

        // ===== LEGAL PAGES =====
        const PRIVACY_POLICY = { html: loadMd('home/sivussa_privacy_policy.md').html };
        const TERMS_OF_SERVICE = { html: loadMd('home/sivussa_terms_of_service.md').html };
        const OPEN_SOURCE_NOTICES = { html: loadMd('home/sivussa_open_source_notices.md').html };
        const PRICING_TERMS = pricing.frontmatter.terms || [];

        return `
export const HOME_HERO = ${JSON.stringify(HOME_HERO)};
export const HOME_WHAT_YOU_GET = ${JSON.stringify(HOME_WHAT_YOU_GET)};
export const HOME_PROBLEM = ${JSON.stringify(HOME_PROBLEM)};
export const HOME_HOW_IT_WORKS = ${JSON.stringify(HOME_HOW_IT_WORKS)};
export const HOME_FEATURES = ${JSON.stringify(HOME_FEATURES)};
export const HOME_WHO_IS_THIS_FOR = ${JSON.stringify(HOME_WHO_IS_THIS_FOR)};
export const HOME_PRICING = ${JSON.stringify(HOME_PRICING)};
export const HOME_FAQ = ${JSON.stringify(HOME_FAQ)};
export const HOME_FINAL_CTA = ${JSON.stringify(HOME_FINAL_CTA)};
export const ABOUT = ${JSON.stringify(ABOUT)};
export const BLOG_CONFIG = ${JSON.stringify(BLOG_CONFIG)};
export const FOOTER_SECTIONS = ${JSON.stringify(FOOTER_SECTIONS)};
export const FOOTER_COPYRIGHT = ${JSON.stringify(FOOTER_COPYRIGHT)};
export const NAV_CONFIG = ${JSON.stringify(NAV_CONFIG)};
export const FAQ_ITEMS = ${JSON.stringify(FAQ_ITEMS)};
export const PRICING_TIERS = ${JSON.stringify(PRICING_TIERS)};
export const FEATURES = ${JSON.stringify(FEATURES)};
export const PRIVACY_POLICY = ${JSON.stringify(PRIVACY_POLICY)};
export const TERMS_OF_SERVICE = ${JSON.stringify(TERMS_OF_SERVICE)};
export const OPEN_SOURCE_NOTICES = ${JSON.stringify(OPEN_SOURCE_NOTICES)};
export const PRICING_TERMS = ${JSON.stringify(PRICING_TERMS)};
`;
      }
    },
  };
}
