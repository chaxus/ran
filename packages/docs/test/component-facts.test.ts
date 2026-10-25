import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { componentFacts } from '../build/component-facts.ts';
import { LOCALES, ROOT_LOCALE } from '../build/langs/locales.ts';

const facts = componentFacts(resolve(import.meta.dirname, '..'));
const cn = LOCALES.find((locale) => locale.dir === 'cn')!;

it("leads with the page's own element and opens its API entry", () => {
  const html = facts('src/ranui/select/index.md', ROOT_LOCALE);
  expect(html.indexOf('&lt;r-select&gt;')).toBeLessThan(html.indexOf('&lt;r-option&gt;'));
  expect(html).toContain('href="/ranui/api#r-select"');
  expect(html).toContain('href="/ranui/style-tokens#select"');
  expect(html).toContain('packages/ranui/components/select/');
});

it("links to the reader's own language", () => {
  const html = facts('src/ranui/button/index.md', cn);
  expect(html).toContain('href="/cn/ranui/api#r-button"');
  expect(html).toContain('>源码<');
});

it.each(['src/ranui/theme/index.md', 'src/ranui/index.md', 'src/ranuts/index.md', 'src/design/index.md'])(
  'adds nothing to %s, which documents no single element',
  (page) => expect(facts(page, ROOT_LOCALE)).toBe(''),
);
