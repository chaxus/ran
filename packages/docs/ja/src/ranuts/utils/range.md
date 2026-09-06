# range

数値を、決めた最小と最大の範囲に収めます。

## API

### range

#### 戻り値

| 引数     | 説明             | 型       |
| -------- | ---------------- | -------- |
| `number` | 範囲に収めた数値 | `number` |

#### パラメーター

| パラメーター | 説明       | 型       | 既定値 |
| ------------ | ---------- | -------- | ------ |
| `num`        | 収める数値 | `number` | 必須   |
| `min`        | 最小の値   | `number` | `0`    |
| `max`        | 最大の値   | `number` | `1`    |

## 使用例

### 基本的な使い方

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10（最大に収まります）
console.log(range(-5, 0, 10)); // 0（最小に収まります）
```

### 百分率を収める

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### 範囲を自分で決める

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20（範囲の外なので収められます）
```

### 色の値を収める

```js
import { range } from 'ranuts';

const red = 300; // RGB の値は 0〜255 のはず
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## 補足

1. **収め方**：最小より小さければ最小を、最大より大きければ最大を返し、それ以外はもとの値をそのまま返します。
2. **既定の範囲**：既定は 0 から 1 です。百分率や比率を扱うのに向いています。
3. **使いどころ**：利用者の入力を制限したり、進捗の値や色の値を求めたりするのによく使われます。

## 補間と範囲の写し換え

シェーダー風の補間と、範囲の写し換えです。GLSL の `mix` / `clamp` / `smoothstep` が用意しているのと同じ道具立てです。アニメーションのイージング、スクロールの位置から不透明度への写像、関係のない数値の範囲どうしの変換などに役立ちます。

### clamp

上の `range` と同じはたらきで、引数の並びが GLSL 風です。`clamp(value, min, max)` と `range(num, min, max)` の違いです。この一群と足並みをそろえるために加えました。呼び出す場所で読みやすいほうの並びを選んでください。

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)` は `a` から `b` へ `t` のぶんだけ補間します（`t=0` なら `a`、`t=1` なら `b`）。`inverseLerp(a, b, value)` はその逆で、`a` と `b` のあいだの `value` を渡すと、それがどのあたりにあるかを `0..1` で返します。どちらも範囲に収めません。`value` が `[a, b]` の外にあれば、`t`（や結果）も `0..1` の外へ出ます。

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 — 収められません
```

#### パラメーター

| 関数                       | パラメーター | 説明               | 型       |
| -------------------------- | ------------ | ------------------ | -------- |
| `lerp(a, b, t)`            | `a`、`b`     | 始まりと終わりの値 | `number` |
|                            | `t`          | 補間の割合         | `number` |
| `inverseLerp(a, b, value)` | `a`、`b`     | 始まりと終わりの値 | `number` |
|                            | `value`      | 位置を調べたい値   | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)` は `value` を `[a1, a2]` から `[b1, b2]` へ線形に写します。範囲には収めません。`fit` はその収めるほうで、同じ写し換えをしたあと、出力の範囲に収めます。

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 — [0,10] の外なので、[0,100] の外へも出ます

fit(15, 0, 10, 0, 100); // 100 — 出力の範囲に収められます
```

### linearstep / smoothstep

どちらも `x` が `edge0` から `edge1` へ進むにつれて `0` から `1` へ立ち上がり、その外側では収められます。`linearstep` は直線で、`smoothstep` は GLSL のエルミート補間による曲線（`3t² - 2t³`）です。直線ではなくイーズイン・イーズアウトになり、アニメーションやシェーダーのフェードではふつうこちらを選びます。

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5（真ん中は同じで、曲線が違うのはそれ以外のところ）
smoothstep(0, 1, 0.1); // 0.028 — なめらかにされ、linearstep の 0.1 よりゆっくり 0 を離れます
```

#### Notes

1. **収めないもの：`lerp`、`inverseLerp`、`remap`。** 想定した範囲の外の `value` や `t` を渡すと、エラーにも収めた値にもならず、外挿した結果が返ります。
2. **収めるもの：`fit`、`linearstep`、`smoothstep`。** この 3 つは必ず、出力の範囲の内に収まった値を返します。
3. `linearstep(edge0, edge1, x)` で `edge0 === edge1` のときは、ゼロで割る代わりに、`x < edge0` なら `0` を、そうでなければ `1` を返します。
