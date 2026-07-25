import { describe, expect, it } from 'vitest';
import { createLocalePath } from '@/utils';

const LOCALES = [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }];

describe('createLocalePath — root deployment', () => {
  const paths = createLocalePath({ locales: LOCALES });

  it('picks the prefix-less locale as the default', () => {
    expect(paths.defaultLocale).toBe('en');
    expect(paths.base).toBe('');
  });

  it('keeps the default locale at the root', () => {
    expect(paths.href('/book/walden/')).toBe('/book/walden/');
    expect(paths.href('/')).toBe('/');
  });

  it('prefixes non-default locales', () => {
    expect(paths.href('/book/walden/', 'zh-CN')).toBe('/zh/book/walden/');
    expect(paths.href('/', 'zh-CN')).toBe('/zh/');
  });

  it('detects the locale from a pathname', () => {
    expect(paths.localeFromPath('/book/walden/')).toBe('en');
    expect(paths.localeFromPath('/zh/book/walden/')).toBe('zh-CN');
    expect(paths.localeFromPath('/zh')).toBe('zh-CN');
  });

  it('matches the longest prefix first, so zh does not swallow zh-hant', () => {
    expect(paths.localeFromPath('/zh-hant/book/')).toBe('zh-HK');
    expect(paths.stripLocale('/zh-hant/book/')).toBe('/book/');
  });

  it('strips the locale prefix', () => {
    expect(paths.stripLocale('/zh/book/walden/')).toBe('/book/walden/');
    expect(paths.stripLocale('/zh')).toBe('/');
    expect(paths.stripLocale('/book/walden/')).toBe('/book/walden/');
  });

  it('switches between locales from any starting locale', () => {
    expect(paths.hrefForLocale('/zh/book/walden/', 'zh-HK')).toBe('/zh-hant/book/walden/');
    expect(paths.hrefForLocale('/zh-hant/book/walden/', 'en')).toBe('/book/walden/');
    expect(paths.hrefForLocale('/book/walden/', 'zh-CN')).toBe('/zh/book/walden/');
  });

  it('is idempotent — href on an already-prefixed path does not double up', () => {
    expect(paths.href(paths.href('/book/', 'zh-CN'), 'zh-CN')).toBe('/zh/book/');
  });

  it('falls back to the default locale for an unknown code', () => {
    expect(paths.href('/book/', 'ja')).toBe('/book/');
  });

  it('preserves query and hash', () => {
    expect(paths.href('/search?q=walden#top', 'zh-CN')).toBe('/zh/search?q=walden#top');
    expect(paths.stripLocale('/zh/search?q=walden#top')).toBe('/search?q=walden#top');
    expect(paths.localeFromPath('/zh/search?q=x')).toBe('zh-CN');
  });

  it('lists every locale alternate for hreflang tags', () => {
    expect(paths.alternates('/zh/book/')).toEqual([
      { code: 'en', href: '/book/' },
      { code: 'zh-CN', href: '/zh/book/' },
      { code: 'zh-HK', href: '/zh-hant/book/' },
    ]);
  });
});

describe('createLocalePath — sub-directory deployment', () => {
  const paths = createLocalePath({ locales: LOCALES, base: '/weread/' });

  it('normalizes the base by dropping the trailing slash', () => {
    expect(paths.base).toBe('/weread');
  });

  it('prepends the base to every generated link', () => {
    expect(paths.href('/book/')).toBe('/weread/book/');
    expect(paths.href('/book/', 'zh-CN')).toBe('/weread/zh/book/');
    expect(paths.href('/')).toBe('/weread/');
  });

  it('accepts a path that already carries the base', () => {
    expect(paths.href('/weread/book/', 'zh-CN')).toBe('/weread/zh/book/');
    expect(paths.localeFromPath('/weread/zh/book/')).toBe('zh-CN');
    expect(paths.stripLocale('/weread/zh/book/')).toBe('/weread/book/');
  });

  it('resolves the bare base path to the root', () => {
    expect(paths.localeFromPath('/weread')).toBe('en');
    expect(paths.stripLocale('/weread')).toBe('/weread/');
  });

  it('only strips the base at the start, not wherever it appears', () => {
    const nested = createLocalePath({ locales: LOCALES, base: '/zh' });
    // '/a/zh/b' 里的 '/zh' 不是 base，不能被剥掉
    expect(nested.stripLocale('/a/zh/b')).toBe('/zh/a/zh/b');
  });
});

describe('createLocalePath — degenerate config', () => {
  it('survives an empty locale list', () => {
    const paths = createLocalePath({ locales: [] });
    expect(paths.defaultLocale).toBe('en');
    expect(paths.href('/a')).toBe('/a');
  });

  it('honours an explicit defaultLocale even when it has a prefix', () => {
    const paths = createLocalePath({
      locales: [{ code: 'zh-CN', prefix: 'zh' }, { code: 'en' }],
      defaultLocale: 'en',
    });
    expect(paths.href('/a')).toBe('/a');
    expect(paths.localeFromPath('/a')).toBe('en');
    expect(paths.href('/a', 'zh-CN')).toBe('/zh/a');
  });

  it('normalizes a path given without a leading slash', () => {
    const paths = createLocalePath({ locales: LOCALES });
    expect(paths.href('book/')).toBe('/book/');
  });
});
