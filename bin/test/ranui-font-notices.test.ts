import type { TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = resolve(dirname(fileURLToPath(import.meta.url)), '../../packages/ranui/bin/copy-bundled-notices.ts');
const documents = [
  'NOTICE.md',
  'GUST-FONT-LICENSE.txt',
  'LPPL-1.3c.txt',
  'KaTeX-LICENSE.txt',
  'Temml-LICENSE.txt',
  'MANIFEST-Latin-Modern-Math.txt',
  'README-Latin-Modern-Math.txt',
];

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), 'ran-font-notices-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path: string, text: string) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  };
  put('node_modules/dashjs/dist/modern/esm/dash.all.min.js.LICENSE.txt', 'DASH notice');
  put('node_modules/mpegts.js/dist/mpegts.js.LICENSE.txt', 'FLV notice');
  for (const name of documents) put(`assets/fonts/licenses/${name}`, `Original ${name}\r\nCopyright fixture\n`);
  put('dist/THIRD_PARTY_LICENSES.md', '# Dependency licenses\n');
  put('dist/IIFE-LICENSES.md', '# IIFE licenses\n');
  put('bin/copy-bundled-notices.ts', '');
  copyFileSync(script, join(root, 'bin/copy-bundled-notices.ts'));
  return {
    root,
    run: () => spawnSync(process.execPath, [join(root, 'bin/copy-bundled-notices.ts')], { encoding: 'utf8' }),
  };
}

test('math font distribution preserves every upstream document byte for byte', (t) => {
  const { root, run } = fixture(t);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  for (const name of documents)
    assert.deepEqual(
      readFileSync(join(root, 'dist/third-party/math-fonts', name)),
      readFileSync(join(root, 'assets/fonts/licenses', name)),
    );
  assert.equal(run().status, 0);
  for (const name of ['THIRD_PARTY_LICENSES.md', 'IIFE-LICENSES.md']) {
    const text = readFileSync(join(root, 'dist', name), 'utf8');
    assert.ok(text.includes('./third-party/math-fonts/NOTICE.md'));
    assert.equal(text.match(/## Bundled mathematical fonts/g)?.length, 1);
  }
});

test('missing font license material fails notice generation', (t) => {
  const { root, run } = fixture(t);
  rmSync(join(root, 'assets/fonts/licenses/GUST-FONT-LICENSE.txt'));
  assert.notEqual(run().status, 0);
});
