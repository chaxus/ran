import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildOptions, PluginOption, UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
// import viteImagemin from '@vheemstra/vite-plugin-imagemin';
// import imageminSvgo from 'imagemin-svgo';
import { babel } from '@rollup/plugin-babel';
// import loadStyle from './plugins/load-style';
import loadSvg from './plugins/load-svg';
import { PORT } from './build/config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const chunkOptimization: Partial<BuildOptions> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  reportCompressedSize: false,
  rollupOptions: {
    external: ['react', 'react-dom', 'vue'],
    output: {
      experimentalMinChunkSize: 500,
    },
    treeshake: {
      preset: 'recommended',
      manualPureFunctions: ['console.log'],
    },
  } as any,
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

export const es: BuildOptions = {
  ...chunkOptimization,
  lib: {
    entry: {
      button: resolve(__dirname, 'components/button/index.ts'),
      icon: resolve(__dirname, 'components/icon/index.ts'),
      image: resolve(__dirname, 'components/image/index.ts'),
      input: resolve(__dirname, 'components/input/index.ts'),
      message: resolve(__dirname, 'components/message/index.ts'),
      skeleton: resolve(__dirname, 'components/skeleton/index.ts'),
      tabpane: resolve(__dirname, 'components/tabpane/index.ts'),
      tab: resolve(__dirname, 'components/tab/index.ts'),
      radar: resolve(__dirname, 'components/radar/index.ts'),
      modal: resolve(__dirname, 'components/modal/index.ts'),
      select: resolve(__dirname, 'components/select/index.ts'),
      math: resolve(__dirname, 'components/math/index.ts'),
      player: resolve(__dirname, 'components/player/index.ts'),
      progress: resolve(__dirname, 'components/progress/index.ts'),
      checkbox: resolve(__dirname, 'components/checkbox/index.ts'),
      colorpicker: resolve(__dirname, 'components/colorpicker/index.ts'),
      popover: resolve(__dirname, 'components/popover/index.ts'),
      loading: resolve(__dirname, 'components/loading/index.ts'),
      index: resolve(__dirname, 'index.ts'),
    },
    fileName: (_: string, name: string): string => {
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
    // loadStyle({
    //   ignore: ['ranui/components/modal/index.ts'],
    // }),
    loadSvg({ svgo: false, defaultImport: 'raw' }),
    visualizer({
      emitFile: false,
      filename: 'report/build-stats.html',
    }) as PluginOption,
    // viteImagemin({
    //   plugins: {
    //     svg: imageminSvgo(),
    //   },
    // }),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, 'components/'),
      '@/theme': resolve(__dirname, 'theme/'),
      '@/assets': resolve(__dirname, 'assets/'),
      '@/public': resolve(__dirname, 'public/'),
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
