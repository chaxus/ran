import { expect, it } from 'vitest';
import { LOCALES } from '../build/langs/locales.ts';
import { homeCopy } from '../build/langs/home-copy.ts';
import { pageTitle } from '../build/seo.ts';
import { renderArticleIndex, renderHome } from '../build/components.ts';
import type { DocPage } from '../build/content.ts';

const page = (baseRel: string, locale: (typeof LOCALES)[number], title = 'ran') =>
  ({ baseRel, locale, title }) as unknown as DocPage;

it.each(LOCALES)('the $lang home is titled with what ran is, not "ran | ran"', (locale) => {
  expect(pageTitle(page('index.md', locale))).toBe(`ran — ${homeCopy(locale.dir).headline}`);
});

it('any other page leads with its own title', () => {
  expect(pageTitle(page('src/ranui/button/index.md', LOCALES[0]!, 'Button'))).toBe('Button | ran');
});

it('the home headline keeps the spaces between its words', () => {
  const english = LOCALES.find((locale) => locale.dir === '')!;
  const h1 = /<h1[\s\S]*?<\/h1>/.exec(renderHome(english))![0].replace(/<[^>]+>/g, '');
  expect(h1).toBe(homeCopy('').headline);
});

it('the article index lists every article, nested groups included', () => {
  const english = LOCALES.find((locale) => locale.dir === '')!;
  const html = renderArticleIndex(english);
  expect(html).toContain('href="/articles/doc_preview"');
  expect(html).toContain('href="/articles/sort/bubble/"');
  expect(html).toContain('href="/notes/docker"');
});
