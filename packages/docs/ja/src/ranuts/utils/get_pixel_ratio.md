# getPixelRatio

Canvas のコンテキストの解像度の比を取得します。高 DPI の画面に対応するために使います。

## API

### getPixelRatio

#### 戻り値

| 引数     | 説明       | 型       |
| -------- | ---------- | -------- |
| `number` | ピクセル比 | `number` |

#### パラメーター

| パラメーター | 説明                          | 型                         | 既定値 |
| ------------ | ----------------------------- | -------------------------- | ------ |
| `context`    | Canvas の 2D 描画コンテキスト | `CanvasRenderingContext2D` | 必須   |

## 使用例

### 基本的な使い方

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('ピクセル比:', ratio);
```

### 高 DPI 画面への対応

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// 比に合わせて Canvas の大きさを調整する
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// 描画の大きさを保つためにコンテキストを拡大する
ctx.scale(ratio, ratio);
```

### くっきりした図を描く

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // 実際の大きさを設定する
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // コンテキストを拡大する
  ctx.scale(ratio, ratio);

  // 中身を描く（論理ピクセルで指定）
  ctx.fillRect(10, 10, 100, 100);
}
```

## 補足

1. **ブラウザー間の互換**：ブラウザーごとに異なる `backingStorePixelRatio` プロパティに対応します。
2. **高 DPI への対応**：高 DPI（Retina）の画面を自動で扱い、図がくっきり描かれるようにします。
3. **計算のしかた**：`devicePixelRatio / backingStorePixelRatio` を返します。
4. **使いどころ**：Canvas の描画、グラフのライブラリ、ゲームの開発など、くっきりした表示が要る場面でよく使われます。
