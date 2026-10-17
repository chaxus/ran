import { defineConfig } from 'vite';
import { iifeUtil, viteConfig } from '../vite.config.ts';

export default defineConfig({ ...viteConfig, build: iifeUtil });
