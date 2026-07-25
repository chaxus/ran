# throttle

Throttle: when a function is triggered rapidly, run it at most once per interval. The first
call runs immediately (leading edge) and the last call inside a window is replayed when the
window closes (trailing edge), so the final state is never dropped.

Use it for scroll, pointer-move and drag — anything that needs **continuous feedback**.
For "only the final value matters" (search-as-you-type, autosave), use [debounce](./debounce).

## API

### throttle(fn, delay?)

#### Parameters

| Parameter | Description                  | Type       | Default  |
| --------- | ---------------------------- | ---------- | -------- |
| `fn`      | Function to throttle         | `Function` | Required |
| `delay`   | Minimum interval (ms)        | `number`   | `300`    |

#### Return

A throttled function that keeps the call-site `this` and arguments, plus:

| Member      | Description                                | Type              |
| ----------- | ------------------------------------------ | ----------------- |
| `cancel()`  | Drop the pending trailing call             | `() => void`      |
| `pending()` | Whether a trailing call is waiting          | `() => boolean`   |

## Example

```js
import { throttle } from 'ranuts';

const onScroll = throttle(() => update(window.scrollY), 100);
window.addEventListener('scroll', onScroll);

// On teardown — remove the listener *and* drop the pending trailing call
window.removeEventListener('scroll', onScroll);
onScroll.cancel();
```

## Notes

1. **Leading + trailing**: runs immediately, then once more at the end of the window with the
   latest arguments.
2. **`this` and arguments** are forwarded from the call site.
3. **Runs anywhere**: uses the bare `setTimeout`, so it works in Node, Web Workers and SSR.
4. **Each call to `throttle()` gets its own window** — two throttled functions never interfere.
5. **Always `cancel()` on teardown**, otherwise the trailing call fires into a destroyed context.

::: warning Removed in 0.3
`generateThrottle()` has been removed. It returned a factory whose generated functions all
**shared one timer and one timestamp**, so two unrelated throttled functions suppressed each
other. Replace `const g = generateThrottle(); const f = g(fn, delay)` with `throttle(fn, delay)`.
:::
