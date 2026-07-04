# Color

一套基于类的颜色系统，配套用于处理 RGB、RGBA、HSL、HSLA、HSB/HSV 与十六进制颜色的转换辅助函数。它提供了功能丰富的 `Color` 类、值对象类（`Rgb`、`Rgba`、`Hsl`、`Hsla`）、调色板生成器 `ColorScheme`、一组独立的转换函数，以及终端 ANSI 样式映射 `FMT`。

> 更简单的辅助函数 `hexToRgb`、`rgbToHex` 和 `randomColor` 有各自独立的文档页：[hexToRgb](./hex_to_rgb.md)、[rgbToHex](./rgb_to_hex.md)、[randomColor](./random_color.md)。它们从同一模块中重新导出。

## API

### Color

主颜色类。它接受十六进制字符串、`[r, g, b, a]` 数组或独立的通道数字，并在构造时即时计算出所有表示形式（`rgb`、`rgba`、`hex`、`hsl`、`hsla`）以及扁平的通道访问器。

#### 构造函数

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### 参数

| 参数  | 说明                                                                                    | 类型                                          | 默认值   |
| ----- | --------------------------------------------------------------------------------------- | --------------------------------------------- | -------- |
| `r`   | 红色通道。可为十六进制字符串（`#f00` / `#ff0000`，`#` 可选）、`[r, g, b, a?]` 数组，或数字 | `string \| number \| Array<string \| number>` | 无       |
| `g`   | 绿色通道（当 `r` 为字符串或数组时忽略）                                                  | `string \| number`                            | `0`      |
| `b`   | 蓝色通道（当 `r` 为字符串或数组时忽略）                                                  | `string \| number`                            | `0`      |
| `a`   | 透明度通道（0–1）                                                                        | `string \| number`                            | `1.0`    |

#### 属性

| 属性     | 说明                              | 类型               |
| -------- | --------------------------------- | ------------------ |
| `r`      | 红色通道（0–255）                 | `string \| number` |
| `g`      | 绿色通道（0–255）                 | `string \| number` |
| `b`      | 蓝色通道（0–255）                 | `string \| number` |
| `a`      | 透明度通道（0–1）                 | `string \| number` |
| `h`      | 色相（0–360），与 `hsl.h` 同步    | `string \| number` |
| `s`      | 饱和度（0–100），与 `hsl.s` 同步  | `string \| number` |
| `l`      | 亮度（0–100），与 `hsl.l` 同步    | `string \| number` |
| `rgb`    | RGB 值对象                        | `Rgb`              |
| `rgba`   | RGBA 值对象                       | `Rgba`             |
| `hex`    | 十六进制字符串（如 `#ff0000`）    | `string`           |
| `hsl`    | HSL 值对象                        | `Hsl`              |
| `hsla`   | HSLA 值对象                       | `Hsla`             |

#### 方法

| 方法                        | 说明                                                              | 返回值 |
| --------------------------- | ----------------------------------------------------------------- | ------ |
| `setHue(newHue)`            | 设置色相并从 HSL 重新计算 RGB/hex                                 | `void` |
| `setSat(newSat)`            | 设置饱和度并从 HSL 重新计算 RGB/hex                               | `void` |
| `setLum(newLum)`            | 设置亮度并从 HSL 重新计算 RGB/hex                                 | `void` |
| `setAlpha(newAlpha)`        | 同时设置 `rgba` 与 `hsla` 的透明度（不影响 RGB/hex）             | `void` |
| `updateFromHsl()`           | 根据当前的 `h/s/l` 重新计算 `rgb`、各通道与 `hex`（由上述 setter 调用） | `void` |

### Rgb

由数组构造的 RGB 值对象。`toString()` 返回 CSS `rgb(...)` 字符串。

#### 构造函数

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### 属性与方法

| 成员         | 说明                    | 类型               |
| ------------ | ----------------------- | ------------------ |
| `r`          | 红色通道                | `string \| number` |
| `g`          | 绿色通道                | `string \| number` |
| `b`          | 蓝色通道                | `string \| number` |
| `toString()` | 返回 `rgb(r,g,b)`       | `string`           |

### Rgba

继承 `Rgb`，增加透明度通道。`toString()` 返回 CSS `rgba(...)` 字符串。

#### 构造函数

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### 属性与方法

| 成员         | 说明                    | 类型               |
| ------------ | ----------------------- | ------------------ |
| `r` `g` `b`  | 继承自 `Rgb`            | `string \| number` |
| `a`          | 透明度通道              | `string \| number` |
| `toString()` | 返回 `rgba(r,g,b,a)`    | `string`           |

### Hsl

由数组构造的 HSL 值对象。`toString()` 返回 CSS `hsl(...)` 字符串。

#### 构造函数

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### 属性与方法

| 成员         | 说明                    | 类型               |
| ------------ | ----------------------- | ------------------ |
| `h`          | 色相（0–360）           | `string \| number` |
| `s`          | 饱和度（0–100）         | `string \| number` |
| `l`          | 亮度（0–100）           | `string \| number` |
| `toString()` | 返回 `hsl(h,s%,l%)`     | `string`           |

### Hsla

继承 `Hsl`，增加透明度通道。`toString()` 返回 CSS `hsla(...)` 字符串。

#### 构造函数

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### 属性与方法

| 成员         | 说明                    | 类型               |
| ------------ | ----------------------- | ------------------ |
| `h` `s` `l`  | 继承自 `Hsl`           | `string \| number` |
| `a`          | 透明度通道              | `string \| number` |
| `toString()` | 返回 `hsla(h,s%,l%,a)`  | `string`           |

### ColorScheme

生成一组相关联的 `Color` 对象——既可以直接由一组颜色生成，也可以由一个基准色按一组色相角度旋转得到。静态工厂方法覆盖了常见的配色方案。

#### 构造函数

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| 参数         | 说明                                                                        | 类型                   |
| ------------ | --------------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | 基准色；或（当 `angleArray` 为 `undefined` 时）用于构建调色板的颜色数组      | `(string \| number)[]` |
| `angleArray` | 应用到基准色上的色相偏移量（度），用于派生额外的调色板成员                    | `number[]`             |

#### 属性与方法

| 成员                                     | 说明                                | 返回值    |
| ---------------------------------------- | ----------------------------------- | --------- |
| `palette`                                | 生成的颜色集合                      | `Color[]` |
| `createFromColors(colorVal)`             | 由颜色数组构建调色板                | `Color[]` |
| `createFromAngles(colorVal, angleArray)` | 由基准色加色相偏移量构建调色板      | `Color[]` |

#### 静态工厂方法

每个方法接受一个基准色值，返回带预设色相角度集的 `ColorScheme`。

| 方法                            | 色相角度          | 配色方案         |
| ------------------------------- | ----------------- | ---------------- |
| `ColorScheme.Compl(colorVal)`   | `[180]`           | 互补色           |
| `ColorScheme.Triad(colorVal)`   | `[120, 240]`      | 三角配色         |
| `ColorScheme.Tetrad(colorVal)`  | `[60, 180, 240]`  | 四角配色         |
| `ColorScheme.Analog(colorVal)`  | `[-45, 45]`       | 邻近色           |
| `ColorScheme.Split(colorVal)`   | `[150, 210]`      | 分裂互补色       |
| `ColorScheme.Accent(colorVal)`  | `[-45, 45, 180]`  | 强调邻近色       |

### 转换函数

`Color` 内部使用的独立函数，每个都单独导出以便直接使用。对于接受三个通道参数的函数，第一个参数也可以是单个数组（例如 `rgbToHsl([r, g, b])`）。

| 函数                              | 说明                                                     | 签名                                                            |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| `componentToHex(c)`               | 将一个 0–255 通道转换为两位十六进制字符串                | `(c: string \| number) => string`                              |
| `hue2rgb(p, q, t)`                | HSL→RGB 的色相辅助函数（由 `hslToRgb` 使用）            | `(p: number, q: number, t: number) => number`                  |
| `hslToRgb(h, s, l)`               | HSL → `[r, g, b]`（0–255）。首参可为 `[h, s, l]`         | `(h, s, l) => number[]`                                         |
| `rgbToHsl(r, g, b)`               | RGB → `[h, s, l]`。首参可为 `[r, g, b]`                  | `(r, g, b) => number[]`                                         |
| `rgbToHsb(r, g, b)`               | RGB → `[h, s, b]`（HSB/HSV）                             | `(r: number, g: number, b: number) => number[]`                |
| `hsbToRgb(h, s, v)`               | HSB/HSV → `[r, g, b]`（0–255）                           | `(h: number, s: number, v: number) => number[]`                |
| `hsvToRgb(h, s, v)`               | `hsbToRgb` 的别名                                        | `(h: number, s: number, v: number) => number[]`                |
| `hsvToHsl(h, s, b)`               | HSB/HSV → `[h, s, l]`（经由 `rgbToHsl(hsbToRgb(...))`）  | `(h, s, b) => number[]`                                         |

> `componentToHex`、`rgbToHex` 和 `hexToRgb` 是底层构建块；参见 [rgbToHex](./rgb_to_hex.md) 与 [hexToRgb](./hex_to_rgb.md)。

### FMT

一个记录终端 ANSI 转义码对的对象，用于文本样式和着色。每个条目都是 `[open, close]` 元组，用于包裹字符串以为终端输出添加样式。

```ts
const FMT: Record<string, Array<string>>
```

可用的键：`bold`、`dim`、`reset`、`italic`、`underline`、`inverse`、`hidden`、`strikethrough`、`black`、`red`、`green`、`yellow`、`blue`、`magenta`、`cyan`、`white`、`gray`，以及背景变体 `bgBlack`、`bgRed`、`bgGreen`、`bgYellow`、`bgBlue`、`bgMagenta`、`bgCyan`、`bgWhite`。

## Example

### 创建 Color

```js
import { Color } from 'ranuts';

// 由十六进制字符串创建（长短形式均可，# 可选）
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// 由通道创建
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// 由数组创建（含透明度）
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### 通过 HSL 修改 Color

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // 将色相旋转到绿色
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // 更暗
color.setSat(50); // 降低饱和度
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### 使用 ColorScheme 构建调色板

```js
import { ColorScheme } from 'ranuts';

// 由基准色生成互补色对
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// 三角配色方案（基准色 + 相隔 120° 的两个颜色）
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// 直接由颜色列表生成
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### 使用转换函数

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// 在文档标注处也可传入数组
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### 使用 FMT 为终端输出添加样式

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // 在终端中显示绿色的 "success"

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## 注意事项

1. **即时计算**：`Color` 在构造函数中计算出所有表示形式，因此 `hex`、`rgb`、`rgba`、`hsl` 与 `hsla` 在构造时总是保持同步。
2. **HSL setter 会重算 RGB**：`setHue` / `setSat` / `setLum` 会更新 HSL，然后通过 `updateFromHsl` 重新推导 RGB 与 hex；`setAlpha` 只影响 `rgba` 与 `hsla`。
3. **数组或通道两种入参**：若干转换函数（`rgbToHex`、`rgbToHsl`、`hslToRgb`）既接受三个通道参数，也接受把单个数组作为第一个参数。
4. **HSV 与 HSB**：`hsvToRgb` 是 `hsbToRgb` 的别名，`hsvToHsl` 是 HSB→HSL 转换的别名——此处 HSV 与 HSB 指同一模型。
5. **FMT 仅限终端**：这些 ANSI 转义序列只有在支持它们的终端中才会呈现为样式；在浏览器控制台中会显示为原始控制字符。
