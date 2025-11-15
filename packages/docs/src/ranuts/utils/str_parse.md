# strParse

Parse a string into an object with custom separators and equals sign.

## API

### strParse

#### Return

| Argument | Description   | Type                     |
| -------- | ------------- | ------------------------ |
| `Object` | Parsed object | `Record<string, string>` |

#### Parameters

| Parameter | Description                       | Type               | Default |
| --------- | --------------------------------- | ------------------ | ------- |
| `str`     | String to parse                   | `string`           | `''`    |
| `sep`     | Separator between key-value pairs | `string \| RegExp` | `''`    |
| `eq`      | Equals sign between key and value | `string \| RegExp` | `''`    |

## Example

### Basic Usage (URL Query String)

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Custom Separator

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### Use Regular Expression

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Handle Empty Values

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' } (empty values are filtered)
```

## Notes

1. **Separator**: The first parameter is the separator between key-value pairs (e.g., `&`), the second parameter is the equals sign between key and value (e.g., `=`).
2. **Empty value filtering**: Keys or values that are empty will be automatically filtered and won't appear in the result object.
3. **Auto cleaning**: Keys and values are automatically cleaned using `clearStr` (removes spaces, quotes, etc.).
4. **Regex support**: Supports both strings and regular expressions as separators.
