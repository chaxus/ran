import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

describe('package export source contracts', () => {
  it('does not expose wasm or ml as public subpaths', () => {
    const packageJson = read('package.json');
    const viteConfig = read('vite.config.ts');
    const buildScript = read('bin/build.sh');
    const rootEntry = read('index.ts');
    const englishReadme = read('readme.md');
    const chineseReadme = read('README.zh-CN.md');
    const lockfile = read('../../pnpm-lock.yaml');

    expect(packageJson).not.toContain('"./wasm"');
    expect(packageJson).not.toContain('"./ml"');
    expect(packageJson).not.toContain('"tesseract.js"');
    expect(viteConfig).not.toContain('umdWasm');
    expect(viteConfig).not.toContain('umdMl');
    expect(viteConfig).not.toContain("wasm: resolve(__dirname, 'src/wasm/index.ts')");
    expect(viteConfig).not.toContain("ml: resolve(__dirname, 'src/ml/index.ts')");
    expect(buildScript).not.toContain('build.umd.wasm.ts');
    expect(buildScript).not.toContain('build.umd.ml.ts');
    expect(rootEntry).not.toContain('@/ml');
    expect(rootEntry).not.toContain('ocr');
    expect(englishReadme).not.toContain('ranuts/wasm');
    expect(englishReadme).not.toContain('ranuts/ml');
    expect(chineseReadme).not.toContain('ranuts/wasm');
    expect(chineseReadme).not.toContain('ranuts/ml');
    expect(lockfile).not.toContain('ranuts@0.1.0-alpha-23');
    expect(lockfile).not.toContain('tesseract.js');
    expect(existsSync(resolve(root, 'build/build.umd.wasm.ts'))).toBe(false);
    expect(existsSync(resolve(root, 'build/build.umd.ml.ts'))).toBe(false);
    expect(existsSync(resolve(root, 'src/wasm'))).toBe(false);
    expect(existsSync(resolve(root, 'src/ml'))).toBe(false);
    expect(existsSync(resolve(root, 'assets/wasm'))).toBe(false);
    expect(existsSync(resolve(root, 'assets/ocr'))).toBe(false);
    expect(existsSync(resolve(root, 'assets/img/ocr'))).toBe(false);
  });
});
