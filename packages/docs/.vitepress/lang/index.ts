import { createI18n } from 'vue-i18n';
import { $env } from '../plugins/env';
import { LANGS_DICT, LANG_MESSAGES, LOADED_LOCALES } from '../lib/constant';

const locale = $env.locale;

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: LANGS_DICT.EN,
  messages: LANG_MESSAGES,
  devtools: false,
});

export const setI18nLanguage = (lang: string): string => {
  // Both branches are the same assignment; kept as one so adding a language never means
  // widening a hard-coded union here (it used to read `lang as 'zh-CN' | 'en'`, which
  // silently mistyped every language added after those two).
  i18n.global.locale.value = lang as LANGS_DICT;
  return lang;
};

// 合并公共语言词条
export const mergeCommonMessage = (message: string, lang = locale): void => {
  i18n.global.mergeLocaleMessage(lang, message);
};

// 异步加载语言词条
export const loadLanguageAsync = (lang: string): Promise<string> => {
  if (!lang) return Promise.reject('lang is undefined');
  // 如果语言相同
  if (i18n.global.locale.value === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // 如果语言已经加载
  if (LOADED_LOCALES.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }
  return import(`../lang/${lang}.json`).then((messages) => {
    mergeCommonMessage(messages.default, lang);
    LOADED_LOCALES.push(lang);
    return setI18nLanguage(lang);
  });
};

export default i18n;
