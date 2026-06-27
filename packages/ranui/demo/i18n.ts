// Demo i18n: a thin DOM binding on top of the framework-agnostic i18n core
// (utils/i18n). Dictionaries live in ./locales/*.json; strings are trusted/static,
// so values may contain inline markup and are applied via innerHTML.
import { createI18n, useI18n } from '@/utils/i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';

export type Lang = 'en' | 'zh';

createI18n({
  messages: { en, zh },
  fallbackLocale: 'en',
  persist: true,
  storageKey: 'ran-demo-lang',
  detectNavigator: true,
});

export const getLang = (): Lang => (useI18n()?.getLocale() === 'zh' ? 'zh' : 'en');

export const setLang = (lang: Lang): void => useI18n()?.setLocale(lang);

export const applyLanguage = (lang: Lang): void => {
  const i18n = useI18n();
  if (!i18n) return;
  i18n.setLocale(lang);
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

  const bind = (attr: string, apply: (el: Element, value: string) => void): void => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const key = el.getAttribute(attr);
      if (key) apply(el, i18n.t(key));
    });
  };

  bind('data-i18n', (el, v) => {
    (el as HTMLElement).innerHTML = v;
  });
  bind('data-i18n-placeholder', (el, v) => el.setAttribute('placeholder', v));
  bind('data-i18n-label', (el, v) => el.setAttribute('label', v));
  bind('data-i18n-title', (el, v) => el.setAttribute('title', v));
  bind('data-i18n-desc', (el, v) => el.setAttribute('description', v));
};
