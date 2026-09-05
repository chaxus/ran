# transformNumber

数値を単位付きの読みやすい文字列に変換します。中国語の単位にも英語の単位にも対応します。

## API

### transformNumber

#### 戻り値

| 引数     | 説明               | 型       |
| -------- | ------------------ | -------- |
| `string` | 整えたあとの文字列 | `string` |

#### パラメーター

| パラメーター | 説明                 | 型       | 既定値    |
| ------------ | -------------------- | -------- | --------- |
| `value`      | 変換する数値の文字列 | `string` | 必須      |
| `locale`     | ロケール             | `string` | `'zh-CN'` |
| `precision`  | 計算に使う精度       | `number` | `2`       |
| `fixed`      | 表示する小数の桁数   | `number` | `2`       |

## 使用例

### 基本的な使い方

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万'（中国語の「万」）
console.log(transformNumber('1000000')); // '100.00 万'
console.log(transformNumber('100000000')); // '1.00 亿'（中国語の「億」）
```

### 英語の単位

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### 精度を指定する

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### 不正な入力の扱い

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## 補足

1. **単位のきまり**：
   - `zh-CN`：万、亿、万亿（4 桁ごと）
   - `zh-HK`：萬、億、萬億（4 桁ごと）
   - `en`：K（千）、M（百万）、B（十億）、T（兆）（3 桁ごと）

2. **精度の扱い**：`Mathjs` を使って正確に計算し、浮動小数点の誤差を避けます。

3. **不正な入力**：入力が正しい数値でないときは `'--'` を返します。

4. **使いどころ**：金額、閲覧数、フォロワー数など、大きな数を見せるのによく使われます。
