# rgbToHex

Wandelt RGB-Werte in einen hexadezimalen Farbwert um.

## API

### rgbToHex

#### Rückgabe

| Argument | Beschreibung              | Typ      |
| -------- | ------------------------- | -------- |
| `string` | Der hexadezimale Farbwert | `string` |

#### Parameter

| Parameter | Beschreibung               | Typ                         | Standard     |
| --------- | -------------------------- | --------------------------- | ------------ |
| `r`       | Rotwert oder das RGB-Array | `string \| number \| Array` | Erforderlich |
| `g`       | Grünwert (optional)        | `string \| number`          | `0`          |
| `b`       | Blauwert (optional)        | `string \| number`          | `0`          |

## Beispiel

### Grundlegende Verwendung

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### Ein Array übergeben

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### Farbumrechnung

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// Zurück nach RGB
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### Farben zur Laufzeit erzeugen

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## Hinweise

1. **Übergabeformen**: drei Möglichkeiten:
   - Drei einzelne Argumente: `rgbToHex(r, g, b)`
   - Ein Array: `rgbToHex([r, g, b])`
   - Zeichenkette oder Zahl: wird von allein umgewandelt

2. **Rückgabewert**: immer ein hexadezimaler Farbwert mit `#`.

3. **Wertebereich**: RGB-Werte liegen üblicherweise zwischen 0 und 255; Werte darüber hinaus werden trotzdem umgewandelt.

4. **Einsatz**: üblich beim Umrechnen von Farben, beim Erzeugen von CSS-Farben und beim Bearbeiten von Farben.
