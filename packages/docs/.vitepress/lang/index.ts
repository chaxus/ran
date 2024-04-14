import { createI18n } from 'vue-i18n';
import { $env } from '../plugins/env';
import { LANGS_DICT, LOADED_LOCALES, LANG_MESSAGES, I18N_MODE } from '../lib/constant';

const locale = $env.locale;

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: LANGS_DICT.EN,
  messages: LANG_MESSAGES,
  devtools: false,
});

export const setI18nLanguage = (lang) => {
  if (i18n.mode === I18N_MODE.LEGACY) {
    i18n.global.locale = lang;
  } else {
    i18n.global.locale.value = lang;
  }
  return lang;
};

// 合并公共语言词条
export const mergeCommonMessage = (message, lang = locale) => {
  i18n.global.mergeLocaleMessage(lang, message);
};

// 异步加载语言词条
export const loadLanguageAsync = (lang = locale) => {
  if (!lang) return Promise.reject('lang is undefined');
  // 如果语言相同
  if (i18n.global.locale === lang) {
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
