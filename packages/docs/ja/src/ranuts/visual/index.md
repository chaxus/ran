# visual

PixiJS 流の 2D 描画エンジンです。図形のシーングラフを組み立て、実行時に選んだ三つのバックエンド（Canvas2D、WebGL、WebGPU）のどれかで描きます。

エンジンは層になっています。**`Application`**（ライフサイクルと描画ループ）、その下に **`Renderer`**（バックエンド）、そして **`Container`**（まとまり）から **`Graphics`**（描けるもの）へと続くシーングラフです。ノードを `app.stage` に足すと、レンダラーがそれを描きます。

> **ブラウザー専用です。** `ranuts/visual` には本物の `HTMLCanvasElement` と、GPU または Canvas のコンテキストが要ります。Node では動きません。

## 読み込み

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## はじめの一歩

アプリケーションを作り、塗りと線をもつ長方形と円を描いて、描画ループを回します。

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create は非同期です。WebGPU バックエンドはデバイスの初期化を
// 非同期で行うため、最初の描画より前に終わっている必要があります。
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// 長方形。赤の塗りに 4px の青い線。
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// 円。
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// 描けるものを stage に足します。描かれるものすべての先祖にあたる場所です。
app.stage.addChild(rect);
app.stage.addChild(circle);

// requestAnimationFrame のループを回します（1 コマだけなら app.render() を呼びます）。
app.start();
```

## API

### `Application`

エンジンの入り口です。canvas、レンダラー、そしてシーングラフの根（`stage`）を抱えています。

`new Application(...)` より、非同期のファクトリー **`Application.create(...)`** を使ってください。WebGPU バックエンドはデバイスの初期化を非同期で行い、それが最初の描画より前に終わっている必要があるからです。Canvas と WebGL はすぐ解決するので、このファクトリーはどのバックエンドでも安全で、書き方もそろいます。

#### `Application.create(options)`

`static async` です。`Application` を組み立て、レンダラーの非同期な初期化を待ちます。

##### パラメーター

| パラメーター | 説明                             | 型                    | 既定値 |
| ------------ | -------------------------------- | --------------------- | ------ |
| `options`    | アプリケーションの設定オプション | `IApplicationOptions` | 必須   |

##### 返り値

| 値                     | 説明                           | 型                     |
| ---------------------- | ------------------------------ | ---------------------- |
| `Promise<Application>` | 初期化の済んだアプリケーション | `Promise<Application>` |

#### Properties

| プロパティ    | 説明                                                         | 型                  |
| ------------- | ------------------------------------------------------------ | ------------------- |
| `stage`       | シーングラフの根。描いてほしいノードはすべてここに足します。 | `Container`         |
| `view`        | 描画先になっている canvas 要素。                             | `HTMLCanvasElement` |
| `eventSystem` | canvas と stage に結びついた、ポインターとイベントの配送。   | `EventSystem`       |

#### Methods

| メソッド   | 説明                                             | 返り値 |
| ---------- | ------------------------------------------------ | ------ |
| `render()` | `stage` を 1 コマだけ描きます。                  | `void` |
| `start()`  | `requestAnimationFrame` の描画ループを始めます。 | `void` |
| `stop()`   | `start()` で始めた描画ループを止めます。         | `void` |

#### `IApplicationOptions`

| フィールド        | 説明                                                                | 型                  | 既定値                 |
| ----------------- | ------------------------------------------------------------------- | ------------------- | ---------------------- |
| `prefer`          | どのバックエンドを使うか。省くと Canvas になります。                | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | 描画先の canvas。省くと、どこにも属さない `<canvas>` が作られます。 | `HTMLCanvasElement` | 新しい canvas          |
| `backgroundColor` | canvas の背景。CSS の色文字列ならなんでも受けつけます。             | `string`            | —                      |
| `backgroundAlpha` | 背景の不透明度。`0`〜`1`。                                          | `number`            | —                      |
| `debug`           | 選ばれた描画バックエンドをコンソールに出します。                    | `boolean`           | `false`                |

### `Container`

まとまりを表すノードで、シーングラフでいう「グループ」にあたります。子と変換の状態を持ちますが、それ自体は何も描きません。`Graphics` のような描けるものは、これを継承しています。まとめて動かす・拡大縮小する・回転させる部分木を作りたいときに `Container` を足してください。

#### Methods

| メソッド             | 説明                                                                    | 返り値    |
| -------------------- | ----------------------------------------------------------------------- | --------- |
| `addChild(child)`    | 子（`Container`）を末尾に足します。すでに親がいれば、親を付け替えます。 | `void`    |
| `removeChild(child)` | `children` から子をひとつ外します。                                     | `void`    |
| `sortChildren()`     | `children` を `zIndex` で並べ替えます（必要なときだけ）。               | `void`    |
| `containsPoint(p)`   | `Point` がこのノードの `hitArea` に当たるか調べます。                   | `boolean` |

#### 変換と表示のプロパティ

これらは共通の基底ノード（`Vertex`）にあり、どの `Container` と `Graphics` でも使えます。

| プロパティ         | 説明                                                           | 型                       |
| ------------------ | -------------------------------------------------------------- | ------------------------ |
| `children`         | 子ノードたち（読み取り専用の配列）。                           | `Container[]`            |
| `parent`           | 親ノード。つながっていれば。                                   | `Container \| undefined` |
| `x` / `y`          | 位置。親の座標系での値です。                                   | `number`                 |
| `position`         | 位置を表す点（`{ x, y }`）。                                   | `ObservablePoint`        |
| `scale`            | 拡大率を表す点（`{ x, y }`）。                                 | `ObservablePoint`        |
| `pivot`            | 回転と拡大縮小の支点。                                         | `ObservablePoint`        |
| `skew`             | 傾きを表す点。                                                 | `ObservablePoint`        |
| `rotation`         | 回転。単位は**ラジアン**。                                     | `number`                 |
| `angle`            | 回転。単位は**度**（`rotation` と連動します）。                | `number`                 |
| `alpha`            | ノードの不透明度。`0`〜`1`（木を下るごとに掛け合わされます）。 | `number`                 |
| `visible`          | `false` なら、そのノードと部分木は飛ばされます。               | `boolean`                |
| `zIndex`           | 兄弟のあいだでの描画順。                                       | `number`                 |
| `hitArea`          | 当たり判定に使う図形。任意です。                               | `Shape \| null`          |
| `cursor`           | そのノードを指したときのカーソルの見た目。                     | `Cursor`                 |
| `structureVersion` | シーン構造の版番号（根だけ）。差分の追跡に使われます。         | `number`                 |

### `Graphics`

`Container` を継承した、描けるものです。塗りや線のスタイルを決めてから、図形のメソッドを呼びます。ほとんどのメソッドは `this` を返すので、そのままつなげて書けます。

#### スタイル

| メソッド                           | 説明                                                                                  | 返り値     |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| `beginFill(color?, alpha?)`        | `color`（CSS の文字列。既定は `'#000000'`）と `alpha`（既定は `1`）で塗り始めます。   | `Graphics` |
| `endFill()`                        | 塗りを終えます。                                                                      | `Graphics` |
| `lineStyle(width, color?, alpha?)` | 線を決めます。太さ `width` px、`color`（既定は `'#000000'`）、`alpha`（既定は `1`）。 | `Graphics` |
| `lineStyle(options)`               | `ILineStyleOptions` のオブジェクトから線を決めます。                                  | `Graphics` |
| `resetLineStyle()`                 | いまの線を既定値に戻します。                                                          | `void`     |

#### 図形

| メソッド                                       | 説明                                                        | 返り値     |
| ---------------------------------------------- | ----------------------------------------------------------- | ---------- |
| `drawRect(x, y, width, height)`                | 長方形。                                                    | `Graphics` |
| `drawRoundedRect(x, y, width, height, radius)` | 角の丸い長方形。                                            | `Graphics` |
| `drawCircle(x, y, radius)`                     | `(x, y)` を中心とする円。                                   | `Graphics` |
| `drawEllipse(x, y, radiusX, radiusY)`          | `(x, y)` を中心とする楕円。                                 | `Graphics` |
| `drawPolygon(points)`                          | 平らな `[x0, y0, x1, y1, …]` の配列から作る、閉じた多角形。 | `Graphics` |

#### パス

| メソッド                                                    | 説明                                           | 返り値     |
| ----------------------------------------------------------- | ---------------------------------------------- | ---------- |
| `moveTo(x, y)`                                              | `(x, y)` から新しいサブパスを始めます。        | `Graphics` |
| `lineTo(x, y)`                                              | `(x, y)` まで直線を引きます。                  | `Graphics` |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | 2 次ベジェ曲線（細かい線分に刻んで描きます）。 | `Graphics` |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | 3 次ベジェ曲線（細かい線分に刻んで描きます）。 | `Graphics` |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | 円弧。                                         | `Graphics` |
| `arcTo(x1, y1, x2, y2, radius)`                             | 制御点を通る二本の線に接する円弧。             | `Graphics` |
| `closePath()`                                               | いまのサブパスを閉じます。                     | `Graphics` |
| `clear()`                                                   | 形をすべて捨て、スタイルを初期状態に戻します。 | `Graphics` |
| `containsPoint(p)`                                          | `Point` が描かれた形に当たるか調べます。       | `boolean`  |

#### `IFillStyleOptions`

| フィールド | 説明                               | 型        | 既定値      |
| ---------- | ---------------------------------- | --------- | ----------- |
| `color`    | 塗りの色（CSS の色ならなんでも）。 | `string`  | `'#ffffff'` |
| `alpha`    | 塗りの不透明度。`0`〜`1`。         | `number`  | `1`         |
| `visible`  | 塗りを描くかどうか。               | `boolean` | `false`     |

#### `ILineStyleOptions`

`IFillStyleOptions` を継承し、次を足します。

| フィールド | 説明             | 型          | 既定値            |
| ---------- | ---------------- | ----------- | ----------------- |
| `width`    | 線の太さ（px）。 | `number`    | `0`               |
| `cap`      | 線の端の形。     | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`     | 線の継ぎ目の形。 | `LINE_JOIN` | `LINE_JOIN.MITER` |

### 列挙型

#### `RENDERER_TYPE`

`IApplicationOptions.prefer` で描画バックエンドを選びます。

| メンバー  | 値         | 説明                              |
| --------- | ---------- | --------------------------------- |
| `CANVAS`  | `'canvas'` | Canvas2D のバックエンド（既定）。 |
| `WEB_GL`  | `'webgl'`  | WebGL のバックエンド。            |
| `WEB_GPU` | `'webgpu'` | WebGPU のバックエンド。           |

#### `SHAPE_TYPE`

`Graphics` の描画メソッドが作る図形の種類です。

| メンバー            | 値                    |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| メンバー | 値         |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| メンバー | 値        |
| -------- | --------- |
| `MITER`  | `'miter'` |
| `BEVEL`  | `'bevel'` |
| `ROUND`  | `'round'` |

### 定数

| 定数               | 値      | 説明                                                                     |
| ------------------ | ------- | ------------------------------------------------------------------------ |
| `MAX_VERTEX_COUNT` | `65536` | バッチのバッファ 1 本が扱える頂点の上限。                                |
| `BYTES_PER_VERTEX` | `12`    | 頂点 1 個あたりのバイト数（`Float32` の位置 2 個 + `Uint8` の色 4 個）。 |

## バックエンド

バックエンドは `IApplicationOptions.prefer`（`RENDERER_TYPE`）で選びます。省くと Canvas になります。

- **`CANVAS`** は Canvas2D の API（`fillRect`、`arc`、`ctx.stroke()` など）でそのまま描きます。
- **`WEB_GL`** と **`WEB_GPU`** はひとつの `BatchRenderer` の流れを共有します。図形は三角形に分解され、ひとつのインターリーブされた頂点バッファに詰められて、一回の呼び出しで描かれます。

三つのバックエンドはどれも **CSS の色ならなんでも**受けつけます。16 進（`#rgb` / `#rrggbb`）、色名、`rgb()`、`hsl()` のいずれも同じように解釈されます。

> **線の形はバックエンドごとに違います。これは意図的です。** Canvas バックエンドでは線の端と継ぎ目をブラウザー本来の `ctx.stroke()` が描きますが、WebGL と WebGPU では独自の三角形分割で描きます。両者はピクセル単位で同じにはなりません。
