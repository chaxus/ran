# Instrumentation hooks

Tap into `console`, `fetch`, `XMLHttpRequest`, clicks, and uncaught errors, for a monitoring
backend, a debug overlay, or tests.

**Every one of them returns a teardown function. Keep it and call it.** Instrumenting a global
without a way back is a one-way door: tests cannot clean up after themselves, and a hot reload
re-patches an already-patched global until each call is nested through a dozen wrappers and
every event is reported N times.

## API

| Function                     | Instruments                          | Returns       |
| ---------------------------- | ------------------------------------ | ------------- |
| `handleConsole(hook)`        | `console.log/info/warn/error/assert` | `restore`     |
| `handleFetchHook(options)`   | `window.fetch`                       | `restore`     |
| `handleXhrHook(options)`     | `XMLHttpRequest#open` / `#send`      | `restore`     |
| `handleError(hook)`          | `error` + `unhandledrejection`       | `unsubscribe` |
| `handleClick(hook)`          | document clicks (capture phase)      | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | any property on any object           | `restore`     |

`handleFetchHook` / `handleXhrHook` take `{ requestHook, responseHook, errorHook }`.

## Example

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// on teardown (HMR, route change, test cleanup)
teardown.forEach((off) => off());
```

## Notes

1. **Original behaviour is preserved.** Responses pass through, errors are re-thrown, console
   output still prints.
2. **`replaceOld`'s restore only undoes its own patch.** If another layer patched on top
   afterwards, restoring blindly would silently uninstall that layer, so it declines instead.
3. **`handleXhrHook` patches the prototype**, so it applies to every instance; its listeners
   are registered with `{ once: true }` so a reused XHR object does not accumulate them.
4. **Do not report console output to a console-logging backend**: the hook fires on the very
   call it produces. (This is why `Monitor`'s `console` channel is off by default.)

::: warning Changed in 0.3
These all used to return `void`, with no way to uninstall. They now return a teardown function;
existing call sites keep working and can simply start using it.
:::
