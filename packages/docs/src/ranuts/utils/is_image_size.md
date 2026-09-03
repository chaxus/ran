# isImageSize

Validate if an image file's dimensions meet specified requirements.

## API

### isImageSize

#### Return

| Argument           | Description                                                   | Type      |
| ------------------ | ------------------------------------------------------------- | --------- |
| `Promise<boolean>` | Promise that resolves to whether dimensions meet requirements | `Promise` |

#### Parameters

| Parameter | Description                | Type     | Default  |
| --------- | -------------------------- | -------- | -------- |
| `file`    | Image file object          | `File`   | Required |
| `width`   | Expected width (optional)  | `number` | Optional |
| `height`  | Expected height (optional) | `number` | Optional |

## Example

### Basic Usage

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Check if width is 800
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('Image width meets requirements');
      } else {
        console.log('Image width does not meet requirements');
      }
    } catch (error) {
      console.error('Check failed:', error);
    }
  }
});
```

### Check Width and Height

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // Check if it's 800x600
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### Check Height Only

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// Only check if height is 600
```

### File Upload Validation

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('Image dimensions must be 1920x1080');
    return;
  }
  // Continue upload
}
```

## Behaviour

1. **Both dimensions must match** when both `width` and `height` are given. Passing neither
   only checks that the file decodes as an image.
2. **A decode failure rejects** (corrupt file, non-image) instead of leaving the promise pending.
3. **The object URL is always revoked**, on success and on failure, so validating many files
   does not leak blob URLs until page unload.
4. **Browser only**: rejects with a clear error under SSR.

::: warning Fixed in 0.3
Previously the second condition overwrote the first, so passing both `width` and `height`
silently ignored `width`; there was no `onerror`, so a corrupt file left the promise pending
forever; and the SSR guard called `reject` without returning, then went on to touch `window`
and throw a `ReferenceError`.
:::

## Notes

1. **Async operation**: Returns Promise, needs to be handled with `await` or `.then()`.

2. **Parameter description**:
   - If only `width` is provided, only checks width
   - If only `height` is provided, only checks height
   - If both are provided, both must match

3. **Server-side environment**: Will reject in server-side environments (no `window` object).

4. **Memory cleanup**: Function automatically cleans up created Object URL internally, no manual handling needed.

5. **Use case**: Commonly used for dimension validation before file upload, avatar size checking, etc.
