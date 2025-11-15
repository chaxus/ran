# checkEncoding

Detect character encoding of Uint8Array data.

## API

### checkEncoding

#### Return

| Argument | Description            | Type     |
| -------- | ---------------------- | -------- |
| `string` | Detected encoding type | `string` |

#### Parameters

| Parameter    | Description    | Type         | Default  |
| ------------ | -------------- | ------------ | -------- |
| `uint8Array` | Data to detect | `Uint8Array` | Required |

## Example

### Basic Usage

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' or other detected encoding
```

### Detect File Encoding

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### Text Decoding

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## Notes

1. **Dependency**: Uses `jschardet` library for encoding detection.
2. **Default encoding**: If detection fails, defaults to `'utf-8'`.
3. **Accuracy**: Encoding detection is not 100% accurate, especially for short text.
4. **Use case**: Commonly used for file processing, text decoding, character encoding conversion, etc.
