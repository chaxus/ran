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

/**
 * The values the design-system page shows match the theme.
 *
 * Naming every token was not enough: the gray-alpha table, the dark overrides and the focus
 * ring all drifted while every name stayed present. This compares what a reader copies:
 * each scale table's light and dark values, and the value cell of each token row.
 */
const LOCALE_PAGES = ['', 'cn', 'ja', 'es', 'pt', 'ko', 'de', 'fa']
  .map((dir) => resolve(RANUI, `../docs/${dir ? `${dir}/` : ''}src/ranui/design-system/index.md`))
  .filter((page) => existsSync(page));

/**
 * The first value each theme file gives a token.
 *
 * @param file A theme stylesheet.
 * @returns Token name to its declared value, whitespace collapsed.
 */
const values = (file: string): Map<string, string> => {
  const out = new Map<string, string>();
  const source = readFileSync(resolve(RANUI, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, name, value] of source.matchAll(/(--ran-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    if (!out.has(name!)) out.set(name!, value!.replace(/\s+/g, ' ').trim());
  }
  return out;
};
const light = values('theme/tokens.less');
const dark = values('theme/dark.less');
const HEX = /^#[0-9a-f]{3,8}$/i;
/** A value short enough to be written out exactly: a colour, a length, a duration, a curve. */
/** Compares values the way CSS reads them: no spaces, no case, `.04` is `0.04`. */
const squash = (value: string): string =>
  value
    .replace(/\s+/g, '')
    .toLowerCase()
    .replace(/(^|[^\d.])\.(\d)/g, '$10.$2');
const SIMPLE = /^(#[0-9a-f]{3,8}|-?[\d.]+(px|rem|em|s|ms|%)?|cubic-bezier\([^)]*\))$/i;

/**
 * Every disagreement between a page's tables and the theme.
 *
 * @param text The page's markdown.
 * @returns One line per wrong value.
 */
const drift = (text: string): string[] => {
  const found: string[] = [];
  let scale = '';
  for (const line of text.split('\n')) {
    const heading = /^#{2,4} .*`(--ran-[a-z-]+?)-\d+\.\.\d+`/.exec(line);
    if (heading) scale = heading[1]!;
    else if (line.startsWith('#')) scale = '';
    const cells = line.split('|').map((cell) => cell.trim());
    // A scale row: | 100 | `#light` | `#dark` |
    if (scale && /^\d+$/.test(cells[1] ?? '')) {
      const token = `${scale}-${cells[1]}`;
      const shown = [...line.matchAll(/`(#[0-9a-fA-F]{3,8})`/g)].map((match) => match[1]!.toLowerCase());
      const expected = [light.get(token), dark.get(token)];
      shown.forEach((value, i) => {
        const want = expected[i]?.toLowerCase();
        if (want && HEX.test(want) && value !== want)
          found.push(`${token} ${i ? 'dark' : 'light'}: ${value}, theme ${want}`);
      });
      continue;
    }
    // Token rows. A row may hold several `token | value` pairs (the spacing table does), show a
    // dark value as "`#hex` (dark)", or give light and dark shadows in two cells.
    cells.forEach((cell, i) => {
      const token = /^`(--ran-[a-z0-9-]+)`$/.exec(cell)?.[1];
      const want = token ? light.get(token) : undefined;
      if (!token || !want) return;
      const next = (cells[i + 1] ?? '').replace(/\s+/g, ' ');
      const plain = next.replace(/`/g, '');
      if (SIMPLE.test(want) && /^[-\d.#]/.test(plain.trim()) && !squash(plain).includes(squash(want)))
        found.push(`${token}: ${plain}, theme ${want}`);
      const referenced = [...want.matchAll(/var\((--ran-[a-z0-9-]+)/g)].map((match) => match[1]!);
      if (plain.includes('--ran-'))
        for (const name of referenced) if (!plain.includes(name)) found.push(`${token}: ${plain}, theme ${want}`);
      const darkShown = /`(#[0-9a-fA-F]{3,8})`\s*\(dark\)/.exec(line)?.[1];
      const darkWant = dark.get(token);
      if (darkShown && darkWant && HEX.test(darkWant) && darkShown.toLowerCase() !== darkWant.toLowerCase())
        found.push(`${token} dark: ${darkShown}, theme ${darkWant}`);
      if (/rgba?\(/.test(want)) {
        const shadows = [...line.matchAll(/`([^`]*rgba?\([^`]*)`/g)].map((match) => match[1]!);
        if (shadows[0] && squash(shadows[0]) !== squash(want)) found.push(`${token}: ${shadows[0]}, theme ${want}`);
        if (shadows[1] && darkWant && squash(shadows[1]) !== squash(darkWant))
          found.push(`${token} dark: ${shadows[1]}, theme ${darkWant}`);
      }
    });
    // Values written inline: "`--ran-text-heading-weight` (600)".
    for (const [, token, shown] of line.matchAll(/`(--ran-[a-z0-9-]+)`\s*\(([^)]+)\)/g)) {
      const want = light.get(token!);
      if (want && SIMPLE.test(want) && /^[-\d.#]/.test(shown!) && squash(shown!) !== squash(want))
        found.push(`${token}: (${shown}), theme ${want}`);
    }
  }
  return [...new Set(found)];
};

describe('the documented values match the theme', () => {
  it.each(LOCALE_PAGES.map((page) => [page.slice(page.indexOf('packages/')), page]))('%s', (label, page) => {
    const wrong = drift(readFileSync(page, 'utf8'));
    expect(wrong, `${label}:\n${wrong.join('\n')}`).toEqual([]);
  });
});
