import { defineConfig } from 'vite';
import { umdShadowless, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umdShadowless });
