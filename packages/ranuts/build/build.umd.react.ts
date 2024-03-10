import { defineConfig } from 'vite';
import { umdReact, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umdReact });
