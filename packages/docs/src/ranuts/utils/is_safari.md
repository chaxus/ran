# isSafari

Determine if the current browser is Safari.

## API

### isSafari

#### Return

| Argument                         | Description                  | Type                             |
| -------------------------------- | ---------------------------- | -------------------------------- |
| `boolean \| undefined \| string` | Whether it is Safari browser | `boolean \| undefined \| string` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('Current browser is Safari');
} else {
  console.log('Not Safari browser');
}
```

### Safari-Specific Features

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Safari-specific handling
  // e.g., handle certain Safari compatibility issues
  applySafariFix();
}
```

### Server-Side Environment

```js
import { isSafari } from 'ranuts';

// Returns undefined in server-side environment
const result = isSafari();
console.log(result); // undefined (server-side environment)
```

## Notes

1. **Detection method**: Determines by checking if `navigator.vendor` contains 'Apple'.
2. **Exclude other browsers**: Excludes Chrome iOS (CriOS) and Firefox iOS (FxiOS).
3. **Server-side environment**: Returns `undefined` in server-side environments (no `navigator` object).
4. **Return value**: Returns `boolean` in browser environment, `undefined` in server-side, may return string in some cases.
