import { afterEach, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dropViteManifest, prepareDist } from '../src/driver.ts';

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

it('keeps hashed assets and their URLs through successive content rebuilds after manifest removal', async () => {
  const root = mkdtempSync(join(tmpdir(), 'ranpress-driver-'));
  roots.push(root);
  const distDir = join(root, 'dist');
  const publicDir = join(root, 'public');
  mkdirSync(publicDir);
  writeFileSync(join(publicDir, 'robots.txt'), 'before');
  writeFileSync(join(root, 'entry.js'), 'import "./style.css"; console.log("docs")');
  writeFileSync(join(root, 'style.css'), 'body { color: red }');
  writeFileSync(
    join(root, 'vite.config.mjs'),
    `export default { build: { outDir: 'dist', emptyOutDir: false, manifest: true, rollupOptions: { input: ${JSON.stringify(join(root, 'entry.js'))} } } }`,
  );
  const first = await prepareDist({ root, distDir, publicDir });
  expect(first.css).toHaveLength(1);
  expect(first.js).toHaveLength(1);
  dropViteManifest(distDir);
  writeFileSync(join(publicDir, 'robots.txt'), 'after');
  for (let i = 0; i < 2; i++) {
    expect(await prepareDist({ root, distDir, publicDir, skipAssets: true })).toEqual(first);
    for (const url of [...first.css, ...first.js]) expect(existsSync(join(distDir, url))).toBe(true);
    expect(readFileSync(join(distDir, 'robots.txt'), 'utf8')).toBe('after');
  }
});
