# filterObj

Filtert die Eigenschaften eines Objekts: Alles, dessen Schlüssel im Array `list` steht, fällt weg, und es entsteht ein neues Objekt. Wird viel genutzt, um leere Zeichenketten und Nullwerte auszusortieren.

## API

### Rückgabe

| Argument | Beschreibung          | Typ      |
| -------- | --------------------- | -------- |
| `Object` | Das gefilterte Objekt | `Object` |

### Optionen

| Argument | Beschreibung                             | Typ      | Standard     |
| -------- | ---------------------------------------- | -------- | ------------ |
| `obj`    | Das zu filternde Objekt                  | `object` | Erforderlich |
| `list`   | Schlüssel, die aus `obj` entfernt werden | `array`  | Erforderlich |

## Beispiel

```js
import { filterObj } from 'ranuts';

const obj = {
  name: 'chaxus',
  age: 10,
  address: 'spark',
};

const result = filterObj(obj, ['name', 'address']);

console.log(result);

// { age:10 }
```
