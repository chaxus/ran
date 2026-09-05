# strParse

区切り文字と等号を自分で決めて、文字列をオブジェクトに解析します。

## API

### strParse

#### 戻り値

| 引数     | 説明                   | 型                       |
| -------- | ---------------------- | ------------------------ |
| `Object` | 解析されたオブジェクト | `Record<string, string>` |

#### パラメーター

| パラメーター | 説明                       | 型                 | 既定値 |
| ------------ | -------------------------- | ------------------ | ------ |
| `str`        | 解析する文字列             | `string`           | `''`   |
| `sep`        | キーと値の組どうしの区切り | `string \| RegExp` | `''`   |
| `eq`         | キーと値のあいだの等号     | `string \| RegExp` | `''`   |

## 使用例

### 基本的な使い方（URL のクエリ文字列）

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### 区切り文字を変える

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### 正規表現を使う

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### 空の値の扱い

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' }（空の値は取り除かれます）
```

## 補足

1. **区切り文字**：ひとつめの引数はキーと値の組どうしの区切り（`&` など）、ふたつめはキーと値のあいだの等号（`=` など）です。
2. **空の値の除去**：キーか値が空のものは自動で取り除かれ、結果のオブジェクトには現れません。
3. **自動で整えます**：キーと値は `clearStr` で自動的に整えられます（空白や引用符を取り除きます）。
4. **正規表現にも対応**：区切りには文字列と正規表現のどちらも使えます。
