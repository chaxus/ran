# getCookie

Obtiene el valor de la cookie con el nombre indicado.

## API

### Devuelve

| Argumento | Descripción                                  | Tipo     |
| --------- | -------------------------------------------- | -------- |
| `string`  | El valor de la cookie con el nombre indicado | `string` |

### Opciones

| Argumento | Descripción                            | Tipo     | Por defecto |
| --------- | -------------------------------------- | -------- | ----------- |
| `name`    | Nombre de la cookie que se quiere leer | `string` | Obligatorio |

## Ejemplo

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
