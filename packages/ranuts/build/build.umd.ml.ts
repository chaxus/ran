import { defineConfig } from 'vite';
import { umdMl, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umdMl });
