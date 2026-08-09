import { defineConfig } from 'vite';
import { es, viteConfig } from '../vite.config.ts';

export default defineConfig({ ...viteConfig, build: es });
