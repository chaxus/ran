# clearStr

文字列から前後の空白、URL エンコード、引用符を取り除きます。

## API

### clearStr

#### 戻り値

| 引数 | 説明 | 型 |
| -------- | -------------- | -------- |
| `string` | 整えたあとの文字列 | `string` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | --------------------- | ---------------- | -------- |
| `str` | 整える文字列 | `string` | 必須 |
| `options` | 設定のオプション | `ClearStrOption` | `{}` |

#### オプション

| パラメーター | 説明 | 型 | 既定値 |
| ------------ | ----------------------------- | --------- | ------- |
| `urlencoded` | URL デコードを行うかどうか | `boolean` | `true` |

## 使用例

### 基本的な使い方

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### URL エンコードされた文字列

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world'（自動でデコードされます）
```

### URL デコードを止める

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world'（デコードされません）
```

### 引用符の扱い

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## 補足

1. **取り除くもの**：前後の空白、シングルクォート、ダブルクォートを取り除きます。
2. **URL デコード**：既定では URL デコードを行い、`urlencoded: false` で止められます。
3. **使いどころ**：ユーザーの入力や、URL のパラメータから取り出した値を整えるのによく使われます。
