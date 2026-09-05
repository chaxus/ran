# cloneDeep

Kopiert ein Objekt oder Array tief und erzeugt eine völlig eigenständige Kopie, verschachtelte Objekte und Arrays eingeschlossen.

## API

### cloneDeep

#### Rückgabe

| Argument | Beschreibung                                     | Typ   |
| -------- | ------------------------------------------------ | ----- |
| `any`    | Das neue, kopierte Objekt oder der kopierte Wert | `any` |

#### Parameter

| Parameter | Beschreibung        | Typ   | Standard     |
| --------- | ------------------- | ----- | ------------ |
| `value`   | Zu kopierender Wert | `any` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (das ursprüngliche Objekt bleibt unberührt)
console.log(cloned.b.c); // 3
```

### Ein Array kopieren

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (das ursprüngliche Array bleibt unberührt)
console.log(cloned[2].a); // 4
```

### Verschachtelte Objekte kopieren

```js
import { cloneDeep } from 'ranuts';

const original = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
  },
};

const cloned = cloneDeep(original);
cloned.user.address.city = 'Los Angeles';

console.log(original.user.address.city); // 'New York'
console.log(cloned.user.address.city); // 'Los Angeles'
```

### `Date`-Objekte kopieren

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## Hinweise

1. **Völlig eigenständig**: Die Kopie teilt nichts mit dem Original; Änderungen an der einen berühren die andere nicht.
2. **Tiefe Kopie**: kopiert rekursiv alle verschachtelten Objekte und Arrays.
3. **Zyklische Verweise**: werden richtig behandelt.
4. **Geschwindigkeit**: Bei großen Objekten oder Arrays kann das Kopieren dauern.
5. **Funktionen und Sonderfälle**: Wie bestimmte Objekte (Funktionen, reguläre Ausdrücke und dergleichen) kopiert werden, kann je nach Umsetzung abweichen.
