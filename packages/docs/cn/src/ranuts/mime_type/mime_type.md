# getMime

传入文件后缀名，返回对应的 `mime type`。

## API

### Return

| 参数     | 说明               | 类型     |
| -------- | ------------------ | -------- |
| `string` | 对应的 `mime type` | `string` |

### Options

| 参数 | 说明       | 类型     | 默认值 |
| ---- | ---------- | -------- | ------ |
| ext  | 文件后缀名 | `string` | 必填   |

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
