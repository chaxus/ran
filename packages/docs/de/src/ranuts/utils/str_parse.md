# strParse

Zerlegt eine Zeichenkette in ein Objekt, mit selbst gewählten Trennzeichen und Gleichheitszeichen.

## API

### strParse

#### Rückgabe

| Argument | Beschreibung           | Typ                      |
| -------- | ---------------------- | ------------------------ |
| `Object` | Das entstandene Objekt | `Record<string, string>` |

#### Parameter

| Parameter | Beschreibung                                    | Typ                | Standard |
| --------- | ----------------------------------------------- | ------------------ | -------- |
| `str`     | Zu zerlegende Zeichenkette                      | `string`           | `''`     |
| `sep`     | Trennzeichen zwischen den Schlüssel-Wert-Paaren | `string \| RegExp` | `''`     |
| `eq`      | Gleichheitszeichen zwischen Schlüssel und Wert  | `string \| RegExp` | `''`     |

## Beispiel

### Grundlegende Verwendung (Query-String einer URL)

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Ein anderes Trennzeichen

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### Einen regulären Ausdruck verwenden

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Leere Werte

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' } (leere Werte fallen weg)
```

## Hinweise

1. **Trennzeichen**: Das erste Argument trennt die Schlüssel-Wert-Paare (etwa `&`), das zweite trennt Schlüssel und Wert (etwa `=`).
2. **Leere Werte**: Ist der Schlüssel oder der Wert leer, fällt das Paar weg und taucht im Ergebnis nicht auf.
3. **Wird automatisch gesäubert**: Schlüssel und Werte laufen durch `clearStr` (entfernt Leerzeichen, Anführungszeichen und dergleichen).
4. **Reguläre Ausdrücke**: Als Trennzeichen sind Zeichenketten wie reguläre Ausdrücke erlaubt.
