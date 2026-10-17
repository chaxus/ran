/** Verify the tarball in a consumer with no repository paths or skipLibCheck. Build first. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const fixture = await mkdtemp(join(tmpdir(), 'ranuts-consumer-'));
const run = (command, args, cwd = fixture) => execFileSync(command, args, { cwd, stdio: 'pipe' });

try {
  const packed = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', fixture], root))[0];
  const installed = join(fixture, 'node_modules', 'ranuts');
  await mkdir(installed, { recursive: true });
  run('tar', ['-xzf', join(fixture, packed.filename), '--strip-components=1', '-C', installed]);
  await symlink(join(root, 'node_modules', '@types'), join(fixture, 'node_modules', '@types'), 'junction');
  await writeFile(join(fixture, 'package.json'), '{"type":"module"}');
  await writeFile(
    join(fixture, 'consumer.mts'),
    `
import { rgbToHex, type RGB } from 'ranuts';
import { debounce } from 'ranuts/utils';
import { Server, Router, writeFile } from 'ranuts/node';
import { I18nCore } from 'ranuts/i18n';
import * as stream from 'ranuts/stream';
import * as conversation from 'ranuts/conversation';
import * as sw from 'ranuts/sw';
import * as vnode from 'ranuts/vnode';
import * as visual from 'ranuts/visual';
const pixel: RGB = [1, 2, 3];
const result: string = rgbToHex(...pixel);
// @ts-expect-error Published color types must not degrade to any.
const invalid: RGB = 42;
void [result, invalid, debounce, Server, Router, writeFile, I18nCore, stream, conversation, sw, vnode, visual];
`,
  );
  const tsc = join(dirname(require.resolve('typescript/package.json')), 'bin', 'tsc');
  for (const [module, resolution] of [
    ['ESNext', 'Bundler'],
    ['NodeNext', 'NodeNext'],
  ]) {
    run(process.execPath, [
      tsc,
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      'false',
      '--target',
      'ES2022',
      '--module',
      module,
      '--moduleResolution',
      resolution,
      '--types',
      'node',
      'consumer.mts',
    ]);
    console.log(`ranuts tarball: ${resolution} consumer types passed`);
  }
  await writeFile(
    join(fixture, 'browser.mts'),
    `
import { rgbToHex, type RGB } from 'ranuts';
import * as visual from 'ranuts/visual';
import * as vnode from 'ranuts/vnode';
const pixel: RGB = [1, 2, 3];
const result: string = rgbToHex(...pixel);
void [result, visual, vnode];
`,
  );
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
  console.log('ranuts tarball: browser consumer types passed without Node ambient types');
  await writeFile(
    join(fixture, 'runtime.mjs'),
    `
import assert from 'node:assert/strict';
import { rgbToHex } from 'ranuts';
import { Server } from 'ranuts/node';
assert.equal(rgbToHex(1, 2, 3), '#010203');
assert.equal(typeof new Server().listen, 'function');
`,
  );
  run(process.execPath, ['runtime.mjs']);
  run(process.execPath, ['-e', "require('node:assert/strict').equal(require('ranuts').rgbToHex(1,2,3),'#010203')"]);
  console.log('ranuts tarball: ESM and CommonJS runtime imports passed');

  // Ensure the input was the packed package, rather than a workspace source alias.
  assert.equal(JSON.parse(await readFile(join(installed, 'package.json'), 'utf8')).name, 'ranuts');
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  await rm(fixture, { recursive: true, force: true });
}
