/**
 * The feed builders are where a wrong value is least visible: a malformed sitemap is
 * still valid XML, and a reader handed an ISO date just files the item under 1970.
 */
import { describe, expect, it } from 'vitest';
import { renderSitemap, xmlEscape } from '../src/feeds.ts';

describe('xmlEscape', () => {
  it('escapes ampersands first so entities are not double-escaped', () => {
    expect(xmlEscape('a & <b> "c" \'d\'')).toBe('a &amp; &lt;b&gt; &quot;c&quot; &apos;d&apos;');
  });
});

describe('renderSitemap', () => {
  it('emits one url per entry and omits absent optional fields', () => {
    const xml = renderSitemap([{ loc: 'https://x/a' }, { loc: 'https://x/b', lastmod: '2026-01-02', priority: '0.8' }]);
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>');
    // The first entry has neither, and must not emit empty elements for them.
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
    expect(xml.match(/<priority>/g)).toHaveLength(1);
  });

  it('escapes a URL containing an ampersand', () => {
    expect(renderSitemap([{ loc: 'https://x/a?b=1&c=2' }])).toContain('b=1&amp;c=2');
  });
});
