import { defineConfig } from 'vite';
import { umdNode, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umdNode });
