# encodeUrl

Safely encode a URL, excluding already-encoded sequences, handling unmatched surrogate pairs.

## API

### encodeUrl

#### Return

| Argument | Description | Type     |
| -------- | ----------- | -------- |
| `string` | Encoded URL | `string` |

#### Parameters

| Parameter | Description   | Type     | Default  |
| --------- | ------------- | -------- | -------- |
| `url`     | URL to encode | `string` | Required |

## Example

### Basic Usage

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### Handle Already Encoded URL

```js
import { encodeUrl } from 'ranuts';

// Already encoded parts won't be re-encoded
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### Handle Special Characters

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // Encoded URL
```

### Handle Invalid Encoding

```js
import { encodeUrl } from 'ranuts';

// Invalid encoding sequences (like %foo) will be re-encoded
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## Notes

1. **Smart encoding**: Only encodes unencoded parts, already-encoded sequences (like `%20`) remain unchanged.
2. **Surrogate pair handling**: Automatically handles unmatched surrogate pairs, replaces with Unicode replacement character.
3. **Safety**: Won't throw errors, will try to encode URL correctly as much as possible.
4. **Use case**: Commonly used to handle user-input URLs, build safe URLs, etc.
