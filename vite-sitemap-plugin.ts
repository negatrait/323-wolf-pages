import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const SITE_URL = 'https://sivussa.com';

interface SitemapEntry {
  loc: string;
  changefreq?: string;
  priority?: string;
}

export default function sitemapPlugin(): Plugin {
  return {
    name: 'vite-sitemap-plugin',
    generateBundle() {
      const contentDir = path.resolve(process.cwd(), 'src/content');
      const postsDir = path.join(contentDir, 'blog/posts');

      const staticPages: SitemapEntry[] = [
        { loc: '/', changefreq: 'weekly', priority: '1.0' },
        { loc: '/how-it-works', changefreq: 'monthly', priority: '0.8' },
        { loc: '/pricing', changefreq: 'monthly', priority: '0.8' },
        { loc: '/about', changefreq: 'monthly', priority: '0.6' },
        { loc: '/faq', changefreq: 'monthly', priority: '0.6' },
        { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
        { loc: '/open-source-notices', changefreq: 'yearly', priority: '0.1' },
      ];

      const blogPosts: SitemapEntry[] = fs.existsSync(postsDir)
        ? fs
            .readdirSync(postsDir)
            .filter((f: string) => f.endsWith('.md'))
            .map((f: string) => ({
              loc: `/blog/${f.replace('.md', '')}`,
              changefreq: 'monthly',
              priority: '0.7',
            }))
        : [];

      const allPages = [...staticPages, ...blogPosts];

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...allPages.map(
          (p) =>
            `  <url><loc>${SITE_URL}${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
        ),
        '</urlset>',
        '',
      ].join('\n');

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: xml,
      });
    },
  };
}
