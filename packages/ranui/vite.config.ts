import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildOptions, PluginOption, UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
// import viteImagemin from '@vheemstra/vite-plugin-imagemin';
// import imageminSvgo from 'imagemin-svgo';
import loadSvg from './plugins/load-svg';
import { PORT } from './build/config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const parseMinifyMode = (value: string | undefined): BuildOptions['minify'] => {
  if (!value) return 'esbuild';
  if (value === 'false') return false;
  if (value === 'terser' || value === 'esbuild' || value === 'oxc') return value;
  return 'esbuild';
};

const parseCssMinifyMode = (value: string | undefined): BuildOptions['cssMinify'] => {
  if (!value) return 'esbuild';
  if (value === 'false') return false;
  if (value === 'esbuild' || value === 'lightningcss') return value;
  return 'esbuild';
};

const minifyMode = parseMinifyMode(process.env.RANUI_MINIFY);
const cssMinifyMode = parseCssMinifyMode(process.env.RANUI_CSS_MINIFY);
const enableAnalyze = process.env.RANUI_ANALYZE === 'true';

const chunkOptimization: Partial<BuildOptions> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  cssCodeSplit: true,
  cssMinify: cssMinifyMode,
  reportCompressedSize: false,
  emptyOutDir: true,
  rollupOptions: {
    external: ['react', 'react-dom', 'vue'],
    output: {
      assetFileNames: (assetInfo): string => {
        if (assetInfo.names?.includes('style.css')) return 'ranui.css';
        return '[name][extname]';
      },
    },
    treeshake: {
      manualPureFunctions: ['console.log'],
    },
  },
  minify: minifyMode,
};

export const bundle: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist'),
  emptyOutDir: false,
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranui',
    fileName: 'index',
    formats: ['cjs', 'iife'],
  },
};

export const es: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist'),
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
      form: resolve(__dirname, 'components/form/index.ts'),
      scratch: resolve(__dirname, 'components/scratch/index.ts'),
      card: resolve(__dirname, 'components/card/index.ts'),
      section: resolve(__dirname, 'components/section/index.ts'),
      router: resolve(__dirname, 'components/router/index.ts'),
      route: resolve(__dirname, 'components/route/index.ts'),
      link: resolve(__dirname, 'components/link/index.ts'),
      'utils/router': resolve(__dirname, 'utils/router/index.ts'),
      'utils/i18n': resolve(__dirname, 'utils/i18n/index.ts'),
      ssg: resolve(__dirname, 'utils/ssg.ts'),
      index: resolve(__dirname, 'index.ts'),
      builder: resolve(__dirname, 'builder.ts'),
      ssr: resolve(__dirname, 'ssr.ts'),
      'ssr-stream': resolve(__dirname, 'ssr-stream.ts'),
      style: resolve(__dirname, 'style.ts'),
    },
    fileName: (_: string, name: string): string => {
      return `${name}.js`;
    },
    formats: ['es'],
  },
};

export const viteConfig: UserConfig = {
  root: 'demo',
  optimizeDeps: {
    exclude: ['public'],
  },
  plugins: [
    loadSvg({ svgo: false, defaultImport: 'raw' }),
    enableAnalyze
      ? (visualizer({
          emitFile: false,
          filename: 'report/build-stats.html',
        }) as PluginOption)
      : null,
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, 'components/'),

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
        additionalData: `@import "${resolve(__dirname, 'base.less')}";`,
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
