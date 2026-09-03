# createSignal

A minimal signal: `[read, write]`, with optional broadcast over the shared
[`subscribers`](./sync_hook) bus so unrelated modules can react to a change.

## API

### createSignal(value, options?)

#### Parameters

| Parameter            | Description                                          | Type                                         | Default     |
| -------------------- | ---------------------------------------------------- | -------------------------------------------- | ----------- |
| `value`              | Initial value                                        | `T`                                          | Required    |
| `options.subscriber` | Event name; broadcasts on `subscribers` when changed | `string`                                     | `undefined` |
| `options.equals`     | How to decide "did it change"                        | `boolean \| ((prev: T, next: T) => boolean)` | `true`      |

`equals` semantics:

| Value            | Behaviour                                                         |
| ---------------- | ----------------------------------------------------------------- |
| omitted / `true` | `Object.is`: reference/value equality (standard signal semantics) |
| `false`          | Every write counts as a change and notifies                       |
| a function       | Return `true` to mean "equal, skip the notification"              |

#### Return

`[getter, setter]`.

## Example

```js
import { createSignal, isEqual, subscribers } from 'ranuts';

const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
subscribers.tap('count-changed', () => render(count()));

setCount(1); // notifies
setCount(1); // same value — no notification

// Opt in to deep comparison when you actually need it
const [tree, setTree] = createSignal(initial, { equals: isEqual });
```

## Notes

1. **Reference equality by default.** A freshly built but deep-equal object _is_ a change.
   This matches standard signal semantics and keeps writes O(1).
2. **Deep comparison is opt-in** via `{ equals: isEqual }`, so the cost is visible at the
   call site.
3. **`subscriber` is optional.** Without it the signal is purely local state.

::: warning Changed in 0.3
Two fixes that change behaviour:

- `{ equals: true }` used to mean "always equal", freezing the signal so it **never updated**.
  It now means "use the default comparison", consistent with `undefined`.
- Every write used to run `cloneDeep` + `isEqual` on top of `equals`. That put an
  O(data-size) copy on the write hot path, and the extra deep check overrode `equals`, so
  `{ equals: false }` ("always notify") silently did nothing for deep-equal values. Both are gone.
  :::
