# convertImageToBase64

Convert an image file to a Base64 encoded string.

## API

### convertImageToBase64

#### Return

| Argument                              | Description                            | Type      |
| ------------------------------------- | -------------------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | Promise that resolves to result object | `Promise` |

#### convertImageToBase64Return

| Property  | Description        | Type                            |
| --------- | ------------------ | ------------------------------- |
| `success` | Whether successful | `boolean`                       |
| `data`    | Base64 data        | `string \| ArrayBuffer \| null` |
| `message` | Error message      | `string`                        |

#### Parameters

| Parameter | Description       | Type   | Default  |
| --------- | ----------------- | ------ | -------- |
| `file`    | Image file object | `File` | Required |

## Example

### Basic Usage

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // Can be directly used for img src
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  }
});
```

### Preview Before Upload

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('Image conversion failed');
}
```

### Error Handling

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('Error:', result.message);
  }
} catch (error) {
  console.error('Exception:', error);
}
```

## Notes

1. **Async operation**: Returns Promise, needs to be handled with `await` or `.then()`.

2. **File types**: Supports all browser-supported image formats (JPEG, PNG, GIF, WebP, etc.).

3. **Data format**: Returned `data` is complete Data URL format (e.g., `data:image/jpeg;base64,...`), can be directly used for `img` tag's `src` attribute.

4. **Error handling**: Conversion failure will reject in Promise, need to catch errors.

5. **Use case**: Commonly used for image preview, pre-upload processing, local storage, etc.
