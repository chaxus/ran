import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

const ALL_PACKS = ['pixel-retro', 'windows-98', 'windows-xp', 'system-6', 'wired', 'paper', 'neo-brutalism'];

describe('theme pack source contracts', () => {
  it('ships opt-in source entries for all packs', () => {
    for (const pack of ALL_PACKS) {
      expect(existsSync(resolve(root, `theme-packs/${pack}.ts`)), `${pack}.ts missing`).toBe(true);
      expect(existsSync(resolve(root, `theme-packs/${pack}.less`)), `${pack}.less missing`).toBe(true);
    }
  });

  it('ships a generated wired-assets.less alongside the wired pack', () => {
    expect(existsSync(resolve(root, 'theme-packs/wired-assets.less'))).toBe(true);
  });

  it('keeps all theme packs as separate public exports', () => {
    const packageJson = read('package.json');
    const viteConfig = read('vite.config.ts');

    const exportPacks = [
      'pixel-retro',
      'windows-98',
      'windows-xp',
      'system-6',
      'wired',
      'paper',
      'neo-brutalism',
      'transitions',
    ];
    for (const pack of exportPacks) {
      expect(packageJson, `package.json missing ${pack} export`).toContain(
        `"./theme-packs/${pack}": "./dist/${pack}.css"`,
      );
      expect(viteConfig, `vite.config.ts missing ${pack} entry`).toContain(`'theme-packs/${pack}'`);
    }

    expect(viteConfig).toContain('cssCodeSplit: true');
  });

  it('ships an all-in-one theme-packs bundle for zero-config usage', () => {
    expect(existsSync(resolve(root, 'theme-packs/all.ts'))).toBe(true);
    const source = read('theme-packs/all.ts');
    for (const pack of ALL_PACKS) {
      expect(source, `all.ts missing ${pack}`).toContain(`./${pack}`);
    }
  });

  it('exports the all bundle as ranui/theme-packs in package.json', () => {
    const packageJson = read('package.json');
    expect(packageJson).toContain('"./theme-packs": "./dist/all.css"');
  });

  it('scopes every pack css under data-ran-theme-pack', () => {
    for (const pack of ALL_PACKS) {
      const source = read(`theme-packs/${pack}.less`);
      expect(source, `${pack} should scope under data-ran-theme-pack`).toContain(`[data-ran-theme-pack='${pack}']`);
    }
  });

  it('scopes pixel-retro css with skin pixel tokens', () => {
    const source = read('theme-packs/pixel-retro.less');
    expect(source).toContain('--ran-skin-hard-shadow');
    expect(source).toContain('--ran-skin-pixel-size');
  });

  it('scopes windows-98 css with bevel skin tokens', () => {
    const source = read('theme-packs/windows-98.less');
    expect(source).toContain('--ran-skin-raised-shadow');
    expect(source).toContain('--ran-skin-inset-shadow');
  });

  it('scopes windows-xp css with gradient button support', () => {
    const source = read('theme-packs/windows-xp.less');
    expect(source).toContain('--ran-skin-raised-shadow');
    expect(source).toContain("type='primary'");
  });

  it('scopes system-6 css with monochrome palette', () => {
    const source = read('theme-packs/system-6.less');
    expect(source).toContain('#000000');
    expect(source).toContain('#ffffff');
  });

  it('scopes wired css with runtime rough overlay support', () => {
    const source = read('theme-packs/wired.less');
    expect(source).toContain('--ran-skin-rough-shadow');
    expect(source).toContain('--ran-btn-content-border: none');
    expect(source).toContain('--ran-input-border: none');
    expect(source).toContain('--ran-select-selection-border: none');
  });

  it('scopes paper css with informal radius and shadow', () => {
    const source = read('theme-packs/paper.less');
    expect(source).toContain('--ran-skin-rough-shadow');
    expect(source).toContain('--ran-skin-font-family');
    expect(source).toContain('--ran-radius-md');
  });

  it('scopes neo-brutalism css with hard shadow and bold border', () => {
    const source = read('theme-packs/neo-brutalism.less');
    expect(source).toContain('--ran-skin-hard-shadow');
    expect(source).toContain('--ran-skin-border-width');
  });

  it('wired-assets.less contains prebuilt SVG data URIs for all required states', () => {
    const source = read('theme-packs/wired-assets.less');
    for (const state of ['normal', 'hover', 'focus', 'active', 'disabled']) {
      expect(source, `wired-assets missing @wired-svg-${state}`).toContain(`@wired-svg-${state}`);
    }
    expect(source).toContain('data:image/svg+xml,');
  });

  it('does not depend on Tailwind utilities or paint worklets in any pack', () => {
    for (const pack of ALL_PACKS) {
      const source = read(`theme-packs/${pack}.less`);
      expect(source, `${pack} uses @tailwind`).not.toContain('@tailwind');
      expect(source, `${pack} uses @apply`).not.toContain('@apply');
      expect(source, `${pack} uses paint()`).not.toContain('paint(');
    }
  });

  it('wired pack TS entry activates the runtime drawing overlay', () => {
    const wiredTs = read('theme-packs/wired.ts');
    const overlayTs = read('theme-packs/wired-overlay.ts');
    const packageJson = read('package.json');
    expect(wiredTs).toContain('./wired-overlay');
    expect(overlayTs).toContain("from 'roughjs'");
    expect(packageJson).toContain('"roughjs"');
  });

  it('ships a transitions pack for smooth pack switching', () => {
    expect(existsSync(resolve(root, 'theme-packs/transitions.ts'))).toBe(true);
    expect(existsSync(resolve(root, 'theme-packs/transitions.less'))).toBe(true);
    const source = read('theme-packs/transitions.less');
    expect(source).toContain('[data-ran-theme-pack]');
    expect(source).toContain('transition');
  });

  it('ships a visual test fixture for theme packs', () => {
    expect(existsSync(resolve(root, 'demo/theme-packs.html'))).toBe(true);
    expect(existsSync(resolve(root, 'demo/theme-packs.ts'))).toBe(true);
  });

  it('ships a Playwright visual spec for theme packs', () => {
    expect(existsSync(resolve(root, 'test/e2e/visual/theme-packs.spec.ts'))).toBe(true);
  });
});
