// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { LOCALES, localeHref } from '../build/langs/locales.ts';
import { navFor, secondaryNavFor } from '../build/nav.ts';
import { renderHome } from '../build/components.ts';
import { publicUrl } from '../build/urls.ts';

it.each(LOCALES)('makes all three pillars and agent guidance reachable in $lang without JavaScript', (locale) => {
  document.body.innerHTML = renderHome(locale);
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map((link) => link.getAttribute('href'));
  const navigation = navFor(locale);
  const secondary = secondaryNavFor(locale);
  const pillars = [...document.querySelectorAll<HTMLAnchorElement>('.pillar')].map((link) => ({
    title: link.querySelector('h3')?.textContent,
    href: link.getAttribute('href'),
  }));
  expect(pillars).toEqual([
    { title: 'Ran Design', href: publicUrl(localeHref('/design/', locale)) },
    { title: 'ranui', href: publicUrl(localeHref('/ranui/', locale)) },
    { title: 'ranuts', href: publicUrl(localeHref('/ranuts/', locale)) },
  ]);
  for (const section of ['design', 'ranui', 'ranuts', 'agents']) {
    const path = publicUrl(localeHref(`/${section}/`, locale));
    expect(path).not.toContain('/src/');
    expect(links, `${locale.lang}: home → ${section}`).toContain(path);
    const entry = navigation.find((item) => item.link === path);
    expect(entry?.text.trim(), `${locale.lang}: navigation → ${section}`).toBeTruthy();
    expect(new RegExp(entry!.activeMatch!).test(path)).toBe(true);
    expect(existsSync(resolve(import.meta.dirname, '..', locale.dir, 'src', section, 'index.md'))).toBe(true);
  }
  const examples = publicUrl(localeHref('/examples/', locale));
  expect(examples).not.toContain('/src/');
  expect(
    secondary.find((item) => item.link === examples)?.text.trim(),
    `${locale.lang}: secondary nav → examples`,
  ).toBeTruthy();
  expect(existsSync(resolve(import.meta.dirname, '..', locale.dir, 'src', 'examples', 'index.md'))).toBe(true);
});

it('leads the installation guide with the published commands and keeps the checkout preview', () => {
  const guide = readFileSync(resolve(import.meta.dirname, '../src/agents/index.md'), 'utf8');
  expect(guide).not.toContain('After publication');
  expect(guide).toContain('codex plugin marketplace add chaxus/ran');
  expect(guide).toContain('claude plugin marketplace add chaxus/ran');
  expect(guide).toContain('with `.` in place of `chaxus/ran` from the repository root');
  expect(guide).toContain('codex plugin add ran@ran');
  expect(guide).toContain('claude plugin install ran@ran');
  expect(guide).toContain('`$design`');
  expect(guide).toContain('`/ran:design`');
  expect(guide).not.toContain('ranui@ran');
});
