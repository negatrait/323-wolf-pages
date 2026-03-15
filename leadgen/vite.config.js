import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    dedupe: ['preact', 'preact/hooks', 'preact/compat'],
    alias: {
      preact: path.resolve(__dirname, 'node_modules/preact'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
