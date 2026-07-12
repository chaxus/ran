import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nCore, createI18n, useI18n } from '@/utils/i18n';

const messages = {
  en: { greeting: 'Hello', welcome: 'Welcome, {name}', onlyEn: 'English only' },
  zh: { greeting: '你好', welcome: '欢迎，{name}' },
};

beforeEach(() => {
  localStorage.clear();
});

describe('utils/i18n', () => {
  it('createI18n registers a global instance returned by useI18n', () => {
    const i18n = createI18n({ messages });
    expect(useI18n()).toBe(i18n);
  });

  it('defaults the locale to fallbackLocale', () => {
    const i18n = new I18nCore({ messages, fallbackLocale: 'en' });
    expect(i18n.getLocale()).toBe('en');
  });

  it('honors an explicit initial locale', () => {
    const i18n = new I18nCore({ messages, locale: 'zh' });
    expect(i18n.locale).toBe('zh');
  });

  it('translates against the active locale', () => {
    const i18n = new I18nCore({ messages, locale: 'zh' });
    expect(i18n.t('greeting')).toBe('你好');
  });

  it('falls back to the fallback locale for missing keys', () => {
    const i18n = new I18nCore({ messages, locale: 'zh', fallbackLocale: 'en' });
    expect(i18n.t('onlyEn')).toBe('English only');
  });

  it('returns the key itself when no translation exists', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    expect(i18n.t('missing.key')).toBe('missing.key');
  });

  it('interpolates {param} placeholders', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    expect(i18n.t('welcome', { name: 'Jack' })).toBe('Welcome, Jack');
  });

  it('leaves unmatched placeholders intact', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    expect(i18n.t('welcome')).toBe('Welcome, {name}');
  });

  it('stringifies numeric params', () => {
    const i18n = new I18nCore({ messages: { en: { total: '{count} items · ${sum}' } }, locale: 'en' });
    expect(i18n.t('total', { count: 3, sum: 59.9 })).toBe('3 items · $59.9');
  });

  describe('literal braces', () => {
    const brace = (en: string) => new I18nCore({ messages: { en: { k: en } }, locale: 'en' });

    it('passes lone / spaced / non-word braces through untouched', () => {
      expect(brace('css .a { color: red }').t('k', { color: 'x' })).toBe('css .a { color: red }');
      expect(brace('json {"a":1}').t('k')).toBe('json {"a":1}');
      expect(brace('a { b } c').t('k')).toBe('a { b } c');
      expect(brace('open { only').t('k')).toBe('open { only');
    });

    it('unescapes {{ and }} to literal braces (Rust/Python format convention)', () => {
      expect(brace('use {{ and }}').t('k')).toBe('use { and }');
      expect(brace('{{name}}').t('k', { name: 'Ada' })).toBe('{name}');
      expect(brace('{{}}').t('k')).toBe('{}');
    });

    it('wraps an interpolated value in literal braces via doubled outer pairs', () => {
      expect(brace('{{{name}}}').t('k', { name: 'Ada' })).toBe('{Ada}');
    });

    it('escapes consistently whether or not params are passed', () => {
      expect(brace('a {{ b').t('k')).toBe('a { b');
      expect(brace('a {{ b').t('k', { x: 1 })).toBe('a { b');
    });
  });

  it('setLocale switches locale and notifies subscribers', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    const handler = vi.fn();
    i18n.onChange(handler);

    i18n.setLocale('zh');

    expect(i18n.getLocale()).toBe('zh');
    expect(handler).toHaveBeenCalledWith('zh');
    expect(i18n.t('greeting')).toBe('你好');
  });

  it('setLocale is a no-op when the locale is unchanged', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    const handler = vi.fn();
    i18n.onChange(handler);

    i18n.setLocale('en');

    expect(handler).not.toHaveBeenCalled();
  });

  it('onChange returns an unsubscribe function', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    const handler = vi.fn();
    const off = i18n.onChange(handler);

    off();
    i18n.setLocale('zh');

    expect(handler).not.toHaveBeenCalled();
  });

  it('addMessages merges a dictionary into a locale', () => {
    const i18n = new I18nCore({ messages, locale: 'zh' });
    i18n.addMessages('zh', { onlyEn: '仅中文补充' });
    expect(i18n.t('onlyEn')).toBe('仅中文补充');
  });

  it('exposes the available locales', () => {
    const i18n = new I18nCore({ messages });
    expect(i18n.availableLocales.sort()).toEqual(['en', 'zh']);
  });

  it('persists the locale to localStorage and restores it', () => {
    const a = new I18nCore({ messages, persist: true, storageKey: 'k', fallbackLocale: 'en' });
    a.setLocale('zh');
    expect(localStorage.getItem('k')).toBe('zh');

    const b = new I18nCore({ messages, persist: true, storageKey: 'k', fallbackLocale: 'en' });
    expect(b.getLocale()).toBe('zh');
  });

  it('does not persist when persist is off', () => {
    const i18n = new I18nCore({ messages, storageKey: 'k' });
    i18n.setLocale('zh');
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('destroy removes all subscribers', () => {
    const i18n = new I18nCore({ messages, locale: 'en' });
    const handler = vi.fn();
    i18n.onChange(handler);

    i18n.destroy();
    i18n.setLocale('zh');

    expect(handler).not.toHaveBeenCalled();
  });
});
