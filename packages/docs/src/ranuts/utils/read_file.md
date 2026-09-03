# readFileAs*

Promise wrappers around `FileReader`.

| Function                          | Resolves with | Use for                                               |
| --------------------------------- | ------------- | ----------------------------------------------------- |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | Binary processing                                     |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | Feeding `checkEncoding` / `arrayBufferToString`       |
| `readFileAsText(blob, encoding?)` | `string`      | Text files; sniff the encoding first if it is unknown |
| `readFileAsDataURL(blob)`         | `string`      | Image previews                                        |

## Example

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // encoding is sniffed, GBK/Big5 included
});
```

## Notes

1. **All three exits are wired**: `onload`, `onerror` and `onabort`. Forgetting `onabort` is
   the classic way to leave a promise pending forever when the user cancels the picker.
2. **Rejects with a clear error** where `FileReader` does not exist (Node, some worker contexts).
3. **Never `new TextDecoder().decode()` a file of unknown origin**: that assumes UTF-8 and turns
   GBK/Big5 into mojibake. Use `arrayBufferToString`, which sniffs first.
