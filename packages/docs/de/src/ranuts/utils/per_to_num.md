# perToNum

Wandelt eine Prozentangabe als Zeichenkette in eine Zahl um.

## API

### perToNum

#### Rückgabe

| Argument | Beschreibung          | Typ      |
| -------- | --------------------- | -------- |
| `number` | Die umgewandelte Zahl | `number` |

#### Parameter

| Parameter | Beschreibung                   | Typ      | Standard |
| --------- | ------------------------------ | -------- | -------- |
| `str`     | Prozentangabe als Zeichenkette | `string` | `''`     |

## Beispiel

### Grundlegende Verwendung

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### Prozentwerte über 1

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5 (höchstens 1, kommt unverändert zurück)
console.log(perToNum('150%')); // 1.5 (über 1, wird durch 100 geteilt)
console.log(perToNum('200%')); // 2
```

### Gewöhnliche Zahl-Zeichenketten

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### Leere Zeichenkette

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## Hinweise

1. **Umgang mit Prozentwerten**:
   - Liegt der Wert über 1, wird durch 100 geteilt (etwa `150%` → `1.5`)
   - Liegt er bei höchstens 1, kommt er unverändert zurück (etwa `50%` → `0.5`)

2. **Zeichenketten ohne Prozentzeichen**: Endet die Zeichenkette nicht auf `%`, wird sie direkt in eine Zahl umgewandelt.

3. **Leere Werte**: Eine leere Zeichenkette ergibt `0`.

4. **Einsatz**: üblich für Prozentwerte aus CSS, für Fortschrittswerte und Ähnliches.
