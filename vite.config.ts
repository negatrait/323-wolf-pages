import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import contentPlugin from './vite-content-plugin.ts';
import sitemapPlugin from './vite-sitemap-plugin.ts';

export default defineConfig({
  plugins: [
    contentPlugin(),
    sitemapPlugin(),
    tailwindcss(),
    preact({
      prerender: {
        enabled: true,
        prerenderScript: '/src/prerender.tsx',
        additionalPrerenderRoutes: [
          '/how-it-works',
          '/pricing',
          '/about',
          '/faq',
          '/blog',
          '/blog/audited-ourselves',
          '/open-source-notices',
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    minify: true,
  },
  resolve: {
    alias: {
      'virtual:content': 'virtual:content',
    },
  },
});
