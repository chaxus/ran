import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { es, viteConfig } from '../vite.config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({ ...viteConfig, root: resolve(__dirname, '..'), build: es });
