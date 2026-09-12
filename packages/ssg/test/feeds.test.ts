/**
 * The feed builders are where a wrong value is least visible: a malformed sitemap is
 * still valid XML, and a reader handed an ISO date just files the item under 1970.
 */
import { describe, expect, it } from 'vitest';
import { renderFeed, renderRobotsTxt, renderSitemap, xmlEscape } from '../src/feeds.ts';

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

describe('renderFeed', () => {
  const feed = (items: Parameters<typeof renderFeed>[0]['items']) =>
    renderFeed({ title: 'T', origin: 'https://x', description: 'D', lang: 'zh-CN', items });

  it('writes pubDate in RFC-822, not ISO', () => {
    // A reader handed an ISO date either drops the item or files it under 1970.
    const xml = feed([{ title: 'a', url: 'https://x/a', date: '2026-09-08', description: 'd' }]);
    expect(xml).toContain('<pubDate>Tue, 08 Sep 2026 00:00:00 GMT</pubDate>');
    expect(xml).not.toContain('2026-09-08T');
  });

  it('emits a category per tag and none when there are none', () => {
    expect(
      feed([{ title: 'a', url: 'https://x/a', date: '2026-01-01', description: 'd', categories: ['p', 'q'] }]).match(
        /<category>/g,
      ),
    ).toHaveLength(2);
    expect(feed([{ title: 'a', url: 'https://x/a', date: '2026-01-01', description: 'd' }])).not.toContain(
      '<category>',
    );
  });

  it('is well-formed with no items', () => {
    const xml = feed([]);
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</rss>');
  });
});

describe('renderRobotsTxt', () => {
  it('allows training crawlers on purpose and points at the sitemap', () => {
    const txt = renderRobotsTxt('https://x');
    expect(txt).toContain('User-agent: ClaudeBot');
    expect(txt).toContain('User-agent: GPTBot');
    expect(txt).toContain('Sitemap: https://x/sitemap.xml');
  });
});
