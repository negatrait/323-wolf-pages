import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import contentPlugin from './vite-content-plugin.mjs';

export default defineConfig({
  plugins: [
    contentPlugin(),
    tailwindcss(),
    preact({
      prerender: {
        enabled: true,
        prerenderScript: '/src/prerender.jsx',
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
