# getCookieByName

Get Cookie value by name using regular expression.

## API

### getCookieByName

#### Return

| Argument | Description                                      | Type     |
| -------- | ------------------------------------------------ | -------- |
| `string` | Cookie value, returns empty string if not exists | `string` |

#### Parameters

| Parameter | Description | Type     | Default  |
| --------- | ----------- | -------- | -------- |
| `name`    | Cookie name | `string` | Required |

## Example

### Basic Usage

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // Cookie value or empty string
```

### Difference from getCookie

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie uses string splitting
const value1 = getCookie('token');

// getCookieByName uses regular expression
const value2 = getCookieByName('token');

// Both have same functionality but different implementation
```

### Check if Cookie Exists

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('Session ID:', sessionId);
} else {
  console.log('Session ID does not exist');
}
```

## Notes

1. **Regex matching**: Uses regular expression to match Cookie, supports cases where Cookie name has spaces before/after.
2. **Server-side safety**: Returns empty string in server-side environments (no `window` object), won't throw errors.
3. **Difference from getCookie**: Same functionality, but `getCookieByName` uses regular expression, `getCookie` uses string splitting.
4. **Return value**: Returns empty string when Cookie doesn't exist, not `null` or `undefined`.
