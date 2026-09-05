# toString

値を文字列型に変換します。

## API

### toString

#### 戻り値

| 引数     | 説明           | 型       |
| -------- | -------------- | -------- |
| `string` | 変換後の文字列 | `string` |

#### パラメーター

| パラメーター | 説明       | 型                 | 既定値 |
| ------------ | ---------- | ------------------ | ------ |
| `value`      | 変換する値 | `string \| number` | 必須   |

## 使用例

### 基本的な使い方

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### 型の変換

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## 補足

1. **薄いラッパー**：`String()` 関数の薄いラッパーです。
2. **対応する型**：文字列と数値の変換に対応します。
3. **使いどころ**：型変換や文字列処理などでよく使われます。
