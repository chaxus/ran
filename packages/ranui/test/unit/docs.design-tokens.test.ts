import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Every global design token has to be documented on the design-system page.
 *
 * The per-component tokens are generated (`style-tokens-public.md`) and freshness-gated,
 * so they cannot drift. The global ones -- the scales, the semantic layer, spacing, sizing,
 * typography, radius, elevation, stacking, motion, focus, skin -- are documented by hand,
 * and a hand-written catalogue is exactly the kind of document that is complete on the day
 * it is written and quietly wrong a month later. `--ran-size-*` was added as its own scale
 * and the page never learned about it; the sizing rule is machine-checked while the tokens
 * it points at were undocumented.
 *
 * The check is deliberately shallow: it asks whether the name appears, not whether the
 * prose around it is right. A name that appears in a table someone had to write is a name
 * someone looked at.
 */
const RANUI = resolve(__dirname, '../..');
const PAGES = [
  resolve(RANUI, '../docs/src/ranui/design-system/index.md'),
  resolve(RANUI, '../docs/cn/src/ranui/design-system/index.md'),
];

/** Token names declared in the theme, in source order. */
const declared = [
  ...new Set(
    [...readFileSync(resolve(RANUI, 'theme/tokens.less'), 'utf8').matchAll(/(--ran-[a-z0-9-]+)\s*:/g)].map(
      (match) => match[1],
    ),
  ),
];

/**
 * Whether a page documents a token.
 *
 * A ten-step scale is documented as `--ran-gray-100..1000` in the heading above its table
 * rather than repeated ten times in prose, so range notation counts for every step it spans.
 * Anything else has to appear literally.
 *
 * @param page The page's text.
 * @param token The token name.
 * @returns Whether the page names it.
 */
const documents = (page: string, token: string): boolean => {
  if (page.includes(token)) return true;
  const step = /^(--ran-[a-z-]+?)-(\d+)$/.exec(token);
  if (!step) return false;
  const [, prefix, value] = step;
  const ranges = page.matchAll(new RegExp(`${prefix}-(\\d+)\\.\\.(\\d+)`, 'g'));
  return [...ranges].some(([, from, to]) => Number(value) >= Number(from) && Number(value) <= Number(to));
};

describe('every global design token is documented', () => {
  it('finds the theme and the pages (sanity)', () => {
    expect(declared.length).toBeGreaterThan(100);
    for (const page of PAGES) expect(existsSync(page), `${page} is missing`).toBe(true);
  });

  it.each(PAGES.map((page) => [page.slice(page.indexOf('packages/')), page]))('%s', (label, page) => {
    const text = readFileSync(page, 'utf8');
    const missing = declared.filter((token) => !documents(text, token));
    expect(missing, `${label} does not document: ${missing.join(', ')}`).toEqual([]);
  });
});
