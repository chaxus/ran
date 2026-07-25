# createLocalePath

URL maths for a multilingual site. Pure functions, no global state, no DOM — usable in a
build script (sitemap, `hreflang`) and in the browser alike.

Uses **sub-directories** (`/zh/book/`) rather than sub-domains (`zh.example.com/book/`):
search engines treat a sub-domain as a separate site whose authority starts from zero, while
a sub-directory inherits the main site's. The default locale lives at the root; every other
locale carries a prefix.

## API

### createLocalePath(config)

| Parameter       | Description                                                              | Type              | Default              |
| --------------- | ------------------------------------------------------------------------ | ----------------- | -------------------- |
| `locales`       | `{ code, prefix? }[]` — no prefix means "default locale, lives at root"  | `LocaleRoute[]`   | Required             |
| `defaultLocale` | Default locale code                                                      | `string`          | first prefix-less    |
| `base`          | Deployment sub-path, e.g. `/weread`; trailing slash is ignored            | `string`          | `''`                 |

Returns:

| Member                          | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `base` / `defaultLocale`        | Normalized config, read-only                                     |
| `localeFromPath(pathname)`      | Detect the locale; unknown paths fall back to the default        |
| `stripLocale(pathname)`         | Drop the locale prefix — the language-agnostic path for routing  |
| `href(path, code?)`             | Build a link for a locale                                        |
| `hrefForLocale(pathname, code)` | Re-point the current path at another locale (language switcher)  |
| `alternates(pathname)`          | Every locale's URL, for `<link rel="alternate" hreflang>`        |

## Example

```js
import { createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
  base: '/docs',
});

paths.href('/book/walden/');                    // '/docs/book/walden/'
paths.href('/book/walden/', 'zh-CN');           // '/docs/zh/book/walden/'
paths.localeFromPath('/docs/zh/book/');         // 'zh-CN'
paths.stripLocale('/docs/zh/book/');            // '/docs/book/'
paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'

// hreflang tags
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## Notes

1. **`href` is idempotent.** It strips any existing prefix before adding the new one, so
   feeding it an already-localized path does not double up — and `hrefForLocale` is just `href`.
2. **Longest prefix wins**, so `zh` does not swallow `/zh-hant/...`.
3. **`base` is only stripped from the start.** Using `replace(base, '')` would strip the first
   occurrence anywhere, which breaks when the path contains the base string mid-way.
4. **Query and hash are preserved** — the maths only touches the pathname.
5. **No global "current locale".** Pass the code explicitly, or default it. Which locale is
   active is the i18n runtime's job, not this module's.
