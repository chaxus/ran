import { packageManifest } from '../../../bin/tooling-json.ts';
/** Retain upstream material that minification removes from the standalone IIFEs. */
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(process.argv[2] ?? resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const upstream = join(root, 'node_modules/jschardet');
const manifest = packageManifest(JSON.parse(await readFile(join(upstream, 'package.json'), 'utf8')));
assert.equal(manifest.name, 'jschardet');
assert.equal(manifest.license, 'LGPL-2.1+', 'Review upstream license changes before bundling');
assert.ok(manifest.repository && typeof manifest.repository !== 'string', 'Missing upstream repository URL');
const license = await readFile(join(upstream, 'LICENSE'));
const headers = new Set();
for (const file of (await readdir(join(upstream, 'src'), { recursive: true })).sort()) {
  if (!file.endsWith('.js')) continue;
  const source = await readFile(join(upstream, 'src', file), 'utf8');
  const header = /^\s*(\/\*[\s\S]*?\*\/)/.exec(source)?.[1];
  if (header && /copyright/i.test(header)) headers.add(header);
}
assert.ok(headers.size > 0, 'Missing upstream copyright material');
const destination = join(root, 'dist/third-party/jschardet');
await mkdir(destination, { recursive: true });
await writeFile(join(destination, 'LICENSE.txt'), license);
await writeFile(
  join(destination, 'NOTICE.txt'),
  `jschardet@${manifest.version}\nLicense: ${manifest.license}\n` +
    `Upstream source: https://registry.npmjs.org/jschardet/-/jschardet-${manifest.version}.tgz\n` +
    `Repository: ${manifest.repository.url}\n\n${[...headers].join('\n\n')}\n`,
);
const banner =
  `/*! Bundled dependency: jschardet@${manifest.version} (${manifest.license}).\n` +
  ' * Copyright and full license: ../third-party/jschardet/NOTICE.txt and LICENSE.txt.\n */\n';
for (const file of ['index.iife.js', 'utils.iife.js']) {
  const path = join(root, 'dist/iife', file);
  const code = await readFile(path, 'utf8');
  await writeFile(path, banner + code.replace(/^\/\*! Bundled dependency:[\s\S]*?\*\/\n/, ''));
}
