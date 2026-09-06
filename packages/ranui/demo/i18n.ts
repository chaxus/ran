// Demo i18n: a thin DOM binding on top of the framework-agnostic i18n core
// (utils/i18n). Dictionaries live in ./locales/*.json; strings are trusted/static,
// so values may contain inline markup and are applied via innerHTML.
import { createI18n, useI18n } from '@/utils/i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ko from './locales/ko.json';
import de from './locales/de.json';
import fa from './locales/fa.json';

/**
 * The demo's language registry — the one list everything else reads: the i18n
 * dictionaries, the `<html lang>`/`dir` the page ends up with, and the labels in
 * the switcher. A second hard-coded list of languages anywhere else is a bug; it
 * will silently miss whichever language is added next.
 *
 * `code` is the dictionary key, `htmlLang` the BCP-47 tag that goes on `<html>`.
 */
export const LANGS = [
  { code: 'en', label: 'English', htmlLang: 'en' },
  { code: 'zh', label: '中文', htmlLang: 'zh-CN' },
  { code: 'ja', label: '日本語', htmlLang: 'ja' },
  { code: 'es', label: 'Español', htmlLang: 'es' },
  { code: 'pt', label: 'Português', htmlLang: 'pt' },
  { code: 'ko', label: '한국어', htmlLang: 'ko' },
  { code: 'de', label: 'Deutsch', htmlLang: 'de' },
  { code: 'fa', label: 'فارسی', htmlLang: 'fa', rtl: true },
] as const;

export type Lang = (typeof LANGS)[number]['code'];

const DEFAULT_LANG: Lang = 'en';

createI18n({
  messages: { en, zh, ja, es, pt, ko, de, fa },
  fallbackLocale: DEFAULT_LANG,
  persist: true,
  storageKey: 'ran-demo-lang',
  detectNavigator: true,
});

const isLang = (value: string | undefined): value is Lang => LANGS.some((l) => l.code === value);

export const getLang = (): Lang => {
  const locale = useI18n()?.getLocale();
  return isLang(locale) ? locale : DEFAULT_LANG;
};

export const setLang = (lang: Lang): void => useI18n()?.setLocale(lang);

export const applyLanguage = (lang: Lang): void => {
  const i18n = useI18n();
  if (!i18n) return;
  i18n.setLocale(lang);

  const def = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  document.documentElement.setAttribute('lang', def.htmlLang);
  // Persian is the only right-to-left language here; `dir` has to be cleared
  // again on the way back out, or the page stays mirrored after switching away.
  document.documentElement.setAttribute('dir', 'rtl' in def && def.rtl ? 'rtl' : 'ltr');

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
  bind('data-i18n-message', (el, v) => el.setAttribute('message', v));
  // `title` is the native tooltip attribute; `heading` is what r-card and r-modal render.
  bind('data-i18n-title', (el, v) => el.setAttribute('title', v));
  bind('data-i18n-heading', (el, v) => el.setAttribute('heading', v));
  bind('data-i18n-desc', (el, v) => el.setAttribute('description', v));
};
