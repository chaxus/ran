# mathjs

数値を正確に計算する関数です。JavaScript の浮動小数点の誤差を避けられ、メソッドチェーンにも対応します。

## API

### mathjs

#### 戻り値

| 引数                  | 説明                   | 型                                   |
| --------------------- | ---------------------- | ------------------------------------ |
| `ComputeNumberResult` | 計算結果のオブジェクト | `{ result: number, next: Function }` |

#### パラメーター

| パラメーター | 説明                             | 型       | 既定値 |
| ------------ | -------------------------------- | -------- | ------ |
| `a`          | ひとつめの数                     | `number` | 必須   |
| `type`       | 演算の種類（`+`、`-`、`*`、`/`） | `string` | 必須   |
| `b`          | ふたつめの数                     | `number` | 必須   |

#### ComputeNumberResult

| プロパティ | 説明                   | 型         |
| ---------- | ---------------------- | ---------- |
| `result`   | 計算の結果             | `number`   |
| `next`     | 計算を続けるための関数 | `Function` |

## 使用例

### 基本的な使い方

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3（0.30000000000000004 ではなく、正確な結果）
```

### メソッドチェーン

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // 正確な計算結果
```

### 誤差の問題を避ける

```js
import { mathjs } from 'ranuts';

// JavaScript のそのままの計算には誤差が出ます
console.log(0.1 + 0.2); // 0.30000000000000004

// mathjs を使えば正確な結果が得られます
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### 込み入った計算

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // 正確な計算結果
```

## 補足

1. **誤差の処理**：浮動小数点の誤差を自動で処理し、`0.1 + 0.2 !== 0.3` のような問題を避けます。
2. **メソッドチェーン**：`next` メソッドで計算をつなげられます。
3. **演算の種類**：`+`（足す）、`-`（引く）、`*`（掛ける）、`/`（割る）の 4 つに対応します。
4. **速度**：そのままの演算よりわずかに遅くなりますが、正確さが保たれます。
