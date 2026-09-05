# hexToRgb

Wandelt einen hexadezimalen Farbwert in ein RGB-Array um.

## API

### hexToRgb

#### Rückgabe

| Argument                | Beschreibung                  | Typ                     |
| ----------------------- | ----------------------------- | ----------------------- |
| `Array<number> \| null` | RGB-Array [r, g, b] oder null | `Array<number> \| null` |

#### Parameter

| Parameter | Beschreibung           | Typ      | Standard     |
| --------- | ---------------------- | -------- | ------------ |
| `hex`     | Hexadezimaler Farbwert | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### Ungültige Werte

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### Mit oder ohne `#`

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### Farbumrechnung

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// Zurück ins Hexadezimale
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## Hinweise

1. **Erlaubtes Format**: sechsstellige hexadezimale Farbwerte (etwa `#ff0000` oder `ff0000`).
2. **Rückgabewert**: bei Erfolg ein Array `[r, g, b]`, sonst `null`.
3. **Groß- und Kleinschreibung**: `#FF0000` und `#ff0000` gelten gleichermaßen.
4. **Einsatz**: üblich beim Umrechnen und Bearbeiten von Farben und beim Umgang mit CSS-Farben.
