import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

describe('component semantic theme token fallbacks', () => {
  it.each([
    ['components/button/index.less', ['--ran-color-primary', '--ran-color-border', '--ran-color-text']],
    [
      'components/input/index.less',
      ['--ran-color-border', '--ran-color-text', '--ran-color-bg-elevated', '--ran-color-text-disabled'],
    ],
    [
      'components/select/index.less',
      ['--ran-color-border', '--ran-color-text', '--ran-color-bg-elevated', '--ran-color-text-disabled'],
    ],
    ['components/dropdown/index.less', ['--ran-color-bg-elevated', '--ran-color-text', '--ran-shadow-elevated']],
    [
      'components/modal/index.less',
      ['--ran-color-bg-elevated', '--ran-color-text', '--ran-color-border-secondary', '--ran-shadow-elevated'],
    ],
    ['components/message/index.less', ['--ran-color-bg-elevated', '--ran-color-text', '--ran-shadow-elevated']],
    [
      'components/checkbox/index.less',
      ['--ran-color-primary', '--ran-color-border', '--ran-color-bg-elevated', '--ran-color-text'],
    ],
  ])('%s references required semantic theme tokens', (path, tokens) => {
    const source = read(path);

    tokens.forEach((token) => {
      expect(source).toContain(token);
    });
  });

  it.each([
    ['components/button/index.less', ['--ran-skin-raised-shadow', '--ran-skin-font-family']],
    ['components/input/index.less', ['--ran-skin-font-family']],
    ['components/dropdown/index.less', ['--ran-skin-raised-shadow']],
    ['components/modal/index.less', ['--ran-skin-raised-shadow']],
    ['components/message/index.less', ['--ran-skin-raised-shadow']],
    ['components/checkbox/index.less', ['--ran-skin-font-family']],
  ])('%s references required skin primitive tokens', (path, tokens) => {
    const source = read(path);

    tokens.forEach((token) => {
      expect(source).toContain(token);
    });
  });
});
