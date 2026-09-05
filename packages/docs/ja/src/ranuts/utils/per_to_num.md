# perToNum

パーセントの文字列を数値に変換します。

## API

### perToNum

#### 戻り値

| 引数     | 説明         | 型       |
| -------- | ------------ | -------- |
| `number` | 変換後の数値 | `number` |

#### パラメーター

| パラメーター | 説明               | 型       | 既定値 |
| ------------ | ------------------ | -------- | ------ |
| `str`        | パーセントの文字列 | `string` | `''`   |

## 使用例

### 基本的な使い方

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### 1 を超えるパーセントの扱い

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5（1 以下なのでそのまま返す）
console.log(perToNum('150%')); // 1.5（1 を超えるので 100 で割る）
console.log(perToNum('200%')); // 2
```

### 普通の数値文字列の扱い

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### 空文字列の扱い

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## 補足

1. **パーセントの扱い**：
   - 値が 1 を超えるときは 100 で割ります（例：`150%` → `1.5`）
   - 値が 1 以下のときはそのまま返します（例：`50%` → `0.5`）

2. **パーセントでない文字列**：`%` で終わらない文字列は、そのまま数値に変換します。

3. **空の値の扱い**：空文字列は `0` になります。

4. **使いどころ**：CSS のパーセント値や進捗の値を扱うのによく使われます。
