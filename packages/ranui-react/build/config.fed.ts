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
        './icon': './components/icon/index.ts',
        './image': './components/image/index.ts',
        './option': './components/option/index.ts',
        './preview': './components/preview/index.ts',
        './progress': './components/progress/index.ts',
        './radar': './components/radar/index.ts',
        './select': './components/select/index.ts',
        './skeleton': './components/skeleton/index.ts',
        './tab': './components/tab/index.ts',
        './tabpane': './components/tabpane/index.ts',
    },
}))

export default defineConfig(viteConfig);
