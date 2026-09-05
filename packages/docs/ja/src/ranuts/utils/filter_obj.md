# filterObj

オブジェクトのプロパティを絞り込みます。キーが `list` の配列にあるものを取り除き、新しいオブジェクトを返します。空文字列や null の値を取り除くのによく使われます。

## API

### 戻り値

| 引数     | 説明                         | 型       |
| -------- | ---------------------------- | -------- |
| `Object` | 絞り込んだあとのオブジェクト | `Object` |

### オプション

| 引数   | 説明                   | 型       | 既定値 |
| ------ | ---------------------- | -------- | ------ |
| `obj`  | 絞り込むオブジェクト   | `object` | 必須   |
| `list` | `obj` から取り除くキー | `array`  | 必須   |

## 使用例

```js
import { filterObj } from 'ranuts';

const obj = {
  name: 'chaxus',
  age: 10,
  address: 'spark',
};

const result = filterObj(obj, ['name', 'address']);

console.log(result);

// { age:10 }
```
