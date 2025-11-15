# getExtensions

Get corresponding file extension array based on MIME type.

## API

### getExtensions

#### Return

| Argument | Description                        | Type       |
| -------- | ---------------------------------- | ---------- |
| `Array`  | File extension array (without dot) | `string[]` |

#### Parameters

| Parameter  | Description | Type     | Default  |
| ---------- | ----------- | -------- | -------- |
| `mimeType` | MIME type   | `string` | Required |

## Example

### Basic Usage

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### Get All Extensions

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### File Type Validation

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## Notes

1. **Return format**: Returned extensions don't include dot (`.`), e.g., `'jpg'` instead of `'.jpg'`.
2. **Multiple extensions**: One MIME type may correspond to multiple extensions, returns all matching extensions.
3. **Empty array**: If MIME type doesn't exist, returns empty array.
4. **Use case**: Commonly used for file type validation, file upload checking, etc.
