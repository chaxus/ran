import { defineConfig } from 'vite';
import { umd, viteConfig } from '../vite.config.ts';

export default defineConfig({ ...viteConfig, build: umd });
