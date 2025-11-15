# localStorageGetItem / localStorageSetItem

Safely operate localStorage with support for server-side rendering environments.

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

## Notes

1. **Server-side safety**: In server-side environments (no `window` object), it handles silently without throwing errors.

2. **Type limitation**: localStorage can only store strings, objects need to be stringified with `JSON.stringify()` first.

3. **Return value**: `localStorageGetItem` returns an empty string when the value doesn't exist, not `null`.

4. **Browser support**: Requires browser support for localStorage API.
