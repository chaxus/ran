/**
 * Every name the README says you can import has to actually be exported.
 *
 * The README arrived here as ranui's `BUILDER.md` and its import lines were rewritten
 * from `ranui/builder` to `ranvi` mechanically. A rewrite like that cannot introduce a
 * wrong *path*, but nothing was checking the *names* — and a manual that tells a reader
 * to import something that does not exist is worse than no manual, because they will
 * assume they are holding it wrong.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as ranvi from '../src/index.ts';

const readme = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../README.md'), 'utf8');

/** `import { a, b } from 'ranvi'` → ['a', 'b'], comments and type-only names removed. */
const importedNames = (): string[] => {
  const names = new Set<string>();
  for (const block of readme.matchAll(/import\s*\{([^}]*)\}\s*from\s*'ranvi'/g)) {
    for (const raw of block[1].split(',')) {
      const name = raw
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim();
      if (name && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
  }
  return [...names].sort();
};

describe('README', () => {
  it('names enough imports to be worth checking (sanity)', () => {
    expect(importedNames().length).toBeGreaterThan(10);
  });

  it.each(importedNames())('exports %s', (name) => {
    // Types vanish at runtime, so a missing name is only a failure if it is not one.
    const isType = new RegExp(`import\\s+type[^}]*\\b${name}\\b|\\btype\\s+${name}\\b`).test(readme);
    if (isType) return;
    expect(Object.hasOwn(ranvi, name), `README imports { ${name} } from 'ranvi'`).toBe(true);
  });
});
