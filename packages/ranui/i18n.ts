// Public entry for the i18n engine only — no component registration.
// Lets consumers `import { createI18n } from 'ranui/i18n'` without pulling in
// every custom element, keeping their bundle lean.
export { I18nCore, createI18n, useI18n } from '@/utils/i18n';
export type { I18nConfig, MessageDict, LocaleMessages, TranslateParams, LocaleChangeHandler } from '@/utils/i18n';
