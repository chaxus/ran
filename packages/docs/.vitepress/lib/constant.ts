import { LOCALES } from '../langs/locales.ts';

export enum INPUT_STATUS {
  NORMAL = 'normal',
  ERROR = 'error',
  WARNING = 'warning',
}

/**
 * Language tags the site ships. Kept as an enum because `plugins/env.ts` uses it as a type,
 * but the list of languages itself lives in `../langs/locales.ts` — this must mirror it, and
 * `LANG_MESSAGES` below is derived from there so the two cannot drift in the values that
 * actually reach the UI.
 */
export enum LANGS_DICT {
  EN = 'en', // English
  ZH_CN = 'zh-CN', // 简体中文
  JA = 'ja', // 日本語
  ES = 'es', // Español
  PT = 'pt', // Português
  KO = 'ko', // 한국어
  DE = 'de', // Deutsch
  FA = 'fa', // فارسی
}
// localStorage 中的多语言标识
export const RAN_CHAXUS_LANG = 'ran_chaxus_lang';

export const LOADED_LOCALES: string[] = [];

/**
 * The vue-i18n bootstrap dictionary: just each language's own name, enough to render the
 * language menu before `loadLanguageAsync` fetches the full `lang/<tag>.json`.
 */
export const LANG_MESSAGES: Record<string, { lang: string }> = Object.fromEntries(
  LOCALES.map((l) => [l.lang, { lang: l.label }]),
);
