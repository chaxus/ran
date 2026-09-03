# matchMediaQuery / watchMediaQuery

Read and subscribe to a CSS media query from JavaScript.

Prefer these over `isMobile()` for layout decisions: UA sniffing identifies the **device**,
a media query identifies the **viewport**, and only the latter is right when a desktop
browser is narrowed or a tablet is rotated.

## API

| Function                           | Description                                           |
| ---------------------------------- | ----------------------------------------------------- |
| `matchMediaQuery(query)`           | Does the query match right now? `false` under SSR     |
| `watchMediaQuery(query, callback)` | Subscribe to changes; returns an unsubscribe function |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`, the shared mobile breakpoint  |

## Example

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## Notes

1. **The callback fires once synchronously** with the current value, so you never have to read
   the initial state separately.
2. **Always unsubscribe.** An unreleased `MediaQueryList` listener keeps the closure (and
   whatever DOM it captured) alive.
3. **Old Safari is handled.** `addEventListener` on `MediaQueryList` only landed in Safari 14;
   `addListener`/`removeListener` is used as a fallback.
