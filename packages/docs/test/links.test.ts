/**
 * Link resolution is the difference between a working site and 1,018 dead links that
 * look completely ordinary in the markup. VitePress did this translation silently; these
 * cases are the shapes that actually appear in this repository's markdown.
 */
import { describe, expect, it } from 'vitest';
import { resolveLinkFrom } from '../build/links.ts';

describe('resolveLinkFrom', () => {
  const from = resolveLinkFrom('/src/ranuts/utils/throttle');
  const fromDir = resolveLinkFrom('/src/ranui/button/');

  it('resolves a sibling written with ./', () => {
    expect(from('./debounce')).toBe('/src/ranuts/utils/debounce');
  });

  it('drops a .md extension', () => {
    expect(from('./timestamp_to_time.md')).toBe('/src/ranuts/utils/timestamp_to_time');
  });

  it('walks up with ..', () => {
    expect(from('../index.md')).toBe('/src/ranuts/');
  });

  it('folds a trailing /index into a directory URL', () => {
    expect(from('./sub/index.md')).toBe('/src/ranuts/utils/sub/');
  });

  it('treats a directory URL as the directory, not as a file in its parent', () => {
    // `/src/ranui/button/` comes from `button/index.md`, so `./x` is inside `button/`.
    expect(fromDir('./x')).toBe('/src/ranui/button/x');
    // Which is why a sibling page is written with `../`, and must resolve one level up.
    expect(fromDir('../icon/')).toBe('/src/ranui/icon/');
  });

  it('keeps a fragment and applies the rules to the path only', () => {
    expect(from('./debounce.md#usage')).toBe('/src/ranuts/utils/debounce#usage');
  });

  it('leaves a site-absolute path alone apart from the .md rules', () => {
    expect(from('/src/ranui/')).toBe('/src/ranui/');
    expect(from('/src/ranui/index.md')).toBe('/src/ranui/');
  });

  it.each([
    ['an external URL', 'https://example.com/a'],
    ['a protocol-relative URL', '//example.com/a'],
    ['a mailto', 'mailto:a@b.c'],
    ['a bare fragment', '#section'],
    ['an empty href', ''],
  ])('leaves %s untouched', (_label, href) => {
    expect(from(href)).toBe(href);
  });
});
