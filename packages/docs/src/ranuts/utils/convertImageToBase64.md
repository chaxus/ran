# convertImageToBase64

图片转`base64`

## API

### Return

| 参数      | 说明                 | 类型                            |
| --------- | -------------------- | ------------------------------- |
| `success` | 是否转换成功         | `boolean`                       |
| `data`    | 转换成功后的值       | `string`,`ArrayBuffer` , `null` |
| `message` | 转换成功或失败的原因 | `string`                        |

### Options

| 参数 | 说明       | 类型   | 默认值 |
| ---- | ---------- | ------ | ------ |
| file | 传入的文件 | `File` | 无     |

## Example

```js
import { convertImageToBase64 } from 'ranuts';

convertImageToBase64(file).then((res) => {
  console.log(result);
});
```
