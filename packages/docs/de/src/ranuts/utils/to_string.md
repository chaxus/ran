# toString

Wandelt einen Wert in den Typ Zeichenkette um.

## API

### toString

#### Rückgabe

| Argument | Beschreibung                  | Typ      |
| -------- | ----------------------------- | -------- |
| `string` | Die umgewandelte Zeichenkette | `string` |

#### Parameter

| Parameter | Beschreibung           | Typ                | Standard     |
| --------- | ---------------------- | ------------------ | ------------ |
| `value`   | Der umzuwandelnde Wert | `string \| number` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### Typumwandlung

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## Hinweise

1. **Dünne Hülle**: Das ist eine schlichte Hülle um die Funktion `String()`.
2. **Unterstützte Typen**: Unterstützt die Umwandlung von Zeichenketten und Zahlen.
3. **Einsatzfall**: Üblich bei Typumwandlungen, Textverarbeitung und Ähnlichem.
