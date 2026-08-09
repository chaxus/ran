import { defineConfig } from 'vite';
import { umdUtil, viteConfig } from '../vite.config.ts';

export default defineConfig({ ...viteConfig, build: umdUtil });
