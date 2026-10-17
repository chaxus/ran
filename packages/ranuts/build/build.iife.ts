import { defineConfig } from 'vite';
import { iife, viteConfig } from '../vite.config.ts';

export default defineConfig({ ...viteConfig, build: iife });
