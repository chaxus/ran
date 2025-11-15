# clearStr

Remove leading/trailing spaces, URL encoding, and quotes from a string.

## API

### clearStr

#### Return

| Argument | Description    | Type     |
| -------- | -------------- | -------- |
| `string` | Cleaned string | `string` |

#### Parameters

| Parameter | Description           | Type             | Default  |
| --------- | --------------------- | ---------------- | -------- |
| `str`     | String to clean       | `string`         | Required |
| `options` | Configuration options | `ClearStrOption` | `{}`     |

#### Options

| Parameter    | Description                   | Type      | Default |
| ------------ | ----------------------------- | --------- | ------- |
| `urlencoded` | Whether to perform URL decode | `boolean` | `true`  |

## Example

### Basic Usage

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### URL Encoded String

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (auto decoded)
```

### Disable URL Decoding

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (not decoded)
```

### Handle Quotes

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## Notes

1. **Cleaning content**: Removes leading/trailing spaces, single quotes, and double quotes.
2. **URL decoding**: Performs URL decoding by default, can be disabled with `urlencoded: false`.
3. **Use case**: Commonly used to clean user input or values extracted from URL parameters.
