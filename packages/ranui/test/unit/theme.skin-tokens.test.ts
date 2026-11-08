import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

describe('theme tokens', () => {
  it('defines the Geist base palette scales', () => {
    const source = read('theme/tokens.less');

    [
      '--ran-gray-100',
      '--ran-gray-1000',
      '--ran-gray-alpha-100',
      '--ran-blue-700',
      '--ran-red-700',
      '--ran-amber-700',
      '--ran-green-700',
      '--ran-background-100',
    ].forEach((token) => {
      expect(source).toContain(token);
    });
  });

  it('maps semantic tokens onto the base scale', () => {
    const source = read('theme/tokens.less');

    [
      // Primary is the monochrome action (Vercel/Geist); blue is links + focus only.
      '--ran-color-primary: var(--ran-gray-1000)',
      '--ran-color-primary-text: var(--ran-background-100)',
      '--ran-color-link: var(--ran-blue-800)',
      '--ran-color-text: var(--ran-gray-1000)',
      '--ran-color-bg: var(--ran-background-100)',
      '--ran-color-border: var(--ran-gray-400)',
    ].forEach((decl) => {
      expect(source).toContain(decl);
    });
  });

  it('keeps the minimal skin primitive layer consumed by components', () => {
    const source = read('theme/tokens.less');

    [
      '--ran-skin-border-width',
      '--ran-skin-border-style',
      '--ran-skin-raised-shadow',
      '--ran-skin-font-family',
    ].forEach((token) => {
      expect(source).toContain(token);
    });
  });

  it('redefines the base scale for dark mode', () => {
    const source = read('theme/dark.less');

    expect(source).toContain('.ran-theme-dark()');
    expect(source).toContain('--ran-gray-1000: #ededef');
    expect(source).toContain("[data-ran-theme='dark']");
  });

  it('defines glass surface language tokens and dark overrides', () => {
    const tokens = read('theme/tokens.less');
    const dark = read('theme/dark.less');

    [
      '--ran-surface-glass-blur',
      '--ran-surface-glass-fill',
      '--ran-surface-glass-overlay-blur',
      '--ran-surface-glass-solid-fallback',
      '--ran-surface-glass-hover',
      '--ran-surface-glass-selected',
    ].forEach((token) => {
      expect(tokens).toContain(token);
    });
    expect(dark).toContain('--ran-surface-glass-fill: rgba(26, 26, 26, 0.55)');
    expect(dark).toContain('--ran-surface-glass-hover');
    expect(tokens).toContain('--ran-surface-glass-blur: 12px');
    expect(tokens).toContain('--ran-surface-glass-overlay-blur: 18px');
    expect(tokens).toContain('--ran-surface-glass-specular');
  });

  it('wires glass surface selectors on the pilot control family', () => {
    const frost = read('theme/surface-frost.less');
    expect(frost).toContain('prefers-reduced-transparency');
    // Content-layer pilots: opt-in only (Apple — no Liquid Glass in the content layer).
    ['card', 'input'].forEach((name) => {
      const source = read(`components/${name}/index.less`);
      expect(source).toContain('surface-frost.less');
      expect(source).toMatch(/:host\(\s*\[surface='glass'\]/);
      expect(source).not.toMatch(/:host-context\(\[data-ran-surface='glass'\]\)/);
    });
    // Functional / overlay pilots: document glass or explicit surface="glass".
    ['button', 'modal', 'message', 'dropdown'].forEach((name) => {
      const source = read(`components/${name}/index.less`);
      expect(source).toContain('surface-frost.less');
      expect(source).toMatch(/:host\(\s*\[surface='glass'\]/);
      // Chromium does not match :host-context(...):not(...); host checks stay inside :host().
      expect(source).toMatch(/:host-context\(\[data-ran-surface='glass'\]\):host\(\s*:not\(\[surface='solid'\]\)/);
      expect(source).not.toMatch(/:host-context\(\[data-ran-surface='glass'\]\):not\(/);
    });
    // Menu rows + select trigger: glass hover wash without a host re-declaring Graphite grey.
    const item = read('components/select/dropdown-item/index.less');
    expect(item).toMatch(/:host-context\(\[data-ran-surface='glass'\]\)/);
    expect(item).toContain('--ran-surface-glass-hover');
    // Sliding wash mode suppresses per-row fills (r-dropdown[data-hover-fill]).
    expect(item).toMatch(/:host-context\(\[data-hover-fill\]\)/);
    const select = read('components/select/index.less');
    expect(select).toMatch(/:host-context\(\[data-ran-surface='glass'\]\)/);
    expect(select).toContain('--ran-surface-glass-hover');
    const dropdown = read('components/dropdown/index.less');
    expect(dropdown).toContain('ran-select-option-hover');
  });
});
