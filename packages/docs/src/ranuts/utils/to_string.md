# toString

Convert value to string type.

## API

### toString

#### Return

| Argument | Description      | Type     |
| -------- | ---------------- | -------- |
| `string` | Converted string | `string` |

#### Parameters

| Parameter | Description      | Type               | Default  |
| --------- | ---------------- | ------------------ | -------- |
| `value`   | Value to convert | `string \| number` | Required |

## Example

### Basic Usage

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### Type Conversion

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## Notes

1. **Simple wrapper**: This is a simple wrapper for `String()` function.
2. **Type support**: Supports string and number type conversion.
3. **Use case**: Commonly used for type conversion, string processing, etc.
