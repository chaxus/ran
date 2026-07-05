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
    // Elevation is a role (see docs/DESIGN.md): floating overlays (dropdown,
    // message) use the menu tier and must NOT fall back to the card tier
    // (`--ran-shadow-elevated` == `--ran-skin-raised-shadow`); a blocking dialog
    // (modal) uses the modal tier.
    ['components/dropdown/index.less', ['--ran-color-bg-elevated', '--ran-color-text', '--ran-shadow-menu']],
    [
      'components/modal/index.less',
      ['--ran-color-bg-elevated', '--ran-color-text', '--ran-color-border-secondary', '--ran-shadow-modal'],
    ],
    ['components/message/index.less', ['--ran-color-bg-elevated', '--ran-color-text', '--ran-shadow-menu']],
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

  // Only in-flow raised controls/surfaces reference the raised skin shadow
  // primitive (`--ran-skin-raised-shadow` == card-tier `--ran-shadow-elevated`).
  // Overlays (dropdown/message) and dialogs (modal) intentionally do NOT — they
  // carry the menu/modal shadow tier instead (asserted above).
  it.each([
    ['components/button/index.less', ['--ran-skin-raised-shadow', '--ran-skin-font-family']],
    ['components/input/index.less', ['--ran-skin-font-family']],
    ['components/checkbox/index.less', ['--ran-skin-font-family']],
  ])('%s references required skin primitive tokens', (path, tokens) => {
    const source = read(path);

    tokens.forEach((token) => {
      expect(source).toContain(token);
    });
  });
});
