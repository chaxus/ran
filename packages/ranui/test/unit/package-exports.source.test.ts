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

  it('exposes SSR helpers as standalone public subpaths', () => {
    const packageJson = read('package.json');
    const viteConfig = read('vite.config.ts');

    expect(existsSync(resolve(root, 'ssr.ts')), 'ssr.ts source entry missing').toBe(true);
    expect(existsSync(resolve(root, 'ssr-stream.ts')), 'ssr-stream.ts source entry missing').toBe(true);

    expect(viteConfig, 'vite.config.ts missing ssr entry').toContain("ssr: resolve(__dirname, 'ssr.ts')");
    expect(viteConfig, 'vite.config.ts missing ssr-stream entry').toContain(
      "'ssr-stream': resolve(__dirname, 'ssr-stream.ts')",
    );

    expect(packageJson, 'package.json missing ./ssr export').toContain('"./ssr"');
    expect(packageJson, 'package.json missing ssr types path').toContain('"types": "./dist/ssr.d.ts"');
    expect(packageJson, 'package.json missing ssr import path').toContain('"import": "./dist/ssr.js"');

    expect(packageJson, 'package.json missing ./ssr-stream export').toContain('"./ssr-stream"');
    expect(packageJson, 'package.json missing ssr-stream types path').toContain('"types": "./dist/ssr-stream.d.ts"');
    expect(packageJson, 'package.json missing ssr-stream import path').toContain('"import": "./dist/ssr-stream.js"');
  });
});
