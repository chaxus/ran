# escapeHtml

Escape HTML special characters to prevent XSS attacks.

## API

### escapeHtml

#### Return

| Argument | Description    | Type     |
| -------- | -------------- | -------- |
| `string` | Escaped string | `string` |

#### Parameters

| Parameter | Description      | Type                       | Default  |
| --------- | ---------------- | -------------------------- | -------- |
| `string`  | String to escape | `string \| number \| null` | Required |

## Example

### Basic Usage

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### Escape Special Characters

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### Handle Numbers and null

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### Prevent XSS Attacks

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// Safe display, won't execute script
```

## Notes

1. **Escaped characters**: Escapes the following characters:
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **Type conversion**: Non-string types are first converted to strings before escaping.

3. **Security**: Used to prevent XSS attacks, should be used when displaying user input content.

4. **Performance**: For strings that don't contain special characters, returns the original string directly.
