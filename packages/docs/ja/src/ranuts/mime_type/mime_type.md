# getMime

ファイルの拡張子を渡すと、その `mime type` が返ります。

## API

### 戻り値

| 引数     | 説明                   | 型       |
| -------- | ---------------------- | -------- |
| `string` | `mime type` を返します | `string` |

### オプション

| パラメーター | 説明                 | 型       | 既定値 |
| ------------ | -------------------- | -------- | ------ |
| ext          | ファイル拡張子の形式 | `string` | 必須   |

## 使用例

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
