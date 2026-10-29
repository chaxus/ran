import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const VERIFY = resolve(__dirname, '../../bin/verify-design-rules.ts');
const TSX = resolve(__dirname, '../../node_modules/.bin/tsx');

let root = '';
afterEach(() => rmSync(root, { recursive: true, force: true }));

/** Runs the checker as a consumer does, over one stylesheet in a `styles` root. */
function verify(css: string): { status: number | null; output: string } {
  root = mkdtempSync(join(tmpdir(), 'ran-verify-design-'));
  mkdirSync(join(root, 'styles'));
  writeFileSync(join(root, 'tokens.less'), ':root {\n  --ran-space-2: 8px;\n}\n');
  writeFileSync(join(root, 'baseline.json'), '{ "rules": {} }\n');
  writeFileSync(join(root, 'styles/site.css'), css);
  const run = spawnSync(TSX, [VERIFY, '--roots', 'styles', '--tokens', 'tokens.less', '--baseline', 'baseline.json'], {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return { status: run.status, output: `${run.stdout}${run.stderr}` };
}

describe('verify:design exceptions', () => {
  it('accepts a rule broken on purpose when the line says why', () => {
    const { status, output } = verify(
      '.a {\n  /* design-ok: bare-colour the ink follows the backdrop, not the theme */\n  color: #fff;\n  padding: 10px; /* design-ok: spacing-scale 设计稿要求的内边距 */\n}\n',
    );
    expect(output).toContain('no new violations');
    expect(status).toBe(0);
  });

  it('refuses an exception that gives no reason, or names another rule', () => {
    const { status, output } = verify(
      '.a {\n  padding: 10px; /* design-ok: spacing-scale */\n  color: #fff; /* design-ok: spacing-scale the wrong rule */\n}\n',
    );
    expect(status).not.toBe(0);
    expect(output).toContain('styles/site.css:2  padding: 10px');
    expect(output).toContain('styles/site.css:3  #fff');
  });

  it('outside the library, a step of the scale may be written as a length', () => {
    const { status, output } = verify('.a {\n  margin: 8px 16px;\n  gap: 24px;\n}\n');
    expect(output).toContain('no new violations');
    expect(status).toBe(0);
  });
});
