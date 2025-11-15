# getMime

Pass in file format extension, returns `mime type`.

## API

### Return

| Argument | Description         | Type     |
| -------- | ------------------- | -------- |
| `string` | Returns `mime type` | `string` |

### Options

| Parameter | Description           | Type     | Default  |
| --------- | --------------------- | -------- | -------- |
| ext       | File extension format | `string` | Required |

## Example

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
