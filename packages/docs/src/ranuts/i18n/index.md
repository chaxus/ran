# i18n

A framework-agnostic internationalisation engine: a small reactive core (`I18nCore`) with an
optional global singleton (`createI18n` / `useI18n`). Nothing here touches the DOM — bind it to the
UI however you like.

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

It is also re-exported from `ranuts/utils`. Import from `ranuts/i18n` when i18n is all you need —
that entry carries only the engine and its two helpers, instead of whatever else the broad `utils`
barrel happens to pull in.

## Usage

```ts
import { createI18n, useI18n } from 'ranuts/i18n';

createI18n({
  messages: {
    en: { 'hero.title': 'Hello, {name}', 'nav.docs': 'Docs' },
    zh: { 'hero.title': '你好，{name}', 'nav.docs': '文档' },
  },
  fallbackLocale: 'en',
  persist: true,
  detectNavigator: true,
});

const i18n = useI18n()!;
i18n.t('hero.title', { name: 'Ada' }); // "Hello, Ada"
i18n.setLocale('zh');
i18n.t('hero.title', { name: 'Ada' }); // "你好，Ada"
```

Dictionaries are **flat** — `t()` does a direct `messages[locale][key]` lookup, so keys are literal
strings like `'hero.title'`, not nested objects.

## Initial locale

Resolved once in the constructor, in this order:

1. The persisted choice in `localStorage` (only when `persist` is on, and only if that locale has a
   dictionary)
2. `config.locale`
3. The browser's languages (only when `detectNavigator` is on)
4. `fallbackLocale`

Step 3 goes through [`resolveLocale`](/src/ranuts/utils/resolve_locale), which reads the whole
ordered `navigator.languages` list rather than just `navigator.language` — a reader whose first
choice isn't among your dictionaries still gets their second, instead of dropping straight to the
fallback.

## Interpolation

`t(key, params)` substitutes `{param}` placeholders in a single left-to-right pass, following the
format-string convention of Rust `format!`, Python `str.format` and .NET `String.Format`:

::: v-pre

| Input                       | Output                                                                       |
| --------------------------- | ---------------------------------------------------------------------------- |
| `{{`                        | literal `{`                                                                  |
| `}}`                        | literal `}`                                                                  |
| `{name}`                    | `params.name`, stringified                                                   |
| `{name}` with no such param | left untouched, so a stray placeholder is visible rather than silently blank |

:::

A lone `{` / `}` or a spaced group like `{ x }` is **not** a placeholder and is emitted verbatim, so
CSS, JSON or code fragments inside a message pass through unharmed. To wrap a value in literal
braces, double the outer pair — <code v-pre>{{{name}}}</code>.

## Typed dictionaries

Pass your dictionary shape as a type argument and every `t()` call is checked at compile time.
Without it, a renamed or mistyped key degrades silently into "render the key itself" — the
user sees `agentModelFirstDownlaod` where a sentence should be, and nothing fails until then.

```ts
interface Messages {
  save: string;
  cancel: string;
}

const i18n = createI18n<Messages>({
  messages: {
    en: { save: 'Save', cancel: 'Cancel' },
    'zh-CN': { save: '保存' }, // still being translated — that is fine
  },
  fallbackLocale: 'en',
});

i18n.t('save'); // ok
i18n.t('saev'); // compile error

useI18n<Messages>()?.t('cancel'); // pass the same type back to keep the check
```

Three details make this usable rather than merely available:

1. **Each locale is `Partial`.** A translation in progress is the normal state; the fallback
   locale covers what a locale has not filled in yet.
2. **The type comes from the type argument, never from the data.** `messages` is wrapped in
   `NoInfer`, so locales with different key sets cannot make TypeScript infer their
   _intersection_ — otherwise a key only the fallback defines would be rejected at every call
   site, and an incomplete translation would break the build instead of falling back at runtime.
3. **An `interface` works, not just a `type`.** The constraint is `StringValues<T>`
   (`{ [K in keyof T]: string }`) rather than `Record<string, string>`, because TypeScript
   only gives implicit index signatures to type aliases — constraining the obvious way would
   have forced every consumer to rewrite their dictionary as a `type`.

Omitting the type argument keeps the untyped behaviour exactly: the default `MessageDict` is
`Record<string, string>`, whose `keyof` is `string`.

## Config

| Field             | Description                                                           | Type             | Default        |
| ----------------- | --------------------------------------------------------------------- | ---------------- | -------------- |
| `locale`          | Initial locale. Overridden by a persisted choice when `persist` is on | `string`         | `-`            |
| `fallbackLocale`  | Locale used when a key is missing in the active locale                | `string`         | `'en'`         |
| `messages`        | Locale → key → string                                                 | `LocaleMessages` | `{}`           |
| `persist`         | Persist the active locale to `localStorage`                           | `boolean`        | `false`        |
| `storageKey`      | `localStorage` key used when `persist` is on                          | `string`         | `'ran-locale'` |
| `detectNavigator` | Seed the initial locale from the browser's language preferences       | `boolean`        | `false`        |

## API

### createI18n

Create and register the global singleton.

#### Parameters

| Parameter | Description    | Type         | Default |
| --------- | -------------- | ------------ | ------- |
| `config`  | See **Config** | `I18nConfig` | `{}`    |

#### Return

| Argument | Description      | Type       |
| -------- | ---------------- | ---------- |
| `i18n`   | The new instance | `I18nCore` |

### useI18n

Return the active global instance, or `null` when none was created.

#### Return

| Argument | Description                   | Type               |
| -------- | ----------------------------- | ------------------ |
| `i18n`   | The active instance or `null` | `I18nCore \| null` |

### I18nCore

| Member                      | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| `t(key, params?)`           | Translate; falls back to the fallback locale, then the key itself    |
| `locale` / `getLocale()`    | The active locale                                                    |
| `setLocale(locale)`         | Switch locale, persist (when enabled) and notify. No-op if unchanged |
| `addMessages(locale, dict)` | Merge a dictionary into a locale, creating it if needed              |
| `getMessages(locale?)`      | The dictionary for a locale, or `{}`                                 |
| `availableLocales`          | Locales that have a dictionary registered                            |
| `onChange(fn)`              | Subscribe to locale changes; returns an unsubscribe function         |
| `destroy()`                 | Remove all subscribers                                               |

## SSR

Safe. All `localStorage` and `navigator` access is guarded, so constructing an instance during
server rendering falls through to `config.locale` or `fallbackLocale`.
