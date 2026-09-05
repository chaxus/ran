# getMime

Übergib eine Dateiendung und du bekommst den passenden `mime type` zurück.

## API

### Rückgabe

| Argument | Beschreibung                | Typ      |
| -------- | --------------------------- | -------- |
| `string` | Gibt den `mime type` zurück | `string` |

### Optionen

| Parameter | Beschreibung           | Typ      | Standard     |
| --------- | ---------------------- | -------- | ------------ |
| ext       | Format der Dateiendung | `string` | Erforderlich |

## Beispiel

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
