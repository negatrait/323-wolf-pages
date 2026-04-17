import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import contentPlugin from './vite-content-plugin.mjs';

export default defineConfig({
  plugins: [preact(), contentPlugin()],
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
