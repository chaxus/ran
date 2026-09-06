# Color

Ein Farbsystem auf Klassenbasis, mit Umrechnungshelfern für RGB, RGBA, HSL, HSLA, HSB/HSV und hexadezimale Farben. Dabei sind eine reich ausgestattete Klasse `Color`, unveränderliche Wertklassen (`Rgb`, `Rgba`, `Hsl`, `Hsla`), der Palettengenerator `ColorScheme`, ein Satz eigenständiger Umrechnungsfunktionen und `FMT`, die ANSI-Stiltabelle fürs Terminal.

> Die einfacheren Helfer `hexToRgb`, `rgbToHex` und `randomColor` haben eigene Seiten: [hexToRgb](./hex_to_rgb.md), [rgbToHex](./rgb_to_hex.md), [randomColor](./random_color.md). Sie werden aus demselben Modul erneut exportiert.

## API

### Color

Die zentrale Farbklasse. Sie nimmt eine Hex-Zeichenkette, ein Array `[r, g, b, a]` oder die Kanäle als einzelne Zahlen und berechnet sogleich jede Darstellung (`rgb`, `rgba`, `hex`, `hsl`, `hsla`) sowie die direkten Zugriffe auf die einzelnen Kanäle.

#### Konstruktor

```ts
new Color(
  r: string | number | Array<string | number>,
  g?: string | number,
  b?: string | number,
  a?: string | number,
)
```

#### Parameter

| Parameter | Beschreibung                                                                                                              | Typ                                           | Standard     |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------ |
| `r`       | Der Rotkanal. Eine Hex-Zeichenkette (`#f00` oder `#ff0000`, mit oder ohne `#`), ein Array `[r, g, b, a?]`, oder eine Zahl | `string \| number \| Array<string \| number>` | Erforderlich |
| `g`       | Der Grünkanal (wird übergangen, wenn `r` eine Zeichenkette oder ein Array ist)                                            | `string \| number`                            | `0`          |
| `b`       | Der Blaukanal (wird übergangen, wenn `r` eine Zeichenkette oder ein Array ist)                                            | `string \| number`                            | `0`          |
| `a`       | Der Alphakanal (0 bis 1)                                                                                                  | `string \| number`                            | `1.0`        |

#### Properties

| Eigenschaft | Beschreibung                                  | Typ                |
| ----------- | --------------------------------------------- | ------------------ |
| `r`         | Der Rotkanal (0 bis 255)                      | `string \| number` |
| `g`         | Der Grünkanal (0 bis 255)                     | `string \| number` |
| `b`         | Der Blaukanal (0 bis 255)                     | `string \| number` |
| `a`         | Der Alphakanal (0 bis 1)                      | `string \| number` |
| `h`         | Farbton (0 bis 360), läuft mit `hsl.h` mit    | `string \| number` |
| `s`         | Sättigung (0 bis 100), läuft mit `hsl.s` mit  | `string \| number` |
| `l`         | Helligkeit (0 bis 100), läuft mit `hsl.l` mit | `string \| number` |
| `rgb`       | RGB-Wertobjekt                                | `Rgb`              |
| `rgba`      | RGBA-Wertobjekt                               | `Rgba`             |
| `hex`       | Hexadezimale Zeichenkette (etwa `#ff0000`)    | `string`           |
| `hsl`       | HSL-Wertobjekt                                | `Hsl`              |
| `hsla`      | HSLA-Wertobjekt                               | `Hsla`             |

#### Methods

| Methode              | Beschreibung                                                                                               | Rückgabe |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| `setHue(newHue)`     | Setzt den Farbton und berechnet RGB und Hex aus dem HSL neu                                                | `void`   |
| `setSat(newSat)`     | Setzt die Sättigung und berechnet RGB und Hex aus dem HSL neu                                              | `void`   |
| `setLum(newLum)`     | Setzt die Helligkeit und berechnet RGB und Hex aus dem HSL neu                                             | `void`   |
| `setAlpha(newAlpha)` | Setzt das Alpha in `rgba` wie in `hsla` (rührt RGB und Hex nicht an)                                       | `void`   |
| `updateFromHsl()`    | Berechnet `rgb`, die Kanäle und `hex` aus dem aktuellen `h/s/l` neu (wird von den Settern oben aufgerufen) | `void`   |

### Rgb

Ein RGB-Wertobjekt, aus einem Array gebaut. `toString()` gibt eine CSS-Zeichenkette `rgb(...)` zurück.

#### Konstruktor

```ts
new Rgb(col: Array<string | number>) // [r, g, b]
```

#### Eigenschaften und Methoden

| Element      | Beschreibung             | Typ                |
| ------------ | ------------------------ | ------------------ |
| `r`          | Der Rotkanal             | `string \| number` |
| `g`          | Der Grünkanal            | `string \| number` |
| `b`          | Der Blaukanal            | `string \| number` |
| `toString()` | Gibt `rgb(r,g,b)` zurück | `string`           |

### Rgba

Erweitert `Rgb` um einen Alphakanal. `toString()` gibt eine CSS-Zeichenkette `rgba(...)` zurück.

#### Konstruktor

```ts
new Rgba(col: Array<string | number>) // [r, g, b, a]
```

#### Eigenschaften und Methoden

| Element      | Beschreibung                | Typ                |
| ------------ | --------------------------- | ------------------ |
| `r` `g` `b`  | Von `Rgb` geerbt            | `string \| number` |
| `a`          | Der Alphakanal              | `string \| number` |
| `toString()` | Gibt `rgba(r,g,b,a)` zurück | `string`           |

### Hsl

Ein HSL-Wertobjekt, aus einem Array gebaut. `toString()` gibt eine CSS-Zeichenkette `hsl(...)` zurück.

#### Konstruktor

```ts
new Hsl(col: Array<string | number>) // [h, s, l]
```

#### Eigenschaften und Methoden

| Element      | Beschreibung               | Typ                |
| ------------ | -------------------------- | ------------------ |
| `h`          | Farbton (0 bis 360)        | `string \| number` |
| `s`          | Sättigung (0 bis 100)      | `string \| number` |
| `l`          | Helligkeit (0 bis 100)     | `string \| number` |
| `toString()` | Gibt `hsl(h,s%,l%)` zurück | `string`           |

### Hsla

Erweitert `Hsl` um einen Alphakanal. `toString()` gibt eine CSS-Zeichenkette `hsla(...)` zurück.

#### Konstruktor

```ts
new Hsla(col: Array<string | number>) // [h, s, l, a]
```

#### Eigenschaften und Methoden

| Element      | Beschreibung                  | Typ                |
| ------------ | ----------------------------- | ------------------ |
| `h` `s` `l`  | Von `Hsl` geerbt              | `string \| number` |
| `a`          | Der Alphakanal                | `string \| number` |
| `toString()` | Gibt `hsla(h,s%,l%,a)` zurück | `string`           |

### ColorScheme

Erzeugt eine Palette verwandter `Color`-Objekte – entweder unmittelbar aus einer Liste von Farben oder aus einer Grundfarbe, die um ein Array von Farbtonwinkeln gedreht wird. Statische Fabrikmethoden decken die gängigen Harmonieschemata ab.

#### Konstruktor

```ts
new ColorScheme(colorVal: (string | number)[], angleArray: number[])
```

| Parameter    | Beschreibung                                                                                                        | Typ                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `colorVal`   | Die Grundfarbe oder, wenn `angleArray` `undefined` ist, das Array von Farben, aus dem die Palette gebaut wird       | `(string \| number)[]` |
| `angleArray` | Die Farbtonversätze (in Grad), die auf die Grundfarbe angewandt werden, um die übrigen Paletteneinträge herzuleiten | `number[]`             |

#### Eigenschaften und Methoden

| Element                                  | Beschreibung                                               | Rückgabe  |
| ---------------------------------------- | ---------------------------------------------------------- | --------- |
| `palette`                                | Die erzeugten Farben                                       | `Color[]` |
| `createFromColors(colorVal)`             | Baut die Palette aus einem Array von Farben                | `Color[]` |
| `createFromAngles(colorVal, angleArray)` | Baut die Palette aus einer Grundfarbe und Farbtonversätzen | `Color[]` |

#### Statische Fabrikmethoden

Jede nimmt eine Grundfarbe und gibt ein `ColorScheme` mit einem fest vorgegebenen Satz von Farbtonwinkeln zurück.

| Methode                        | Farbtonwinkel    | Schema               |
| ------------------------------ | ---------------- | -------------------- |
| `ColorScheme.Compl(colorVal)`  | `[180]`          | Komplementär         |
| `ColorScheme.Triad(colorVal)`  | `[120, 240]`     | Triadisch            |
| `ColorScheme.Tetrad(colorVal)` | `[60, 180, 240]` | Tetradisch           |
| `ColorScheme.Analog(colorVal)` | `[-45, 45]`      | Analog               |
| `ColorScheme.Split(colorVal)`  | `[150, 210]`     | Geteilt komplementär |
| `ColorScheme.Accent(colorVal)` | `[-45, 45, 180]` | Analog mit Akzent    |

### Umrechnungsfunktionen

Eigenständige Funktionen, die `Color` intern benutzt; alle sind zum unmittelbaren Gebrauch exportiert. Wo eine Funktion drei Kanäle entgegennimmt, darf das erste Argument auch ein einzelnes Array sein (etwa `rgbToHsl([r, g, b])`).

| Funktion            | Beschreibung                                                                     | Signatur                                        |
| ------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------- |
| `componentToHex(c)` | Wandelt einen Kanal von 0 bis 255 in eine zweistellige Hex-Zeichenkette um       | `(c: string \| number) => string`               |
| `hue2rgb(p, q, t)`  | Farbtonhelfer für den Weg von HSL nach RGB (wird von `hslToRgb` benutzt)         | `(p: number, q: number, t: number) => number`   |
| `hslToRgb(h, s, l)` | Von HSL nach `[r, g, b]` (0 bis 255). Nimmt `[h, s, l]` als erstes Argument an   | `(h, s, l) => number[]`                         |
| `rgbToHsl(r, g, b)` | Von RGB nach `[h, s, l]`. Nimmt `[r, g, b]` als erstes Argument an               | `(r, g, b) => number[]`                         |
| `rgbToHsb(r, g, b)` | Von RGB nach `[h, s, b]` (HSB/HSV)                                               | `(r: number, g: number, b: number) => number[]` |
| `hsbToRgb(h, s, v)` | Von HSB/HSV nach `[r, g, b]` (0 bis 255)                                         | `(h: number, s: number, v: number) => number[]` |
| `hsvToRgb(h, s, v)` | Ein anderer Name für `hsbToRgb`                                                  | `(h: number, s: number, v: number) => number[]` |
| `hsvToHsl(h, s, b)` | Von HSB/HSV nach `[h, s, l]` (über `rgbToHsl(hsbToRgb(...))`)                    | `(h, s, b) => number[]`                         |
| `rgbToHsv(r, g, b)` | Ein anderer Name für `rgbToHsb`                                                  | `(r: number, g: number, b: number) => number[]` |
| `hexToHsb(hex)`     | Von `#rrggbb` oder `#rgb` nach `[h, s, b]`, oder `null` bei fehlerhafter Eingabe | `(hex: string) => number[] \| null`             |
| `hexToHsv(hex)`     | Ein anderer Name für `hexToHsb`                                                  | `(hex: string) => number[] \| null`             |
| `hsbToHsl(h, s, b)` | Von HSB/HSV nach `[h, s, l]`                                                     | `(h, s, b) => number[]`                         |
| `hslToHsb(h, s, l)` | Von HSL nach `[h, s, b]`                                                         | `(h, s, l) => number[]`                         |
| `hslToHsv(h, s, l)` | Ein anderer Name für `hslToHsb`                                                  | `(h, s, l) => number[]`                         |

> `componentToHex`, `rgbToHex` und `hexToRgb` sind die grundlegenden Bausteine; siehe [rgbToHex](./rgb_to_hex.md) und [hexToRgb](./hex_to_rgb.md).

### Helfer fürs Alpha

Alpha wird hier von **0 bis 100** angegeben – auf derselben Prozentskala, die das übrige Modul für Sättigung und Helligkeit benutzt, und nicht von 0 bis 1, wie es das CSS-`rgba()` nimmt.

| Funktion              | Beschreibung                                                                            | Signatur                   |
| --------------------- | --------------------------------------------------------------------------------------- | -------------------------- |
| `hexToAlpha(aa)`      | Von einem zweistelligen Hex-Alphakanal (`ff`, `80`, `00`) auf einen Wert von 0 bis 100  | `(aa: string) => number`   |
| `rgbaString(r,g,b,a)` | Baut eine CSS-Zeichenkette `rgba()`; `a` wird durch 100 geteilt                         | `(r, g, b, a) => string`   |
| `rgbaToRgb(r,g,b,a)`  | Legt eine durchscheinende Farbe **über Weiß** und gibt ein deckendes `[r, g, b]` zurück | `(r, g, b, a) => number[]` |
| `rgbaToHex(r,g,b,a)`  | Dieselbe Überlagerung, zurückgegeben als sechsstellige Hex-Zeichenkette                 | `(r, g, b, a) => string`   |

::: warning
`rgbaToRgb` und `rgbaToHex` schreiben **Weiß** als Hintergrund fest. Es gibt sie für Stellen, die keinen Alphakanal annehmen können (etwa beim Zurückschreiben eines sechsstelligen Hex-Werts). Unter einem dunklen Thema wirkt das Ergebnis zu hell; misch dort lieber gegen deinen eigenen Hintergrund.
:::

### Helfer für Mischung und Shader-Mathematik

Die Misch- und Farbkorrekturmathematik hinter den Nachbearbeitungsfiltern von `ranuts/visual` (`ColorAdjustFilter` und Verwandte), hier exportiert zur Wiederverwendung auf der CPU-Seite (etwa um eine Miniaturvorschau zu berechnen, ohne eine GPU-Strecke hochzufahren). Anders als im übrigen Modul laufen **die Kanäle hier von 0 bis 1**, nicht von 0 bis 255 oder 0 bis 100 – so, wie es in Shadern üblich ist.

| Funktion                              | Beschreibung                                                                                                                          | Signatur                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `luma(r, g, b)`                       | Die empfundene Helligkeit (Gewichte nach Rec. 601). Behält die Skala bei, in der die Eingaben stehen (0–1 oder 0–255)                 | `(r, g, b) => number`                        |
| `blendScreen(base, blend)`            | Mischung „Negativ multiplizieren“: je Kanal `1 - (1-base)(1-blend)`                                                                   | `(base: RGB, blend: RGB) => RGB`             |
| `blendMultiply(base, blend)`          | Mischung „Multiplizieren“: je Kanal `base * blend`                                                                                    | `(base: RGB, blend: RGB) => RGB`             |
| `blendOverlay(base, blend)`           | Ineinanderkopieren: in den Schatten multiplizieren, in den Lichtern negativ multiplizieren                                            | `(base: RGB, blend: RGB) => RGB`             |
| `brightnessContrast(color, b, c)`     | Je Kanal `(channel - 0.5) * contrast + 0.5 + brightness`                                                                              | `(color: RGB, brightness, contrast) => RGB`  |
| `saturation(color, amount)`           | Mischt in Richtung Leuchtdichte. `0` ergibt Graustufen, `1` lässt alles wie es ist, über `1` wird kräftiger gesättigt                 | `(color: RGB, amount: number) => RGB`        |
| `vibrance(color, amount)`             | Wie `saturation`, hebt aber die matten Kanäle stärker an als die ohnehin kräftigen. Über `0` verstärkt es, unter `0` dämpft es        | `(color: RGB, amount: number) => RGB`        |
| `cosinePalette(t, a, b, c, d)`        | Kosinusverlauf nach Inigo Quilez: `a + b·cos(2π(c·t + d))`, wobei `a` bis `d` je ein RGB-Tripel sind und `t` die Position von 0 bis 1 | `(t, a: RGB, b: RGB, c: RGB, d: RGB) => RGB` |
| `srgbToLinear(c)` / `linearToSrgb(c)` | Rechnet einen Kanal zwischen sRGB (was du aus einer Hexfarbe abliest) und linearem Licht (was die Shader-Mathematik verlangt) um      | `(c: number) => number`                      |

```ts
import { blendScreen, brightnessContrast, cosinePalette, srgbToLinear, linearToSrgb } from 'ranuts/utils';

// Zwei Farben von 0 bis 1 im Modus Negativ multiplizieren mischen
const screened = blendScreen([0.8, 0.2, 0.1], [0.1, 0.5, 0.9]);

// Kontrast anheben und Helligkeit etwas senken
const graded = brightnessContrast([0.6, 0.6, 0.6], -0.05, 1.2);

// Eine prozedural erzeugte Verlaufspalette bei t=0.35 abtasten
const swatch = cosinePalette(0.35, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1, 1, 1], [0, 0.33, 0.67]);

// Gammarichtige Rechnung (Mischen, Beleuchtung) gehört in den linearen Raum
const linear = srgbToLinear(0.5);
const backToSrgb = linearToSrgb(linear); // ≈ 0.5
```

::: warning
Misch- und Korrekturmathematik arbeitet auf Werten in **linearem Licht**, damit die Ergebnisse physikalisch stimmen. Eine 8-Bit-Hexfarbe ist sRGB-kodiert; schick sie also erst durch `srgbToLinear`, wenn die Mischung nicht bloß übersetzen, sondern auch richtig aussehen soll.
:::

### Formatmuster

Reguläre Ausdrücke zum Prüfen von Farbzeichenketten. `RGB_REGEX` und `RGBA_REGEX` dulden **keine** Leerzeichen; entferne sie vorher (`value.replace(/\s+/g, '')`).

| Konstante         | Passt auf                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| `HEX_COLOR_REGEX` | `#rgb` oder `#rrggbb`, `#` verpflichtend, Groß- und Kleinschreibung egal |
| `RGB_REGEX`       | `rgb(r,g,b)`                                                             |
| `RGBA_REGEX`      | `rgba(r,g,b,a)`                                                          |

### FMT

Eine Sammlung von ANSI-Escape-Paaren fürs Terminal, mit denen sich Text gestalten und einfärben lässt. Jeder Eintrag ist ein Tupel `[öffnen, schließen]`, das du um eine Zeichenkette legst, um die Ausgabe zu gestalten.

```ts
const FMT: Record<string, Array<string>>;
```

Verfügbare Schlüssel: `bold`, `dim`, `reset`, `italic`, `underline`, `inverse`, `hidden`, `strikethrough`, `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray` sowie die Hintergrundvarianten `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`.

## Beispiel

### Eine Color erzeugen

```js
import { Color } from 'ranuts';

// Aus einer Hex-Zeichenkette (kurze oder lange Form, # wahlweise)
const red = new Color('#ff0000');
console.log(red.hex); // '#ff0000'
console.log(red.rgb.toString()); // 'rgb(255,0,0)'
console.log(red.hsl.toString()); // 'hsl(0,100%,50%)'

// Aus einzelnen Kanälen
const green = new Color(0, 255, 0);
console.log(green.hex); // '#00ff00'

// Aus einem Array (mit Alpha)
const blue = new Color([0, 0, 255, 0.5]);
console.log(blue.rgba.toString()); // 'rgba(0,0,255,0.5)'
```

### Eine Color über HSL verändern

```js
import { Color } from 'ranuts';

const color = new Color('#ff0000');

color.setHue(120); // den Farbton bis ins Grüne drehen
console.log(color.rgb.toString()); // 'rgb(0,255,0)'

color.setLum(25); // dunkler
color.setSat(50); // Sättigung herausnehmen
color.setAlpha(0.4);
console.log(color.rgba.toString()); // 'rgba(...,0.4)'
```

### Mit ColorScheme eine Palette bauen

```js
import { ColorScheme } from 'ranuts';

// Komplementärpaar aus einer Grundfarbe
const compl = ColorScheme.Compl('#3498db');
console.log(compl.palette.map((c) => c.hex));

// Triadisches Schema (die Grundfarbe und zwei Farben im Abstand von 120°)
const triad = ColorScheme.Triad('#3498db');
console.log(triad.palette.length); // 3

// Unmittelbar aus einer Liste von Farben
const custom = new ColorScheme(['#ff0000', '#00ff00', '#0000ff']);
console.log(custom.palette.map((c) => c.hsl.toString()));
```

### Die Umrechnungsfunktionen benutzen

```js
import { rgbToHsl, hslToRgb, rgbToHsb, hsbToRgb, componentToHex } from 'ranuts';

console.log(rgbToHsl(255, 0, 0)); // [0, 100, 50]
console.log(hslToRgb(0, 100, 50)); // [255, 0, 0]
console.log(rgbToHsb(255, 0, 0)); // [0, 100, 100]
console.log(hsbToRgb(0, 100, 100)); // [255, 0, 0]
console.log(componentToHex(255)); // 'ff'

// Wo es beschrieben ist, wird auch ein Array als Eingabe angenommen
console.log(rgbToHsl([0, 128, 255])); // [h, s, l]
```

### Terminalausgabe mit FMT gestalten

```js
import { FMT } from 'ranuts';

const [open, close] = FMT.green;
console.log(`${open}success${close}`); // im Terminal steht "success" in Grün

const bold = FMT.bold;
console.log(`${bold[0]}important${bold[1]}`);
```

## Hinweise

1. **Alles wird sofort berechnet**: Eine `Color` berechnet im Konstruktor sämtliche Darstellungen, `hex`, `rgb`, `rgba`, `hsl` und `hsla` stimmen also vom Augenblick der Erzeugung an überein.
2. **Die HSL-Setter berechnen RGB neu**: `setHue`, `setSat` und `setLum` ändern das HSL und leiten dann über `updateFromHsl` RGB und Hex neu her. `setAlpha` rührt nur an `rgba` und `hsla`.
3. **Eingabe als Array oder als Kanäle**: Mehrere Umrechnungsfunktionen (`rgbToHex`, `rgbToHsl`, `hslToRgb`) nehmen entweder drei einzelne Kanäle oder ein einzelnes Array als erstes Argument.
4. **HSV und HSB**: `hsvToRgb` ist ein anderer Name für `hsbToRgb`, und `hsvToHsl` einer für die Umrechnung von HSB nach HSL. HSV und HSB meinen hier dasselbe Modell.
5. **FMT gilt nur fürs Terminal**: Die ANSI-Escape-Folgen erscheinen nur in einem Terminal als Gestaltung, das sie versteht; in der Browserkonsole stehen sie als rohe Steuerzeichen da.
