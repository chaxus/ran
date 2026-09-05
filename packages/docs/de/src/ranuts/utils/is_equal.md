# isEqual

Vergleicht zwei Werte tief auf Gleichheit, auch zusammengesetzte Typen wie Objekte, Arrays und Datumsangaben.

## API

### isEqual

#### Rückgabe

| Argument  | Beschreibung                    | Typ       |
| --------- | ------------------------------- | --------- |
| `boolean` | Ob die beiden Werte gleich sind | `boolean` |

#### Parameter

| Parameter | Beschreibung                   | Typ   | Standard     |
| --------- | ------------------------------ | ----- | ------------ |
| `value`   | Erster zu vergleichender Wert  | `any` | Erforderlich |
| `other`   | Zweiter zu vergleichender Wert | `any` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### Objekte vergleichen

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### Arrays vergleichen

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### Datumsangaben vergleichen

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### Zyklische Verweise

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (zyklische Verweise sind berücksichtigt)
```

## Hinweise

1. **Tiefer Vergleich**: geht rekursiv durch alle Eigenschaften von Objekten und Arrays.
2. **Zyklische Verweise**: werden richtig behandelt.
3. **Prüft den Typ**: Unterscheiden sich die Typen, kommt `false` zurück.
4. **Geschwindigkeit**: Bei großen Objekten oder Arrays kann der tiefe Vergleich dauern.
