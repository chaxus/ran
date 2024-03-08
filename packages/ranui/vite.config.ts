import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildOptions, PluginOption, UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminSvgo from 'imagemin-svgo';
import type { RollupOptions } from 'rollup';
import loadStyle from './plugins/load-style';
import loadSvg from './plugins/load-svg';
import { PORT } from './build/config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

interface chunkOptimization {
  assetsInlineLimit: number;
  chunkSizeWarningLimit: number;
  reportCompressedSize: boolean;
  rollupOptions: RollupOptions;
  minify: boolean | 'terser' | 'esbuild' | undefined;
}

const chunkOptimization: Partial<chunkOptimization> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  reportCompressedSize: false,
  rollupOptions: {
    external: ['react'],
    output: {
      experimentalMinChunkSize: 500,
    },
    treeshake: {
      preset: 'recommended',
      manualPureFunctions: ['console.log'],
    },
  },
  minify: 'terser',
};

export const umd: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd'),
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranui',
    fileName: 'index',
    formats: ['umd'],
  },
};

export const umdShadowless: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd/shadowless'),
  lib: {
    entry: resolve(__dirname, 'shadowless.ts'),
    name: 'ranui',
    fileName: 'shadowless',
    formats: ['umd'],
  },
};

export const es: BuildOptions = {
  ...chunkOptimization,
  lib: {
    entry: {
      button: resolve(__dirname, 'components/button/index.ts'),
      icon: resolve(__dirname, 'components/icon/index.ts'),
      iconShadowless: resolve(__dirname, 'shadowless/icon/index.ts'),
      image: resolve(__dirname, 'components/image/index.ts'),
      input: resolve(__dirname, 'components/input/index.ts'),
      inputShadowless: resolve(__dirname, 'shadowless/input/index.ts'),
      message: resolve(__dirname, 'components/message/index.ts'),
      preview: resolve(__dirname, 'components/preview/index.ts'),
      skeleton: resolve(__dirname, 'components/skeleton/index.ts'),
      tabpane: resolve(__dirname, 'components/tabpane/index.ts'),
      tab: resolve(__dirname, 'components/tab/index.ts'),
      radar: resolve(__dirname, 'components/radar/index.ts'),
      modal: resolve(__dirname, 'components/modal/index.ts'),
      select: resolve(__dirname, 'components/select/index.ts'),
      selectShadowless: resolve(__dirname, 'shadowless/select/index.ts'),
      option: resolve(__dirname, 'components/option/index.ts'),
      player: resolve(__dirname, 'components/player/index.ts'),
      progress: resolve(__dirname, 'components/progress/index.ts'),
      checkbox: resolve(__dirname, 'components/checkbox/index.ts'),
      colorpicker: resolve(__dirname, 'components/colorpicker/index.ts'),
      popover: resolve(__dirname, 'components/popover/index.ts'),
      content: resolve(__dirname, 'components/content/index.ts'),
      index: resolve(__dirname, 'index.ts'),
      shadowless: resolve(__dirname, 'shadowless.ts'),
    },
    fileName: (_: string, name: string): string => {
      if (name.includes('components')) {
        return `components/${name}/index.js`;
      }
      if (name.includes('shadowless')) {
        return `shadowless/${name}/index.js`;
      }
      return `${name}.js`;
    },
    formats: ['es'],
  },
};

export const viteConfig: UserConfig = {
  optimizeDeps: {
    exclude: ['public'],
  },
  plugins: [
    loadStyle({
      ignore: ['ranui/components/modal/index.ts'],
    }),
    loadSvg({ svgo: false, defaultImport: 'raw' }),
    visualizer({
      emitFile: false,
      filename: 'report/build-stats.html',
    }) as PluginOption,
    viteImagemin({
      plugins: {
        svg: imageminSvgo(),
      },
    }),
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, 'components/'),
      '@/shadowless': resolve(__dirname, 'shadowless/'),
      '@/assets': resolve(__dirname, 'assets/'),
      '@/utils': resolve(__dirname, 'utils/'),
    },
    extensions: ['.mjs', '.js', '.cjs', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "./base.less";`,
      },
    },
    modules: {
      generateScopedName: '[name--[local]--[hash:base64:5]]',
    },
  },
  server: {
    port: PORT,
  },
};

export default defineConfig(viteConfig);
