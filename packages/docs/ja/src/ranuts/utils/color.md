# Color

クラスを土台にした色のしくみです。RGB、RGBA、HSL、HSLA、HSB/HSV、16 進表記を扱うための変換ヘルパーがそろっています。中身は、機能の厚い `Color` クラス、変更できない値クラス（`Rgb`、`Rgba`、`Hsl`、`Hsla`）、パレット生成の `ColorScheme`、単独で使える変換関数の一式、そしてターミナル用の ANSI スタイル表 `FMT` です。

> もっと簡単なヘルパーである `hexToRgb`、`rgbToHex`、`randomColor` には、それぞれ専用のページがあります。[hexToRgb](./hex_to_rgb.md)、[rgbToHex](./rgb_to_hex.md)、[randomColor](./random_color.md) です。いずれも同じモジュールから再 export されています。

## API

### Color

中心となる色のクラスです。16 進の文字列、`[r, g, b, a]` の配列、あるいはチャンネルごとの数値を受け取り、すべての表現（`rgb`、`rgba`、`hex`、`hsl`、`hsla`）とチャンネル直読み用のアクセサーを、その場で計算します。

#### コンストラクター

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### パラメーター

| パラメーター | 説明                                                                                                            | 型                                            | 既定値 |
| ------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------ |
| `r`          | 赤のチャンネル。16 進の文字列（`#f00` / `#ff0000`。`#` はあってもなくても）、`[r, g, b, a?]` の配列、または数値 | `string \| number \| Array<string \| number>` | 必須   |
| `g`          | 緑のチャンネル（`r` が文字列か配列のときは無視されます）                                                        | `string \| number`                            | `0`    |
| `b`          | 青のチャンネル（`r` が文字列か配列のときは無視されます）                                                        | `string \| number`                            | `0`    |
| `a`          | アルファチャンネル（0〜1）                                                                                      | `string \| number`                            | `1.0`  |

#### Properties

| プロパティ | 説明                                 | 型                 |
| ---------- | ------------------------------------ | ------------------ |
| `r`        | 赤のチャンネル（0〜255）             | `string \| number` |
| `g`        | 緑のチャンネル（0〜255）             | `string \| number` |
| `b`        | 青のチャンネル（0〜255）             | `string \| number` |
| `a`        | アルファチャンネル（0〜1）           | `string \| number` |
| `h`        | 色相（0〜360）。`hsl.h` と連動します | `string \| number` |
| `s`        | 彩度（0〜100）。`hsl.s` と連動します | `string \| number` |
| `l`        | 明度（0〜100）。`hsl.l` と連動します | `string \| number` |
| `rgb`      | RGB の値オブジェクト                 | `Rgb`              |
| `rgba`     | RGBA の値オブジェクト                | `Rgba`             |
| `hex`      | 16 進の文字列（`#ff0000` など）      | `string`           |
| `hsl`      | HSL の値オブジェクト                 | `Hsl`              |
| `hsla`     | HSLA の値オブジェクト                | `Hsla`             |

#### Methods

| メソッド             | 説明                                                                                          | 返り値 |
| -------------------- | --------------------------------------------------------------------------------------------- | ------ |
| `setHue(newHue)`     | 色相を設定し、HSL から RGB と hex を計算し直します                                            | `void` |
| `setSat(newSat)`     | 彩度を設定し、HSL から RGB と hex を計算し直します                                            | `void` |
| `setLum(newLum)`     | 明度を設定し、HSL から RGB と hex を計算し直します                                            | `void` |
| `setAlpha(newAlpha)` | `rgba` と `hsla` の両方にアルファを設定します（RGB と hex には触れません）                    | `void` |
| `updateFromHsl()`    | いまの `h/s/l` から `rgb`、各チャンネル、`hex` を計算し直します（上のセッターから呼ばれます） | `void` |

### Rgb

配列から作る RGB の値オブジェクトです。`toString()` は CSS の `rgb(...)` 文字列を返します。

#### コンストラクター

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### プロパティとメソッド

| メンバー     | 説明                    | 型                 |
| ------------ | ----------------------- | ------------------ |
| `r`          | 赤のチャンネル          | `string \| number` |
| `g`          | 緑のチャンネル          | `string \| number` |
| `b`          | 青のチャンネル          | `string \| number` |
| `toString()` | `rgb(r,g,b)` を返します | `string`           |

### Rgba

`Rgb` にアルファチャンネルを足したものです。`toString()` は CSS の `rgba(...)` 文字列を返します。

#### コンストラクター

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### プロパティとメソッド

| メンバー     | 説明                       | 型                 |
| ------------ | -------------------------- | ------------------ |
| `r` `g` `b`  | `Rgb` から受け継いだもの   | `string \| number` |
| `a`          | アルファチャンネル         | `string \| number` |
| `toString()` | `rgba(r,g,b,a)` を返します | `string`           |

### Hsl

配列から作る HSL の値オブジェクトです。`toString()` は CSS の `hsl(...)` 文字列を返します。

#### コンストラクター

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### プロパティとメソッド

| メンバー     | 説明                      | 型                 |
| ------------ | ------------------------- | ------------------ |
| `h`          | 色相（0〜360）            | `string \| number` |
| `s`          | 彩度（0〜100）            | `string \| number` |
| `l`          | 明度（0〜100）            | `string \| number` |
| `toString()` | `hsl(h,s%,l%)` を返します | `string`           |

### Hsla

`Hsl` にアルファチャンネルを足したものです。`toString()` は CSS の `hsla(...)` 文字列を返します。

#### コンストラクター

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### プロパティとメソッド

| メンバー     | 説明                         | 型                 |
| ------------ | ---------------------------- | ------------------ |
| `h` `s` `l`  | `Hsl` から受け継いだもの     | `string \| number` |
| `a`          | アルファチャンネル           | `string \| number` |
| `toString()` | `hsla(h,s%,l%,a)` を返します | `string`           |

### ColorScheme

関連しあう `Color` のパレットを作ります。色の一覧からそのまま作ることも、基準色を色相の角度の配列だけ回して作ることもできます。よくある配色の型は、静的なファクトリーメソッドとして用意してあります。

#### コンストラクター

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| パラメーター | 説明                                                                             | 型                     |
| ------------ | -------------------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | 基準となる色。`angleArray` が `undefined` のときは、パレットの素材にする色の配列 | `(string \| number)[]` |
| `angleArray` | 基準色にかける色相のずらし幅（度）。ここからパレットの残りを導きます             | `number[]`             |

#### プロパティとメソッド

| メンバー                                 | 説明                                             | 返り値    |
| ---------------------------------------- | ------------------------------------------------ | --------- |
| `palette`                                | 作られた色たち                                   | `Color[]` |
| `createFromColors(colorVal)`             | 色の配列からパレットを組み立てます               | `Color[]` |
| `createFromAngles(colorVal, angleArray)` | 基準色と色相のずらし幅からパレットを組み立てます | `Color[]` |

#### 静的なファクトリーメソッド

どれも基準となる色の値を受け取り、あらかじめ決められた色相の角度の組をもつ `ColorScheme` を返します。

| メソッド                       | 色相の角度       | 配色                 |
| ------------------------------ | ---------------- | -------------------- |
| `ColorScheme.Compl(colorVal)`  | `[180]`          | 補色                 |
| `ColorScheme.Triad(colorVal)`  | `[120, 240]`     | トライアド           |
| `ColorScheme.Tetrad(colorVal)` | `[60, 180, 240]` | テトラード           |
| `ColorScheme.Analog(colorVal)` | `[-45, 45]`      | 類似色               |
| `ColorScheme.Split(colorVal)`  | `[150, 210]`     | 分裂補色             |
| `ColorScheme.Accent(colorVal)` | `[-45, 45, 180]` | アクセントつき類似色 |

### 変換の関数

`Color` が内部で使っている、単独でも成り立つ関数です。どれもそのまま使えるように export されています。チャンネルを三つ受け取る関数では、最初の引数に配列ひとつを渡してもかまいません（`rgbToHsl([r, g, b])` のように）。

| 関数                | 説明                                                                  | シグネチャ                                      |
| ------------------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| `componentToHex(c)` | 0〜255 のチャンネルひとつを 2 桁の 16 進文字列に変換します            | `(c: string \| number) => string`               |
| `hue2rgb(p, q, t)`  | HSL から RGB へ変換するときの色相ヘルパー（`hslToRgb` が使います）    | `(p: number, q: number, t: number) => number`   |
| `hslToRgb(h, s, l)` | HSL から `[r, g, b]`（0〜255）へ。最初の引数に `[h, s, l]` を渡せます | `(h, s, l) => number[]`                         |
| `rgbToHsl(r, g, b)` | RGB から `[h, s, l]` へ。最初の引数に `[r, g, b]` を渡せます          | `(r, g, b) => number[]`                         |
| `rgbToHsb(r, g, b)` | RGB から `[h, s, b]`（HSB/HSV）へ                                     | `(r: number, g: number, b: number) => number[]` |
| `hsbToRgb(h, s, v)` | HSB/HSV から `[r, g, b]`（0〜255）へ                                  | `(h: number, s: number, v: number) => number[]` |
| `hsvToRgb(h, s, v)` | `hsbToRgb` の別名                                                     | `(h: number, s: number, v: number) => number[]` |
| `hsvToHsl(h, s, b)` | HSB/HSV から `[h, s, l]` へ（`rgbToHsl(hsbToRgb(...))` を経由）       | `(h, s, b) => number[]`                         |
| `rgbToHsv(r, g, b)` | `rgbToHsb` の別名                                                     | `(r: number, g: number, b: number) => number[]` |
| `hexToHsb(hex)`     | `#rrggbb` / `#rgb` から `[h, s, b]` へ。形が崩れていれば `null`       | `(hex: string) => number[] \| null`             |
| `hexToHsv(hex)`     | `hexToHsb` の別名                                                     | `(hex: string) => number[] \| null`             |
| `hsbToHsl(h, s, b)` | HSB/HSV から `[h, s, l]` へ                                           | `(h, s, b) => number[]`                         |
| `hslToHsb(h, s, l)` | HSL から `[h, s, b]` へ                                               | `(h, s, l) => number[]`                         |
| `hslToHsv(h, s, l)` | `hslToHsb` の別名                                                     | `(h, s, l) => number[]`                         |

> `componentToHex`、`rgbToHex`、`hexToRgb` は低い層の部品です。[rgbToHex](./rgb_to_hex.md) と [hexToRgb](./hex_to_rgb.md) を参照してください。

### アルファのヘルパー

ここでのアルファは **0〜100** で表します。CSS の `rgba()` が取る 0〜1 ではなく、このモジュールが彩度と明度に使っているパーセントの目盛りにそろえてあります。

| 関数                  | 説明                                                          | シグネチャ                 |
| --------------------- | ------------------------------------------------------------- | -------------------------- |
| `hexToAlpha(aa)`      | 2 桁の 16 進アルファ（`ff` / `80` / `00`）から 0〜100 へ      | `(aa: string) => number`   |
| `rgbaString(r,g,b,a)` | CSS の `rgba()` 文字列を組み立てます。`a` は 100 で割られます | `(r, g, b, a) => string`   |
| `rgbaToRgb(r,g,b,a)`  | 半透明の色を**白の上に**重ね、不透明な `[r, g, b]` にします   | `(r, g, b, a) => number[]` |
| `rgbaToHex(r,g,b,a)`  | 同じ重ね合わせの結果を、6 桁の 16 進文字列で返します          | `(r, g, b, a) => string`   |

::: warning
`rgbaToRgb` と `rgbaToHex` は背景を**白**に決め打ちしています。アルファチャンネルを受けつけられない場所（6 桁の 16 進で書き戻すときなど）のためのものです。暗いテーマの下では結果が明るすぎて見えるので、その場合は自分の背景色に対して合成してください。
:::

### 合成とシェーダー数学のヘルパー

`ranuts/visual` の後処理フィルター（`ColorAdjustFilter` とその仲間）の裏で動いている、色調整と合成の計算です。CPU 側でも使い回せるように export してあります（GPU のパイプラインを立ち上げずにサムネイルのプレビューを計算する、といった用途です）。このモジュールのほかの部分と違い、**ここでのチャンネルは 0〜1** です。0〜255 でも 0〜100 でもなく、シェーダーの流儀にそろえてあります。

| 関数                                  | 説明                                                                                                                                          | シグネチャ                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `luma(r, g, b)`                       | 目に感じられる明るさ（Rec. 601 の重み）。入力の目盛り（0〜1 でも 0〜255 でも）をそのまま保ちます                                              | `(r, g, b) => number`                        |
| `blendScreen(base, blend)`            | スクリーン合成。チャンネルごとに `1 - (1-base)(1-blend)`                                                                                      | `(base: RGB, blend: RGB) => RGB`             |
| `blendMultiply(base, blend)`          | 乗算合成。チャンネルごとに `base * blend`                                                                                                     | `(base: RGB, blend: RGB) => RGB`             |
| `blendOverlay(base, blend)`           | オーバーレイ。暗部では乗算、明部ではスクリーン                                                                                                | `(base: RGB, blend: RGB) => RGB`             |
| `brightnessContrast(color, b, c)`     | チャンネルごとに `(channel - 0.5) * contrast + 0.5 + brightness`                                                                              | `(color: RGB, brightness, contrast) => RGB`  |
| `saturation(color, amount)`           | 輝度のほうへ混ぜます。`0` で白黒、`1` でそのまま、`1` より大きいと彩度が上がります                                                            | `(color: RGB, amount: number) => RGB`        |
| `vibrance(color, amount)`             | `saturation` に似ていますが、くすんだチャンネルのほうを、すでに鮮やかなチャンネルより強く持ち上げます。`0` より大きいと強め、小さいと弱めます | `(color: RGB, amount: number) => RGB`        |
| `cosinePalette(t, a, b, c, d)`        | Inigo Quilez のコサイン勾配。`a + b·cos(2π(c·t + d))`。`a` から `d` はそれぞれ RGB の三つ組で、`t` は 0〜1 の位置                             | `(t, a: RGB, b: RGB, c: RGB, d: RGB) => RGB` |
| `srgbToLinear(c)` / `linearToSrgb(c)` | チャンネルひとつを sRGB（16 進の色から読み取る値）とリニアな光（シェーダーの計算が求める値）のあいだで変換します                              | `(c: number) => number`                      |

```ts
import { blendScreen, brightnessContrast, cosinePalette, srgbToLinear, linearToSrgb } from 'ranuts/utils';

// 0〜1 の色ふたつをスクリーン合成する
const screened = blendScreen([0.8, 0.2, 0.1], [0.1, 0.5, 0.9]);

// コントラストを上げ、明るさをすこし下げる
const graded = brightnessContrast([0.6, 0.6, 0.6], -0.05, 1.2);

// 手続き的なグラデーションのパレットを t=0.35 で取り出す
const swatch = cosinePalette(0.35, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1, 1, 1], [0, 0.33, 0.67]);

// ガンマを正しく扱う計算（合成や照明）は、リニア空間で行うべきです
const linear = srgbToLinear(0.5);
const backToSrgb = linearToSrgb(linear); // ≈ 0.5
```

::: warning
合成と色調整の計算は、物理的に正しい結果を得るために**リニアな光**の値を前提にしています。8 ビットの 16 進の色は sRGB で符号化されているので、合成が「動く」だけでなく「正しく見える」必要があるなら、まず `srgbToLinear` を通してください。
:::

### 書式のパターン

色の文字列を検証するための正規表現です。`RGB_REGEX` と `RGBA_REGEX` は空白を**受けつけません**。先に取り除いてください（`value.replace(/\s+/g, '')`）。

| 定数              | 一致するもの                                               |
| ----------------- | ---------------------------------------------------------- |
| `HEX_COLOR_REGEX` | `#rgb` / `#rrggbb`。`#` は必須で、大文字小文字は問いません |
| `RGB_REGEX`       | `rgb(r,g,b)`                                               |
| `RGBA_REGEX`      | `rgba(r,g,b,a)`                                            |

### FMT

文字の装飾と色づけに使う、ターミナル向け ANSI エスケープコードの組を集めたレコードです。各項目は `[開始, 終了]` のタプルで、文字列をこれで挟むとターミナルの出力に装飾がつきます。

```ts
const FMT: Record<string, Array<string>>;
```

使えるキーは `bold`、`dim`、`reset`、`italic`、`underline`、`inverse`、`hidden`、`strikethrough`、`black`、`red`、`green`、`yellow`、`blue`、`magenta`、`cyan`、`white`、`gray`、それに背景色版の `bgBlack`、`bgRed`、`bgGreen`、`bgYellow`、`bgBlue`、`bgMagenta`、`bgCyan`、`bgWhite` です。

## 使用例

### Color を作る

```js
import { Color } from 'ranuts';

// 16 進の文字列から（短い形でも長い形でも、# はあってもなくても）
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// チャンネルごとの値から
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// 配列から（アルファつき）
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### HSL を通して Color を書き換える

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // 色相を緑まで回す
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // より暗く
color.setSat(50); // 彩度を落とす
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### ColorScheme でパレットを組む

```js
import { ColorScheme } from 'ranuts';

// 基準色から補色の対を作る
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// トライアド配色（基準色と、120 度ずつ離れた二色）
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// 色の一覧からそのまま
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### 変換の関数を使う

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// ドキュメントに書かれている場所では、配列を渡すこともできます
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### FMT でターミナルの出力を飾る

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // ターミナルでは "success" が緑になります

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## 補足

1. **その場で全部計算します**: `Color` はコンストラクターですべての表現を計算するので、生成した時点で `hex`、`rgb`、`rgba`、`hsl`、`hsla` は必ずそろっています。
2. **HSL のセッターは RGB を計算し直します**: `setHue` / `setSat` / `setLum` は HSL を更新したあと、`updateFromHsl` で RGB と hex を導き直します。`setAlpha` が触るのは `rgba` と `hsla` だけです。
3. **配列でもチャンネルでも渡せます**: いくつかの変換関数（`rgbToHex`、`rgbToHsl`、`hslToRgb`）は、チャンネル三つでも、最初の引数に配列ひとつでも受け取ります。
4. **HSV と HSB について**: `hsvToRgb` は `hsbToRgb` の別名、`hsvToHsl` は HSB から HSL への変換の別名です。ここでは HSV と HSB は同じモデルを指しています。
5. **FMT はターミナル専用です**: ANSI のエスケープ列が装飾として見えるのは、それに対応したターミナルの中だけです。ブラウザーのコンソールでは、制御文字がそのまま見えてしまいます。
