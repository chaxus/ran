# randomColor

ランダムな色のオブジェクトを生成します。

## API

### randomColor

#### 戻り値

| 引数    | 説明                       | 型      |
| ------- | -------------------------- | ------- |
| `Color` | ランダムな色のオブジェクト | `Color` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2'（ランダム）
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### ランダムな色の値を取り出す

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### ランダムな色を複数生成する

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`色 ${index + 1}:`, color.hex);
});
```

### ランダムな色を設定する

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## 補足

1. **ランダムな生成**：呼ぶたびにランダムな 16 進数の色を生成します。
2. **完全なオブジェクト**：完全な `Color` オブジェクトを返し、hex、rgb、hsl などのプロパティをすべて含みます。
3. **色の書式**：生成される色の値には `#` が付くので、そのまま CSS で使えます。
4. **使いどころ**：ランダムな色の生成、カラーピッカー、データの可視化などでよく使われます。
