import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

describe('theme skin primitive tokens', () => {
  it('defines the shared skin token layer used by special theme packs', () => {
    const source = read('theme/tokens.less');

    [
      '--ran-skin-border-width',
      '--ran-skin-border-style',
      '--ran-skin-outline-color',
      '--ran-skin-inset-shadow',
      '--ran-skin-raised-shadow',
      '--ran-skin-hard-shadow',
      '--ran-skin-rough-shadow',
      '--ran-skin-rough-border-image',
      '--ran-skin-surface-texture',
      '--ran-skin-pixel-size',
      '--ran-skin-jitter-x',
      '--ran-skin-jitter-y',
      '--ran-skin-control-height-sm',
      '--ran-skin-control-height-md',
      '--ran-skin-font-family',
    ].forEach((token) => {
      expect(source).toContain(token);
    });
  });
});
