import { defineConfig } from 'vite';
import { umdNode, viteConfig } from '../vite.config.ts';

export default defineConfig({ ...viteConfig, build: umdNode });
