# Color

클래스를 바탕으로 한 색 체계입니다. RGB, RGBA, HSL, HSLA, HSB/HSV, 16진수 색을 다루는 변환 도우미가 갖추어져 있습니다. 손이 넉넉한 `Color` 클래스, 바뀌지 않는 값 클래스(`Rgb`, `Rgba`, `Hsl`, `Hsla`), 팔레트 생성기 `ColorScheme`, 홀로 쓸 수 있는 변환 함수 묶음, 그리고 터미널용 ANSI 스타일 표 `FMT`가 들어 있습니다.

> 더 단순한 도우미인 `hexToRgb`, `rgbToHex`, `randomColor`에는 저마다 따로 문서가 있습니다. [hexToRgb](./hex_to_rgb.md), [rgbToHex](./rgb_to_hex.md), [randomColor](./random_color.md)입니다. 모두 같은 모듈에서 다시 내보냅니다.

## API

### Color

중심이 되는 색 클래스입니다. 16진수 문자열, `[r, g, b, a]` 배열, 또는 채널별 숫자를 받아, 모든 표현(`rgb`, `rgba`, `hex`, `hsl`, `hsla`)과 채널을 곧바로 읽는 접근자를 그 자리에서 계산해 둡니다.

#### 생성자

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### 매개변수

| 매개변수 | 설명                                                                                                 | 타입                                          | 기본값 |
| -------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------ |
| `r`      | 빨강 채널. 16진수 문자열(`#f00`이나 `#ff0000`, `#`은 있어도 없어도), `[r, g, b, a?]` 배열, 또는 숫자 | `string \| number \| Array<string \| number>` | 필수   |
| `g`      | 초록 채널(`r`가 문자열이나 배열이면 무시됩니다)                                                      | `string \| number`                            | `0`    |
| `b`      | 파랑 채널(`r`가 문자열이나 배열이면 무시됩니다)                                                      | `string \| number`                            | `0`    |
| `a`      | 알파 채널(0에서 1)                                                                                   | `string \| number`                            | `1.0`  |

#### Properties

| 프로퍼티 | 설명                                     | 타입               |
| -------- | ---------------------------------------- | ------------------ |
| `r`      | 빨강 채널(0에서 255)                     | `string \| number` |
| `g`      | 초록 채널(0에서 255)                     | `string \| number` |
| `b`      | 파랑 채널(0에서 255)                     | `string \| number` |
| `a`      | 알파 채널(0에서 1)                       | `string \| number` |
| `h`      | 색상(0에서 360). `hsl.h`와 짝을 이룹니다 | `string \| number` |
| `s`      | 채도(0에서 100). `hsl.s`와 짝을 이룹니다 | `string \| number` |
| `l`      | 명도(0에서 100). `hsl.l`과 짝을 이룹니다 | `string \| number` |
| `rgb`    | RGB 값 객체                              | `Rgb`              |
| `rgba`   | RGBA 값 객체                             | `Rgba`             |
| `hex`    | 16진수 문자열(`#ff0000` 따위)            | `string`           |
| `hsl`    | HSL 값 객체                              | `Hsl`              |
| `hsla`   | HSLA 값 객체                             | `Hsla`             |

#### Methods

| 메서드               | 설명                                                                                  | 돌려주는 값 |
| -------------------- | ------------------------------------------------------------------------------------- | ----------- |
| `setHue(newHue)`     | 색상을 정하고 HSL에서 RGB와 16진수를 다시 계산합니다                                  | `void`      |
| `setSat(newSat)`     | 채도를 정하고 HSL에서 RGB와 16진수를 다시 계산합니다                                  | `void`      |
| `setLum(newLum)`     | 명도를 정하고 HSL에서 RGB와 16진수를 다시 계산합니다                                  | `void`      |
| `setAlpha(newAlpha)` | `rgba`와 `hsla` 양쪽에 알파를 넣습니다(RGB와 16진수는 건드리지 않습니다)              | `void`      |
| `updateFromHsl()`    | 지금의 `h/s/l`에서 `rgb`와 각 채널, `hex`를 다시 계산합니다(위의 설정자들이 부릅니다) | `void`      |

### Rgb

배열로 짓는 RGB 값 객체입니다. `toString()`은 CSS `rgb(...)` 문자열을 돌려줍니다.

#### 생성자

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### 속성과 메서드

| 멤버         | 설명                      | 타입               |
| ------------ | ------------------------- | ------------------ |
| `r`          | 빨강 채널                 | `string \| number` |
| `g`          | 초록 채널                 | `string \| number` |
| `b`          | 파랑 채널                 | `string \| number` |
| `toString()` | `rgb(r,g,b)`를 돌려줍니다 | `string`           |

### Rgba

`Rgb`에 알파 채널을 더한 것입니다. `toString()`은 CSS `rgba(...)` 문자열을 돌려줍니다.

#### 생성자

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### 속성과 메서드

| 멤버         | 설명                         | 타입               |
| ------------ | ---------------------------- | ------------------ |
| `r` `g` `b`  | `Rgb`에서 물려받은 것        | `string \| number` |
| `a`          | 알파 채널                    | `string \| number` |
| `toString()` | `rgba(r,g,b,a)`를 돌려줍니다 | `string`           |

### Hsl

배열로 짓는 HSL 값 객체입니다. `toString()`은 CSS `hsl(...)` 문자열을 돌려줍니다.

#### 생성자

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### 속성과 메서드

| 멤버         | 설명                        | 타입               |
| ------------ | --------------------------- | ------------------ |
| `h`          | 색상(0에서 360)             | `string \| number` |
| `s`          | 채도(0에서 100)             | `string \| number` |
| `l`          | 명도(0에서 100)             | `string \| number` |
| `toString()` | `hsl(h,s%,l%)`를 돌려줍니다 | `string`           |

### Hsla

`Hsl`에 알파 채널을 더한 것입니다. `toString()`은 CSS `hsla(...)` 문자열을 돌려줍니다.

#### 생성자

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### 속성과 메서드

| 멤버         | 설명                           | 타입               |
| ------------ | ------------------------------ | ------------------ |
| `h` `s` `l`  | `Hsl`에서 물려받은 것          | `string \| number` |
| `a`          | 알파 채널                      | `string \| number` |
| `toString()` | `hsla(h,s%,l%,a)`를 돌려줍니다 | `string`           |

### ColorScheme

서로 어울리는 `Color`들의 팔레트를 만듭니다. 색 목록에서 곧바로 만들 수도 있고, 바탕색을 색상 각도 배열만큼 돌려서 만들 수도 있습니다. 흔히 쓰는 배색 형태는 정적 팩토리 메서드로 마련해 두었습니다.

#### 생성자

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| 매개변수     | 설명                                                                 | 타입                   |
| ------------ | -------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | 바탕색. `angleArray`가 `undefined`면 팔레트를 지을 색들의 배열       | `(string \| number)[]` |
| `angleArray` | 바탕색에 더하는 색상 어긋냄(도). 여기서 팔레트의 나머지를 뽑아냅니다 | `number[]`             |

#### 속성과 메서드

| 멤버                                     | 설명                                       | 돌려주는 값 |
| ---------------------------------------- | ------------------------------------------ | ----------- |
| `palette`                                | 만들어진 색들                              | `Color[]`   |
| `createFromColors(colorVal)`             | 색 배열로 팔레트를 짓습니다                | `Color[]`   |
| `createFromAngles(colorVal, angleArray)` | 바탕색과 색상 어긋냄으로 팔레트를 짓습니다 | `Color[]`   |

#### 정적 팩토리 메서드

저마다 바탕색 값을 받아, 미리 정해 둔 색상 각도 묶음을 가진 `ColorScheme`을 돌려줍니다.

| 메서드                         | 색상 각도        | 배색               |
| ------------------------------ | ---------------- | ------------------ |
| `ColorScheme.Compl(colorVal)`  | `[180]`          | 보색               |
| `ColorScheme.Triad(colorVal)`  | `[120, 240]`     | 삼색               |
| `ColorScheme.Tetrad(colorVal)` | `[60, 180, 240]` | 사색               |
| `ColorScheme.Analog(colorVal)` | `[-45, 45]`      | 유사색             |
| `ColorScheme.Split(colorVal)`  | `[150, 210]`     | 분할 보색          |
| `ColorScheme.Accent(colorVal)` | `[-45, 45, 180]` | 강조를 더한 유사색 |

### 변환 함수

`Color`가 안에서 쓰지만 홀로도 성립하는 함수들이며, 모두 그대로 쓸 수 있도록 내보냅니다. 채널을 셋 받는 함수에서는 첫 인자에 배열 하나를 넘겨도 됩니다(`rgbToHsl([r, g, b])`처럼).

| 함수                | 설명                                                                    | 시그니처                                        |
| ------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `componentToHex(c)` | 0에서 255 사이 채널 하나를 두 자리 16진수 문자열로 바꿉니다             | `(c: string \| number) => string`               |
| `hue2rgb(p, q, t)`  | HSL에서 RGB로 갈 때 쓰는 색상 도우미(`hslToRgb`가 씁니다)               | `(p: number, q: number, t: number) => number`   |
| `hslToRgb(h, s, l)` | HSL에서 `[r, g, b]`(0에서 255)로. 첫 인자에 `[h, s, l]`을 넘겨도 됩니다 | `(h, s, l) => number[]`                         |
| `rgbToHsl(r, g, b)` | RGB에서 `[h, s, l]`로. 첫 인자에 `[r, g, b]`를 넘겨도 됩니다            | `(r, g, b) => number[]`                         |
| `rgbToHsb(r, g, b)` | RGB에서 `[h, s, b]`(HSB/HSV)로                                          | `(r: number, g: number, b: number) => number[]` |
| `hsbToRgb(h, s, v)` | HSB/HSV에서 `[r, g, b]`(0에서 255)로                                    | `(h: number, s: number, v: number) => number[]` |
| `hsvToRgb(h, s, v)` | `hsbToRgb`의 다른 이름                                                  | `(h: number, s: number, v: number) => number[]` |
| `hsvToHsl(h, s, b)` | HSB/HSV에서 `[h, s, l]`로(`rgbToHsl(hsbToRgb(...))`를 거쳐)             | `(h, s, b) => number[]`                         |
| `rgbToHsv(r, g, b)` | `rgbToHsb`의 다른 이름                                                  | `(r: number, g: number, b: number) => number[]` |
| `hexToHsb(hex)`     | `#rrggbb`나 `#rgb`에서 `[h, s, b]`로. 꼴이 어긋나면 `null`              | `(hex: string) => number[] \| null`             |
| `hexToHsv(hex)`     | `hexToHsb`의 다른 이름                                                  | `(hex: string) => number[] \| null`             |
| `hsbToHsl(h, s, b)` | HSB/HSV에서 `[h, s, l]`로                                               | `(h, s, b) => number[]`                         |
| `hslToHsb(h, s, l)` | HSL에서 `[h, s, b]`로                                                   | `(h, s, l) => number[]`                         |
| `hslToHsv(h, s, l)` | `hslToHsb`의 다른 이름                                                  | `(h, s, l) => number[]`                         |

> `componentToHex`, `rgbToHex`, `hexToRgb`는 낮은 층의 부품입니다. [rgbToHex](./rgb_to_hex.md)와 [hexToRgb](./hex_to_rgb.md)를 보세요.

### 알파 도우미

여기서 알파는 **0에서 100**으로 적습니다. CSS `rgba()`가 받는 0에서 1이 아니라, 이 모듈이 채도와 명도에 쓰는 백분율 눈금에 맞춘 것입니다.

| 함수                  | 설명                                                                | 시그니처                   |
| --------------------- | ------------------------------------------------------------------- | -------------------------- |
| `hexToAlpha(aa)`      | 두 자리 16진수 알파(`ff`, `80`, `00`)에서 0에서 100 사이 값으로     | `(aa: string) => number`   |
| `rgbaString(r,g,b,a)` | CSS `rgba()` 문자열을 짓습니다. `a`는 100으로 나뉩니다              | `(r, g, b, a) => string`   |
| `rgbaToRgb(r,g,b,a)`  | 반투명한 색을 **흰 바탕 위에** 겹쳐 불투명한 `[r, g, b]`로 만듭니다 | `(r, g, b, a) => number[]` |
| `rgbaToHex(r,g,b,a)`  | 같은 겹침의 결과를 여섯 자리 16진수 문자열로 돌려줍니다             | `(r, g, b, a) => string`   |

::: warning
`rgbaToRgb`와 `rgbaToHex`는 바탕을 **흰색**으로 못 박아 두었습니다. 알파 채널을 받지 못하는 자리(6자리 16진수로 되돌려 쓸 때 같은)를 위한 것입니다. 어두운 테마 아래에서는 결과가 너무 밝게 보이니, 그럴 때는 직접 자기 바탕색에 겹쳐 계산하세요.
:::

### 혼합과 셰이더 수학 도우미

`ranuts/visual`의 후처리 필터(`ColorAdjustFilter`와 그 무리) 뒤에서 도는 색 보정과 혼합 계산입니다. CPU 쪽에서도 다시 쓸 수 있도록 여기서 내보냅니다(GPU 파이프라인을 세우지 않고 섬네일 미리보기를 계산하는 따위). 이 모듈의 다른 곳과 달리 **여기서 채널은 0에서 1**입니다. 0에서 255도, 0에서 100도 아닌, 셰이더의 관례를 따랐습니다.

| 함수                                  | 설명                                                                                                                     | 시그니처                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `luma(r, g, b)`                       | 눈에 느껴지는 밝기(Rec. 601 가중치). 넣은 값의 눈금(0–1이든 0–255든)을 그대로 지킵니다                                   | `(r, g, b) => number`                        |
| `blendScreen(base, blend)`            | 스크린 혼합. 채널마다 `1 - (1-base)(1-blend)`                                                                            | `(base: RGB, blend: RGB) => RGB`             |
| `blendMultiply(base, blend)`          | 곱하기 혼합. 채널마다 `base * blend`                                                                                     | `(base: RGB, blend: RGB) => RGB`             |
| `blendOverlay(base, blend)`           | 오버레이. 어두운 곳에서는 곱하기, 밝은 곳에서는 스크린                                                                   | `(base: RGB, blend: RGB) => RGB`             |
| `brightnessContrast(color, b, c)`     | 채널마다 `(channel - 0.5) * contrast + 0.5 + brightness`                                                                 | `(color: RGB, brightness, contrast) => RGB`  |
| `saturation(color, amount)`           | 휘도 쪽으로 섞습니다. `0`이면 흑백, `1`이면 그대로, `1`보다 크면 더 짙어집니다                                           | `(color: RGB, amount: number) => RGB`        |
| `vibrance(color, amount)`             | `saturation`과 비슷하지만, 이미 짙은 채널보다 흐린 채널을 더 끌어올립니다. `0`보다 크면 돋우고, 작으면 눅입니다          | `(color: RGB, amount: number) => RGB`        |
| `cosinePalette(t, a, b, c, d)`        | Inigo Quilez의 코사인 그러데이션. `a + b·cos(2π(c·t + d))`이며 `a`부터 `d`는 저마다 RGB 세 값, `t`는 0에서 1 사이의 자리 | `(t, a: RGB, b: RGB, c: RGB, d: RGB) => RGB` |
| `srgbToLinear(c)` / `linearToSrgb(c)` | 채널 하나를 sRGB(16진수 색에서 읽는 값)와 선형 광량(셰이더 계산이 바라는 값) 사이에서 바꿔 줍니다                        | `(c: number) => number`                      |

```ts
import { blendScreen, brightnessContrast, cosinePalette, srgbToLinear, linearToSrgb } from 'ranuts/utils';

// 0에서 1 사이의 색 둘을 스크린으로 섞기
const screened = blendScreen([0.8, 0.2, 0.1], [0.1, 0.5, 0.9]);

// 대비를 올리고 밝기를 조금 내리기
const graded = brightnessContrast([0.6, 0.6, 0.6], -0.05, 1.2);

// 절차적으로 만든 그러데이션 팔레트를 t=0.35에서 뽑기
const swatch = cosinePalette(0.35, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1, 1, 1], [0, 0.33, 0.67]);

// 감마를 제대로 다루는 계산(혼합, 조명)은 선형 공간에서 해야 합니다
const linear = srgbToLinear(0.5);
const backToSrgb = linearToSrgb(linear); // ≈ 0.5
```

::: warning
혼합과 보정 계산은 물리적으로 옳은 결과를 얻으려고 **선형 광량** 값을 전제로 합니다. 8비트 16진수 색은 sRGB로 인코딩되어 있으니, 혼합이 그저 돌아가는 데 그치지 않고 제대로 보여야 한다면 먼저 `srgbToLinear`를 거치세요.
:::

### 형식 패턴

색 문자열을 검사하는 정규식입니다. `RGB_REGEX`와 `RGBA_REGEX`는 공백을 **받아 주지 않으니** 먼저 걷어 내세요(`value.replace(/\s+/g, '')`).

| 상수              | 맞는 꼴                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `HEX_COLOR_REGEX` | `#rgb`나 `#rrggbb`. `#`은 반드시 있어야 하고 대소문자는 가리지 않습니다 |
| `RGB_REGEX`       | `rgb(r,g,b)`                                                            |
| `RGBA_REGEX`      | `rgba(r,g,b,a)`                                                         |

### FMT

글자를 꾸미고 물들이는 데 쓰는, 터미널용 ANSI 이스케이프 코드 짝을 모은 레코드입니다. 각 항목은 `[여는 코드, 닫는 코드]` 튜플이고, 문자열을 이것으로 감싸면 터미널 출력에 꾸밈이 붙습니다.

```ts
const FMT: Record<string, Array<string>>;
```

쓸 수 있는 키는 `bold`, `dim`, `reset`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, 그리고 바탕색 판인 `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`입니다.

## 예시

### Color 만들기

```js
import { Color } from 'ranuts';

// 16진수 문자열로(짧은 꼴이든 긴 꼴이든, #은 있어도 없어도)
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// 채널 값으로
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// 배열로(알파까지)
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### HSL을 통해 Color 고치기

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // 색상을 초록까지 돌립니다
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // 더 어둡게
color.setSat(50); // 채도를 낮춥니다
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### ColorScheme으로 팔레트 짓기

```js
import { ColorScheme } from 'ranuts';

// 바탕색에서 보색 짝 만들기
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// 삼색 배색(바탕색과, 120°씩 떨어진 두 색)
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// 색 목록에서 곧바로
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### 변환 함수 쓰기

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// 문서에 적힌 자리에서는 배열을 넘겨도 됩니다
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### FMT로 터미널 출력 꾸미기

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // 터미널에서는 "success"가 초록으로 나옵니다

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## 참고

1. **한꺼번에 미리 계산합니다**: `Color`는 생성자에서 모든 표현을 계산해 두므로, 만들어지는 순간부터 `hex`, `rgb`, `rgba`, `hsl`, `hsla`가 서로 어긋나지 않습니다.
2. **HSL 설정자는 RGB를 다시 계산합니다**: `setHue`, `setSat`, `setLum`은 HSL을 고친 다음 `updateFromHsl`로 RGB와 16진수를 다시 뽑아냅니다. `setAlpha`가 건드리는 것은 `rgba`와 `hsla`뿐입니다.
3. **배열로도 채널로도 받습니다**: 몇몇 변환 함수(`rgbToHex`, `rgbToHsl`, `hslToRgb`)는 채널 셋을 따로 받아도 되고, 첫 인자에 배열 하나를 받아도 됩니다.
4. **HSV와 HSB**: `hsvToRgb`는 `hsbToRgb`의 다른 이름이고, `hsvToHsl`은 HSB에서 HSL로 가는 변환의 다른 이름입니다. 여기서 HSV와 HSB는 같은 모형을 가리킵니다.
5. **FMT는 터미널 전용입니다**: ANSI 이스케이프 열이 꾸밈으로 보이는 것은 그것을 알아듣는 터미널 안에서뿐입니다. 브라우저 콘솔에서는 제어 문자가 그대로 드러납니다.
