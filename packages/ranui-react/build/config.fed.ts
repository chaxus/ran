import { defineConfig } from 'vite';
import federation from "@originjs/vite-plugin-federation";
import { viteConfig } from '../vite.config';

viteConfig.build = {
    target: "esnext",
    minify: false,
};
viteConfig.plugins?.push(federation({
    name: 'ranui',
    filename: 'ranui.js',
    exposes: {
        './utils': './utils/index.ts',
        './button': './components/button/index.ts',
        './input': './components/input/index.ts',
        './player': './components/player/index.ts',
    },
}))

export default defineConfig(viteConfig);
