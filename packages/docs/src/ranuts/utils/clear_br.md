# clearBr

Remove spaces, HTML tags, and line breaks from a string.

## API

### clearBr

#### Return

| Argument | Description    | Type     |
| -------- | -------------- | -------- |
| `string` | Cleaned string | `string` |

#### Parameters

| Parameter | Description     | Type     | Default |
| --------- | --------------- | -------- | ------- |
| `str`     | String to clean | `string` | `''`    |

## Example

### Basic Usage

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### Clean HTML Content

```js
import { clearBr } from 'ranuts';

const html = '<div>This is <strong>test</strong> content</div>\nline break';
const cleaned = clearBr(html);
console.log(cleaned); // 'Thisistestcontentlinebreak'
```

### Handle Empty String

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // '' (empty string)
console.log(clearBr()); // '' (empty string)
```

## Notes

1. **Cleaning content**: Removes all spaces, HTML tags, and line breaks (`\r\n`).
2. **Empty string handling**: If input is empty string, returns empty string directly.
3. **Use case**: Commonly used to extract plain text content, removing format markers.
