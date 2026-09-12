/**
 * The tokenizer is the part of search that is ours, and the part that fails silently.
 *
 * MiniSearch splits on spaces and punctuation. That is right for English and useless for
 * Chinese, Japanese and Korean: a sentence with no spaces becomes one token, so a query
 * for a word inside it matches nothing — and nothing errors, the search box just returns
 * no results forever.
 */
import { describe, expect, it } from 'vitest';
import { buildIndex, tokenize } from '../src/search.ts';

describe('tokenize', () => {
  it('lowercases Latin words and splits on punctuation', () => {
    expect(tokenize('Theme Switch, now!')).toEqual(['theme', 'switch', 'now']);
  });

  it('emits bigrams for CJK so a query can match inside a run', () => {
    expect(tokenize('\u670d\u52a1\u7aef\u6e32\u67d3')).toEqual([
      '\u670d\u52a1',
      '\u52a1\u7aef',
      '\u7aef\u6e32',
      '\u6e32\u67d3',
    ]);
  });

  it('handles a lone CJK character', () => {
    expect(tokenize('\u597d')).toEqual(['\u597d']);
  });

  it('splits a mixed chunk into both its Latin and its CJK parts', () => {
    const out = tokenize('ranui\u7ec4\u4ef6');
    expect(out).toContain('ranui');
    expect(out).toContain('\u7ec4\u4ef6');
  });

  it('covers Japanese and Korean, not only Han', () => {
    expect(tokenize('\u30b5\u30fc\u30d0\u30fc').length).toBeGreaterThan(1);
    expect(tokenize('\uc11c\ubc84\ub80c\ub354\ub9c1').length).toBeGreaterThan(1);
  });

  it('returns nothing for empty or whitespace-only input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('buildIndex', () => {
  const pages = [
    {
      url: '/a',
      title: 'Alpha',
      sections: [
        { slug: '', title: '', text: 'the lead paragraph about buttons' },
        { slug: 'usage', title: 'Usage', text: 'rendering works here' },
        { slug: 'empty', title: '', text: '' },
      ],
    },
  ];

  it('indexes one document per section and drops the empty one', () => {
    expect(JSON.parse(buildIndex(pages)).documentCount).toBe(2);
  });

  it('anchors a section to its slug and the lead to the page itself', () => {
    const json = buildIndex(pages);
    expect(json).toContain('/a#usage');
    expect(json).toContain('"/a"');
  });

  it('stores a capped preview rather than the whole body', () => {
    // The body is the bulk of an index every reader downloads to search once; storing
    // all of it roughly doubles the file. Assert on the stored field rather than on the
    // JSON as a whole — the indexed terms legitimately contain the full text too.
    const long = 'x'.repeat(400);
    const parsed = JSON.parse(
      buildIndex([{ url: '/b', title: 'B', sections: [{ slug: '', title: '', text: long }] }]),
    ) as { storedFields: Record<string, { preview: string }> };
    const previews = Object.values(parsed.storedFields).map((f) => f.preview);
    expect(previews).toHaveLength(1);
    expect(previews[0]).toHaveLength(220);
  });
});
