import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const english = 'README.md';
const translations = readdirSync(root).filter((name) => /^README\.[a-zA-Z-]+\.md$/.test(name));

const read = (name: string): string => readFileSync(join(root, name), 'utf8');
const sections = (text: string): number => text.match(/^## /gm)?.length ?? 0;
const fences = (text: string): string[] =>
  [...text.matchAll(/^```(\w*)\n([\s\S]*?)^```/gm)].map(([, lang, body]) => `${lang}:${body}`);
// The HTML example carries translated button text; every other block is a command or import.
const commands = (text: string): string[] => fences(text).filter((block) => !block.startsWith('html:'));
const localRefs = (text: string): string[] =>
  [...text.matchAll(/(?:\]\(|src="|srcset=")\.\/([^)"#]+)/g)]
    .map(([, path]) => path.replace(/README\.[a-zA-Z-]+\.md$/, 'README.md'))
    .sort();

// The translations once lost a whole section while the English README kept growing,
// and nothing noticed. They mirror its structure so a change to one shows up in all.
test('every translated README mirrors the English one', () => {
  assert.ok(translations.length > 0);
  const source = read(english);
  for (const name of translations) {
    const text = read(name);
    assert.equal(sections(text), sections(source), `${name}: section count`);
    assert.deepEqual(
      fences(text).map((block) => block.split(':')[0]),
      fences(source).map((block) => block.split(':')[0]),
      `${name}: code block languages`,
    );
    assert.deepEqual(commands(text), commands(source), `${name}: commands and imports`);
    assert.deepEqual(localRefs(text), localRefs(source), `${name}: local links and images`);
  }
});

test('every README links to every other language', () => {
  const all = [english, ...translations];
  for (const name of all) {
    const text = read(name);
    for (const other of all.filter((candidate) => candidate !== name)) {
      assert.ok(text.includes(`href="./${other}"`), `${name} does not link to ${other}`);
    }
  }
});
