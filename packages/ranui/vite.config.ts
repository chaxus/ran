import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildOptions, PluginOption, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminSvgo from 'imagemin-svgo';
import loadStyle from './plugins/load-style';
import loadSvg from './plugins/load-svg';
import { PORT } from './build/config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

type TreeshakingPreset = 'smallest' | 'safest' | 'recommended';

type HasModuleSideEffects = (id: string, external: boolean) => boolean;

type ModuleSideEffectsOption = boolean | 'no-external' | string[] | HasModuleSideEffects;

interface NormalizedTreeshakingOptions {
  annotations: boolean;
  correctVarValueBeforeDeclaration: boolean;
  manualPureFunctions: readonly string[];
  moduleSideEffects: HasModuleSideEffects;
  propertyReadSideEffects: boolean | 'always';
  tryCatchDeoptimization: boolean;
  unknownGlobalSideEffects: boolean;
}

interface TreeshakingOptions extends Partial<Omit<NormalizedTreeshakingOptions, 'moduleSideEffects'>> {
  moduleSideEffects?: ModuleSideEffectsOption;
  preset?: TreeshakingPreset;
}
interface CustomPluginOptions {
  [plugin: string]: unknown;
}
interface ModuleOptions {
  assertions: Record<string, string>;
  meta: CustomPluginOptions;
  moduleSideEffects: boolean | 'no-treeshake';
  syntheticNamedExports: boolean | string;
}
interface AcornNode {
  end: number;
  start: number;
  type: string;
}
interface ResolvedId extends ModuleOptions {
  external: boolean | 'absolute';
  id: string;
  resolvedBy: string;
}
interface ModuleInfo extends ModuleOptions {
  ast: AcornNode | null;
  code: string | null;
  dynamicImporters: readonly string[];
  dynamicallyImportedIdResolutions: readonly ResolvedId[];
  dynamicallyImportedIds: readonly string[];
  exportedBindings: Record<string, string[]> | null;
  exports: string[] | null;
  hasDefaultExport: boolean | null;
  hasModuleSideEffects: boolean | 'no-treeshake';
  id: string;
  implicitlyLoadedAfterOneOf: readonly string[];
  implicitlyLoadedBefore: readonly string[];
  importedIdResolutions: readonly ResolvedId[];
  importedIds: readonly string[];
  importers: readonly string[];
  isEntry: boolean;
  isExternal: boolean;
  isIncluded: boolean | null;
}
type GetModuleInfo = (moduleId: string) => ModuleInfo | null;
interface ManualChunkMeta {
  getModuleIds: () => IterableIterator<string>;
  getModuleInfo: GetModuleInfo;
}
type NullValue = null | undefined | void;

type GetManualChunk = (id: string, meta: ManualChunkMeta) => string | NullValue;

type ManualChunksOption = { [chunkAlias: string]: string[] } | GetManualChunk;

interface chunkOptimization {
  assetsInlineLimit: number;
  chunkSizeWarningLimit: number;
  reportCompressedSize: boolean;
  rollupOptions: {
    output: {
      experimentalMinChunkSize?: number;
      manualChunks?: ManualChunksOption;
    };
    treeshake?: boolean | TreeshakingPreset | TreeshakingOptions;
  };
  minify: boolean | 'terser' | 'esbuild' | undefined;
}

const chunkOptimization: Partial<chunkOptimization> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 8 * 1024,
  reportCompressedSize: false,
  rollupOptions: {
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
  rollupOptions: {
    output: {
      experimentalMinChunkSize: 500,
    },
  },
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
  rollupOptions: {
    output: {
      experimentalMinChunkSize: 500,
      // manualChunks: (id) => {
      //   if (id.includes('node_modules')) {
      //     return 'vendor';
      //   }
      // },
    },
    treeshake: {
      preset: 'recommended',
      manualPureFunctions: ['console.log'],
    },
  },
  lib: {
    entry: {
      button: resolve(__dirname, 'components/button/index.ts'),
      icon: resolve(__dirname, 'components/icon/index.ts'),
      image: resolve(__dirname, 'components/image/index.ts'),
      input: resolve(__dirname, 'components/input/index.ts'),
      message: resolve(__dirname, 'components/message/index.ts'),
      preview: resolve(__dirname, 'components/preview/index.ts'),
      skeleton: resolve(__dirname, 'components/skeleton/index.ts'),
      tabpane: resolve(__dirname, 'components/tabpane/index.ts'),
      tab: resolve(__dirname, 'components/tab/index.ts'),
      radar: resolve(__dirname, 'components/radar/index.ts'),
      modal: resolve(__dirname, 'components/modal/index.ts'),
      select: resolve(__dirname, 'components/select/index.ts'),
      option: resolve(__dirname, 'components/option/index.ts'),
      player: resolve(__dirname, 'components/player/index.ts'),
      progress: resolve(__dirname, 'components/progress/index.ts'),
      checkbox: resolve(__dirname, 'components/checkbox/index.ts'),
      colorpicker: resolve(__dirname, 'components/colorpicker/index.ts'),
      popover: resolve(__dirname, 'components/popover/index.ts'),
      content: resolve(__dirname, 'components/content/index.ts'),
      index: resolve(__dirname, 'index.ts'),
    },
    fileName: (_: string, name: string): string => {
      if (name === 'index') {
        return `${name}.js`;
      }
      return `components/${name}/index.js`;
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
    dts(),
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
