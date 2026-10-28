import { describe, expect, it } from 'vitest';
import { parseRedirects, matchRedirect } from 'ranpress';
import { legacyRedirects, legacyUrl, movedRedirects, pageUrl, publicUrl, sourceUrl } from '../build/urls.ts';

describe('public URLs', () => {
  it.each([
    ['/src/ranui/button/', '/ranui/button/'],
    ['/src/ranuts/api', '/ranuts/api'],
    ['/cn/src/ranuts/choosing/', '/cn/ranuts/choosing/'],
    ['/fa/src/agents/', '/fa/agents/'],
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
    expect(pageUrl('src/ranuts/choosing/index.md', '')).toBe('/ranuts/choosing/');
    expect(pageUrl('index.md', 'de')).toBe('/de/');
  });

  it.each(['/ranui/button/', '/cn/ranuts/choosing/', '/design/', '/agents/', '/ko/ranuts/api'])(
    'maps %s back to the retired URL it replaces',
    (path) => {
      expect(publicUrl(legacyUrl(path)!)).toBe(path);
    },
  );

  it('has no retired URL for pages that never lived under src/', () => {
    expect(legacyUrl('/')).toBeNull();
    expect(legacyUrl('/cn/')).toBeNull();
    expect(legacyUrl('/assets/a.png')).toBeNull();
    expect(legacyUrl('/articles/doc_preview')).toBeNull();
  });
});

describe('legacy redirects', () => {
  const rules = parseRedirects(legacyRedirects().join('\n'));

  it.each([
    ['/src/ranui/button/', '/ranui/button/'],
    ['/de/src/ranuts/api', '/de/ranuts/api'],
    ['/src', '/'],
    ['/fa/src/', '/fa/'],
  ])('sends %s to %s in one rule', (from, to) => {
    expect(matchRedirect(rules, from)?.to).toBe(to);
  });
});

describe('pages moved to chaxus.com', () => {
  const rules = parseRedirects(legacyRedirects().join('\n'));

  it.each([
    ['/articles/doc_preview', 'https://chaxus.com/writing/doc_preview/'],
    ['/articles/doc_preview/', 'https://chaxus.com/writing/doc_preview/'],
    ['/articles/sort/', 'https://chaxus.com/writing/sort/'],
    ['/articles/sort/bubble/', 'https://chaxus.com/writing/sort/bubble/'],
    ['/articles/math/linear_algebra', 'https://chaxus.com/writing/math/linear_algebra/'],
    ['/notes/docker', 'https://chaxus.com/writing/docker/'],
    ['/cn/articles/ai/', 'https://chaxus.com/zh/writing/ai/'],
    ['/cn/notes/libreoffice2wasm', 'https://chaxus.com/zh/writing/libreoffice2wasm/'],
    ['/src/article/video', 'https://chaxus.com/writing/video/'],
    ['/cn/src/note/centos', 'https://chaxus.com/zh/writing/centos/'],
    ['/articles/', 'https://chaxus.com/writing/'],
    ['/articles', 'https://chaxus.com/writing/'],
    ['/cn/articles/', 'https://chaxus.com/zh/writing/'],
    ['/notes/', 'https://chaxus.com/writing/'],
    ['/articles/never-existed', 'https://chaxus.com/writing/'],
    ['/src/article/ai.html', 'https://chaxus.com/writing/ai/'],
    ['/cn/src/note/docker.html', 'https://chaxus.com/zh/writing/docker/'],
    ['/src/article/sort/index.html', 'https://chaxus.com/writing/sort/'],
    ['/src/article/index.html', 'https://chaxus.com/writing/'],
  ])('sends %s to %s in one rule', (from, to) => {
    expect(matchRedirect(rules, from)?.to).toBe(to);
  });

  it('ends every target in a slash, which chaxus.com serves without a further hop', () => {
    for (const rule of parseRedirects(movedRedirects().join('\n')))
      expect(rule.to).toMatch(/^https:\/\/chaxus\.com\/.*\/$/);
  });
});
