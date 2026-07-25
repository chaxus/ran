// The i18n engine now lives in ranuts — it has no DOM coupling and no dependency on any
// component, and the locale plumbing it needs (guarded localStorage, navigator matching via
// `resolveLocale`) was already there. ranui keeps the module path so `@/utils/i18n`,
// `ranui/i18n` and the `ranui` barrel all stay importable exactly as before.
// Imported from the dedicated `ranuts/i18n` subpath rather than the `ranuts/utils` barrel:
// `ranui/i18n` exists so consumers can take the engine without the rest of the library, and
// going through the barrel would hand them whatever else that chunk happens to carry.
export { I18nCore, createI18n, useI18n } from 'ranuts/i18n';
export type {
  I18nConfig,
  MessageDict,
  StringValues,
  LocaleMessages,
  TranslateParams,
  LocaleChangeHandler,
} from 'ranuts/i18n';
