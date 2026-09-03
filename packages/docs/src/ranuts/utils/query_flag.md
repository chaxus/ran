# queryFlag / isInIframe

Read a boolean URL flag, and tell whether the page is embedded: the two checks behind
`?embed`, `?readonly` and `?debug`.

## API

| Function               | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `queryFlag(key, url?)` | Whether a query parameter reads as true                          |
| `isInIframe()`         | Whether this page is running inside an iframe; `false` under SSR |

### `queryFlag`

| Parameter | Description              | Type     | Default          |
| --------- | ------------------------ | -------- | ---------------- |
| `key`     | Parameter name           | `string` | Required         |
| `url`     | Full URL or query string | `string` | Current location |

True for `?k`, `?k=`, `?k=1` and `?k=true` (case-insensitive). False for everything else,
including an absent parameter and an explicit `?k=false`.

## Example

### Read a flag

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← the usual spelling
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### Detect embed mode

```js
import { queryFlag, isInIframe } from 'ranuts';

// Embedded when framed, or when the host asked for it explicitly.
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### Skip analytics inside someone else's page

```js
import { isInIframe } from 'ranuts';

// Tracking here would attribute the host site's visitors to us.
if (!isInIframe()) initAnalytics();
```

### Read-only preview

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## Notes

1. **A bare flag is the common spelling.** `?embed` carries no value, so
   `getQuery(url).embed` is `''` (falsy), and a plain truthiness check silently misses the
   most common form. That is what `queryFlag` exists for.

2. **`?k=false` is false.** An explicit negative is honoured rather than treated as "present,
   therefore on".

3. **`isInIframe` is guarded.** Reading `window.parent` can throw across origins in some
   engines; an unreadable parent is treated as embedded, because that is what it means.

4. **Both are SSR-safe.** With no `window`, `isInIframe` is `false` and `queryFlag` is `false`
   unless a `url` is passed, so both work in build-time scripts by supplying the URL.
