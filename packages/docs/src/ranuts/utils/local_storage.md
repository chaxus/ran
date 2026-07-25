# localStorage helpers

localStorage access that cannot throw, plus a prefixed JSON view over it.

`localStorage` is not merely absent under SSR — it also throws on _access_ in a third-party
iframe with cookies blocked, and on _write_ in Safari private mode or at quota. Every read and
write here is guarded, because a storage failure should degrade a preference, never break the
page.

## API

### localStorageSetItem

Set a value in localStorage.

#### Parameters

| Parameter | Description | Type     | Default  |
| --------- | ----------- | -------- | -------- |
| `name`    | Key name    | `string` | Required |
| `value`   | Value       | `string` | Required |

#### Return

No return value (`void`)

### localStorageGetItem

Get a value from localStorage.

#### Parameters

| Parameter | Description | Type     | Default  |
| --------- | ----------- | -------- | -------- |
| `name`    | Key name    | `string` | Required |

#### Return

| Argument | Description                                      | Type     |
| -------- | ------------------------------------------------ | -------- |
| `string` | Stored value, returns empty string if not exists | `string` |

### localStorageRemoveItem

Remove a key.

| Parameter | Description | Type     | Default  |
| --------- | ----------- | -------- | -------- |
| `name`    | Key name    | `string` | Required |

### createStore(prefix?)

A prefixed, JSON-serialising view over localStorage.

#### Return

| Method               | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `get(key, fallback)` | Stored value, or `fallback` when missing, unavailable or corrupt   |
| `set(key, value)`    | Serialise and store; `false` when nothing was written              |
| `remove(key)`        | Remove the key                                                     |
| `keyOf(key)`         | Full storage key (`prefix + key`) — useful for `storage` listeners |

## Example

### Basic Usage

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// Set value
localStorageSetItem('username', 'john');

// Get value
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### Store Object

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### Server-Side Safety

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// Won't throw error in server-side environment, fails silently
localStorageSetItem('key', 'value'); // Server-side: no operation
const value = localStorageGetItem('key'); // Server-side: returns ''
```

### Check Existence

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('Value exists:', value);
} else {
  console.log('Value does not exist');
}
```

### Namespaced JSON storage

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // writes agent_history_default
const restored = history.get('default', []); // [] when absent or corrupt
history.remove('default');
```

### Several features, one origin

```js
import { createStore } from 'ranuts';

// Prefixes keep unrelated features from colliding.
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## Notes

1. **Nothing here throws.** Missing storage, a blocked third-party frame, private mode, quota
   — all of them degrade quietly. `localStorageGetItem` returns `''`, the setters do nothing,
   and `createStore().set()` reports `false`.

2. **Guarded at call time, not module load.** The storage lookup happens inside each call, so
   these work after SSR-then-hydrate and can be stubbed in tests.

3. **`createStore` validates nothing.** Whatever was stored comes back typed as `T`; check it
   yourself if it crosses a version boundary. The fallback only covers absence and parse
   failure — a value written by an older version of your code cannot throw a `SyntaxError`
   into the caller, but it can still be the wrong shape.

4. **`set` returns `false`** for a circular structure, a `BigInt`, or a write that did not
   land. It reads the value back to confirm.

5. **Type limitation**: the raw helpers only handle strings. Use `createStore` rather than
   hand-rolling `JSON.stringify` / `JSON.parse` with a try/catch at each call site.

6. **Return value**: `localStorageGetItem` returns `''` when the value does not exist, not
   `null`.
