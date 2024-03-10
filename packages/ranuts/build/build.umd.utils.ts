import { defineConfig } from 'vite';
import { umdUtil, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umdUtil });
