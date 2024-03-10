import { defineConfig } from 'vite';
import { umdWasm, viteConfig } from '../vite.config';

export default defineConfig({ ...viteConfig, build: umdWasm });
