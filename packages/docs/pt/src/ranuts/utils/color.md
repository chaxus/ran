# Color

Um sistema de cor baseado em classes, com auxiliares de conversão para trabalhar com RGB, RGBA, HSL, HSLA, HSB/HSV e cores hexadecimais. Traz uma classe `Color` bem servida, classes de valor imutáveis (`Rgb`, `Rgba`, `Hsl`, `Hsla`), o gerador de paletas `ColorScheme`, um conjunto de funções de conversão avulsas e o `FMT`, o mapa de estilos ANSI para o terminal.

> Os auxiliares mais simples — `hexToRgb`, `rgbToHex` e `randomColor` — têm página própria: [hexToRgb](./hex_to_rgb.md), [rgbToHex](./rgb_to_hex.md), [randomColor](./random_color.md). Todos são reexportados deste mesmo módulo.

## API

### Color

A classe principal de cor. Aceita uma string hexadecimal, um array `[r, g, b, a]` ou os canais como números separados, e já calcula de imediato todas as representações (`rgb`, `rgba`, `hex`, `hsl`, `hsla`), além dos acessores diretos a cada canal.

#### Construtor

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### Parâmetros

| Parâmetro | Descrição                                                                                                            | Tipo                                          | Padrão      |
| --------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `r`       | Canal vermelho. Uma string hexadecimal (`#f00` ou `#ff0000`, com `#` ou sem), um array `[r, g, b, a?]`, ou um número | `string \| number \| Array<string \| number>` | Obrigatório |
| `g`       | Canal verde (ignorado quando `r` é uma string ou um array)                                                           | `string \| number`                            | `0`         |
| `b`       | Canal azul (ignorado quando `r` é uma string ou um array)                                                            | `string \| number`                            | `0`         |
| `a`       | Canal alfa (de 0 a 1)                                                                                                | `string \| number`                            | `1.0`       |

#### Properties

| Propriedade | Descrição                                         | Tipo               |
| ----------- | ------------------------------------------------- | ------------------ |
| `r`         | Canal vermelho (de 0 a 255)                       | `string \| number` |
| `g`         | Canal verde (de 0 a 255)                          | `string \| number` |
| `b`         | Canal azul (de 0 a 255)                           | `string \| number` |
| `a`         | Canal alfa (de 0 a 1)                             | `string \| number` |
| `h`         | Matiz (de 0 a 360), anda junto com `hsl.h`        | `string \| number` |
| `s`         | Saturação (de 0 a 100), anda junto com `hsl.s`    | `string \| number` |
| `l`         | Luminosidade (de 0 a 100), anda junto com `hsl.l` | `string \| number` |
| `rgb`       | Objeto de valor RGB                               | `Rgb`              |
| `rgba`      | Objeto de valor RGBA                              | `Rgba`             |
| `hex`       | String hexadecimal (por exemplo `#ff0000`)        | `string`           |
| `hsl`       | Objeto de valor HSL                               | `Hsl`              |
| `hsla`      | Objeto de valor HSLA                              | `Hsla`             |

#### Methods

| Método               | Descrição                                                                                  | Devolve |
| -------------------- | ------------------------------------------------------------------------------------------ | ------- |
| `setHue(newHue)`     | Define a matiz e recalcula o RGB e o hexadecimal a partir do HSL                           | `void`  |
| `setSat(newSat)`     | Define a saturação e recalcula o RGB e o hexadecimal a partir do HSL                       | `void`  |
| `setLum(newLum)`     | Define a luminosidade e recalcula o RGB e o hexadecimal a partir do HSL                    | `void`  |
| `setAlpha(newAlpha)` | Define o alfa tanto no `rgba` quanto no `hsla` (não mexe no RGB nem no hexadecimal)        | `void`  |
| `updateFromHsl()`    | Recalcula `rgb`, os canais e `hex` a partir do `h/s/l` atual (chamado pelos setters acima) | `void`  |

### Rgb

Um objeto de valor RGB montado a partir de um array. O `toString()` devolve uma string CSS `rgb(...)`.

#### Construtor

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### Propriedades e métodos

| Membro       | Descrição            | Tipo               |
| ------------ | -------------------- | ------------------ |
| `r`          | Canal vermelho       | `string \| number` |
| `g`          | Canal verde          | `string \| number` |
| `b`          | Canal azul           | `string \| number` |
| `toString()` | Devolve `rgb(r,g,b)` | `string`           |

### Rgba

Estende o `Rgb` com um canal alfa. O `toString()` devolve uma string CSS `rgba(...)`.

#### Construtor

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### Propriedades e métodos

| Membro       | Descrição               | Tipo               |
| ------------ | ----------------------- | ------------------ |
| `r` `g` `b`  | Herdado do `Rgb`        | `string \| number` |
| `a`          | Canal alfa              | `string \| number` |
| `toString()` | Devolve `rgba(r,g,b,a)` | `string`           |

### Hsl

Um objeto de valor HSL montado a partir de um array. O `toString()` devolve uma string CSS `hsl(...)`.

#### Construtor

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### Propriedades e métodos

| Membro       | Descrição                 | Tipo               |
| ------------ | ------------------------- | ------------------ |
| `h`          | Matiz (de 0 a 360)        | `string \| number` |
| `s`          | Saturação (de 0 a 100)    | `string \| number` |
| `l`          | Luminosidade (de 0 a 100) | `string \| number` |
| `toString()` | Devolve `hsl(h,s%,l%)`    | `string`           |

### Hsla

Estende o `Hsl` com um canal alfa. O `toString()` devolve uma string CSS `hsla(...)`.

#### Construtor

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### Propriedades e métodos

| Membro       | Descrição                 | Tipo               |
| ------------ | ------------------------- | ------------------ |
| `h` `s` `l`  | Herdado do `Hsl`          | `string \| number` |
| `a`          | Canal alfa                | `string \| number` |
| `toString()` | Devolve `hsla(h,s%,l%,a)` | `string`           |

### ColorScheme

Gera uma paleta de objetos `Color` aparentados, seja a partir de uma lista de cores, seja de uma cor base girada por um array de ângulos de matiz. Os métodos de fábrica estáticos cobrem os esquemas de harmonia mais comuns.

#### Construtor

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| Parâmetro    | Descrição                                                                                     | Tipo                   |
| ------------ | --------------------------------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | A cor base ou, quando `angleArray` é `undefined`, o array de cores com que a paleta é montada | `(string \| number)[]` |
| `angleArray` | Os deslocamentos de matiz (em graus) aplicados à cor base para tirar o resto da paleta        | `number[]`             |

#### Propriedades e métodos

| Membro                                   | Descrição                                                           | Devolve   |
| ---------------------------------------- | ------------------------------------------------------------------- | --------- |
| `palette`                                | As cores geradas                                                    | `Color[]` |
| `createFromColors(colorVal)`             | Monta a paleta a partir de um array de cores                        | `Color[]` |
| `createFromAngles(colorVal, angleArray)` | Monta a paleta a partir de uma cor base e de deslocamentos de matiz | `Color[]` |

#### Métodos de fábrica estáticos

Cada um recebe uma cor base e devolve um `ColorScheme` com um conjunto de ângulos de matiz já definido.

| Método                         | Ângulos de matiz | Esquema               |
| ------------------------------ | ---------------- | --------------------- |
| `ColorScheme.Compl(colorVal)`  | `[180]`          | Complementar          |
| `ColorScheme.Triad(colorVal)`  | `[120, 240]`     | Triádico              |
| `ColorScheme.Tetrad(colorVal)` | `[60, 180, 240]` | Tetrádico             |
| `ColorScheme.Analog(colorVal)` | `[-45, 45]`      | Análogo               |
| `ColorScheme.Split(colorVal)`  | `[150, 210]`     | Complementar dividido |
| `ColorScheme.Accent(colorVal)` | `[-45, 45, 180]` | Análogo com acento    |

### Funções de conversão

Funções avulsas que o `Color` usa por dentro; todas são exportadas para você usar direto. Onde uma função recebe três canais, o primeiro argumento pode ser também um único array (por exemplo `rgbToHsl([r, g, b])`).

| Função              | Descrição                                                                          | Assinatura                                      |
| ------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| `componentToHex(c)` | Converte um canal de 0 a 255 numa string hexadecimal de dois dígitos               | `(c: string \| number) => string`               |
| `hue2rgb(p, q, t)`  | Auxiliar de matiz para ir de HSL a RGB (usado pelo `hslToRgb`)                     | `(p: number, q: number, t: number) => number`   |
| `hslToRgb(h, s, l)` | De HSL para `[r, g, b]` (de 0 a 255). Aceita `[h, s, l]` como primeiro argumento   | `(h, s, l) => number[]`                         |
| `rgbToHsl(r, g, b)` | De RGB para `[h, s, l]`. Aceita `[r, g, b]` como primeiro argumento                | `(r, g, b) => number[]`                         |
| `rgbToHsb(r, g, b)` | De RGB para `[h, s, b]` (HSB/HSV)                                                  | `(r: number, g: number, b: number) => number[]` |
| `hsbToRgb(h, s, v)` | De HSB/HSV para `[r, g, b]` (de 0 a 255)                                           | `(h: number, s: number, v: number) => number[]` |
| `hsvToRgb(h, s, v)` | Outro nome do `hsbToRgb`                                                           | `(h: number, s: number, v: number) => number[]` |
| `hsvToHsl(h, s, b)` | De HSB/HSV para `[h, s, l]` (passando por `rgbToHsl(hsbToRgb(...))`)               | `(h, s, b) => number[]`                         |
| `rgbToHsv(r, g, b)` | Outro nome do `rgbToHsb`                                                           | `(r: number, g: number, b: number) => number[]` |
| `hexToHsb(hex)`     | De `#rrggbb` ou `#rgb` para `[h, s, b]`, ou `null` se a entrada estiver malformada | `(hex: string) => number[] \| null`             |
| `hexToHsv(hex)`     | Outro nome do `hexToHsb`                                                           | `(hex: string) => number[] \| null`             |
| `hsbToHsl(h, s, b)` | De HSB/HSV para `[h, s, l]`                                                        | `(h, s, b) => number[]`                         |
| `hslToHsb(h, s, l)` | De HSL para `[h, s, b]`                                                            | `(h, s, l) => number[]`                         |
| `hslToHsv(h, s, l)` | Outro nome do `hslToHsb`                                                           | `(h, s, l) => number[]`                         |

> `componentToHex`, `rgbToHex` e `hexToRgb` são as peças de baixo nível; veja [rgbToHex](./rgb_to_hex.md) e [hexToRgb](./hex_to_rgb.md).

### Auxiliares de alfa

Aqui o alfa vai de **0 a 100**, a mesma escala em porcentagem que o resto do módulo usa para saturação e luminosidade, e não o 0–1 que o `rgba()` do CSS aceita.

| Função                | Descrição                                                                                | Assinatura                 |
| --------------------- | ---------------------------------------------------------------------------------------- | -------------------------- |
| `hexToAlpha(aa)`      | De um canal alfa hexadecimal de dois dígitos (`ff`, `80`, `00`) para um valor de 0 a 100 | `(aa: string) => number`   |
| `rgbaString(r,g,b,a)` | Monta uma string CSS `rgba()`; o `a` é dividido por 100                                  | `(r, g, b, a) => string`   |
| `rgbaToRgb(r,g,b,a)`  | Compõe uma cor translúcida **sobre branco** e devolve um `[r, g, b]` opaco               | `(r, g, b, a) => number[]` |
| `rgbaToHex(r,g,b,a)`  | A mesma composição, devolvida como string hexadecimal de seis dígitos                    | `(r, g, b, a) => string`   |

::: warning
O `rgbaToRgb` e o `rgbaToHex` fixam o **branco** como fundo. Eles existem para os lugares que não aceitam um canal alfa (ao gravar de volta um hexadecimal de seis dígitos, por exemplo). Num tema escuro o resultado vai parecer claro demais; nesse caso, misture contra o seu próprio fundo.
:::

### Auxiliares de mistura e matemática de shaders

A matemática de mistura e de correção de cor que está por trás dos filtros de pós-processamento do `ranuts/visual` (o `ColorAdjustFilter` e companhia), exportada aqui para ser reaproveitada do lado da CPU (calcular a prévia de uma miniatura, digamos, sem levantar uma esteira de GPU). Diferente do resto do módulo, **aqui os canais vão de 0 a 1**, não de 0 a 255 nem de 0 a 100, seguindo a convenção dos shaders.

| Função                                | Descrição                                                                                                                | Assinatura                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `luma(r, g, b)`                       | O brilho como ele é percebido (pesos da Rec. 601). Mantém a escala em que as entradas vierem (0–1 ou 0–255)              | `(r, g, b) => number`                        |
| `blendScreen(base, blend)`            | Mistura em modo divisão: `1 - (1-base)(1-blend)` por canal                                                               | `(base: RGB, blend: RGB) => RGB`             |
| `blendMultiply(base, blend)`          | Mistura em modo multiplicação: `base * blend` por canal                                                                  | `(base: RGB, blend: RGB) => RGB`             |
| `blendOverlay(base, blend)`           | Sobreposição: multiplicação nas sombras, divisão nas luzes                                                               | `(base: RGB, blend: RGB) => RGB`             |
| `brightnessContrast(color, b, c)`     | `(channel - 0.5) * contrast + 0.5 + brightness` por canal                                                                | `(color: RGB, brightness, contrast) => RGB`  |
| `saturation(color, amount)`           | Mistura na direção da luminância. `0` deixa em tons de cinza, `1` não muda nada, e acima de `1` satura mais              | `(color: RGB, amount: number) => RGB`        |
| `vibrance(color, amount)`             | Como o `saturation`, mas satura mais os canais apagados do que os que já estão vivos. Acima de `0` realça, abaixo apaga  | `(color: RGB, amount: number) => RGB`        |
| `cosinePalette(t, a, b, c, d)`        | Gradiente de cossenos do Inigo Quilez: `a + b·cos(2π(c·t + d))`, onde `a` a `d` são trios RGB e `t` é a posição de 0 a 1 | `(t, a: RGB, b: RGB, c: RGB, d: RGB) => RGB` |
| `srgbToLinear(c)` / `linearToSrgb(c)` | Converte um canal entre sRGB (o que você lê de uma cor hexadecimal) e luz linear (o que a matemática dos shaders pede)   | `(c: number) => number`                      |

```ts
import { blendScreen, brightnessContrast, cosinePalette, srgbToLinear, linearToSrgb } from 'ranuts/utils';

// Mistura em modo divisão duas cores de 0 a 1
const screened = blendScreen([0.8, 0.2, 0.1], [0.1, 0.5, 0.9]);

// Sobe o contraste e baixa um pouco o brilho
const graded = brightnessContrast([0.6, 0.6, 0.6], -0.05, 1.2);

// Colhe uma amostra de uma paleta de gradiente procedural em t=0.35
const swatch = cosinePalette(0.35, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1, 1, 1], [0, 0.33, 0.67]);

// A matemática com gama correta (misturas, iluminação) deve acontecer em espaço linear
const linear = srgbToLinear(0.5);
const backToSrgb = linearToSrgb(linear); // ≈ 0.5
```

::: warning
A matemática de mistura e de correção trabalha sobre valores de **luz linear** para dar resultados fisicamente corretos. Uma cor hexadecimal de 8 bits vem codificada em sRGB, então passe-a antes pelo `srgbToLinear` se você quer que a mistura fique certa e não só que compile.
:::

### Padrões de formato

Expressões regulares para validar strings de cor. O `RGB_REGEX` e o `RGBA_REGEX` **não** toleram espaços; tire-os antes (`value.replace(/\s+/g, '')`).

| Constante         | Casa com                                                            |
| ----------------- | ------------------------------------------------------------------- |
| `HEX_COLOR_REGEX` | `#rgb` ou `#rrggbb`, com `#` obrigatório, sem distinguir maiúsculas |
| `RGB_REGEX`       | `rgb(r,g,b)`                                                        |
| `RGBA_REGEX`      | `rgba(r,g,b,a)`                                                     |

### FMT

Um registro de pares de códigos de escape ANSI para dar estilo e cor ao texto do terminal. Cada entrada é uma tupla `[abrir, fechar]` com que você embrulha uma string para estilizar a saída.

```ts
const FMT: Record<string, Array<string>>;
```

Chaves disponíveis: `bold`, `dim`, `reset`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, e as variantes de fundo `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`.

## Exemplo

### Criar um Color

```js
import { Color } from 'ranuts';

// A partir de uma string hexadecimal (forma curta ou longa, com ou sem #)
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// A partir dos canais
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// A partir de um array (com alfa)
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### Mexer num Color pelo HSL

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // gira a matiz até o verde
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // mais escuro
color.setSat(50); // baixa a saturação
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### Montar uma paleta com o ColorScheme

```js
import { ColorScheme } from 'ranuts';

// Par complementar a partir de uma cor base
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// Esquema triádico (a base e duas cores afastadas 120°)
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// Direto de uma lista de cores
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### Usar as funções de conversão

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// Onde está documentado, também se aceita um array como entrada
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### Estilizar a saída do terminal com o FMT

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // num terminal, "success" em verde

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## Notas

1. **Tudo é calculado de saída**: um `Color` calcula todas as representações no construtor, então `hex`, `rgb`, `rgba`, `hsl` e `hsla` já nascem batendo entre si.
2. **Os setters de HSL recalculam o RGB**: `setHue`, `setSat` e `setLum` atualizam o HSL e depois tiram de novo o RGB e o hexadecimal pelo `updateFromHsl`. O `setAlpha` só mexe em `rgba` e `hsla`.
3. **Entrada por array ou por canais**: várias funções de conversão (`rgbToHex`, `rgbToHsl`, `hslToRgb`) aceitam tanto três canais soltos quanto um único array no primeiro argumento.
4. **HSV e HSB**: o `hsvToRgb` é outro nome do `hsbToRgb`, e o `hsvToHsl` outro nome da conversão de HSB para HSL. Aqui HSV e HSB são o mesmo modelo.
5. **O FMT só vale no terminal**: as sequências de escape ANSI aparecem como estilo apenas num terminal que as entenda; no console do navegador elas saem como caracteres de controle crus.
