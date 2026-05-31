import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

describe('package export source contracts', () => {
  it('keeps public entrypoints explicit instead of star barrel exports', () => {
    expect(read('index.ts')).not.toContain('export *');
    expect(read('builder.ts')).not.toContain('export *');
  });

  it('exposes builder as a standalone public subpath', () => {
    const packageJson = read('package.json');
    const viteConfig = read('vite.config.ts');

    expect(existsSync(resolve(root, 'builder.ts')), 'builder.ts source entry missing').toBe(true);
    expect(viteConfig, 'vite.config.ts missing builder entry').toContain("builder: resolve(__dirname, 'builder.ts')");
    expect(packageJson, 'package.json missing ./builder export').toContain('"./builder"');
    expect(packageJson, 'package.json missing builder types path').toContain('"types": "./dist/builder.d.ts"');
    expect(packageJson, 'package.json missing builder import path').toContain('"import": "./dist/builder.js"');
    expect(packageJson, 'package.json missing builder require fallback').toContain('"require": "./dist/index.cjs"');
  });
});
