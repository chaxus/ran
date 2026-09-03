# createObjectURL

Create an object URL from Blob, ArrayBuffer, or Response.

## API

### createObjectURL

#### Return

| Argument          | Description                         | Type      |
| ----------------- | ----------------------------------- | --------- |
| `Promise<string>` | Promise that resolves to object URL | `Promise` |

#### Parameters

| Parameter | Description | Type                                        | Default  |
| --------- | ----------- | ------------------------------------------- | -------- |
| `src`     | Data source | `Blob \| ArrayBuffer \| Response \| string` | Required |

## Example

### Basic Usage (Blob)

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### Create from ArrayBuffer

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### Create from Response

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### Handle String

```js
import { createObjectURL } from 'ranuts';

// If string is passed, returns directly
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### Image Preview

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## Notes

1. **Async operation**: Returns Promise, needs to be handled with `await` or `.then()`.
2. **Type support**: Supports Blob, ArrayBuffer, Response, and string types.
3. **Memory management**: Created URLs need to manually call `URL.revokeObjectURL()` to free memory.
4. **Use case**: Commonly used for file preview, temporary URL generation, image processing, etc.

## requestUrlToBuffer

Fetch a URL as raw bytes over `XMLHttpRequest`. Those bytes typically feed into
`createObjectURL` above, when you need to inspect or transform them (checking a magic number,
decoding audio) before turning them into a displayable URL.

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### Parameters

| Parameter | Description                                                             | Type                                     | Default  |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------- | -------- |
| `src`     | URL to fetch                                                            | `string`                                 | Required |
| `options` | `method` (default `'GET'`) and `responseType` (default `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | Required |

#### Return

`Promise` resolving to `{ success: true, data, message: '' }` on an HTTP 200, or **rejecting**
with `{ success: false, data: status, message }` otherwise. A failed request is a rejection,
not a resolved `success: false`, so a bare `.then()` without `.catch()` will surface it as an
unhandled rejection.

::: tip Prefer `fetch` for new code
This predates `fetch` being universally available and uses `XMLHttpRequest` under the hood. If
you don't specifically need XHR (upload progress events, `abort()`), `fetch(url).then(r =>
r.arrayBuffer())` does the same job with a `Promise`-native rejection shape.
:::
