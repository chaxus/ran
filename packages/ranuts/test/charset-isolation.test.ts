import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { build, type Rolldown } from 'vite';

const utils = resolve(__dirname, '../src/utils/index.ts');
// A string jschardet keeps in its minified output (its supported charset table).
const DETECTOR = 'windows-1255';

let dir = '';
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'ranuts-charset-'));
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

/** Bundle a consumer of `ranuts/utils` the way an app build would, and return the emitted code. */
async function bundle(name: string, source: string): Promise<string> {
  const entry = join(dir, `${name}.ts`);
  await writeFile(entry, source.replaceAll('UTILS', JSON.stringify(utils)));
  const result = (await build({
    configFile: false,
    logLevel: 'silent',
    build: { write: false, minify: true, lib: { entry, formats: ['es'], fileName: name } },
  })) as Rolldown.RolldownOutput[];
  return result
    .flatMap((output) => output.output)
    .map((chunk) => (chunk.type === 'chunk' ? chunk.code : ''))
    .join('\n');
}

it('consumers of the string helpers do not ship the charset detector', async () => {
  const code = await bundle(
    'codec',
    `import { MessageCodec, getRandomString, slugify } from UTILS;
     export const run = () => [MessageCodec, getRandomString(4), slugify('a b')];`,
  );
  expect(code).not.toContain(DETECTOR);
}, 60_000);

it('consumers of charset sniffing still get the detector', async () => {
  const code = await bundle(
    'sniff',
    `import { checkEncoding } from UTILS;
     export const run = (bytes: Uint8Array) => checkEncoding(bytes);`,
  );
  expect(code).toContain(DETECTOR);
}, 60_000);
