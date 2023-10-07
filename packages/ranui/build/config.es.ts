import { defineConfig } from 'vite';
import { es, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: es });
