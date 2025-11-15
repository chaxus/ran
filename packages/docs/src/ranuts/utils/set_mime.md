# setMime

Set or update MIME type mapping.

## API

### setMime

#### Return

| Argument              | Description           | Type                  |
| --------------------- | --------------------- | --------------------- |
| `Map<string, string>` | MIME type mapping Map | `Map<string, string>` |

#### Parameters

| Parameter  | Description    | Type     | Default  |
| ---------- | -------------- | -------- | -------- |
| `ext`      | File extension | `string` | Required |
| `mimeType` | MIME type      | `string` | Required |

## Example

### Basic Usage

```js
import { setMime, getMime } from 'ranuts';

// Set custom MIME type
setMime('.myext', 'application/x-my-custom-type');

// Get MIME type
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### Update Existing Type

```js
import { setMime, getMime } from 'ranuts';

// Update .js MIME type
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### Add New Type

```js
import { setMime } from 'ranuts';

// Add new file type mapping
setMime('.xyz', 'application/x-xyz-format');
```

## Notes

1. **Global impact**: After setting, affects global MIME type mapping, all places using `getMime` will be affected.
2. **Override behavior**: If extension already exists, will override original MIME type.
3. **Return value**: Returns entire MIME type Map, can continue operations.
4. **Use case**: Commonly used to add custom file type MIME type mappings.
