# debounce

Debounce: when a function is triggered rapidly, run it **only after the triggering stops**
for `ms` milliseconds. Use it when only the final state matters — search-as-you-type,
window resize, autosave.

For "I need the intermediate values too", use [throttle](./throttle).

## API

### debounce(fn, ms?)

#### Parameters

| Parameter | Description            | Type       | Default  |
| --------- | ---------------------- | ---------- | -------- |
| `fn`      | Function to debounce   | `Function` | Required |
| `ms`      | Quiet period (ms)      | `number`   | `500`    |

#### Return

A debounced function that keeps the call-site `this` and the **last** arguments, plus:

| Member      | Description                                            | Type            |
| ----------- | ------------------------------------------------------ | --------------- |
| `cancel()`  | Drop the pending call                                   | `() => void`    |
| `flush()`   | Run the pending call right now (e.g. before submitting) | `() => void`    |
| `pending()` | Whether a call is waiting                               | `() => boolean` |

## Example

```js
import { debounce } from 'ranuts';

const save = debounce((draft) => api.save(draft), 800);
input.addEventListener('input', (e) => save(e.target.value));

form.addEventListener('submit', () => save.flush()); // don't lose the last keystroke
onUnmount(() => save.cancel());
```

## Notes

1. **Only the last call runs**, with the arguments of that last call.
2. **`this` is taken from the call site** — `obj.handler()` sees `obj`.
3. **Always `cancel()` on teardown**, otherwise the pending timer fires into a destroyed context.
4. **Fully typed**: parameter and return types are inferred from `fn`.
