// The i18n engine now lives in ranuts — it has no DOM coupling and no dependency on any
// component, and the locale plumbing it needs (guarded localStorage, navigator matching via
// `resolveLocale`) was already there. ranui keeps the module path so `@/utils/i18n`,
// `ranui/i18n` and the `ranui` barrel all stay importable exactly as before.
export { I18nCore, createI18n, useI18n } from 'ranuts/utils';
export type {
  I18nConfig,
  MessageDict,
  LocaleMessages,
  TranslateParams,
  LocaleChangeHandler,
} from 'ranuts/utils';
