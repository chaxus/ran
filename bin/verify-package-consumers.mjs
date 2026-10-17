/** Exercise actual packed artifacts, including pnpm's published workspace metadata. Build first. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = await mkdtemp(join(tmpdir(), 'ran-packages-'));
const run = (command, args, cwd = fixture) => execFileSync(command, args, { cwd, stdio: 'pipe' });
const packs = ['ranuts', 'ranview', 'ranui'];
const manifests = new Map();
try {
  await mkdir(join(fixture, 'node_modules'), { recursive: true });
  for (const directory of packs) {
    const source = join(root, 'packages', directory);
    const manifest = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
    const tarball = join(fixture, `${directory}.tgz`);
    run('pnpm', ['--config.ignore-scripts=true', 'pack', '--out', tarball], source);
    const installed = join(fixture, 'node_modules', manifest.name);
    await mkdir(installed, { recursive: true });
    run('tar', ['-xzf', tarball, '--strip-components=1', '-C', installed]);
    const packed = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
    manifests.set(manifest.name, packed);
    assert.ok(
      !JSON.stringify(packed.dependencies ?? {}).includes('workspace:'),
      'Pack must resolve workspace versions',
    );
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      if (dependency === 'ranuts' || dependency === '@alixex/ranview') continue;
      const target = join(fixture, 'node_modules', dependency);
      await mkdir(dirname(target), { recursive: true });
      try {
        await symlink(join(source, 'node_modules', dependency), target, 'junction');
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
    }
  }
  await symlink(join(root, 'packages/ranui/node_modules/@types'), join(fixture, 'node_modules/@types'), 'junction');
  await writeFile(join(fixture, 'package.json'), '{"type":"module"}');
  const imports = [];
  const cjsImports = [];
  let count = 0;
  for (const [name, manifest] of manifests) {
    for (const [entry, conditions] of Object.entries(manifest.exports)) {
      if (typeof conditions !== 'object' || entry.includes('*')) continue;
      const specifier = name + (entry === '.' ? '' : entry.slice(1));
      if (conditions.import) imports.push(`import * as p${count} from '${specifier}'; void p${count};`);
      if (conditions.require) cjsImports.push(`import p${count} = require('${specifier}'); void p${count};`);
      count++;
    }
  }
  const contracts = `
import { requestUrlToBuffer, createObjectURL, type RGB } from 'ranuts';
import { signal } from 'ranui/builder';
import { Button } from 'ranui/button';
const pixel: RGB = [1, 2, 3];
// @ts-expect-error A real tuple type must reject invalid input.
const badPixel: RGB = 42;
async function binaryContracts() {
  const array: ArrayBuffer = (await requestUrlToBuffer('/data')).data;
  const blob: Blob = (await requestUrlToBuffer('/data', { responseType: 'blob' })).data;
  const text: string = (await requestUrlToBuffer('/data', { responseType: 'text' })).data;
  // @ts-expect-error Default data must not masquerade as Blob.
  const wrong: Blob = (await requestUrlToBuffer('/data')).data;
  const url: string = await createObjectURL('https://example.test/file');
  void [array, blob, text, wrong, url];
}
const [value, set] = signal(1); set(2); const current: number = value();
const button: Button = new Button();
void [pixel, badPixel, binaryContracts, current, button];
`;
  await writeFile(join(fixture, 'consumer.mts'), imports.join('\n') + contracts);
  await writeFile(join(fixture, 'consumer.cts'), cjsImports.join('\n') + contracts);
  const require = createRequire(join(root, 'packages/ranui/package.json'));
  const tsc = join(dirname(require.resolve('typescript/package.json')), 'bin/tsc');
  for (const files of [['consumer.mts'], ['consumer.cts'], ['consumer.mts', 'consumer.cts']]) {
    run(process.execPath, [
      tsc,
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      'false',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--types',
      'node',
      ...files,
    ]);
    console.log(`Packed libraries: strict NodeNext ${files.join('+')} consumer passed`);
  }
  await writeFile(join(fixture, 'browser.mts'), imports.join('\n') + contracts);
  await writeFile(
    join(fixture, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        noEmit: true,
        strict: true,
        skipLibCheck: false,
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        types: [],
      },
      files: ['browser.mts'],
    }),
  );
  run(process.execPath, [tsc, '-p', 'tsconfig.json']);
  console.log('Packed libraries: browser declarations passed without Node ambient types');
  await writeFile(
    join(fixture, 'typings-only.mts'),
    `
import type {} from 'ranui/typings';
const prompt: Ran.Prompt = { content: 'ready', duration: 1000 };
// @ts-expect-error Public message options must keep their concrete field types.
const invalid: Ran.Prompt = { content: 42 };
void [prompt, invalid];
`,
  );
  run(process.execPath, [
    tsc,
    '--ignoreConfig',
    '--noEmit',
    '--strict',
    '--skipLibCheck',
    'false',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    '--types',
    'ranui/typings',
    'typings-only.mts',
  ]);
  console.log('Packed libraries: standalone browser augmentations need no Vite or Node types');

  await writeFile(
    join(fixture, 'runtime.cjs'),
    `
async function main() {
const assert = require('node:assert/strict');
const { Div, signal } = require('ranui/builder');
const { h, renderToString } = require('ranui/ssr');
const { renderHTMLToString } = require('ranui/ssr-stream');
const { insideShadow } = require('ranui/testing');
assert.equal(typeof Div, 'function');
assert.equal(signal(3)[0](), 3);
assert.equal(h('div', {}, 'hello'), '<div>hello</div>');
const { Button } = require('ranui');
assert.match(renderToString(new Button()), /<r-button/);
assert.match(await renderHTMLToString('<r-button>test</r-button>'), /shadowrootmode/);
assert.equal(typeof renderHTMLToString, 'function');
assert.equal(typeof insideShadow, 'function');
assert.equal(typeof require('ranui/button').Button, 'function');
assert.equal(typeof require('@alixex/ranview/static').Div, 'function');
assert.equal(require('ranuts').rgbToHex(1,2,3), '#010203');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
`,
  );
  run(process.execPath, ['runtime.cjs']);
  console.log('Packed libraries: CommonJS helper entry points execute their advertised functions');
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  await rm(fixture, { recursive: true, force: true });
}
