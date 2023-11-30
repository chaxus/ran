# getMime

传入文件格式后缀，返回`mime type`

## API

### Return

| 参数     | 说明            | 类型     |
| -------- | --------------- | -------- |
| `string` | 返回`mime type` | `string` |

### Options

| 参数 | 说明         | 类型     | 默认值 |
| ---- | ------------ | -------- | ------ |
| ext  | 文件后缀格式 | `string` | 无     |

## Example

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation
const res = getMime('.txt');
console.log(result);
// text/plain
```
