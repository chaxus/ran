# transformText

Convert ArrayBuffer to text, automatically detect encoding and decode.

## API

### transformText

#### Return

| Argument                     | Description                           | Type                         |
| ---------------------------- | ------------------------------------- | ---------------------------- |
| `TransformText \| undefined` | Conversion result object or undefined | `TransformText \| undefined` |

#### TransformText

| Property   | Description       | Type     |
| ---------- | ----------------- | -------- |
| `encoding` | Detected encoding | `string` |
| `content`  | Decoded text      | `string` |

#### Parameters

| Parameter | Description        | Type                    | Default  |
| --------- | ------------------ | ----------------------- | -------- |
| `content` | Content to convert | `string \| ArrayBuffer` | Required |

## Example

### Basic Usage

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('Encoding:', result.encoding);
  console.log('Content:', result.content); // 'Hello World'
}
```

### Process File

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### Auto Encoding Detection

```js
import { transformText } from 'ranuts';

// Automatically detect encoding and decode
const result = transformText(arrayBuffer);
if (result) {
  console.log(`Successfully decoded using ${result.encoding} encoding`);
  console.log(result.content);
}
```

## Notes

1. **Auto detection**: Uses `jschardet` to automatically detect encoding type.
2. **ArrayBuffer only**: Currently only supports `ArrayBuffer` type, string type will output warning.
3. **Return condition**: Only returns result when encoding is detected and decoding succeeds, otherwise returns `undefined`.
4. **Use case**: Commonly used for file reading, text decoding, encoding conversion, etc.
