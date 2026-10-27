import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { slugify } from 'ranpress';
import { DESIGN_ASSETS, designReferenceMarkdown, designSectionLink } from '../build/design-reference.ts';
import { LOCALES, localeHref } from '../build/langs/locales.ts';

const DESIGN = resolve(import.meta.dirname, '../../../design');
const cn = LOCALES.find((l) => l.dir === 'cn')!;
const ja = LOCALES.find((l) => l.dir === 'ja')!;

describe('the Ran Design guide page', () => {
  it('keeps readers on the site and sends unpublished files to GitHub', () => {
    const page = designReferenceMarkdown(DESIGN, 'DESIGN.md');
    expect(page).not.toMatch(/\]\(\.\/[A-Z_]+\.md/);
    expect(page).toContain('https://github.com/chaxus/ran/blob/main/design/DESIGN.md');
  });

  it.each([undefined, cn])('serves every figure from the copied assets (%s)', (locale) => {
    const page = designReferenceMarkdown(DESIGN, 'DESIGN.md', undefined, locale);
    const figures = [...page.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]!);
    expect(figures.length).toBeGreaterThan(0);
    for (const src of figures) {
      expect(src.startsWith(`${DESIGN_ASSETS}/`), src).toBe(true);
      expect(existsSync(resolve(DESIGN, 'assets', src.slice(DESIGN_ASSETS.length + 1))), src).toBe(true);
    }
  });

  it('names the page after itself, not the shared document name', () => {
    expect(designReferenceMarkdown(DESIGN, 'DESIGN.md').match(/^# (.+)$/m)?.[1]).toBe('Design checklist');
    expect(designReferenceMarkdown(DESIGN, 'DESIGN.md', undefined, cn).match(/^# (.+)$/m)?.[1]).toBe('设计检查清单');
  });

  it('links a section in the reader’s language where a translation exists, in English otherwise', () => {
    const headings = new Set(
      [...designReferenceMarkdown(DESIGN, 'DESIGN.md', undefined, cn).matchAll(/^#{1,6} (.+)$/gm)].map((m) =>
        slugify(m[1]!),
      ),
    );
    const translated = designSectionLink(DESIGN, 'Interaction', cn);
    expect(translated.label).toBe('交互');
    expect(headings.has(translated.link.split('#')[1]!)).toBe(true);
    expect(localeHref(translated.link, cn)).toBe(`/cn${translated.link}`);

    const english = designSectionLink(DESIGN, 'Interaction', ja);
    expect(english).toEqual({ link: '/src/design/guide#interaction', label: 'Interaction' });
    expect(localeHref(english.link, ja)).toBe(english.link);
    expect(() => designSectionLink(DESIGN, 'No such section', cn)).toThrow();
  });
});
