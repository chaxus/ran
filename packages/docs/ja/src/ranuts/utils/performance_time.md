# performanceTime

高精度なタイムスタンプを取得します。ブラウザーと Node.js のどちらにも対応します。

## API

### performanceTime

#### 戻り値

| 引数 | 説明 | 型 |
| -------- | --------------------------------------- | -------- |
| `number` | 高精度なタイムスタンプ（ミリ秒） | `number` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// 何らかの処理を実行する
const end = performanceTime();
console.log(`所要時間: ${end - start} ms`);
```

### パフォーマンスの計測

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// 時間のかかる処理を実行する
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`処理の所要時間: ${end - start} ms`);
```

### 関数の実行時間

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // 重たい計算
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`結果: ${result}, 所要時間: ${end - start} ms`);
```

## 補足

1. **対応する環境**：
   - ブラウザー：`performance.now()` を使います
   - Node.js：`process.hrtime()` を使います
   - それ以外：`Date.now()` にフォールバックします

2. **精度**：`performance.now()` と `process.hrtime()` はマイクロ秒単位の精度を持ち、`Date.now()` より正確です。

3. **相対的な時刻**：返るタイムスタンプは相対的な時刻です。差を測るのには向きますが、絶対時刻として使うのには向きません。

4. **単位**：戻り値の単位はミリ秒です。
