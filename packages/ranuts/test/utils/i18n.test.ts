import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nCore, createI18n, useI18n } from '@/utils/i18n';

const g = globalThis as unknown as Record<string, unknown>;
const saved: Array<[string, PropertyDescriptor | undefined]> = [];

const define = (key: string, value: unknown): void => {
  saved.push([key, Object.getOwnPropertyDescriptor(g, key)]);
  Object.defineProperty(g, key, { value, configurable: true, writable: true });
};

const memoryStorage = (seed: Record<string, string> = {}) => {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    read: (k: string) => map.get(k) ?? null,
  };
};

beforeEach(() => define('window', {}));

afterEach(() => {
  while (saved.length > 0) {
    const [key, descriptor] = saved.pop() as [string, PropertyDescriptor | undefined];
    if (descriptor) Object.defineProperty(g, key, descriptor);
    else delete g[key];
  }
});

const MESSAGES = {
  en: { save: 'Save', greet: 'Hello {name}', braces: 'Use {{name}} to interpolate' },
  'zh-CN': { save: '保存', greet: '你好 {name}' },
};

describe('I18nCore — translation', () => {
  it('resolves against the active locale', () => {
    const i18n = new I18nCore({ messages: MESSAGES, locale: 'zh-CN' });
    expect(i18n.t('save')).toBe('保存');
  });

  it('falls back to the fallback locale for a missing key', () => {
    // zh-CN 没有 braces，应回落到 en 而不是直接吐 key
    const i18n = new I18nCore({ messages: MESSAGES, locale: 'zh-CN', fallbackLocale: 'en' });
    expect(i18n.t('braces')).toBe('Use {name} to interpolate');
  });

  it('returns the key itself when no locale has it', () => {
    const i18n = new I18nCore({ messages: MESSAGES });
    expect(i18n.t('nope')).toBe('nope');
  });

  it('interpolates named params', () => {
    const i18n = new I18nCore({ messages: MESSAGES });
    expect(i18n.t('greet', { name: 'Ada' })).toBe('Hello Ada');
  });

  it('leaves a placeholder visible when its param is absent', () => {
    // 静默留空会让缺参数变成看不见的 bug；留着 {name} 至少肉眼可见
    const i18n = new I18nCore({ messages: MESSAGES });
    expect(i18n.t('greet')).toBe('Hello {name}');
  });

  it('treats {{ }} as escapes for literal braces', () => {
    const i18n = new I18nCore({ messages: MESSAGES });
    expect(i18n.t('braces')).toBe('Use {name} to interpolate');
  });

  it('passes a spaced or lone brace through untouched, so CSS/JSON survives', () => {
    const i18n = new I18nCore({ messages: { en: { css: 'a { color: red }', lone: 'a { b' } } });
    expect(i18n.t('css')).toBe('a { color: red }');
    expect(i18n.t('lone')).toBe('a { b');
  });

  it('stringifies numeric params', () => {
    const i18n = new I18nCore({ messages: { en: { n: 'count {n}' } } });
    expect(i18n.t('n', { n: 0 })).toBe('count 0');
  });
});

describe('I18nCore — locale management', () => {
  it('switches locale and notifies subscribers', () => {
    const i18n = new I18nCore({ messages: MESSAGES, locale: 'en' });
    const handler = vi.fn();
    i18n.onChange(handler);
    i18n.setLocale('zh-CN');
    expect(i18n.locale).toBe('zh-CN');
    expect(handler).toHaveBeenCalledWith('zh-CN');
  });

  it('does not notify when the locale is unchanged', () => {
    const i18n = new I18nCore({ messages: MESSAGES, locale: 'en' });
    const handler = vi.fn();
    i18n.onChange(handler);
    i18n.setLocale('en');
    expect(handler).not.toHaveBeenCalled();
  });

  it('unsubscribes, and destroy() clears everyone', () => {
    const i18n = new I18nCore({ messages: MESSAGES, locale: 'en' });
    const a = vi.fn();
    const b = vi.fn();
    const off = i18n.onChange(a);
    i18n.onChange(b);
    off();
    i18n.setLocale('zh-CN');
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
    i18n.destroy();
    i18n.setLocale('en');
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('merges dictionaries at runtime and lists what it has', () => {
    const i18n = new I18nCore({ messages: { en: { a: 'A' } } });
    i18n.addMessages('en', { b: 'B' });
    i18n.addMessages('ja', { a: 'あ' });
    expect(i18n.t('b')).toBe('B');
    expect(i18n.availableLocales.sort()).toEqual(['en', 'ja']);
    expect(i18n.getMessages('ja')).toEqual({ a: 'あ' });
  });

  it('persists the choice and restores it on the next instance', () => {
    const storage = memoryStorage();
    define('localStorage', storage);
    new I18nCore({ messages: MESSAGES, locale: 'en', persist: true, storageKey: 'app-lang' }).setLocale('zh-CN');
    expect(storage.read('app-lang')).toBe('zh-CN');

    const restored = new I18nCore({ messages: MESSAGES, locale: 'en', persist: true, storageKey: 'app-lang' });
    expect(restored.locale).toBe('zh-CN');
  });

  it('does not persist unless asked', () => {
    const storage = memoryStorage();
    define('localStorage', storage);
    new I18nCore({ messages: MESSAGES, locale: 'en' }).setLocale('zh-CN');
    expect(storage.read('ran-locale')).toBeNull();
  });

  it('detects from the whole navigator.languages list, not just the first entry', () => {
    define('navigator', { languages: ['ja-JP', 'zh-CN', 'en-US'], language: 'ja-JP' });
    const i18n = new I18nCore({ messages: MESSAGES, detectNavigator: true, fallbackLocale: 'en' });
    expect(i18n.locale).toBe('zh-CN');
  });

  it('falls back when nothing in the browser list matches', () => {
    define('navigator', { languages: ['fr-FR'], language: 'fr-FR' });
    expect(new I18nCore({ messages: MESSAGES, detectNavigator: true, fallbackLocale: 'en' }).locale).toBe('en');
  });
});

describe('I18nCore — typed dictionaries', () => {
  interface Messages {
    save: string;
    cancel: string;
  }

  it('keeps t() working for a typed dictionary', () => {
    const i18n = new I18nCore<Messages>({ messages: { en: { save: 'Save', cancel: 'Cancel' } } });
    expect(i18n.t('save')).toBe('Save');
  });

  it('rejects an unknown key at compile time', () => {
    const i18n = new I18nCore<Messages>({ messages: { en: { save: 'Save', cancel: 'Cancel' } } });
    // @ts-expect-error 'saev' 不在 Messages 里 —— 这正是泛型要挡住的拼写错误
    i18n.t('saev');
    expect(i18n.availableLocales).toEqual(['en']);
  });

  it('still accepts any string when no dictionary type is given', () => {
    // 默认 MessageDict 的 keyof 就是 string，所以既有的无类型用法一字不改
    const i18n = new I18nCore({ messages: { en: { anything: 'x' } } });
    expect(i18n.t('whatever-key')).toBe('whatever-key');
  });

  it('accepts an interface, not just a type alias', () => {
    // 约束是 StringValues<T> 而不是 Record<string, string>：后者会拒绝 interface
    // （TS 只给 type alias 隐式索引签名），逼所有使用方把字典改写成 type。
    const i18n = new I18nCore<Messages>({ messages: { en: { save: 'Save', cancel: 'Cancel' } } });
    expect(i18n.t('save')).toBe('Save');
  });

  it('tolerates locales with different key sets', () => {
    // 回归：没有 NoInfer 时 TS 会把 TDict 推成各语言的交集，只有 fallback 有的 key
    // 会在每个调用点报错——翻译没补全就编译不过，而不是运行时回落。
    const i18n = new I18nCore<Messages>({
      messages: { en: { save: 'Save', cancel: 'Cancel' }, 'zh-CN': { save: '保存' } },
      locale: 'zh-CN',
      fallbackLocale: 'en',
    });
    expect(i18n.t('save')).toBe('保存');
    expect(i18n.t('cancel')).toBe('Cancel');
  });

  it('carries the type through addMessages', () => {
    const i18n = new I18nCore<Messages>({ messages: { en: { save: 'Save', cancel: 'Cancel' } } });
    i18n.addMessages('zh-CN', { save: '保存' }); // Partial<TDict>，可以只补一部分
    i18n.setLocale('zh-CN');
    expect(i18n.t('save')).toBe('保存');
    expect(i18n.t('cancel')).toBe('Cancel'); // 缺的走 fallback
  });
});

describe('global singleton', () => {
  interface Messages {
    hello: string;
  }

  it('createI18n registers it and useI18n hands it back', () => {
    const created = createI18n({ messages: MESSAGES, locale: 'en' });
    expect(useI18n()).toBe(created);
    expect(useI18n()?.t('save')).toBe('Save');
  });

  it('re-applies the dictionary type through useI18n', () => {
    createI18n<Messages>({ messages: { en: { hello: 'Hi' } } });
    const i18n = useI18n<Messages>();
    expect(i18n?.t('hello')).toBe('Hi');
    // @ts-expect-error 类型参数一路带到了 useI18n 的返回值上
    i18n?.t('nope');
  });

  it('a later createI18n replaces the registered instance', () => {
    const first = createI18n({ messages: { en: { a: 'A' } } });
    const second = createI18n({ messages: { en: { a: 'B' } } });
    expect(useI18n()).toBe(second);
    expect(useI18n()).not.toBe(first);
  });
});
