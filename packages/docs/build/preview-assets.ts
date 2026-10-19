import { cpSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { Plugin } from 'vite';

const packageRoot = dirname(createRequire(import.meta.url).resolve('@ranui/preview/package.json'));
const { version } = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as { version: string };
export const previewAssetDirectory = `preview-${version}`;

/** PDF.js resolves fonts, cMaps and WASM beside its emitted module. Version both together. */
export const isPreviewPdfChunk = (moduleIds: readonly string[]): boolean =>
  moduleIds.some((id) => id.replaceAll('\\', '/').startsWith(`${packageRoot.replaceAll('\\', '/')}/dist/pdf-`));

export const previewAssets = (): Plugin => {
  let destination: string;
  return {
    name: 'docs-preview-assets',
    apply: 'build',
    configResolved(config) {
      destination = resolve(config.root, config.build.outDir, 'assets', previewAssetDirectory, 'pdfjs');
    },
    closeBundle() {
      cpSync(join(packageRoot, 'dist/pdfjs'), destination, { recursive: true });
    },
  };
};
