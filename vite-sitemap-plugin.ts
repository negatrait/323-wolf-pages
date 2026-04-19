import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const SITE_URL = 'https://sivussa.com';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq?: string;
  priority?: string;
}

export default function sitemapPlugin(): Plugin {
  return {
    name: 'vite-sitemap-plugin',
    generateBundle() {
      const contentDir = path.resolve(process.cwd(), 'src/content');
      const postsDir = path.join(contentDir, 'blog/posts');

      const gitLogDate = (filePath: string): string => {
        try {
          const { execSync } = require('node:child_process');
          const date = execSync(`git log -1 --format=%as -- "${filePath}"`, { encoding: 'utf-8' }).trim();
          return date || new Date().toISOString().split('T')[0];
        } catch {
          return new Date().toISOString().split('T')[0];
        }
      };

      const staticPages: SitemapEntry[] = [
        { loc: '/', lastmod: gitLogDate('src/content/home/hero.md'), changefreq: 'weekly', priority: '1.0' },
        { loc: '/how-it-works', lastmod: gitLogDate('src/content/home/how-it-works.md'), changefreq: 'monthly', priority: '0.5' },
        { loc: '/pricing', lastmod: gitLogDate('src/content/home/pricing.md'), changefreq: 'monthly', priority: '0.8' },
        { loc: '/about', lastmod: gitLogDate('src/content/about.md'), changefreq: 'monthly', priority: '0.6' },
        { loc: '/faq', lastmod: gitLogDate('src/content/faq.md'), changefreq: 'monthly', priority: '0.7' },
        { loc: '/blog', lastmod: gitLogDate('src/content/blog/index.md'), changefreq: 'weekly', priority: '0.8' },
        { loc: '/open-source-notices', lastmod: gitLogDate('src/content/home/sivussa_open_source_notices.md'), changefreq: 'yearly', priority: '0.1' },
      ];

      const blogPosts: SitemapEntry[] = fs.existsSync(postsDir)
        ? fs
            .readdirSync(postsDir)
            .filter((f: string) => f.endsWith('.md'))
            .map((f: string) => ({
              loc: `/blog/${f.replace('.md', '')}`,
              lastmod: gitLogDate(`src/content/blog/posts/${f}`),
              changefreq: 'monthly',
            }))
        : [];

      const allPages = [...staticPages, ...blogPosts];

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...allPages.map(
          (p) =>
            `  <url><loc>${SITE_URL}${p.loc}</loc><lastmod>${p.lastmod}</lastmod>${p.changefreq ? `<changefreq>${p.changefreq}</changefreq>` : ''}${p.priority ? `<priority>${p.priority}</priority>` : ''}</url>`,
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
