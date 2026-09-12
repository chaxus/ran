/**
 * The frontmatter parser is deliberately not YAML — it supports a documented subset and
 * throws on everything else. These tests pin both halves of that promise, because the
 * value of "throws on anything else" is entirely in the *anything else*.
 */
import { describe, expect, it } from 'vitest';
import { parseFrontmatter, readBoolean, readList, readString } from '../src/frontmatter.ts';

const parse = (s: string) => parseFrontmatter(s, 'test.md');

describe('parseFrontmatter', () => {
  it('returns the whole file as content when there is no frontmatter', () => {
    const { data, content } = parse('# Title\n\nbody');
    expect(data).toEqual({});
    expect(content).toBe('# Title\n\nbody');
  });

  it('reads the documented value shapes', () => {
    const { data, content } = parse(
      ['---', 'title: bare text', 'tags: [a, b, "c d"]', 'draft: true', 'empty:', '# a comment', '---', 'body'].join(
        '\n',
      ),
    );
    expect(data).toEqual({ title: 'bare text', tags: ['a', 'b', 'c d'], draft: true, empty: '' });
    expect(content).toBe('body');
  });

  it('keeps a colon inside a quoted value', () => {
    // The failure this guards against is real: an em dash typed as a colon turned a
    // description into a mapping key and killed a whole docs build.
    expect(parse('---\ntitle: "a: b"\n---\n').data.title).toBe('a: b');
  });

  it('does not split a quoted list item on its comma', () => {
    expect(parse('---\ntags: ["a, b", c]\n---\n').data.tags).toEqual(['a, b', 'c']);
  });

  it('strips a UTF-8 BOM so the first line still matches', () => {
    // Otherwise the delimiter never matches and the frontmatter renders as prose.
    expect(parse('﻿---\ntitle: x\n---\nbody').data.title).toBe('x');
  });

  it.each([
    ['an unterminated block', '---\ntitle: x\n'],
    ['an indented key', '---\n  title: x\n---\n'],
    ['a line with no colon', '---\ntitle\n---\n'],
    ['an empty key', '---\n: x\n---\n'],
    ['a duplicate key', '---\ntitle: a\ntitle: b\n---\n'],
    ['an unclosed list', '---\ntags: [a, b\n---\n'],
  ])('throws on %s', (_label, source) => {
    expect(() => parse(source)).toThrow();
  });

  it('names the file and line in the error', () => {
    expect(() => parse('---\ntitle: a\nbroken\n---\n')).toThrow(/test\.md:3/);
  });
});

describe('typed accessors', () => {
  it('requires a missing field only when there is no fallback', () => {
    expect(() => readString({}, 'title', 'f.md')).toThrow(/missing required "title"/);
    expect(readString({}, 'title', 'f.md', 'x')).toBe('x');
  });

  it('rejects a value of the wrong shape rather than coercing it', () => {
    expect(() => readString({ title: true }, 'title', 'f.md')).toThrow(/must be a string/);
    expect(() => readList({ tags: 'a' }, 'tags', 'f.md')).toThrow(/must be a list/);
    expect(() => readBoolean({ draft: 'yes' }, 'draft', 'f.md', false)).toThrow(/must be true or false/);
  });

  it('treats an absent list as empty and an absent boolean as its default', () => {
    expect(readList({}, 'tags', 'f.md')).toEqual([]);
    expect(readBoolean({}, 'draft', 'f.md', true)).toBe(true);
  });
});
