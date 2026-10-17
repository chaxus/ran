import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = resolve(dirname(fileURLToPath(import.meta.url)), '../../packages/ranuts/bin/copy-bundled-notices.mjs');
const license =
  'GNU LESSER GENERAL PUBLIC LICENSE\nVersion 2.1, February 1999\nFixture license bytes must be preserved.\n';
const primary = '/* Copyright Netscape Communications Corporation. GNU Lesser General Public License. */';
const secondary = '/* Copyright Another Contributor. GNU Lesser General Public License. */';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ran-bundled-notices-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, text) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  put(
    'node_modules/jschardet/package.json',
    JSON.stringify({
      name: 'jschardet',
      version: '3.1.4',
      license: 'LGPL-2.1+',
      repository: { url: 'https://github.com/aadsm/jschardet.git' },
    }),
  );
  put('node_modules/jschardet/LICENSE', license);
  put('node_modules/jschardet/src/index.js', primary + '\nexports.detect = function() {};\n');
  put('node_modules/jschardet/src/prober.js', secondary + '\nmodule.exports = {};\n');
  for (const name of ['index', 'utils']) put(`dist/iife/${name}.iife.js`, `var ${name} = {};\n`);
  return {
    root,
    put,
    read: (path) => readFileSync(join(root, path), 'utf8'),
    run: () => spawnSync(process.execPath, [script, root], { encoding: 'utf8' }),
  };
}

test('IIFE distribution retains exact upstream license, every source header and source version', (t) => {
  const { read, run } = fixture(t);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(read('dist/third-party/jschardet/LICENSE.txt'), license);
  const notice = read('dist/third-party/jschardet/NOTICE.txt');
  for (const text of [
    primary,
    secondary,
    'jschardet@3.1.4',
    'LGPL-2.1+',
    'https://registry.npmjs.org/jschardet/-/jschardet-3.1.4.tgz',
  ])
    assert.ok(notice.includes(text), text);
  for (const name of ['index', 'utils']) {
    const bundle = read(`dist/iife/${name}.iife.js`);
    assert.ok(bundle.includes('jschardet@3.1.4'));
    assert.ok(bundle.includes('../third-party/jschardet/'));
    assert.ok(bundle.endsWith(`var ${name} = {};\n`));
  }
  assert.equal(run().status, 0);
  assert.equal(read('dist/iife/index.iife.js').match(/jschardet@3\.1\.4/g).length, 1);
});

test('missing upstream copyright material fails the build instead of emitting incomplete notices', (t) => {
  const { root, run } = fixture(t);
  rmSync(join(root, 'node_modules/jschardet/src'), { recursive: true });
  assert.notEqual(run().status, 0);
});
