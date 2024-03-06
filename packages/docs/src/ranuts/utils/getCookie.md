# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| -------- | ----------------------------------------------------- | -------- |
| `sting`  | Returns the value of a cookie with the specified name | `string` |

### Options

| argument | Instructions                                         | type     | Default value |
| -------- | ---------------------------------------------------- | -------- | ------------- |
| name     | Specifies the value of the name that gets the cookie | `object` | 无            |

## Example

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
