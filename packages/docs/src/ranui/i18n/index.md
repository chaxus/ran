# i18n

A framework-agnostic internationalization engine. It mirrors the [router](/src/ranui/router/)
design — a small core (`I18nCore`) with an optional global singleton
(`createI18n` / `useI18n`) and no DOM coupling, so you bind it to the UI however you like.

> **Use when** you need runtime locale switching in a ranui app — call `createI18n` once, then read strings with `useI18n().t(key, params)` and switch languages with `setLocale`. It has no framework or DOM dependency, so it works in plain JS, any framework, and SSR.

The engine ships as its own **`ranui/i18n`** entry — importing it registers **no** custom
elements, so a page that only needs translation never pulls in the component library. The
same exports are also available from the top-level `ranui` barrel.

## Quick start

Create the i18n singleton once at startup, then translate anywhere:

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // Each locale is a FLAT dictionary — keys are looked up verbatim, not nested.
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // used when a key is missing in the active locale
  persist: true, // remember the choice under localStorage key 'ran-locale'
  detectNavigator: true, // seed the initial locale from navigator.language
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // persists and notifies subscribers
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` looks up `messages[activeLocale][key]`, then `messages[fallbackLocale][key]`, and
finally returns the `key` itself if neither exists. `{param}` placeholders in the string are
interpolated from the second argument. Because lookup is a flat map access, **keys are literal
strings** — write `'hero.title'` as one key, not a nested `{ hero: { title } }` object.

## Parameters (interpolation)

Yes — messages take runtime parameters. Put `{name}`-style placeholders in the string and pass
the values as the second argument to `t()`; each `{param}` is replaced by the matching value:

```js
createI18n({
  messages: {
    en: {
      'cart.summary': '{count} items · ${total}',
      greeting: 'Welcome back, {user}!',
    },
    zh: {
      'cart.summary': '{count} 件商品 · ¥{total}',
      greeting: '欢迎回来，{user}！',
    },
  },
});

const i18n = useI18n();
i18n.t('cart.summary', { count: 3, total: 59.9 }); // → "3 items · $59.9"
i18n.t('greeting', { user: 'Ada' }); // → "Welcome back, Ada!"
```

Details:

- Placeholder syntax is `{word}` (letters, digits, `_`). Values may be strings or numbers —
  numbers are stringified.
- A placeholder with no matching key is **left as-is** (`{oops}` stays literally in the output),
  which makes missing params easy to spot rather than silently blank.
- Interpolation runs after locale fallback, so the same params work no matter which locale
  actually resolved the string.
- There is no built-in pluralization or number/date formatting — compose those with
  `Intl.NumberFormat` / `Intl.PluralRules` and pass the formatted string in as a param.

## Escaping literal braces

A lone `{` or `}`, or a spaced group like `{ color: red }`, is **not** a placeholder and passes
through untouched — so CSS, JSON, and code fragments inside a message are safe by default. The
only ambiguous case is a literal `{word}` you want to show verbatim. To escape it, **double the
braces** — the same convention as Rust `format!`, Python `str.format`, and .NET `String.Format`:

```js
const i18n = useI18n(); // messages below assumed registered

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"  (not interpolated)
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"  (value wrapped in literal braces)
```

| In the message | Output                                  |
| -------------- | --------------------------------------- |
| `{{`           | `{`                                     |
| `}}`           | `}`                                     |
| `{name}`       | the `name` param, or `{name}` if absent |
| `{ name }`     | `{ name }` (spaces → not a placeholder) |
| `{`            | `{` (lone brace)                        |

Escaping is applied in the same left-to-right pass as interpolation and works whether or not
you pass params, so `{{`/`}}` always mean literal braces.

> **Why doubling rather than a backslash or ICU-style quotes?** The heavyweight i18n stacks
> take different routes: **ICU MessageFormat** (react-intl / FormatJS, Java, PHP) escapes with a
> single quote — `'{'` — because it also parses rich `{count, plural, …}` / `{gender, select, …}`
> sub-syntax that needs a quoting character. **i18next** sidesteps escaping by making `{{name}}`
> itself the placeholder, so single braces are always literal. **Vue I18n** uses a literal-wrap
> form, `{'{'}`. ranui keeps the lightweight single-brace `{name}` syntax, and for that the
> brace-doubling rule is the least surprising complement: no new escape character, familiar from
> every mainstream format-string API, and trivial to reason about in one pass. If you need real
> plural/gender/number grammar, format with `Intl.*` and pass the result in as a param.

## Reacting to locale changes

`onChange` fires after every `setLocale`; use it to re-render the strings you've painted:

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // re-run your t() calls
});

// later, when the view unmounts
unsubscribe();
```

## Adding messages lazily

Load a locale's dictionary on demand (e.g. code-split per language) and merge it in:

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // merges into any existing 'fr' dictionary
i18n.setLocale('fr');
```

## API

`createI18n(config)` creates and registers the global singleton (call once);
`useI18n()` returns it, or `null` if `createI18n` hasn't run yet.

### `I18nConfig`

| Field             | Type             | Default        | Description                                                  |
| ----------------- | ---------------- | -------------- | ------------------------------------------------------------ |
| `messages`        | `LocaleMessages` | `{}`           | `locale → { key → string }`. Each dictionary is flat.        |
| `locale`          | `string`         | fallback       | Initial locale (overridden by a persisted choice when on).   |
| `fallbackLocale`  | `string`         | `'en'`         | Locale consulted when a key is missing in the active locale. |
| `persist`         | `boolean`        | `false`        | Persist the active locale to `localStorage`.                 |
| `storageKey`      | `string`         | `'ran-locale'` | localStorage key used when `persist` is on.                  |
| `detectNavigator` | `boolean`        | `false`        | Seed the initial locale from `navigator.language`.           |

### `I18nCore` methods

| Method                      | Returns       | Description                                                   |
| --------------------------- | ------------- | ------------------------------------------------------------- |
| `t(key, params?)`           | `string`      | Translate; falls back to fallback locale, then the key.       |
| `setLocale(locale)`         | `void`        | Switch locale; persists (if on) and notifies subscribers.     |
| `getLocale()`               | `string`      | The active locale.                                            |
| `onChange(handler)`         | `() => void`  | Subscribe to locale changes; returns an unsubscribe function. |
| `addMessages(locale, dict)` | `void`        | Merge more messages into a locale.                            |
| `getMessages(locale?)`      | `MessageDict` | Read a locale's dictionary (defaults to the active locale).   |
| `availableLocales`          | `string[]`    | Locales that have a dictionary registered.                    |
| `destroy()`                 | `void`        | Remove all subscribers.                                       |

**Types**

```ts
type MessageDict = Record<string, string>; // flat: 'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // locale → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

The core is SSR-safe: `localStorage` and `navigator` access is guarded, so `createI18n` /
`t` run without throwing during server rendering. Persistence and navigator detection simply
no-op on the server and take effect once the code runs in the browser.
