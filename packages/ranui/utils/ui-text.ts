import { useI18n } from '@/utils/i18n';

/** The languages ranui ships text for. English is the fallback for every other language. */
export type TextLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'pt' | 'de' | 'fa';

/** One component's built-in text: every key, in every language. */
export type TextTable<K extends string> = Record<TextLanguage, Record<K, string>>;

/**
 * Declares a component's text table. The keys come from `en`; every other language must have
 * exactly those keys, so a missing or misspelt translation fails type-checking.
 * Each component owns its table, so a page pays only for the text of the components it imports.
 */
export const defineText = <K extends string>(
  table: { en: Record<K, string> } & Record<Exclude<TextLanguage, 'en'>, Record<NoInfer<K>, string>>,
): TextTable<K> => table;

/** The nearest `lang`, looking through shadow roots so text built inside a component still finds the page's. */
const langNear = (element?: Element): string => {
  let node: Element | undefined = element;
  while (node) {
    const lang = node.closest?.('[lang]')?.getAttribute('lang');
    if (lang) return lang;
    node = (node.getRootNode?.() as ShadowRoot | undefined)?.host;
  }
  return '';
};

/** The language to speak: the app's i18n locale if it has one, else the nearest `lang`. */
const languageOf = (element?: Element): string => {
  const raw =
    useI18n()?.getLocale() ||
    langNear(element) ||
    (typeof document !== 'undefined' ? document.documentElement.lang : '') ||
    'en';
  const tag = raw.toLowerCase();
  // The zh table is Simplified; a Traditional reader is better served by English than by it.
  if (/^zh[-_](hant|tw|hk|mo)\b/.test(tag)) return 'en';
  return tag.split(/[-_]/)[0]!;
};

const fill = (text: string, params?: Record<string, string | number>): string =>
  params ? text.replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match)) : text;

/**
 * The default text for `key` from a component's `table`, in the reader's language.
 *
 * An app that runs ranui's i18n can override any string by defining `ranui.<key>` in its own
 * dictionary; otherwise the table's entry for the locale is used, then English. An element's
 * own attribute override (`label`, `label-*`) still wins and is checked by the component
 * before it calls this. Resolved when the text is written, not re-read on a later locale change.
 */
export const uiText = <K extends string>(
  table: TextTable<K>,
  key: NoInfer<K>,
  element?: Element,
  params?: Record<string, string | number>,
): string => {
  const i18n = useI18n();
  const hostKey = `ranui.${key}`;
  if (i18n) {
    // The active locale only: `t()` would fall back to the app's default dictionary, so an
    // override written only in English would replace the built-in translation everywhere.
    const own = (i18n.getMessages(i18n.getLocale()) as Record<string, string | undefined>)[hostKey];
    if (own !== undefined) return fill(own, params);
  }
  const language = languageOf(element);
  return fill((table as Partial<Record<string, Record<K, string>>>)[language]?.[key] ?? table.en[key], params);
};
