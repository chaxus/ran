# resolveLocale

Pick which of your supported locales to use, from the usual chain:
**query → cookie → localStorage → navigator → fallback**.

The catalogue of messages is yours; this only picks the key.

## API

### resolveLocale(options)

| Option         | Description                                                              | Type                | Default          |
| -------------- | ------------------------------------------------------------------------ | ------------------- | ---------------- |
| `supported`    | Locales you actually ship, most specific first                           | `readonly string[]` | Required         |
| `fallback`     | Returned when nothing matches                                            | `string`            | `supported[0]`   |
| `query`        | Query parameter carrying an explicit choice, e.g. `lang`                 | `string`            | —                |
| `cookie`       | Cookie name carrying the choice                                          | `string`            | —                |
| `storageKey`   | localStorage key carrying the choice the user last picked                | `string`            | —                |
| `useNavigator` | Consult `navigator.languages` / `navigator.language` before falling back | `boolean`           | `true`           |
| `url`          | URL to read the query from                                               | `string`            | Current location |

#### Return

The matching entry of `supported` — always one of them, never an arbitrary string.

## Example

### Full chain

```js
import { resolveLocale } from 'ranuts';

const locale = resolveLocale({
  supported: ['en', 'zh-CN'],
  query: 'lang',
  cookie: 'lang',
  storageKey: 'app-lang',
});

document.documentElement.lang = locale;
render(messages[locale]);
```

### Region variants fall back to the base language

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'  (unsupported → fallback)
```

### Pair with locale URLs

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// Prefer what the URL already says; fall back to the user's own preference.
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## Notes

1. **The order is the point.** A `?lang=` in the URL is explicit, shareable and one-off, so it
   beats everything. A cookie is a server-visible decision, so it beats client-only state.
   localStorage is what the user last chose in-app. `navigator.language` is only a guess about
   a first-time visitor. Getting this backwards produces the classic bug where a shared
   `?lang=en` link keeps rendering in the recipient's stored language.

2. **The result is always one of `supported`.** A value outside the list is ignored rather
   than returned, so the result is safe to index a message catalogue with.

3. **Matching is case-insensitive and falls back by base language.** With
   `supported: ['en', 'zh-CN']`, `en-GB` matches `en` and `zh` matches `zh-CN`.

4. **`navigator.languages` is consulted in order**, not just `navigator.language` — the list
   is the user's actual ranked preference, and its head is often not the best available match.

5. **Every source degrades quietly.** No `window`, no `document.cookie`, no localStorage —
   each simply contributes nothing, so the chain works under SSR and in build-time scripts.
