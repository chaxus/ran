# hexToRgb

16 進数の色の値を RGB の配列に変換します。

## API

### hexToRgb

#### 戻り値

| 引数                    | 説明                              | 型                      |
| ----------------------- | --------------------------------- | ----------------------- |
| `Array<number> \| null` | RGB の配列 [r, g, b]、または null | `Array<number> \| null` |

#### パラメーター

| パラメーター | 説明            | 型       | 既定値 |
| ------------ | --------------- | -------- | ------ |
| `hex`        | 16 進数の色の値 | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### 不正な値の扱い

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### `#` はあってもなくてもよい

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### 色の変換

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// 16 進数に戻す
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## 補足

1. **受け付ける形**：6 桁の 16 進数の色の値に対応します（`#ff0000` でも `ff0000` でも構いません）。
2. **戻り値**：成功すると `[r, g, b]` の配列を、失敗すると `null` を返します。
3. **大文字小文字**：`#FF0000` も `#ff0000` も同じように扱われます。
4. **使いどころ**：色の変換や加工、CSS の色の処理などでよく使われます。
