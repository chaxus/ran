/**
 * Link resolution is the difference between a working site and 1,018 dead links that
 * look completely ordinary in the markup. VitePress did this translation silently; these
 * cases are the shapes that actually appear in this repository's markdown. Links are
 * written against source paths and come out as public URLs.
 */
import { describe, expect, it } from 'vitest';
import { resolveLinkFrom } from '../build/links.ts';

describe('resolveLinkFrom', () => {
  const from = resolveLinkFrom('/src/ranuts/utils/throttle');
  const fromDir = resolveLinkFrom('/src/ranui/button/');

  it('resolves a sibling written with ./', () => {
    expect(from('./debounce')).toBe('/ranuts/utils/debounce');
  });

  it('drops a .md extension', () => {
    expect(from('./timestamp_to_time.md')).toBe('/ranuts/utils/timestamp_to_time');
  });

  it('walks up with ..', () => {
    expect(from('../index.md')).toBe('/ranuts/');
  });

  it('folds a trailing /index into a directory URL', () => {
    expect(from('./sub/index.md')).toBe('/ranuts/utils/sub/');
  });

  it('treats a directory URL as the directory, not as a file in its parent', () => {
    // `/src/ranui/button/` comes from `button/index.md`, so `./x` is inside `button/`.
    expect(fromDir('./x')).toBe('/ranui/button/x');
    // Which is why a sibling page is written with `../`, and must resolve one level up.
    expect(fromDir('../icon/')).toBe('/ranui/icon/');
  });

  it('keeps a fragment and applies the rules to the path only', () => {
    expect(from('./debounce.md#usage')).toBe('/ranuts/utils/debounce#usage');
  });

  it('publishes a site-absolute source path at its public URL', () => {
    expect(from('/src/ranui/')).toBe('/ranui/');
    expect(from('/src/ranui/index.md')).toBe('/ranui/');
    expect(from('/cn/src/ranuts/choosing/')).toBe('/cn/ranuts/choosing/');
    expect(from('/assets/a.png')).toBe('/assets/a.png');
  });

  it('resolves a relative path against the source tree, then publishes it', () => {
    // From `/src/ranui/button/`, `../../ranuts/x` is `/src/ranuts/x`, published at `/ranuts/x`.
    expect(fromDir('../../ranuts/x.md')).toBe('/ranuts/x');
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
