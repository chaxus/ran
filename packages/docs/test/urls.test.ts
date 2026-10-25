import { describe, expect, it } from 'vitest';
import { parseRedirects, matchRedirect } from 'ranpress';
import { legacyRedirects, legacyUrl, pageUrl, publicUrl, sourceUrl } from '../build/urls.ts';

describe('public URLs', () => {
  it.each([
    ['/src/ranui/button/', '/ranui/button/'],
    ['/src/ranuts/api', '/ranuts/api'],
    ['/cn/src/article/doc_preview', '/cn/articles/doc_preview'],
    ['/fa/src/note/docker', '/fa/notes/docker'],
    ['/src/', '/'],
    ['/src', '/'],
    ['/ja/src', '/ja/'],
  ])('publishes %s at %s', (source, published) => {
    expect(publicUrl(source)).toBe(published);
  });

  it.each(['/', '/assets/a.png', '/search/en.json', '/xx/src/ranui/', '/srcs/a'])('leaves %s alone', (path) => {
    expect(publicUrl(path)).toBe(path);
  });

  it('derives a page URL from its source path and locale', () => {
    expect(sourceUrl('src/ranui/index.md', 'ko')).toBe('/ko/src/ranui/');
    expect(pageUrl('src/ranui/index.md', 'ko')).toBe('/ko/ranui/');
    expect(pageUrl('src/article/sort/index.md', '')).toBe('/articles/sort/');
    expect(pageUrl('index.md', 'de')).toBe('/de/');
  });

  it.each(['/ranui/button/', '/cn/articles/doc_preview', '/design/', '/agents/', '/notes/docker'])(
    'maps %s back to the retired URL it replaces',
    (path) => {
      expect(publicUrl(legacyUrl(path)!)).toBe(path);
    },
  );

  it('has no retired URL for pages that never lived under src/', () => {
    expect(legacyUrl('/')).toBeNull();
    expect(legacyUrl('/cn/')).toBeNull();
    expect(legacyUrl('/assets/a.png')).toBeNull();
  });
});

describe('legacy redirects', () => {
  const rules = parseRedirects(legacyRedirects().join('\n'));

  it.each([
    ['/src/ranui/button/', '/ranui/button/'],
    ['/src/article/', '/articles/'],
    ['/src/article/sort/', '/articles/sort/'],
    ['/src/article', '/articles'],
    ['/de/src/ranuts/api', '/de/ranuts/api'],
    ['/cn/src/note/docker', '/cn/notes/docker'],
    ['/src', '/'],
    ['/fa/src/', '/fa/'],
  ])('sends %s to %s in one rule', (from, to) => {
    expect(matchRedirect(rules, from)?.to).toBe(to);
  });
});
