# randomColor

Erzeugt ein zufälliges Farbobjekt.

## API

### randomColor

#### Rückgabe

| Argument | Beschreibung | Typ |
| -------- | ------------------- | ------- |
| `Color` | Zufälliges Farbobjekt | `Color` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2' (zufällig)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### Die Werte der zufälligen Farbe auslesen

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### Mehrere zufällige Farben erzeugen

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`Farbe ${index + 1}:`, color.hex);
});
```

### Eine zufällige Farbe setzen

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## Hinweise

1. **Zufällig erzeugt**: Jeder Aufruf liefert einen zufälligen Hexadezimalwert.
2. **Vollständiges Objekt**: Zurück kommt ein komplettes `Color`-Objekt mit allen Eigenschaften — hex, rgb, hsl und den übrigen.
3. **Format der Farbe**: Der erzeugte Wert enthält das `#`, lässt sich also direkt in CSS verwenden.
4. **Einsatz**: üblich beim Erzeugen zufälliger Farben, in Farbwählern und in der Datenvisualisierung.
