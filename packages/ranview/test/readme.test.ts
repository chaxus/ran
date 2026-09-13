/**
 * Every name the README says you can import has to actually be exported.
 *
 * The README arrived here as ranui's `BUILDER.md` and its import lines were rewritten
 * from `ranui/builder` to `ranview` mechanically. A rewrite like that cannot introduce a
 * wrong *path*, but nothing was checking the *names* — and a manual that tells a reader
 * to import something that does not exist is worse than no manual, because they will
 * assume they are holding it wrong.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as ranview from '../src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const readme = readFileSync(resolve(here, '../README.md'), 'utf8');

/** `import { a, b } from '@chaxus/ranview'` → ['a', 'b'], comments and type-only names removed. */
const importedNames = (): string[] => {
  const names = new Set<string>();
  // The specifier is read from package.json rather than written here: the last two renames
  // each moved it, and a parser that hard-codes the old one silently matches nothing and
  // reports success on an empty set. The sanity check below is what caught that.
  const self = JSON.parse(readFileSync(resolve(here, '../package.json'), 'utf8')).name as string;
  const pattern = new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*'${self.replace('/', '\\/')}'`, 'g');
  for (const block of readme.matchAll(pattern)) {
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
    expect(Object.hasOwn(ranview, name), `README imports { ${name} } from '@chaxus/ranview'`).toBe(true);
  });
});
