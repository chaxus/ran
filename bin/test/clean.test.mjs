import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function fixture(t) {
  const temporary = mkdtempSync(join(tmpdir(), 'ran-clean-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const root = join(temporary, 'repo');
  const put = (path, content = 'keep me') => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    return target;
  };
  put('package.json', readFileSync(join(repository, 'package.json')));
  put('packages/manifest.json', JSON.stringify({ packages: { ranui: {}, docs: {}, rust: {} } }));
  for (const file of ['clean.sh', 'clean.mjs']) {
    if (existsSync(join(repository, 'bin', file))) copyFileSync(join(repository, 'bin', file), put(`bin/${file}`));
  }
  // The old cleaner must never reach package-manager caches during the red run.
  for (const [name, content] of [
    ['pnpm', '#!/bin/sh\nprintf "%s\\n" "$CLEAN_TEST_STORE"\n'],
    ['npm', '#!/bin/sh\nexit 0\n'],
  ]) {
    chmodSync(put(`.tools/${name}`, content), 0o755);
  }
  const run = (cwd = root) =>
    spawnSync('/bin/sh', [join(root, 'bin/clean.sh')], {
      cwd,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${join(root, '.tools')}:${process.env.PATH}`,
        CLEAN_TEST_STORE: join(temporary, 'global-store'),
      },
    });
  return { temporary, root, put, run };
}

function succeeded(result) {
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test('removes generated artifacts while preserving dependencies, lockfiles and package sources', (t) => {
  const { root, put, run } = fixture(t);
  const preserved = [
    'node_modules/dependency/index.js',
    'packages/ranui/node_modules/dependency/index.js',
    'pnpm-lock.yaml',
    'packages/ranui/build/index.ts',
    'packages/docs/build/plugin.ts',
    'packages/ranui/src/dist/source.ts',
    'packages/rust/src/main.rs',
    'packages/undeclared/dist/source.ts',
  ];
  const generated = [
    'dist/bundle.js',
    'coverage/index.html',
    'report/jscpd.json',
    'playwright-report/index.html',
    'test-results/output.json',
    '.prettiercache',
    'packages/ranui/dist/index.js',
    'packages/ranui/coverage/index.html',
    'packages/ranui/playwright-report/index.html',
    'packages/ranui/test-results/output.json',
    'packages/docs/dist/index.html',
  ];
  for (const path of [...preserved, ...generated]) put(path);
  succeeded(run());
  for (const path of preserved) assert.equal(existsSync(join(root, path)), true, `${path} must survive`);
  for (const path of generated) assert.equal(existsSync(join(root, path)), false, `${path} must be removed`);
});

test('cleans the repository from another working directory and is idempotent', (t) => {
  const { temporary, root, put, run } = fixture(t);
  put('packages/docs/dist/index.html');
  const unrelated = join(temporary, 'unrelated');
  mkdirSync(unrelated);
  writeFileSync(join(unrelated, 'pnpm-lock.yaml'), 'unrelated lock');
  mkdirSync(join(unrelated, 'node_modules'));
  succeeded(run(unrelated));
  assert.equal(existsSync(join(root, 'packages/docs/dist')), false);
  assert.equal(readFileSync(join(unrelated, 'pnpm-lock.yaml'), 'utf8'), 'unrelated lock');
  assert.equal(existsSync(join(unrelated, 'node_modules')), true);
  succeeded(run(unrelated));
});

test('preserves external files behind artifact and package-directory symlinks', (t) => {
  const { temporary, root, put, run } = fixture(t);
  const external = join(temporary, 'external');
  mkdirSync(join(external, 'dist'), { recursive: true });
  writeFileSync(join(external, 'dist/keep.js'), 'external source');
  mkdirSync(join(root, 'packages/ranui'), { recursive: true });
  symlinkSync(external, join(root, 'packages/docs'), 'junction');
  symlinkSync(join(external, 'dist'), join(root, 'packages/ranui/dist'), 'junction');
  put('packages/ranui/coverage/index.html');
  succeeded(run());
  assert.equal(readFileSync(join(external, 'dist/keep.js'), 'utf8'), 'external source');
  assert.equal(existsSync(join(root, 'packages/ranui/dist')), true, 'artifact symlink must survive');
  assert.equal(existsSync(join(root, 'packages/ranui/coverage')), false);
});

test('rejects package traversal in the manifest before deleting anything', (t) => {
  const { temporary, root, put, run } = fixture(t);
  put('packages/manifest.json', JSON.stringify({ packages: { ranui: {}, '../../external': {} } }));
  put('dist/bundle.js');
  mkdirSync(join(temporary, 'external/dist'), { recursive: true });
  writeFileSync(join(temporary, 'external/dist/keep.js'), 'external source');
  const result = run();
  assert.notEqual(result.status, 0, 'invalid manifest must fail closed');
  assert.equal(existsSync(join(root, 'dist/bundle.js')), true);
  assert.equal(existsSync(join(temporary, 'external/dist/keep.js')), true);
});
