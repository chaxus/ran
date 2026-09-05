# getCookie

指定した名前の cookie の値を取得します。

## API

### 戻り値

| 引数     | 説明                       | 型       |
| -------- | -------------------------- | -------- |
| `string` | 指定した名前の cookie の値 | `string` |

### オプション

| 引数   | 説明                   | 型       | 既定値 |
| ------ | ---------------------- | -------- | ------ |
| `name` | 読み取る cookie の名前 | `string` | 必須   |

## 使用例

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
