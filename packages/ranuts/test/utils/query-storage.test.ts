import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllQueryString, isInIframe, queryFlag } from '@/utils/bom';
import { createStore, localStorageGetItem, localStorageRemoveItem, localStorageSetItem } from '@/utils/storage';
import { resolveLocale } from '@/utils/lang';

describe('getAllQueryString', () => {
  it('parses an ordinary query', () => {
    expect(getAllQueryString('https://x.dev/a?lang=zh-CN&page=2')).toEqual({ lang: 'zh-CN', page: '2' });
  });

  it('keeps a bare flag as an empty string', () => {
    // The old implementation dropped these, making `?embed` indistinguishable from absent.
    expect(getAllQueryString('?embed')).toEqual({ embed: '' });
    expect(getAllQueryString('?embed=')).toEqual({ embed: '' });
    expect(getAllQueryString('?embed&lang=en')).toEqual({ embed: '', lang: 'en' });
  });

  it('does not let a fragment leak into the last value', () => {
    expect(getAllQueryString('https://x.dev/a?lang=en#section')).toEqual({ lang: 'en' });
  });

  it('splits only on the first "=" so values may contain one', () => {
    expect(getAllQueryString('?next=/a?b=1')).toEqual({ next: '/a?b=1' });
  });

  it('percent-decodes keys and values, and "+" as a space', () => {
    expect(getAllQueryString('?q=hello+world&%6Bey=v')).toEqual({ q: 'hello world', key: 'v' });
  });

  it('keeps a malformed escape verbatim instead of dropping the parameter', () => {
    expect(getAllQueryString('?bad=%zz&good=1')).toEqual({ bad: '%zz', good: '1' });
  });

  it('returns {} when there is no query, and under SSR', () => {
    expect(getAllQueryString('https://x.dev/a')).toEqual({});
    expect(getAllQueryString('')).toEqual({});
    expect(getAllQueryString()).toEqual({}); // no window in the node test env
  });
});

describe('queryFlag', () => {
  it.each([
    ['?embed', true],
    ['?embed=', true],
    ['?embed=1', true],
    ['?embed=true', true],
    ['?embed=TRUE', true],
    ['?embed=0', false],
    ['?embed=false', false],
    ['?embed=no', false],
    ['?other=1', false],
    ['', false],
  ])('%s -> %s', (url, expected) => {
    expect(queryFlag('embed', url)).toBe(expected);
  });
});

describe('isInIframe', () => {
  it('is false with no window (SSR)', () => {
    expect(isInIframe()).toBe(false);
  });

  it('is true when window.parent differs from window', () => {
    vi.stubGlobal('window', { parent: {} });
    expect(isInIframe()).toBe(true);
    vi.unstubAllGlobals();
  });

  it('is false at the top level', () => {
    const top: Record<string, unknown> = {};
    top.parent = top;
    vi.stubGlobal('window', top);
    expect(isInIframe()).toBe(false);
    vi.unstubAllGlobals();
  });
});

/** Minimal in-memory localStorage; the test env is node, so there is none by default. */
const stubStorage = (): Map<string, string> => {
  const data = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, String(value)),
    removeItem: (key: string) => void data.delete(key),
  });
  return data;
};

describe('localStorage helpers', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('read and write through', () => {
    stubStorage();
    localStorageSetItem('k', 'v');
    expect(localStorageGetItem('k')).toBe('v');
    localStorageRemoveItem('k');
    expect(localStorageGetItem('k')).toBe('');
  });

  it('returns "" and does not throw when storage is absent', () => {
    expect(localStorageGetItem('k')).toBe('');
    expect(() => localStorageSetItem('k', 'v')).not.toThrow();
    expect(() => localStorageRemoveItem('k')).not.toThrow();
  });

  it('does not throw when access itself throws (blocked third-party frame)', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('SecurityError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    });
    expect(localStorageGetItem('k')).toBe('');
    expect(() => localStorageSetItem('k', 'v')).not.toThrow();
  });
});

describe('createStore', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('namespaces keys with the prefix', () => {
    const data = stubStorage();
    const store = createStore<number>('app_');
    expect(store.keyOf('count')).toBe('app_count');
    store.set('count', 3);
    expect(data.get('app_count')).toBe('3');
  });

  it('round-trips structured values', () => {
    stubStorage();
    const store = createStore<{ items: string[] }>('s_');
    store.set('doc', { items: ['a', 'b'] });
    expect(store.get('doc', { items: [] })).toEqual({ items: ['a', 'b'] });
  });

  it('returns the fallback for a missing key', () => {
    stubStorage();
    expect(createStore<string[]>('s_').get('nope', [])).toEqual([]);
  });

  it('returns the fallback for corrupt JSON instead of throwing', () => {
    const data = stubStorage();
    data.set('s_doc', '{not json');
    expect(createStore<string[]>('s_').get('doc', ['safe'])).toEqual(['safe']);
  });

  it('reports false when the value cannot be serialised', () => {
    stubStorage();
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(createStore<unknown>('s_').set('bad', circular)).toBe(false);
  });

  it('reports false when storage is unavailable', () => {
    expect(createStore<number>('s_').set('n', 1)).toBe(false);
  });

  it('removes a key', () => {
    stubStorage();
    const store = createStore<number>('s_');
    store.set('n', 1);
    store.remove('n');
    expect(store.get('n', -1)).toBe(-1);
  });
});

describe('resolveLocale', () => {
  const supported = ['en', 'zh-CN'] as const;
  afterEach(() => vi.unstubAllGlobals());

  it('prefers the query over everything else', () => {
    const data = stubStorage();
    data.set('lang', 'en');
    expect(
      resolveLocale({ supported, query: 'lang', storageKey: 'lang', useNavigator: false, url: '?lang=zh-CN' }),
    ).toBe('zh-CN');
  });

  it('falls back to storage when the query is absent', () => {
    const data = stubStorage();
    data.set('lang', 'zh-CN');
    expect(resolveLocale({ supported, query: 'lang', storageKey: 'lang', useNavigator: false, url: '?x=1' })).toBe(
      'zh-CN',
    );
  });

  it('matches a region variant by its base language', () => {
    expect(resolveLocale({ supported, query: 'lang', useNavigator: false, url: '?lang=en-GB' })).toBe('en');
    expect(resolveLocale({ supported, query: 'lang', useNavigator: false, url: '?lang=zh' })).toBe('zh-CN');
  });

  it('is case-insensitive', () => {
    expect(resolveLocale({ supported, query: 'lang', useNavigator: false, url: '?lang=ZH-cn' })).toBe('zh-CN');
  });

  it('ignores an unsupported value rather than returning it', () => {
    expect(resolveLocale({ supported, query: 'lang', useNavigator: false, url: '?lang=de' })).toBe('en');
  });

  it('uses navigator.languages in order', () => {
    vi.stubGlobal('navigator', { languages: ['de', 'zh-CN', 'en'], language: 'de' });
    expect(resolveLocale({ supported })).toBe('zh-CN');
  });

  it('falls back to the explicit fallback, then to supported[0]', () => {
    expect(resolveLocale({ supported, useNavigator: false, fallback: 'zh-CN' })).toBe('zh-CN');
    expect(resolveLocale({ supported, useNavigator: false })).toBe('en');
  });
});
