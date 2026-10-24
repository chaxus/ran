/**
 * The dev server's fast path.
 *
 * A markdown save rebuilds with `skipAssets`. That used to wipe the output, skip the
 * bundler and read a manifest the previous build had already dropped — so after the
 * first save every page referenced no stylesheet and no script.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dropViteManifest, prepareDist, writeOut } from '../src/driver.ts';

let root: string;
let distDir: string;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'ranpress-driver-'));
  distDir = join(root, 'dist');
  mkdirSync(join(root, 'client'));
  writeFileSync(join(root, 'client', 'main.js'), "import './main.css';\nconsole.info('client');\n");
  writeFileSync(join(root, 'client', 'main.css'), 'body { color: red; }\n');
  writeFileSync(
    join(root, 'vite.config.mjs'),
    `export default {
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: { input: { app: 'client/main.js' } },
  },
};
`,
  );
});

afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('prepareDist', () => {
  it('keeps the previous bundle and its URLs when assets are skipped', async () => {
    const full = await prepareDist({ root, distDir });
    expect(full.css).toHaveLength(1);
    expect(full.js).toHaveLength(1);
    writeOut(distDir, 'page.html', 'first build');
    dropViteManifest(distDir);

    const fast = await prepareDist({ root, distDir, skipAssets: true });

    expect(fast).toEqual(full);
    for (const url of [...fast.css, ...fast.js]) expect(existsSync(join(distDir, url))).toBe(true);
  });
});
