# Color

Un sistema de color basado en clases, con ayudas de conversión para trabajar con RGB, RGBA, HSL, HSLA, HSB/HSV y colores hexadecimales. Trae una clase `Color` bien surtida, clases de valor inmutables (`Rgb`, `Rgba`, `Hsl`, `Hsla`), el generador de paletas `ColorScheme`, un juego de funciones de conversión sueltas y `FMT`, el mapa de estilos ANSI para la terminal.

> Las ayudas más sencillas —`hexToRgb`, `rgbToHex` y `randomColor`— tienen página propia: [hexToRgb](./hex_to_rgb.md), [rgbToHex](./rgb_to_hex.md), [randomColor](./random_color.md). Se reexportan desde este mismo módulo.

## API

### Color

La clase principal de color. Acepta una cadena hexadecimal, un array `[r, g, b, a]` o los canales como números sueltos, y calcula de inmediato todas las representaciones (`rgb`, `rgba`, `hex`, `hsl`, `hsla`) además de los accesores directos a cada canal.

#### Constructor

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### Parámetros

| Parámetro | Descripción                                                                                                      | Tipo                                          | Por defecto |
| --------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `r`       | Canal rojo. Una cadena hexadecimal (`#f00` o `#ff0000`, con `#` o sin él), un array `[r, g, b, a?]`, o un número | `string \| number \| Array<string \| number>` | Obligatorio |
| `g`       | Canal verde (se ignora cuando `r` es una cadena o un array)                                                      | `string \| number`                            | `0`         |
| `b`       | Canal azul (se ignora cuando `r` es una cadena o un array)                                                       | `string \| number`                            | `0`         |
| `a`       | Canal alfa (de 0 a 1)                                                                                            | `string \| number`                            | `1.0`       |

#### Properties

| Propiedad | Descripción                                      | Tipo               |
| --------- | ------------------------------------------------ | ------------------ |
| `r`       | Canal rojo (de 0 a 255)                          | `string \| number` |
| `g`       | Canal verde (de 0 a 255)                         | `string \| number` |
| `b`       | Canal azul (de 0 a 255)                          | `string \| number` |
| `a`       | Canal alfa (de 0 a 1)                            | `string \| number` |
| `h`       | Tono (de 0 a 360), va a la par de `hsl.h`        | `string \| number` |
| `s`       | Saturación (de 0 a 100), va a la par de `hsl.s`  | `string \| number` |
| `l`       | Luminosidad (de 0 a 100), va a la par de `hsl.l` | `string \| number` |
| `rgb`     | Objeto de valor RGB                              | `Rgb`              |
| `rgba`    | Objeto de valor RGBA                             | `Rgba`             |
| `hex`     | Cadena hexadecimal (por ejemplo `#ff0000`)       | `string`           |
| `hsl`     | Objeto de valor HSL                              | `Hsl`              |
| `hsla`    | Objeto de valor HSLA                             | `Hsla`             |

#### Methods

| Método               | Descripción                                                                                        | Devuelve |
| -------------------- | -------------------------------------------------------------------------------------------------- | -------- |
| `setHue(newHue)`     | Fija el tono y recalcula el RGB y el hexadecimal a partir del HSL                                  | `void`   |
| `setSat(newSat)`     | Fija la saturación y recalcula el RGB y el hexadecimal a partir del HSL                            | `void`   |
| `setLum(newLum)`     | Fija la luminosidad y recalcula el RGB y el hexadecimal a partir del HSL                           | `void`   |
| `setAlpha(newAlpha)` | Fija el alfa tanto en `rgba` como en `hsla` (no toca el RGB ni el hexadecimal)                     | `void`   |
| `updateFromHsl()`    | Recalcula `rgb`, los canales y `hex` a partir del `h/s/l` actual (lo llaman los setters de arriba) | `void`   |

### Rgb

Un objeto de valor RGB construido a partir de un array. `toString()` devuelve una cadena CSS `rgb(...)`.

#### Constructor

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### Propiedades y métodos

| Miembro      | Descripción           | Tipo               |
| ------------ | --------------------- | ------------------ |
| `r`          | Canal rojo            | `string \| number` |
| `g`          | Canal verde           | `string \| number` |
| `b`          | Canal azul            | `string \| number` |
| `toString()` | Devuelve `rgb(r,g,b)` | `string`           |

### Rgba

Extiende `Rgb` con un canal alfa. `toString()` devuelve una cadena CSS `rgba(...)`.

#### Constructor

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### Propiedades y métodos

| Miembro      | Descripción              | Tipo               |
| ------------ | ------------------------ | ------------------ |
| `r` `g` `b`  | Heredado de `Rgb`        | `string \| number` |
| `a`          | Canal alfa               | `string \| number` |
| `toString()` | Devuelve `rgba(r,g,b,a)` | `string`           |

### Hsl

Un objeto de valor HSL construido a partir de un array. `toString()` devuelve una cadena CSS `hsl(...)`.

#### Constructor

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### Propiedades y métodos

| Miembro      | Descripción              | Tipo               |
| ------------ | ------------------------ | ------------------ |
| `h`          | Tono (de 0 a 360)        | `string \| number` |
| `s`          | Saturación (de 0 a 100)  | `string \| number` |
| `l`          | Luminosidad (de 0 a 100) | `string \| number` |
| `toString()` | Devuelve `hsl(h,s%,l%)`  | `string`           |

### Hsla

Extiende `Hsl` con un canal alfa. `toString()` devuelve una cadena CSS `hsla(...)`.

#### Constructor

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### Propiedades y métodos

| Miembro      | Descripción                | Tipo               |
| ------------ | -------------------------- | ------------------ |
| `h` `s` `l`  | Heredado de `Hsl`          | `string \| number` |
| `a`          | Canal alfa                 | `string \| number` |
| `toString()` | Devuelve `hsla(h,s%,l%,a)` | `string`           |

### ColorScheme

Genera una paleta de objetos `Color` emparentados, ya sea a partir de una lista de colores o de un color base girado según un array de ángulos de tono. Los métodos de fábrica estáticos cubren los esquemas de armonía más habituales.

#### Constructor

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| Parámetro    | Descripción                                                                                           | Tipo                   |
| ------------ | ----------------------------------------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | El color base o, cuando `angleArray` es `undefined`, el array de colores con el que se arma la paleta | `(string \| number)[]` |
| `angleArray` | Los desplazamientos de tono (en grados) que se aplican al color base para sacar el resto de la paleta | `number[]`             |

#### Propiedades y métodos

| Miembro                                  | Descripción                                                             | Devuelve  |
| ---------------------------------------- | ----------------------------------------------------------------------- | --------- |
| `palette`                                | Los colores generados                                                   | `Color[]` |
| `createFromColors(colorVal)`             | Arma la paleta a partir de un array de colores                          | `Color[]` |
| `createFromAngles(colorVal, angleArray)` | Arma la paleta a partir de un color base y unos desplazamientos de tono | `Color[]` |

#### Métodos de fábrica estáticos

Cada uno recibe un color base y devuelve un `ColorScheme` con un juego de ángulos de tono ya fijado.

| Método                         | Ángulos de tono  | Esquema                 |
| ------------------------------ | ---------------- | ----------------------- |
| `ColorScheme.Compl(colorVal)`  | `[180]`          | Complementario          |
| `ColorScheme.Triad(colorVal)`  | `[120, 240]`     | Triádico                |
| `ColorScheme.Tetrad(colorVal)` | `[60, 180, 240]` | Tetrádico               |
| `ColorScheme.Analog(colorVal)` | `[-45, 45]`      | Análogo                 |
| `ColorScheme.Split(colorVal)`  | `[150, 210]`     | Complementario dividido |
| `ColorScheme.Accent(colorVal)` | `[-45, 45, 180]` | Análogo con acento      |

### Funciones de conversión

Funciones sueltas que `Color` usa por dentro; todas se exportan para que las uses tal cual. Donde una función recibe tres canales, el primer argumento puede ser también un único array (por ejemplo `rgbToHsl([r, g, b])`).

| Función             | Descripción                                                                  | Firma                                           |
| ------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| `componentToHex(c)` | Convierte un canal de 0 a 255 en una cadena hexadecimal de dos dígitos       | `(c: string \| number) => string`               |
| `hue2rgb(p, q, t)`  | Ayuda de tono para pasar de HSL a RGB (la usa `hslToRgb`)                    | `(p: number, q: number, t: number) => number`   |
| `hslToRgb(h, s, l)` | De HSL a `[r, g, b]` (de 0 a 255). Acepta `[h, s, l]` como primer argumento  | `(h, s, l) => number[]`                         |
| `rgbToHsl(r, g, b)` | De RGB a `[h, s, l]`. Acepta `[r, g, b]` como primer argumento               | `(r, g, b) => number[]`                         |
| `rgbToHsb(r, g, b)` | De RGB a `[h, s, b]` (HSB/HSV)                                               | `(r: number, g: number, b: number) => number[]` |
| `hsbToRgb(h, s, v)` | De HSB/HSV a `[r, g, b]` (de 0 a 255)                                        | `(h: number, s: number, v: number) => number[]` |
| `hsvToRgb(h, s, v)` | Otro nombre de `hsbToRgb`                                                    | `(h: number, s: number, v: number) => number[]` |
| `hsvToHsl(h, s, b)` | De HSB/HSV a `[h, s, l]` (pasando por `rgbToHsl(hsbToRgb(...))`)             | `(h, s, b) => number[]`                         |
| `rgbToHsv(r, g, b)` | Otro nombre de `rgbToHsb`                                                    | `(r: number, g: number, b: number) => number[]` |
| `hexToHsb(hex)`     | De `#rrggbb` o `#rgb` a `[h, s, b]`, o `null` si la entrada está mal formada | `(hex: string) => number[] \| null`             |
| `hexToHsv(hex)`     | Otro nombre de `hexToHsb`                                                    | `(hex: string) => number[] \| null`             |
| `hsbToHsl(h, s, b)` | De HSB/HSV a `[h, s, l]`                                                     | `(h, s, b) => number[]`                         |
| `hslToHsb(h, s, l)` | De HSL a `[h, s, b]`                                                         | `(h, s, l) => number[]`                         |
| `hslToHsv(h, s, l)` | Otro nombre de `hslToHsb`                                                    | `(h, s, l) => number[]`                         |

> `componentToHex`, `rgbToHex` y `hexToRgb` son las piezas de bajo nivel; véanse [rgbToHex](./rgb_to_hex.md) y [hexToRgb](./hex_to_rgb.md).

### Ayudas para el alfa

Aquí el alfa va de **0 a 100**, la misma escala en porcentaje que el resto del módulo usa para la saturación y la luminosidad, y no el 0–1 que toma `rgba()` en CSS.

| Función               | Descripción                                                                          | Firma                      |
| --------------------- | ------------------------------------------------------------------------------------ | -------------------------- |
| `hexToAlpha(aa)`      | De un canal alfa hexadecimal de dos dígitos (`ff`, `80`, `00`) a un valor de 0 a 100 | `(aa: string) => number`   |
| `rgbaString(r,g,b,a)` | Arma una cadena CSS `rgba()`; la `a` se divide entre 100                             | `(r, g, b, a) => string`   |
| `rgbaToRgb(r,g,b,a)`  | Compone un color translúcido **sobre blanco** y devuelve un `[r, g, b]` opaco        | `(r, g, b, a) => number[]` |
| `rgbaToHex(r,g,b,a)`  | La misma composición, devuelta como cadena hexadecimal de seis dígitos               | `(r, g, b, a) => string`   |

::: warning
`rgbaToRgb` y `rgbaToHex` fijan el **blanco** como fondo. Existen para los sitios que no admiten un canal alfa (al escribir de vuelta un hexadecimal de seis dígitos, por ejemplo). Bajo un tema oscuro el resultado se verá demasiado claro; mezcla mejor contra tu propio fondo.
:::

### Ayudas de mezcla y matemática de shaders

La matemática de mezcla y de corrección de color que hay detrás de los filtros de posprocesado de `ranuts/visual` (`ColorAdjustFilter` y compañía), exportada aquí para reaprovecharla del lado de la CPU (calcular la vista previa de una miniatura, digamos, sin levantar una tubería de GPU). A diferencia del resto del módulo, **aquí los canales van de 0 a 1**, ni 0–255 ni 0–100, siguiendo la convención de los shaders.

| Función                               | Descripción                                                                                                                    | Firma                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `luma(r, g, b)`                       | El brillo tal como se percibe (pesos de la Rec. 601). Conserva la escala en que vengan las entradas (0–1 o 0–255)              | `(r, g, b) => number`                        |
| `blendScreen(base, blend)`            | Mezcla en modo trama: `1 - (1-base)(1-blend)` por canal                                                                        | `(base: RGB, blend: RGB) => RGB`             |
| `blendMultiply(base, blend)`          | Mezcla en modo multiplicar: `base * blend` por canal                                                                           | `(base: RGB, blend: RGB) => RGB`             |
| `blendOverlay(base, blend)`           | Superposición: multiplicar en las sombras, trama en las luces                                                                  | `(base: RGB, blend: RGB) => RGB`             |
| `brightnessContrast(color, b, c)`     | `(channel - 0.5) * contrast + 0.5 + brightness` por canal                                                                      | `(color: RGB, brightness, contrast) => RGB`  |
| `saturation(color, amount)`           | Mezcla hacia la luminancia. `0` deja escala de grises, `1` no cambia nada, y por encima de `1` satura más                      | `(color: RGB, amount: number) => RGB`        |
| `vibrance(color, amount)`             | Como `saturation`, pero satura más los canales apagados que los que ya están vivos. Por encima de `0` realza, por debajo apaga | `(color: RGB, amount: number) => RGB`        |
| `cosinePalette(t, a, b, c, d)`        | Degradado de cosenos de Inigo Quilez: `a + b·cos(2π(c·t + d))`, donde `a` a `d` son tríos RGB y `t` la posición de 0 a 1       | `(t, a: RGB, b: RGB, c: RGB, d: RGB) => RGB` |
| `srgbToLinear(c)` / `linearToSrgb(c)` | Convierte un canal entre sRGB (lo que lees de un color hexadecimal) y luz lineal (lo que pide la matemática de los shaders)    | `(c: number) => number`                      |

```ts
import { blendScreen, brightnessContrast, cosinePalette, srgbToLinear, linearToSrgb } from 'ranuts/utils';

// Mezcla en modo trama dos colores de 0 a 1
const screened = blendScreen([0.8, 0.2, 0.1], [0.1, 0.5, 0.9]);

// Sube el contraste y baja un poco el brillo
const graded = brightnessContrast([0.6, 0.6, 0.6], -0.05, 1.2);

// Toma una muestra de una paleta degradada procedural en t=0.35
const swatch = cosinePalette(0.35, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1, 1, 1], [0, 0.33, 0.67]);

// La matemática con gamma correcta (mezclas, iluminación) debe hacerse en espacio lineal
const linear = srgbToLinear(0.5);
const backToSrgb = linearToSrgb(linear); // ≈ 0.5
```

::: warning
La matemática de mezcla y corrección trabaja sobre valores de **luz lineal** para dar resultados físicamente correctos. Un color hexadecimal de 8 bits viene codificado en sRGB, así que pásalo antes por `srgbToLinear` si quieres que la mezcla se vea bien y no solo que compile.
:::

### Patrones de formato

Expresiones regulares para validar cadenas de color. `RGB_REGEX` y `RGBA_REGEX` **no** toleran espacios; quítalos antes (`value.replace(/\s+/g, '')`).

| Constante         | Casa con                                                           |
| ----------------- | ------------------------------------------------------------------ |
| `HEX_COLOR_REGEX` | `#rgb` o `#rrggbb`, con `#` obligatorio, sin distinguir mayúsculas |
| `RGB_REGEX`       | `rgb(r,g,b)`                                                       |
| `RGBA_REGEX`      | `rgba(r,g,b,a)`                                                    |

### FMT

Un registro de pares de códigos de escape ANSI para dar estilo y color al texto de la terminal. Cada entrada es una tupla `[abrir, cerrar]` con la que envuelves una cadena para darle estilo en la salida.

```ts
const FMT: Record<string, Array<string>>;
```

Claves disponibles: `bold`, `dim`, `reset`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, y las variantes de fondo `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`.

## Ejemplo

### Crear un Color

```js
import { Color } from 'ranuts';

// A partir de una cadena hexadecimal (forma corta o larga, con o sin #)
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// A partir de los canales
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// A partir de un array (con alfa)
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### Cambiar un Color a través de HSL

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // gira el tono hasta el verde
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // más oscuro
color.setSat(50); // baja la saturación
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### Armar una paleta con ColorScheme

```js
import { ColorScheme } from 'ranuts';

// Pareja complementaria a partir de un color base
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// Esquema triádico (el base y dos colores separados 120°)
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// Directamente a partir de una lista de colores
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### Usar las funciones de conversión

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// Donde está documentado, también se acepta un array como entrada
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### Dar estilo a la salida de la terminal con FMT

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // en una terminal, "success" en verde

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## Notas

1. **Todo se calcula de entrada**: un `Color` calcula todas sus representaciones en el constructor, así que `hex`, `rgb`, `rgba`, `hsl` y `hsla` están de acuerdo desde el momento en que se crea.
2. **Los setters de HSL recalculan el RGB**: `setHue`, `setSat` y `setLum` actualizan el HSL y luego vuelven a derivar el RGB y el hexadecimal con `updateFromHsl`. `setAlpha` solo toca `rgba` y `hsla`.
3. **Entrada por array o por canales**: varias funciones de conversión (`rgbToHex`, `rgbToHsl`, `hslToRgb`) aceptan tanto tres canales sueltos como un único array en el primer argumento.
4. **HSV frente a HSB**: `hsvToRgb` es otro nombre de `hsbToRgb`, y `hsvToHsl` otro nombre de la conversión de HSB a HSL. Aquí HSV y HSB se refieren al mismo modelo.
5. **FMT solo sirve en la terminal**: las secuencias de escape ANSI se ven como estilo únicamente en una terminal que las admita; en la consola del navegador aparecen como caracteres de control en crudo.
