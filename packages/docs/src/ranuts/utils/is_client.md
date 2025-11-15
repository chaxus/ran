# isClient

Determine if the current environment is a client (browser) environment.

## API

### isClient

#### Return

| Argument  | Description                      | Type      |
| --------- | -------------------------------- | --------- |
| `boolean` | Whether it is client environment | `boolean` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('Currently in browser environment');
  // Can use browser APIs like window, document
  window.localStorage.setItem('key', 'value');
} else {
  console.log('Currently in server-side environment');
}
```

### Conditional Execution

```js
import { isClient } from 'ranuts';

// Only execute in client
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### Server-Side Rendering Safety

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## Notes

1. **Detection method**: Determines by checking `typeof window !== 'undefined'`.
2. **Constant value**: `isClient` is a constant, not a function, no parentheses needed when using.
3. **Use case**: Commonly used to distinguish between client and server-side environments, avoiding errors when using browser APIs on server-side.
