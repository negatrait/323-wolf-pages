import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import contentPlugin from './vite-content-plugin.mjs';

export default defineConfig({
  plugins: [
    contentPlugin(),
    preact({
      prerender: {
        enabled: true,
        prerenderScript: '/src/prerender.jsx',
        additionalPrerenderRoutes: [
          '/how-it-works',
          '/pricing',
          '/about',
          '/faq',
          '/privacy',
          '/terms',
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
