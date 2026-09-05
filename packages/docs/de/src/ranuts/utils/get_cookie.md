# getCookie

Liest den Wert des Cookies mit dem angegebenen Namen.

## API

### Rückgabe

| Argument | Beschreibung                                   | Typ      |
| -------- | ---------------------------------------------- | -------- |
| `string` | Der Wert des Cookies mit dem angegebenen Namen | `string` |

### Optionen

| Argument | Beschreibung                 | Typ      | Standard     |
| -------- | ---------------------------- | -------- | ------------ |
| `name`   | Name des zu lesenden Cookies | `string` | Erforderlich |

## Beispiel

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
