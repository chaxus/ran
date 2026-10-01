import { describe, expect, it } from 'vitest';
// @ts-expect-error jsdom has no bundled type declarations.
import { JSDOM } from 'jsdom';
import { renderDoc } from '../build/page.ts';
import { headFor } from '../build/seo.ts';
import { LOCALES, ROOT_LOCALE } from '../build/config.ts';
import type { DocPage } from '../build/content.ts';
import { BD_ANALYSE, GOOGLE_ANALYSE, PREVIEW_CODE, SERVICE_WORK, SET_FONT_SIZE } from '../build/common/index.ts';

const pageFor = (overrides: Partial<DocPage> = {}): DocPage => ({
  kind: 'page',
  file: 'src/ranui/button/index.md',
  locale: ROOT_LOCALE,
  baseRel: 'src/ranui/button/index.md',
  url: '/src/ranui/button/',
  outFile: 'src/ranui/button/index.html',
  title: 'Title <b> & "',
  description: 'Description <img src=x> & "',
  html: '<h2 id="usage">Trusted <code>&lt;tag&gt;</code></h2><pre><code>a &lt; b &amp;&amp; c</code></pre>',
  toc: [
    { level: 2, slug: 'usage', text: '<img src=x> & "' },
    { level: 3, slug: 'example & "', text: 'Example' },
  ],
  sections: [],
  ...overrides,
});
const render = (page: DocPage, urls = new Set([page.url])) => {
  const head = headFor(page, { pages: [page], urls } as any);
  return new JSDOM(
    renderDoc({ page, head, urls, assets: { css: ['/style.css?x="&y=<'], js: ['/app.js?x="&y=<'] } as any }),
  ).window.document;
};

describe('static document rendering', () => {
  it('escapes text and attributes while preserving trusted Markdown and exact script source', () => {
    const page = pageFor();
    const doc = render(page);
    expect(doc.title).toBe(`${page.title} | ran`);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(page.description);
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(`${page.title} | ran`);
    expect(doc.querySelector('.toc__link')?.textContent).toBe(page.toc[0].text);
    expect(doc.querySelector('.toc img')).toBeNull();
    expect(doc.querySelector('article')?.innerHTML).toBe(page.html);
    expect(doc.querySelector('link[rel="stylesheet"]')?.getAttribute('href')).toBe('/style.css?x="&y=<');
    expect(doc.querySelector('script[type="module"]')?.getAttribute('src')).toBe('/app.js?x="&y=<');
    const scripts = [...doc.querySelectorAll('script:not([src])')].map((script) => script.textContent);
    expect(scripts.slice(1)).toEqual([SET_FONT_SIZE, PREVIEW_CODE, GOOGLE_ANALYSE, BD_ANALYSE, SERVICE_WORK]);
    expect(scripts[0]).toContain("if(t==='dark'||t==='light')");
    expect(doc.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('renders mobile and desktop outlines separately and keeps the active sidebar group open', () => {
    const doc = render(pageFor());
    expect(doc.querySelectorAll('.mobile-toc .toc__list')).toHaveLength(1);
    expect(doc.querySelectorAll('aside.toc .toc__list')).toHaveLength(1);
    expect(doc.querySelector('.mobile-toc .toc__label')).toBeNull();
    const active = doc.querySelector('.sidebar a[aria-current="page"]');
    expect(active).not.toBeNull();
    for (let parent = active?.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') expect(parent.hasAttribute('open')).toBe(true);
    }
  });

  it('omits short outlines and unavailable language alternatives and renders locale landing pages', () => {
    for (const locale of LOCALES) {
      const url = locale.dir ? `/${locale.dir}/` : '/';
      const page = pageFor({ locale, baseRel: 'index.md', url, toc: [pageFor().toc[0]] });
      const doc = render(page);
      expect(doc.documentElement.lang).toBe(locale.lang);
      expect(doc.documentElement.getAttribute('dir')).toBe(locale.rtl ? 'rtl' : null);
      expect(doc.querySelector('.landing')).not.toBeNull();
      expect(doc.querySelector('.langs')).toBeNull();
      expect(doc.querySelector('.toc, .mobile-toc')).toBeNull();
      expect(doc.querySelector('link[rel="alternate"][hreflang]')?.getAttribute('hreflang')).toBe(locale.lang);
    }
  });

  it('keeps a not-found page out of indexing and canonical alternatives', () => {
    const tags = headFor(pageFor({ kind: 'notfound' }), { urls: new Set() } as any);
    const doc = new JSDOM(`<head>${tags.join('')}</head>`).window.document;
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, follow');
    expect(doc.querySelector('link')).toBeNull();
  });
});
