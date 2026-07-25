# once / singleFlight

Run something **exactly once** and reuse the result — lazy initialization for config parsing,
expensive one-off computation, lazy getters. `once` is synchronous; `singleFlight` is the
async counterpart.

## API

### once(fn)

| Parameter | Description                                                  | Type              | Default  |
| --------- | ------------------------------------------------------------ | ----------------- | -------- |
| `fn`      | Function to run once; a non-function value is returned as-is | `Function \| any` | Required |

Returns a wrapped function. The first call evaluates and caches; every later call returns
that first result, **whatever arguments are passed**.

### singleFlight(fn)

| Parameter | Description                | Type               | Default  |
| --------- | -------------------------- | ------------------ | -------- |
| `fn`      | Async function to run once | `() => Promise<T>` | Required |

Returns a wrapped function plus:

| Member    | Description                                                | Type         |
| --------- | ---------------------------------------------------------- | ------------ |
| `reset()` | Discard the cached result so the next call runs `fn` again | `() => void` |
| `started` | Whether it has a result or is currently running            | `boolean`    |

### memoize(fn)

Deprecated alias of `once`. See the warning below.

## Example

```js
import { once, singleFlight } from 'ranuts';

// Sync: parse the config only on first access
const config = once(() => JSON.parse(rawConfig));
config(); // parses
config(); // cached

// Async: open the database once, no matter how many callers race
const ready = singleFlight(() => db.openDataBase());
await Promise.all([ready(), ready(), ready()]); // opens once
```

## Notes

1. **`once` is not keyed by arguments.** Only the first call's arguments take effect. If you
   need per-argument caching, use a `Map` yourself.
2. **`once` releases `fn` after evaluating**, so whatever it captured can be garbage collected.
3. **`singleFlight` does not cache rejections.** A failed attempt clears the cache so a
   transient network blip stays retryable — caching a rejected promise would make one glitch
   permanent.
4. **Concurrent `singleFlight` callers share the in-flight promise**, so `fn` runs once even
   when N callers race. This is the fix for the classic "init() returns void, so callers can't
   await it, so early writes fail" bug.

::: warning Renamed in 0.3
`memoize` was a misleading name — it never cached by argument, it just ran once. It is now an
alias of `once` and is deprecated. The type signature was also wrong before (declared as
zero-argument while it forwarded arguments); it now infers from `fn`.
:::
