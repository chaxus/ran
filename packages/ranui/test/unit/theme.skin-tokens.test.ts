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
      '--ran-color-link: var(--ran-blue-700)',
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
    expect(source).toContain('--ran-gray-1000: #ededed');
    expect(source).toContain("[data-ran-theme='dark']");
  });
});
