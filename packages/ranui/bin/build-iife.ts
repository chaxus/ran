/**
 * Builds a standalone IIFE bundle for every web component:
 *   dist/iife/<name>.iife.js
 *
 * Each file is self-contained (shared runtime and internal component
 * dependencies are inlined) and registers its custom element(s) as a side
 * effect, so a page can pick exactly what it needs with a single tag:
 *
 *   <script src="https://cdn.jsdelivr.net/npm/ranui@x.y.z/dist/iife/select.iife.js" defer></script>
 *
 * Loading several files is safe — element registration is guarded
 * (customElements.get(name) || customElements.define(...)), so duplicated
 * inlined dependencies are no-ops. For pages that use many components,
 * prefer the per-component ES modules (dist/<name>.js, shared chunks are
 * deduplicated by the browser) or the full dist/index.iife.js instead.
 *
 * IIFE is a single-entry format, so this loops one vite build per component.
 * The entry list comes from `componentEntries` in vite.config.ts — the same
 * source of truth as the per-component ES build.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import type { LibraryOptions } from 'vite';
import { componentEntries, viteConfig } from '../vite.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT, 'dist/iife');

const toGlobalName = (name: string): string => `ranui_${name.replace(/[^a-zA-Z0-9_$]/g, '_')}`;

const main = async (): Promise<void> => {
  await fs.rm(OUT_DIR, { recursive: true, force: true });

  for (const [name, entry] of Object.entries(componentEntries)) {
    const lib: LibraryOptions = {
      entry,
      name: toGlobalName(name),
      formats: ['iife'],
      fileName: () => `${name}.iife.js`,
    };
    await build({
      ...viteConfig,
      root: ROOT,
      configFile: false,
      logLevel: 'warn',
      define: {
        'import.meta.env.DEV': JSON.stringify(false),
        'import.meta.env.PROD': JSON.stringify(true),
        'import.meta.env.SSR': JSON.stringify(false),
      },
      build: {
        outDir: OUT_DIR,
        emptyOutDir: false,
        reportCompressedSize: false,
        lib,
        rollupOptions: {
          // These bundles register elements as a side effect; exports are a
          // convenience. 'named' avoids the MIXED_EXPORTS warning for entries
          // that ship both named and default exports.
          output: { exports: 'named' },
        },
      },
    });
    const { size } = await fs.stat(path.join(OUT_DIR, `${name}.iife.js`));
    console.log(`dist/iife/${name}.iife.js  ${(size / 1024).toFixed(1)} kB`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
