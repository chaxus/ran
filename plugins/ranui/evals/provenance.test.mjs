import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runtimeHash } from './evidence.mjs';

test('changing workspace source exports invalidates runtime even when dist is unchanged', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ranui-source-identity-'));
  const repo = path.join(root, 'repo');
  const run = path.join(root, 'run');
  const write = (name, text = 'initial') => {
    const target = path.join(root, name);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, text);
  };
  try {
    for (const name of [
      'run/surface/index.html',
      'run/runtime.js',
      'repo/packages/ranui/components/button/index.ts',
      'repo/packages/ranui/utils/component.ts',
      'repo/packages/ranui/theme/tokens.less',
      'repo/packages/ranui/fonts/font.woff2',
      'repo/packages/ranui/base.less',
      'repo/packages/ranui/style.ts',
      'repo/packages/ranuts/dist/index.js',
      'repo/packages/ranview/dist/index.js',
      'repo/packages/ranuts/package.json',
      'repo/packages/ranview/package.json',
      'repo/packages/ranview/src/index.ts',
      'repo/pnpm-lock.yaml',
    ])
      write(name);
    write('run/run.json', JSON.stringify({ repo }));
    const before = runtimeHash(run);
    write('repo/packages/ranview/src/index.ts', 'changed source export, same built output');
    assert.notEqual(runtimeHash(run), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
