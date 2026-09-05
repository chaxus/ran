# isString

値が文字列型かどうかを判定します。

## API

### isString

#### 戻り値

| 引数      | 説明           | 型        |
| --------- | -------------- | --------- |
| `boolean` | 文字列かどうか | `boolean` |

#### パラメーター

| パラメーター | 説明     | 型        | 既定値 |
| ------------ | -------- | --------- | ------ |
| `obj`        | 調べる値 | `unknown` | 必須   |

## 使用例

### 基本的な使い方

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### 型のチェック

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('文字列です:', value.toUpperCase());
  } else {
    console.log('文字列ではありません');
  }
}

processValue('hello'); // '文字列です: HELLO'
processValue(123); // '文字列ではありません'
```

### 引数の検証

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('入力は文字列でなければなりません');
  }
  return input.trim();
}
```

## 補足

1. **型の判定**：`Object.prototype.toString.call()` を使って正確に型を見分けます。
2. **厳しさ**：値が本当の文字列型のときだけ `true` を返します。ほかの型（String オブジェクトを含む）は `false` です。
3. **使いどころ**：型のチェックや引数の検証などでよく使われます。
