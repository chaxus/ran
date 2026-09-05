# transformNumber

Wandelt eine Zahl in eine Zeichenkette mit Einheiten um — chinesische wie englische.

## API

### transformNumber

#### Rückgabe

| Argument | Beschreibung                 | Typ      |
| -------- | ---------------------------- | -------- |
| `string` | Die formatierte Zeichenkette | `string` |

#### Parameter

| Parameter   | Beschreibung                        | Typ      | Standard     |
| ----------- | ----------------------------------- | -------- | ------------ |
| `value`     | Umzuwandelnde Zahl als Zeichenkette | `string` | Erforderlich |
| `locale`    | Gebietsschema                       | `string` | `'zh-CN'`    |
| `precision` | Genauigkeit der Rechnung            | `number` | `2`          |
| `fixed`     | Angezeigte Nachkommastellen         | `number` | `2`          |

## Beispiel

### Grundlegende Verwendung

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万' (zehntausend, chinesisch)
console.log(transformNumber('1000000')); // '100.00 万' (eine Million)
console.log(transformNumber('100000000')); // '1.00 亿' (hundert Millionen)
```

### Englische Einheiten

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### Die Genauigkeit einstellen

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### Ungültige Eingaben

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## Hinweise

1. **Einheitensystem**:
   - `zh-CN`: 万 (zehntausend), 亿 (hundert Millionen), 万亿 (Billion) — alle vier Stellen
   - `zh-HK`: 萬, 億, 萬億 — ebenfalls alle vier Stellen
   - `en`: K (Tausend), M (Million), B (Milliarde), T (Billion) — alle drei Stellen

2. **Genauigkeit**: rechnet mit `Mathjs`, um Gleitkommafehler zu vermeiden.

3. **Ungültige Eingabe**: Ist die Eingabe keine gültige Zahl, kommt `'--'` zurück.

4. **Einsatz**: üblich für große Zahlen wie Beträge, Aufrufe oder Followerzahlen.
