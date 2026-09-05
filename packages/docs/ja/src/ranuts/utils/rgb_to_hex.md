# rgbToHex

RGB の値を 16 進数の色の値に変換します。

## API

### rgbToHex

#### 戻り値

| 引数     | 説明            | 型       |
| -------- | --------------- | -------- |
| `string` | 16 進数の色の値 | `string` |

#### パラメーター

| パラメーター | 説明                      | 型                          | 既定値 |
| ------------ | ------------------------- | --------------------------- | ------ |
| `r`          | 赤の値、または RGB の配列 | `string \| number \| Array` | 必須   |
| `g`          | 緑の値（任意）            | `string \| number`          | `0`    |
| `b`          | 青の値（任意）            | `string \| number`          | `0`    |

## 使用例

### 基本的な使い方

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### 配列で渡す

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### 色の変換

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// RGB に戻す
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### 色を動的に作る

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## 補足

1. **引数の渡し方**：3 とおりに対応しています。
   - 引数を 3 つ並べる：`rgbToHex(r, g, b)`
   - 配列で渡す：`rgbToHex([r, g, b])`
   - 文字列でも数値でも：自動で変換します

2. **戻り値**：必ず `#` の付いた 16 進数の色の値を返します。

3. **値の範囲**：RGB の値はふつう 0〜255 ですが、範囲の外の値もそのまま 16 進数に変換されます。

4. **使いどころ**：色の変換、CSS の色の生成、色の加工などでよく使われます。
