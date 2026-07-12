// Framework-agnostic i18n core. Mirrors the router design: a small reactive
// engine (I18nCore) with an optional global singleton (createI18n / useI18n).
// No DOM coupling — bind it to the UI however you like.

export type MessageDict = Record<string, string>;
export type LocaleMessages = Record<string, MessageDict>;
export type TranslateParams = Record<string, string | number>;
export type LocaleChangeHandler = (locale: string) => void;

export interface I18nConfig {
  /** Initial locale. Overridden by a persisted choice when `persist` is on. */
  locale?: string;
  /** Locale used when a key is missing in the active locale. Defaults to 'en'. */
  fallbackLocale?: string;
  /** Locale → key → string. */
  messages?: LocaleMessages;
  /** Persist the active locale to localStorage. Defaults to false. */
  persist?: boolean;
  /** localStorage key used when `persist` is on. Defaults to 'ran-locale'. */
  storageKey?: string;
  /** Seed the initial locale from `navigator.language` when nothing else applies. */
  detectNavigator?: boolean;
}

const DEFAULT_STORAGE_KEY = 'ran-locale';

const EMPTY_PARAMS: TranslateParams = Object.freeze({});

const readStored = (key: string): string | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStored = (key: string, value: string): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (SSR / private browsing)
  }
};

const detectNavigatorLocale = (available: string[]): string | null => {
  if (typeof navigator === 'undefined' || !navigator.language) return null;
  const lower = navigator.language.toLowerCase();
  // exact ('zh-cn'), then base ('zh') against the available locales
  return (
    available.find((l) => l.toLowerCase() === lower) ??
    available.find((l) => lower.startsWith(l.toLowerCase())) ??
    available.find((l) => lower.startsWith(`${l.toLowerCase()}-`)) ??
    null
  );
};

export class I18nCore {
  private _locale: string;
  private _fallback: string;
  private _messages: LocaleMessages;
  private _persist: boolean;
  private _storageKey: string;
  private _handlers = new Set<LocaleChangeHandler>();

  constructor(config: I18nConfig = {}) {
    this._messages = { ...config.messages };
    this._fallback = config.fallbackLocale ?? 'en';
    this._persist = config.persist ?? false;
    this._storageKey = config.storageKey ?? DEFAULT_STORAGE_KEY;
    this._locale = this._resolveInitialLocale(config);
  }

  private _resolveInitialLocale(config: I18nConfig): string {
    const available = Object.keys(this._messages);
    // priority: persisted choice → explicit config → navigator → fallback
    const stored = this._persist ? readStored(this._storageKey) : null;
    if (stored && (this._messages[stored] || available.length === 0)) return stored;
    if (config.locale) return config.locale;
    if (config.detectNavigator) {
      const detected = detectNavigatorLocale(available);
      if (detected) return detected;
    }
    return this._fallback;
  }

  /** The active locale. */
  get locale(): string {
    return this._locale;
  }

  getLocale(): string {
    return this._locale;
  }

  /** Switch locale; persists (when enabled) and notifies subscribers. No-op if unchanged. */
  setLocale(locale: string): void {
    if (locale === this._locale) return;
    this._locale = locale;
    if (this._persist) writeStored(this._storageKey, locale);
    this._notify();
  }

  /** Merge a dictionary into a locale (creating it if needed). */
  addMessages(locale: string, dict: MessageDict): void {
    this._messages[locale] = { ...this._messages[locale], ...dict };
  }

  getMessages(locale: string = this._locale): MessageDict {
    return this._messages[locale] ?? {};
  }

  /** Locales that have a dictionary registered. */
  get availableLocales(): string[] {
    return Object.keys(this._messages);
  }

  /**
   * Translate a key against the active locale, falling back to the fallback
   * locale and finally the key itself. `{param}` placeholders are interpolated;
   * `{{` / `}}` are escapes for literal `{` / `}` (see {@link I18nCore._interpolate}).
   */
  t(key: string, params?: TranslateParams): string {
    const value = this._messages[this._locale]?.[key] ?? this._messages[this._fallback]?.[key] ?? key;
    return this._interpolate(value, params);
  }

  /**
   * Substitute `{param}` placeholders and unescape literal braces.
   *
   * Grammar (a single left-to-right pass, so escapes and placeholders never
   * fight each other), matching the format-string convention used by Rust
   * `format!`, Python `str.format`, and .NET `String.Format`:
   * - `{{` → literal `{`
   * - `}}` → literal `}`
   * - `{name}` → `params.name` (stringified), or left untouched when the param
   *   is absent, so a stray placeholder is visible rather than silently blank.
   *
   * A lone `{`/`}` or a `{ spaced }` group is not a placeholder and is emitted
   * verbatim, so CSS/JSON/code fragments in a message pass through unharmed.
   * To wrap a value in literal braces, double the outer pair: `{{{name}}}`.
   */
  private _interpolate(str: string, params?: TranslateParams): string {
    const values = params ?? EMPTY_PARAMS;
    return str.replace(/\{\{|\}\}|\{(\w+)\}/g, (match, name: string | undefined) => {
      if (match === '{{') return '{';
      if (match === '}}') return '}';
      return values[name!] != null ? String(values[name!]) : match;
    });
  }

  /** Subscribe to locale changes. Returns an unsubscribe function. */
  onChange(handler: LocaleChangeHandler): () => void {
    this._handlers.add(handler);
    return () => {
      this._handlers.delete(handler);
    };
  }

  private _notify(): void {
    for (const handler of this._handlers) handler(this._locale);
  }

  /** Remove all subscribers. */
  destroy(): void {
    this._handlers.clear();
  }
}

let _globalI18n: I18nCore | null = null;

/** Create and register the global i18n singleton. */
export function createI18n(config: I18nConfig = {}): I18nCore {
  _globalI18n = new I18nCore(config);
  return _globalI18n;
}

/** Return the active global i18n instance, or null if none was created. */
export function useI18n(): I18nCore | null {
  return _globalI18n;
}
