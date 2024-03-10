import { defineConfig } from 'vite';
import { umd, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umd });
