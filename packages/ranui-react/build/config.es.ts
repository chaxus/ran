import { defineConfig } from 'vite';
import { es, viteConfig } from '../vite.config';

viteConfig.build = es;

export default defineConfig(viteConfig);
