import { getAllQueryString, getCookieByName } from '@/utils/bom';
import { localStorageGetItem } from '@/utils/storage';

/** Coarse language bucket: Chinese / English / other only */
export type TextLanguage = 'zh' | 'en' | 'other';

/**
 * @description: Decide a text's primary language from the ratio of CJK to Latin characters.
 * Pure statistics, no model or dictionary loaded — good enough to branch on "which
 * tokenizer / which language-specific model / which typographic metrics".
 *
 * Only the first N characters are sampled: the body language is consistent throughout, so
 * scanning a whole book (millions of characters) is pure waste. Text with a little CJK still
 * counts as Chinese (Latin has to clearly dominate for English), because English mixed into
 * Chinese text is common while the reverse is rare.
 *
 * @param {string} text text to inspect
 * @param {number} sampleSize sample length, defaults to 20000
 * @return {TextLanguage}
 */
export const detectLanguage = (text: string, sampleSize = 20000): TextLanguage => {
  const sample = text.slice(0, sampleSize);
  let cjk = 0;
  let latin = 0;
  for (const ch of sample) {
    const c = ch.codePointAt(0) ?? 0;
    // CJK Unified Ideographs (including the commonly used Extension A block)
    if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3400 && c <= 0x4dbf)) {
      cjk++;
    } else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) {
      latin++;
    }
  }
  if (cjk === 0 && latin === 0) return 'other';
  if (cjk >= latin) return 'zh';
  return latin > cjk * 3 ? 'en' : 'zh';
};

/**
 * @description: Map the browser UI language into the same buckets (the default when there is
 * no content to inspect). Returns 'other' under SSR.
 * @return {TextLanguage}
 */
export const navigatorLanguage = (): TextLanguage => {
  if (typeof navigator === 'undefined') return 'other';
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  return 'other';
};

export interface ResolveLocaleOptions {
  /** Locales the app actually ships, most specific first. The result is always one of these. */
  supported: readonly string[];
  /** Returned when no source matches. Defaults to `supported[0]`. */
  fallback?: string;
  /** Query parameter carrying an explicit choice, e.g. `lang` in `?lang=zh-CN`. */
  query?: string;
  /** Cookie name carrying the choice (a server-rendered preference, typically). */
  cookie?: string;
  /** localStorage key carrying the choice the user last picked in-app. */
  storageKey?: string;
  /** Consult `navigator.language` / `navigator.languages` before falling back. Defaults to true. */
  useNavigator?: boolean;
  /** URL to read the query from; defaults to the current location. */
  url?: string;
}

/**
 * @description: Resolve which of your supported locales to use, from the usual chain:
 * **query → cookie → localStorage → navigator → fallback**.
 *
 * The order is the point. A `?lang=` in the URL is an explicit, shareable, one-off
 * instruction and must beat everything; a cookie is a server-visible decision, so it beats
 * client-only state; localStorage is what the user last chose in-app; `navigator.language`
 * is only a guess about a first-time visitor. Getting this backwards produces the classic
 * bug where a shared `?lang=en` link keeps rendering in the recipient's stored language.
 *
 * Matching is case-insensitive and falls back from region to base language: with
 * `supported: ['en', 'zh-CN']`, a `zh-TW` request matches nothing but `zh` matches `zh-CN`,
 * and `en-GB` matches `en`. Values outside `supported` are ignored rather than returned, so
 * the result is always safe to index a message catalogue with.
 *
 * The catalogue itself is yours — this only picks the key.
 *
 * @param {ResolveLocaleOptions} options
 * @return {string} one of `supported`
 * @example
 * ```ts
 * const locale = resolveLocale({
 *   supported: ['en', 'zh-CN'],
 *   query: 'lang',
 *   cookie: 'lang',
 *   storageKey: 'app-lang',
 * });
 * ```
 */
export const resolveLocale = (options: ResolveLocaleOptions): string => {
  const { supported, query, cookie, storageKey, useNavigator = true, url } = options;
  const fallback = options.fallback ?? supported[0] ?? 'en';
  if (supported.length === 0) return fallback;

  const lower = supported.map((code) => code.toLowerCase());

  /** Exact match first, then base-language match (`zh-TW` → `zh-CN` only via the base `zh`). */
  const match = (raw: string | undefined | null): string | undefined => {
    if (!raw) return undefined;
    const candidate = raw.trim().toLowerCase();
    if (!candidate) return undefined;
    const exact = lower.indexOf(candidate);
    if (exact !== -1) return supported[exact];
    const base = candidate.split('-')[0];
    const partial = lower.findIndex((code) => code === base || code.split('-')[0] === base);
    return partial === -1 ? undefined : supported[partial];
  };

  const sources: Array<string | undefined | null> = [];

  if (query) {
    // Imported lazily-ish via a local read so this module stays usable in Node: both
    // helpers already return empty results when there is no document/window.
    sources.push(getAllQueryString(url)[query]);
  }
  if (cookie) sources.push(getCookieByName(cookie));
  if (storageKey) sources.push(localStorageGetItem(storageKey));
  if (useNavigator && typeof navigator !== 'undefined') {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const { languages, language } = navigator;
    // `languages` is the user's ordered preference list; `language` is only its head.
    sources.push(...(languages ?? []), language);
  }

  for (const source of sources) {
    const hit = match(source);
    if (hit) return hit;
  }
  return fallback;
};
