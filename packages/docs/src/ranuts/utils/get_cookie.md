# getCookie

Get the value of the cookie with the given name.

## API

### Return

| Argument | Description                                     | Type     |
| -------- | ----------------------------------------------- | -------- |
| `string` | The value of the cookie with the specified name | `string` |

### Options

| Argument | Description                | Type     | Default  |
| -------- | -------------------------- | -------- | -------- |
| `name`   | Name of the cookie to read | `string` | Required |

## Example

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
