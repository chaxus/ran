import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Private symbols named in the docs have to still exist in the source.
 *
 * Generated docs (COMPONENTS.md, the token tables, ranuts' API.md) are checked
 * in CI, so they cannot drift. Hand-written ones had nothing watching them, and
 * that is where drift showed up: moving `_attachReposition` out of r-select and
 * r-popover into the shared floating controller left DESIGN.md and CLAUDE.md
 * both pointing at a symbol with zero hits in the source, as the example of how
 * to keep a portaled panel with its anchor. Nothing said so -- the guidance just
 * quietly stopped being true.
 *
 * Only underscore-prefixed identifiers, because that is the one pattern with no
 * false positives here: in this codebase a leading underscore means a private
 * field or method, so a doc naming one is making a claim about the
 * implementation. Wider rules were measured and rejected -- PascalCase in
 * backticks turns up DOM exception names (`NotSupportedError`), tool names
 * (`Vitest`), font names (`SimHei`), section headings on the docs index
 * (`Radar`), and deliberate references to things that were *removed*
 * (`RanThemePackName`, in a sentence explaining that they no longer exist);
 * `foo()` turns up Playwright matchers and ranuts APIs re-exported from here.
 * A rule that needs a growing allowlist stops being a rule.
 *
 * So this does not catch everything. It does not know that a paragraph
 * describing behaviour has gone stale, and it does not cover renamed constants
 * that were never private. It catches the one class of drift that is decidable,
 * and it costs nothing to keep.
 */
const RANUI = resolve(__dirname, '../..');
const SITE = resolve(RANUI, '../docs');

const walk = (dir: string, ext: string, out: string[] = []): string[] => {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, ext, out);
    else if (name.endsWith(ext)) out.push(path);
  }
  return out;
};

/** Every hand-written doc that talks about this library. */
const docs = [
  resolve(RANUI, 'CLAUDE.md'),
  ...walk(resolve(RANUI, 'docs'), '.md'),
  ...walk(resolve(SITE, 'src/ranui'), '.md'),
  ...walk(resolve(SITE, 'cn/src/ranui'), '.md'),
].filter(
  (file) =>
    existsSync(file) &&
    // A changelog's job is to name what changed, including what was removed.
    !file.endsWith('CHANGELOG.md'),
);

const source = [
  ...walk(resolve(RANUI, 'components'), '.ts'),
  ...walk(resolve(RANUI, 'utils'), '.ts'),
  ...walk(resolve(RANUI, 'testing'), '.ts'),
]
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

describe('docs reference symbols that exist', () => {
  it('finds the docs and the source (sanity)', () => {
    expect(docs.length).toBeGreaterThan(20);
    expect(source.length).toBeGreaterThan(10_000);
  });

  it.each(docs.map((file) => [relative(RANUI, file), file]))('%s', (label, file) => {
    const referenced = [
      ...new Set([...readFileSync(file, 'utf8').matchAll(/`(_[A-Za-z][A-Za-z0-9_]*)`/g)].map((m) => m[1])),
    ];
    for (const symbol of referenced) {
      expect(
        new RegExp(`\\b${symbol}\\b`).test(source),
        `${label} names \`${symbol}\`, which no longer exists in the source. ` +
          `Either the symbol moved (point the doc at where it lives now) or it is gone (rewrite the guidance).`,
      ).toBe(true);
    }
  });
});
