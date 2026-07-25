// Framework-agnostic i18n core: a small reactive engine (I18nCore) with an optional global
// singleton (createI18n / useI18n). No DOM coupling — bind it to the UI however you like.
//
// Lived in ranui until the duplicate utilities across the two packages were merged. Nothing
// here touches the DOM or a component, and the locale plumbing it needs (guarded
// localStorage, navigator matching) already lived here, so this is where it belongs.
import { localStorageGetItem, localStorageSetItem } from '@/utils/storage';
import { resolveLocale } from '@/utils/lang';

export type MessageDict = Record<string, string>;

/**
 * "An object whose values are all strings" — the constraint the dictionary type parameter
 * uses, instead of `Record<string, string>`.
 *
 * The difference matters in practice: an `interface Messages { save: string }` does **not**
 * satisfy `Record<string, string>`, because TypeScript only gives implicit index signatures
 * to type aliases, never to interfaces. Constraining that way would have forced every
 * consumer to declare their dictionary as a `type` — and an interface is the natural thing
 * to reach for. This self-referential mapped constraint accepts both.
 */
export type StringValues<T> = { [K in keyof T]: string };

/**
 * Locale → dictionary. Parameterised by the dictionary shape so an app can hand in its own
 * `interface Messages { … }` and get `t()` checked against it at compile time.
 */
export type LocaleMessages<TDict extends StringValues<TDict> = MessageDict> = Record<string, Partial<TDict>>;
export type TranslateParams = Record<string, string | number>;
export type LocaleChangeHandler = (locale: string) => void;

export interface I18nConfig<TDict extends StringValues<TDict> = MessageDict> {
  /** Initial locale. Overridden by a persisted choice when `persist` is on. */
  locale?: string;
  /** Locale used when a key is missing in the active locale. Defaults to 'en'. */
  fallbackLocale?: string;
  /**
   * Locale → key → string. Each locale is `Partial`, because a translation in progress is
   * the normal state — the fallback locale covers what a locale has not filled in yet.
   *
   * Wrapped in `NoInfer` so the dictionary type comes from the type argument and is never
   * reverse-engineered from this data. Without it, passing locales with different key sets
   * makes TypeScript infer their *intersection*, and a key that only the fallback locale
   * defines gets rejected at every call site — the incomplete translation would break the
   * build rather than fall back at runtime.
   */
  messages?: Record<string, Partial<NoInfer<TDict>>>;
  /** Persist the active locale to localStorage. Defaults to false. */
  persist?: boolean;
  /** localStorage key used when `persist` is on. Defaults to 'ran-locale'. */
  storageKey?: string;
  /** Seed the initial locale from the browser's language preferences when nothing else applies. */
  detectNavigator?: boolean;
}

const DEFAULT_STORAGE_KEY = 'ran-locale';

const EMPTY_PARAMS: TranslateParams = Object.freeze({});

/**
 * @description: The engine. Optionally parameterised by your dictionary shape.
 *
 * The default `MessageDict` is `Record<string, string>`, whose `keyof` is `string` — so
 * untyped use keeps working exactly as before. Passing your own interface instead turns every
 * `t()` call into a compile-time check, which is what stops a renamed or mistyped key from
 * degrading silently into "render the key itself" at runtime.
 *
 * @example
 * ```ts
 * interface Messages { save: string; cancel: string }
 * const i18n = createI18n<Messages>({ messages: { en: { save: 'Save', cancel: 'Cancel' } } });
 * i18n.t('save');    // ok
 * i18n.t('saev');    // compile error, instead of rendering "saev" to the user
 * ```
 */
export class I18nCore<TDict extends StringValues<TDict> = MessageDict> {
  private _locale: string;
  private _fallback: string;
  private _messages: LocaleMessages<TDict>;
  private _persist: boolean;
  private _storageKey: string;
  private _handlers = new Set<LocaleChangeHandler>();

  constructor(config: I18nConfig<TDict> = {}) {
    this._messages = { ...config.messages };
    this._fallback = config.fallbackLocale ?? 'en';
    this._persist = config.persist ?? false;
    this._storageKey = config.storageKey ?? DEFAULT_STORAGE_KEY;
    this._locale = this._resolveInitialLocale(config);
  }

  private _resolveInitialLocale(config: I18nConfig<TDict>): string {
    const available = Object.keys(this._messages);
    // priority: persisted choice → explicit config → navigator → fallback
    const stored = this._persist ? localStorageGetItem(this._storageKey) || null : null;
    if (stored && (this._messages[stored] || available.length === 0)) return stored;
    if (config.locale) return config.locale;
    if (config.detectNavigator) {
      // `resolveLocale` reads the whole ordered `navigator.languages` list, not just
      // `navigator.language` — a reader whose first choice isn't among the dictionaries
      // still gets their second rather than dropping straight to the fallback. An empty
      // fallback means "no match", which is what the next line branches on.
      const detected = resolveLocale({ supported: available, useNavigator: true, fallback: '' });
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
    if (this._persist) localStorageSetItem(this._storageKey, locale);
    this._notify();
  }

  /** Merge a dictionary into a locale (creating it if needed). Partial, so a locale can be filled in lazily. */
  addMessages(locale: string, dict: Partial<NoInfer<TDict>>): void {
    this._messages[locale] = { ...this._messages[locale], ...dict };
  }

  getMessages(locale: string = this._locale): Partial<TDict> {
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
  t(key: keyof TDict & string, params?: TranslateParams): string {
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

// Deliberately stored untyped: one module-level slot cannot know each caller's dictionary.
// `useI18n<TDict>()` re-applies the caller's type — the type argument must match what
// `createI18n` was given, which is the same discipline any global singleton requires.
let _globalI18n: I18nCore<MessageDict> | null = null;

/**
 * @description: Create and register the global i18n singleton.
 * @param {I18nConfig<TDict>} config
 * @return {I18nCore<TDict>}
 */
export function createI18n<TDict extends StringValues<TDict> = MessageDict>(
  config: I18nConfig<TDict> = {},
): I18nCore<TDict> {
  const instance = new I18nCore<TDict>(config);
  _globalI18n = instance as unknown as I18nCore<MessageDict>;
  return instance;
}

/**
 * @description: The active global instance, or null when none was created. Pass the same
 * dictionary type you gave `createI18n` to keep `t()` checked.
 * @return {I18nCore<TDict> | null}
 */
export function useI18n<TDict extends StringValues<TDict> = MessageDict>(): I18nCore<TDict> | null {
  return _globalI18n as unknown as I18nCore<TDict> | null;
}
