# Color

A class-based color system with conversion helpers for working with RGB, RGBA, HSL, HSLA, HSB/HSV and hexadecimal colors. It provides a rich `Color` class, immutable value classes (`Rgb`, `Rgba`, `Hsl`, `Hsla`), a `ColorScheme` palette generator, a set of standalone conversion functions, and the `FMT` terminal ANSI style map.

> The simpler helpers `hexToRgb`, `rgbToHex` and `randomColor` are documented on their own pages: [hexToRgb](./hex_to_rgb.md), [rgbToHex](./rgb_to_hex.md), [randomColor](./random_color.md). They are re-exported from the same module.

## API

### Color

The main color class. It accepts a hex string, an `[r, g, b, a]` array, or separate channel numbers, and eagerly computes every representation (`rgb`, `rgba`, `hex`, `hsl`, `hsla`) plus flat channel accessors.

#### Constructor

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### Parameters

| Parameter | Description                                                                                                | Type                                          | Default  |
| --------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- | -------- |
| `r`       | Red channel. A hex string (`#f00` / `#ff0000`, with or without `#`), an `[r, g, b, a?]` array, or a number | `string \| number \| Array<string \| number>` | Required |
| `g`       | Green channel (ignored when `r` is a string or array)                                                      | `string \| number`                            | `0`      |
| `b`       | Blue channel (ignored when `r` is a string or array)                                                       | `string \| number`                            | `0`      |
| `a`       | Alpha channel (0–1)                                                                                        | `string \| number`                            | `1.0`    |

#### Properties

| Property | Description                         | Type               |
| -------- | ----------------------------------- | ------------------ |
| `r`      | Red channel (0–255)                 | `string \| number` |
| `g`      | Green channel (0–255)               | `string \| number` |
| `b`      | Blue channel (0–255)                | `string \| number` |
| `a`      | Alpha channel (0–1)                 | `string \| number` |
| `h`      | Hue (0–360), mirrors `hsl.h`        | `string \| number` |
| `s`      | Saturation (0–100), mirrors `hsl.s` | `string \| number` |
| `l`      | Lightness (0–100), mirrors `hsl.l`  | `string \| number` |
| `rgb`    | RGB value object                    | `Rgb`              |
| `rgba`   | RGBA value object                   | `Rgba`             |
| `hex`    | Hexadecimal string (e.g. `#ff0000`) | `string`           |
| `hsl`    | HSL value object                    | `Hsl`              |
| `hsla`   | HSLA value object                   | `Hsla`             |

#### Methods

| Method               | Description                                                                                | Return |
| -------------------- | ------------------------------------------------------------------------------------------ | ------ |
| `setHue(newHue)`     | Set hue and recompute RGB/hex from HSL                                                     | `void` |
| `setSat(newSat)`     | Set saturation and recompute RGB/hex from HSL                                              | `void` |
| `setLum(newLum)`     | Set lightness and recompute RGB/hex from HSL                                               | `void` |
| `setAlpha(newAlpha)` | Set alpha on both `rgba` and `hsla` (does not touch RGB/hex)                               | `void` |
| `updateFromHsl()`    | Recompute `rgb`, channels and `hex` from the current `h/s/l` (called by the setters above) | `void` |

### Rgb

An RGB value object built from an array. `toString()` returns a CSS `rgb(...)` string.

#### Constructor

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### Properties & Methods

| Member       | Description          | Type               |
| ------------ | -------------------- | ------------------ |
| `r`          | Red channel          | `string \| number` |
| `g`          | Green channel        | `string \| number` |
| `b`          | Blue channel         | `string \| number` |
| `toString()` | Returns `rgb(r,g,b)` | `string`           |

### Rgba

Extends `Rgb` with an alpha channel. `toString()` returns a CSS `rgba(...)` string.

#### Constructor

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### Properties & Methods

| Member       | Description             | Type               |
| ------------ | ----------------------- | ------------------ |
| `r` `g` `b`  | Inherited from `Rgb`    | `string \| number` |
| `a`          | Alpha channel           | `string \| number` |
| `toString()` | Returns `rgba(r,g,b,a)` | `string`           |

### Hsl

An HSL value object built from an array. `toString()` returns a CSS `hsl(...)` string.

#### Constructor

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### Properties & Methods

| Member       | Description            | Type               |
| ------------ | ---------------------- | ------------------ |
| `h`          | Hue (0–360)            | `string \| number` |
| `s`          | Saturation (0–100)     | `string \| number` |
| `l`          | Lightness (0–100)      | `string \| number` |
| `toString()` | Returns `hsl(h,s%,l%)` | `string`           |

### Hsla

Extends `Hsl` with an alpha channel. `toString()` returns a CSS `hsla(...)` string.

#### Constructor

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### Properties & Methods

| Member       | Description               | Type               |
| ------------ | ------------------------- | ------------------ |
| `h` `s` `l`  | Inherited from `Hsl`      | `string \| number` |
| `a`          | Alpha channel             | `string \| number` |
| `toString()` | Returns `hsla(h,s%,l%,a)` | `string`           |

### ColorScheme

Generates a palette of related `Color` objects — either directly from a list of colors, or from a base color rotated by an array of hue angles. Static factory methods cover common color-harmony schemes.

#### Constructor

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| Parameter    | Description                                                                                    | Type                   |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | Base color, or (when `angleArray` is `undefined`) an array of colors to build the palette from | `(string \| number)[]` |
| `angleArray` | Hue offsets (degrees) applied to the base color to derive additional palette entries           | `number[]`             |

#### Properties & Methods

| Member                                   | Description                                          | Return    |
| ---------------------------------------- | ---------------------------------------------------- | --------- |
| `palette`                                | The generated colors                                 | `Color[]` |
| `createFromColors(colorVal)`             | Build the palette from an array of colors            | `Color[]` |
| `createFromAngles(colorVal, angleArray)` | Build the palette from a base color plus hue offsets | `Color[]` |

#### Static factory methods

Each takes a base color value and returns a `ColorScheme` with a preset hue-angle set.

| Method                         | Hue angles       | Scheme              |
| ------------------------------ | ---------------- | ------------------- |
| `ColorScheme.Compl(colorVal)`  | `[180]`          | Complementary       |
| `ColorScheme.Triad(colorVal)`  | `[120, 240]`     | Triadic             |
| `ColorScheme.Tetrad(colorVal)` | `[60, 180, 240]` | Tetradic            |
| `ColorScheme.Analog(colorVal)` | `[-45, 45]`      | Analogous           |
| `ColorScheme.Split(colorVal)`  | `[150, 210]`     | Split-complementary |
| `ColorScheme.Accent(colorVal)` | `[-45, 45, 180]` | Accented analogous  |

### Conversion functions

Standalone functions used internally by `Color`; each is exported for direct use. Where a function accepts three channel arguments, the first may also be a single array (e.g. `rgbToHsl([r, g, b])`).

| Function            | Description                                                     | Signature                                       |
| ------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| `componentToHex(c)` | Convert one 0–255 channel to a two-digit hex string             | `(c: string \| number) => string`               |
| `hue2rgb(p, q, t)`  | HSL→RGB hue helper (used by `hslToRgb`)                         | `(p: number, q: number, t: number) => number`   |
| `hslToRgb(h, s, l)` | HSL → `[r, g, b]` (0–255). Accepts `[h, s, l]` as the first arg | `(h, s, l) => number[]`                         |
| `rgbToHsl(r, g, b)` | RGB → `[h, s, l]`. Accepts `[r, g, b]` as the first arg         | `(r, g, b) => number[]`                         |
| `rgbToHsb(r, g, b)` | RGB → `[h, s, b]` (HSB/HSV)                                     | `(r: number, g: number, b: number) => number[]` |
| `hsbToRgb(h, s, v)` | HSB/HSV → `[r, g, b]` (0–255)                                   | `(h: number, s: number, v: number) => number[]` |
| `hsvToRgb(h, s, v)` | Alias of `hsbToRgb`                                             | `(h: number, s: number, v: number) => number[]` |
| `hsvToHsl(h, s, b)` | HSB/HSV → `[h, s, l]` (via `rgbToHsl(hsbToRgb(...))`)           | `(h, s, b) => number[]`                         |

> `componentToHex`, `rgbToHex` and `hexToRgb` are the low-level building blocks; see [rgbToHex](./rgb_to_hex.md) and [hexToRgb](./hex_to_rgb.md).

### FMT

A record of ANSI terminal escape-code pairs for text styling and coloring. Each entry is a `[open, close]` tuple you wrap around a string to style terminal output.

```ts
const FMT: Record<string, Array<string>>;
```

Available keys: `bold`, `dim`, `reset`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, and the background variants `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`.

## Example

### Creating a Color

```js
import { Color } from 'ranuts';

// From a hex string (short or long form, # optional)
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// From channels
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// From an array (with alpha)
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### Mutating a Color via HSL

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // rotate hue to green
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // darker
color.setSat(50); // desaturate
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### Building a palette with ColorScheme

```js
import { ColorScheme } from 'ranuts';

// Complementary pair from a base color
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// Triadic scheme (base + two colors 120° apart)
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// Directly from a list of colors
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### Using the conversion functions

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// Array input is also accepted where documented
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### Styling terminal output with FMT

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // green "success" in a terminal

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## Notes

1. **Eager computation**: A `Color` computes all representations in its constructor, so `hex`, `rgb`, `rgba`, `hsl` and `hsla` are always in sync at construction time.
2. **HSL setters recompute RGB**: `setHue` / `setSat` / `setLum` update HSL and then re-derive RGB and hex via `updateFromHsl`. `setAlpha` only affects `rgba` and `hsla`.
3. **Array-or-channels inputs**: Several conversion functions (`rgbToHex`, `rgbToHsl`, `hslToRgb`) accept either three channel arguments or a single array as the first argument.
4. **HSV vs HSB**: `hsvToRgb` is an alias of `hsbToRgb`, and `hsvToHsl` an alias of the HSB→HSL conversion — HSV and HSB refer to the same model here.
5. **FMT is terminal-only**: The ANSI escape sequences render as styling only in a terminal that supports them; in a browser console they appear as raw control characters.
