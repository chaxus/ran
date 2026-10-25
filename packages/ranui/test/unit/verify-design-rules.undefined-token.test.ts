import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const VERIFY = resolve(__dirname, '../../bin/verify-design-rules.ts');
const TSX = resolve(__dirname, '../../node_modules/.bin/tsx');
const EMPTY_BASELINE = '{ "rules": {} }\n';

let root = '';
afterEach(() => rmSync(root, { recursive: true, force: true }));

/** Runs the checker as a consumer does, over one stylesheet in a `styles` root. */
function verify(css: string): { status: number | null; output: string } {
  root = mkdtempSync(join(tmpdir(), 'ran-verify-design-'));
  mkdirSync(join(root, 'styles'));
  writeFileSync(join(root, 'tokens.less'), ':root {\n  --ran-space-3: 12px;\n  --ran-space-4: 16px;\n}\n');
  writeFileSync(join(root, 'baseline.json'), EMPTY_BASELINE);
  writeFileSync(join(root, 'styles/site.css'), css);
  const run = spawnSync(TSX, [VERIFY, '--roots', 'styles', '--tokens', 'tokens.less', '--baseline', 'baseline.json'], {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return { status: run.status, output: `${run.stdout}${run.stderr}` };
}

describe('verify:design undefined-token-fallback', () => {
  it('reports a missing scale step behind a literal fallback, even as the second var() on a line', () => {
    const { status, output } = verify('.a {\n  padding: var(--ran-space-3, 12px) var(--ran-space-5, 20px) 0;\n}\n');
    expect(status).not.toBe(0);
    expect(output).toContain('styles/site.css:2  --ran-space-5 (not a step of the --ran-space scale)');
  });

  it('leaves component override hooks and declared steps alone', () => {
    const { status, output } = verify('.a {\n  padding: var(--ran-card-padding, var(--ran-space-4, 16px));\n}\n');
    expect(output).toContain('no new violations');
    expect(status).toBe(0);
  });
});
