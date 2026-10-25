import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { LOCALES } from '../build/langs/locales.ts';
import { homeCopy } from '../build/langs/home-copy.ts';

/**
 * The component count the site states is the count the generated API reference documents.
 *
 * The number is written by hand into the home page in eight languages and into the sidebar
 * label; the generated reference is the one place it cannot drift.
 */
const documented = [
  ...readFileSync(resolve(__dirname, '../../ranui/docs/COMPONENTS.md'), 'utf8').matchAll(/^## `<r-[a-z-]+>`/gm),
].length;
const persian = (n: number) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!);
const states = (text: string) => text.includes(String(documented)) || text.includes(persian(documented));

it('documents at least one element', () => expect(documented).toBeGreaterThan(0));

it.each(LOCALES)('states the documented element count on the $lang home page', (locale) => {
  const copy = homeCopy(locale.dir);
  expect(copy.stats[0]!.num).toBe(String(documented));
  expect(states(copy.pillars[0]!.desc), copy.pillars[0]!.desc).toBe(true);
});

it.each(LOCALES)('states the documented element count in the $lang API sidebar label', (locale) => {
  const file = locale.dir === '' ? 'en' : locale.dir;
  const source = readFileSync(resolve(__dirname, `../build/langs/messages/${file}.ts`), 'utf8');
  const label = /element_api_all_\d+_elements: '([^']+)'/.exec(source)?.[1] ?? '';
  expect(states(label), label).toBe(true);
});
