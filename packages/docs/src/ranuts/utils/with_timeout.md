# withTimeout / deferred

Promise primitives JavaScript does not ship: an externally settled promise, and a bounded wait.

## API

| Function                                                 | Description                                              |
| -------------------------------------------------------- | -------------------------------------------------------- |
| `deferred<T>()`                                          | `{ promise, resolve, reject }` — settle it from outside  |
| `withTimeout(promise, ms, options?)`                     | Reject with `TimeoutError` if it has not settled in `ms` |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | Resolve `fallback` instead of rejecting                  |
| `delay(ms)`                                              | Resolve after `ms`                                       |
| `TimeoutError`                                           | Error class thrown by `withTimeout`                      |

### `withTimeout` options

| Option      | Description                                                 | Default                            |
| ----------- | ----------------------------------------------------------- | ---------------------------------- |
| `message`   | Error message                                               | `operation timed out after {ms}ms` |
| `onTimeout` | Called when the deadline passes, to tear the operation down | —                                  |

## Example

### Bound a request, and abort it on timeout

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### Degrade instead of failing

```js
import { withTimeoutFallback } from 'ranuts';

// A slow save should return the original file, not break the flow.
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### Settle a promise from a callback

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### Serialise operations with a deadline

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## Notes

1. **The timer is always cleared**, including when the work wins the race. The usual
   hand-rolled version — `Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])` —
   leaks the timer whenever the task finishes first. In Node that keeps the process alive for
   the full deadline; in tests it leaves a stray timer firing into the next test.

2. **A timeout does not cancel the work.** A promise cannot be cancelled. `onTimeout` is
   where you abort the fetch, terminate the worker, or close the connection.

3. **`withTimeoutFallback` only absorbs the deadline.** A genuine rejection from the wrapped
   promise still propagates — a timeout is not an error, but an error still is.

4. **`delay` uses the bare `setTimeout`**, so it works in Node, Web Workers and the browser
   alike. `window.setTimeout` would throw outside a document.

5. **`deferred` beats outer `let`s.** Assigning the executor's arguments to variables
   declared outside is the common alternative; TypeScript cannot prove they are assigned, and
   it is easy to get subtly wrong.
