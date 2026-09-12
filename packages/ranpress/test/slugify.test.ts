/**
 * The slug algorithm is VitePress's, character for character, and it has to stay that
 * way: the documentation site has 17,216 anchors in the wild — in its own cross-links,
 * in its outline, and in every deep link anyone has ever shared. A slugifier that is
 * merely *reasonable* silently changes all of them.
 *
 * Each case below is a difference that actually bit during the migration.
 */
import { describe, expect, it } from 'vitest';
import { slugify, stripCustomAnchor, truncate } from '../src/markdown.ts';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Quick Start')).toBe('quick-start');
  });

  it('strips combining marks after NFKD', () => {
    // Spanish, Portuguese and German headings are full of these; keeping the accent
    // gives every translated page a different anchor from the English one.
    expect(slugify('par\u00e2metros')).toBe('parametros');
    expect(slugify('w\u00e4hlen')).toBe('wahlen');
  });

  it('keeps CJK verbatim', () => {
    // Filtering it leaves the empty string, and every anchor on a Chinese page
    // collides into section-1, section-2…
    expect(slugify('\u670d\u52a1\u7aef\u6e32\u67d3')).toBe('\u670d\u52a1\u7aef\u6e32\u67d3');
  });

  it('keeps a zero-width non-joiner, which Persian headings need', () => {
    // The punctuation set is specific rather than "everything that is not a letter" —
    // the broader rule ate the ZWNJ and the anchor stopped matching its own heading.
    const persian = '\u0634\u06cc\u0648\u0647\u200c\u0647\u0627';
    expect(slugify(persian)).toBe(persian);
  });

  it('collapses runs of punctuation to a single hyphen and trims the ends', () => {
    expect(slugify('  a -- b!!  ')).toBe('a-b');
  });

  it('prefixes a leading digit, which cannot start a CSS identifier', () => {
    expect(slugify('2 ways')).toBe('_2-ways');
  });

  it('drops control characters', () => {
    expect(slugify('a\u0001b')).toBe('ab');
  });
});

describe('stripCustomAnchor', () => {
  it('removes a trailing explicit id', () => {
    expect(stripCustomAnchor('\u670d\u52a1\u7aef\u6e32\u67d3 {#server-rendering}')).toBe(
      '\u670d\u52a1\u7aef\u6e32\u67d3',
    );
  });

  it('leaves braces that are not a trailing anchor alone', () => {
    expect(stripCustomAnchor('use {#id} inline')).toBe('use {#id} inline');
    expect(stripCustomAnchor('a {not-an-id}')).toBe('a {not-an-id}');
  });

  it('removes the whitespace separating the heading from the marker', () => {
    expect(stripCustomAnchor('Heading \t {#id}')).toBe('Heading');
  });

  it('stays linear on a long run of whitespace', () => {
    // The pattern used to open with `\\s*`, which on this input matched the whole run,
    // failed at `{`, restarted one character later and matched almost all of it again —
    // quadratic, and reachable from any caller since this is a library.
    const started = performance.now();
    expect(stripCustomAnchor('\t'.repeat(60_000))).toBe('');
    expect(performance.now() - started).toBeLessThan(500);
  });
});

describe('truncate', () => {
  it('leaves short text alone', () => {
    expect(truncate('short', 20)).toBe('short');
  });

  it('cuts on a word boundary and marks the cut', () => {
    const out = truncate('one two three four five six seven eight nine ten', 20);
    expect(out.endsWith('…')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(20);
  });
});
