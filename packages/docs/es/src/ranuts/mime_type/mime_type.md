# getMime

Le pasas la extensión de un archivo y te devuelve su `mime type`.

## API

### Devuelve

| Argumento | Descripción             | Tipo     |
| --------- | ----------------------- | -------- |
| `string`  | Devuelve el `mime type` | `string` |

### Opciones

| Parámetro | Descripción                     | Tipo     | Por defecto |
| --------- | ------------------------------- | -------- | ----------- |
| ext       | Formato de extensión de archivo | `string` | Obligatorio |

## Ejemplo

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
