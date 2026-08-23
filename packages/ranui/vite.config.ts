import path, { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildOptions, PluginOption, UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import loadSvg from './plugins/load-svg.ts';
import { PORT } from './build/config.ts';

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

/** Host frameworks a consumer already has; never ours to bundle. */
const FRAMEWORK_EXTERNAL = ['react', 'react-dom', 'vue'];

/**
 * Every entry in `dependencies`, read from package.json so the two cannot drift.
 *
 * These are left **unbundled in the ES build**, which is what declaring them as
 * dependencies was always supposed to mean. Inlining them instead made every consumer pay
 * for each one twice: once as a copy inside `dist/`, and again as the npm install that
 * copy shadowed and that nothing ever loaded — around 240 MB of node_modules (dashjs,
 * mermaid, hls.js…) that no import could reach. Leaving the specifier bare also hands
 * chunking back to the consumer's own bundler, which knows their target and can dedupe a
 * library they already depend on. shiki made the cost visible (~600 grammar modules
 * fanning out into ranui's tarball), but the problem was never shiki-specific.
 *
 * Deliberately **not** applied to the CJS/IIFE outputs: those exist to be dropped in via
 * `<script src>` with no resolver, so they must stay self-contained. They use
 * `singleFileResolve`, which additionally swaps shiki for its smaller web bundle.
 */
const RUNTIME_DEPENDENCIES = Object.keys(
  (createRequire(import.meta.url)('./package.json') as { dependencies?: Record<string, string> }).dependencies ?? {},
);

/** Matches a dependency and any of its subpaths (`ranuts/utils`, `shiki/engine/javascript`). */
const isRuntimeDependency = (id: string): boolean =>
  RUNTIME_DEPENDENCIES.some((dep) => id === dep || id.startsWith(`${dep}/`));

const chunkOptimization: Partial<BuildOptions> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  cssCodeSplit: true,
  cssMinify: cssMinifyMode,
  reportCompressedSize: false,
  emptyOutDir: true,
  rollupOptions: {
    external: FRAMEWORK_EXTERNAL,
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

const RESOLVE_EXTENSIONS = ['.mjs', '.js', '.cjs', '.ts', '.jsx', '.tsx', '.json'];

const pathAlias: Record<string, string> = {
  '@/components': resolve(__dirname, 'components/'),
  '@/assets': resolve(__dirname, 'assets/'),
  '@/public': resolve(__dirname, 'public/'),
  '@/utils': resolve(__dirname, 'utils/'),
};

/**
 * Resolution for the **single-file** outputs (CJS + IIFE bundles, and the standalone
 * per-component IIFE files). These formats cannot code-split, so an import of `shiki`
 * would inline its entire grammar set — ~600 languages, tens of megabytes — into one
 * file. The web bundle carries the ~50 most common languages instead, which is what
 * makes a `<script src>` drop-in viable at all.
 *
 * The per-component **ES** build does not use this: there `shiki` stays whole and every
 * language becomes its own lazy chunk, so a consumer downloads only what a code fence
 * actually asks for. `ranui/markdown` is therefore the entry to prefer.
 */
export const singleFileResolve = {
  alias: [
    ...Object.entries(pathAlias).map(([find, replacement]) => ({ find, replacement })),
    { find: /^shiki$/, replacement: 'shiki/bundle/web' },
  ],
  extensions: RESOLVE_EXTENSIONS,
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

/** Every web component, keyed by its public entry name. Single source of truth:
 * the per-component ES build below and the per-component IIFE build
 * (bin/build-iife.ts) both derive their entry lists from this map. */
export const componentEntries: Record<string, string> = {
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
  mermaid: resolve(__dirname, 'components/mermaid/index.ts'),
  markdown: resolve(__dirname, 'components/markdown/index.ts'),
  player: resolve(__dirname, 'components/player/index.ts'),
  progress: resolve(__dirname, 'components/progress/index.ts'),
  checkbox: resolve(__dirname, 'components/checkbox/index.ts'),
  colorpicker: resolve(__dirname, 'components/colorpicker/index.ts'),
  popover: resolve(__dirname, 'components/popover/index.ts'),
  content: resolve(__dirname, 'components/popover/content/index.ts'),
  dropdown: resolve(__dirname, 'components/dropdown/index.ts'),
  loading: resolve(__dirname, 'components/loading/index.ts'),
  scratch: resolve(__dirname, 'components/scratch/index.ts'),
  card: resolve(__dirname, 'components/card/index.ts'),
  conversation: resolve(__dirname, 'components/conversation/index.ts'),
  reasoning: resolve(__dirname, 'components/reasoning/index.ts'),
  'tool-card': resolve(__dirname, 'components/tool-card/index.ts'),
  'token-meter': resolve(__dirname, 'components/token-meter/index.ts'),
  'state-dot': resolve(__dirname, 'components/state-dot/index.ts'),
  'disclosure-row': resolve(__dirname, 'components/disclosure-row/index.ts'),
  attachments: resolve(__dirname, 'components/attachments/index.ts'),
  'voice-button': resolve(__dirname, 'components/voice-button/index.ts'),
  glass: resolve(__dirname, 'components/glass/index.ts'),
  section: resolve(__dirname, 'components/section/index.ts'),
  router: resolve(__dirname, 'components/router/index.ts'),
  route: resolve(__dirname, 'components/route/index.ts'),
  link: resolve(__dirname, 'components/link/index.ts'),
  'theme-switch': resolve(__dirname, 'components/theme-switch/index.ts'),
};

export const es: BuildOptions = {
  ...chunkOptimization,
  rollupOptions: {
    ...chunkOptimization.rollupOptions,
    external: (id: string): boolean => FRAMEWORK_EXTERNAL.includes(id) || isRuntimeDependency(id),
  },
  outDir: resolve(__dirname, 'dist'),
  lib: {
    entry: {
      ...componentEntries,
      'utils/router': resolve(__dirname, 'utils/router/index.ts'),
      'utils/i18n': resolve(__dirname, 'utils/i18n/index.ts'),
      ssg: resolve(__dirname, 'utils/ssg.ts'),
      index: resolve(__dirname, 'index.ts'),
      builder: resolve(__dirname, 'builder.ts'),
      ssr: resolve(__dirname, 'ssr.ts'),
      'ssr-stream': resolve(__dirname, 'ssr-stream.ts'),
      theme: resolve(__dirname, 'theme.ts'),
      testing: resolve(__dirname, 'testing.ts'),
      i18n: resolve(__dirname, 'i18n.ts'),
      icons: resolve(__dirname, 'components/icon/builtin.ts'),
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
    loadSvg({ defaultImport: 'raw' }),
    enableAnalyze
      ? (visualizer({
          emitFile: false,
          filename: 'report/build-stats.html',
        }) as PluginOption)
      : null,
  ],
  resolve: {
    alias: pathAlias,
    extensions: RESOLVE_EXTENSIONS,
  },
  css: {
    // Vite 8 defaults to a worker pool for CSS preprocessors, and its worker
    // handshake polls `receiveMessageOnPort` a fixed 10 times after `Atomics.wait`
    // unlocks. Under CI CPU contention that budget runs out and the build dies with
    // "[less] Failed to receive message from sync port after 10 attempts". Run less on
    // the main thread: the theme is a handful of files, so the lost parallelism is
    // cheaper than a flaky build.
    preprocessorMaxWorkers: 0,
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
