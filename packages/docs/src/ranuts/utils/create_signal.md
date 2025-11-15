# createSignal

Create a reactive signal (Signal) that notifies subscribers when value changes.

## API

### createSignal

#### Return

| Argument           | Description                         | Type                               |
| ------------------ | ----------------------------------- | ---------------------------------- |
| `[getter, setter]` | Returns getter and setter functions | `[() => T, (newValue: T) => void]` |

#### Parameters

| Parameter | Description                      | Type      | Default  |
| --------- | -------------------------------- | --------- | -------- |
| `value`   | Initial value                    | `T`       | Required |
| `options` | Configuration options (optional) | `Options` | Optional |

#### Options

| Parameter    | Description                             | Type                  | Default  |
| ------------ | --------------------------------------- | --------------------- | -------- |
| `subscriber` | Subscriber identifier                   | `string`              | Optional |
| `equals`     | Equality comparison function or boolean | `boolean \| Function` | Optional |

## Example

### Basic Usage

```js
import { createSignal } from 'ranuts';

const [count, setCount] = createSignal(0);

console.log(count()); // 0
setCount(10);
console.log(count()); // 10
```

### Subscribe to Changes

```js
import { createSignal, subscribers } from 'ranuts';

const [name, setName] = createSignal('John', {
  subscriber: 'nameSignal',
});

// Subscribe to changes
subscribers.tap('nameSignal', () => {
  console.log('Name changed:', name());
});

setName('Jane'); // Triggers subscription callback
```

### Custom Comparison Function

```js
import { createSignal } from 'ranuts';

const [user, setUser] = createSignal(
  { id: 1, name: 'John' },
  {
    equals: (prev, next) => prev.id === next.id,
  },
);

// Only updates when id is different
setUser({ id: 1, name: 'Jane' }); // Won't update (same id)
setUser({ id: 2, name: 'Bob' }); // Will update (different id)
```

### Disable Auto Comparison

```js
import { createSignal } from 'ranuts';

const [data, setData] = createSignal(
  { value: 1 },
  {
    equals: false, // Always updates, no comparison
  },
);
```

## Notes

1. **Reactive**: Automatically notifies subscribers when value changes (if `subscriber` is set).
2. **Deep comparison**: Defaults to using `isEqual` for deep comparison, only updates when value truly changes.
3. **Custom comparison**: Can customize comparison logic through `equals` option.
4. **Use case**: Commonly used for state management, reactive UI, data binding, etc.
