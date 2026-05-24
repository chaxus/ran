import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { bundle, viteConfig } from '../vite.config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  ...viteConfig,
  root: resolve(__dirname, '..'),
  define: {
    'import.meta.env.DEV': JSON.stringify(false),
    'import.meta.env.PROD': JSON.stringify(true),
    'import.meta.env.SSR': JSON.stringify(false),
  },
  build: bundle,
});
