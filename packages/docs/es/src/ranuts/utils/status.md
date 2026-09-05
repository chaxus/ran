# getStatus / status

Una tabla que empareja códigos de estado HTTP con sus mensajes, más el ayudante bidireccional `getStatus`: los mismos datos que ofrece el propio `http.STATUS_CODES` de Node, empaquetados también para el navegador.

## Uso

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' — las cadenas numéricas se leen antes como código
getStatus('not found'); // 404 — si no, busca por mensaje, sin distinguir mayúsculas

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### Parámetros

| Parámetro | Descripción                                                     | Tipo               | Por defecto |
| --------- | --------------------------------------------------------------- | ------------------ | ----------- |
| `code`    | Un código de estado, una cadena numérica o un mensaje de estado | `number \| string` | Obligatorio |

#### Devuelve

`number | string`. Pásale un `number` y recibes el **mensaje**; pásale un `string` y recibes el **código** (una cadena numérica como `'404'` se lee primero como código, y solo se busca como mensaje si no es un código conocido). Lanza una excepción si la entrada no encaja en ninguno de los dos.

### `status`

| Campo      | Descripción                                                             | Tipo                   |
| ---------- | ----------------------------------------------------------------------- | ---------------------- |
| `message`  | Código → mensaje                                                        | `Map<number, string>`  |
| `code`     | Mensaje en minúsculas → código                                          | `Map<string, number>`  |
| `codes`    | Todos los códigos conocidos                                             | `number[]`             |
| `redirect` | Códigos que redirigen (`300`, `301`, `302`, `303`, `305`, `307`, `308`) | `Record<number, true>` |
| `empty`    | Códigos sin cuerpo (`204`, `205`, `304`)                                | `Record<number, true>` |
| `retry`    | Códigos que merece la pena reintentar (`502`, `503`, `504`)             | `Record<number, true>` |

## Notas

1. **`getStatus` lanza una excepción con un código o mensaje desconocido**: `TypeError` si el argumento no es `number` ni `string`, y `Error` en los demás casos. Envuélvelo en `try`/`catch` (o comprueba antes `status.codes.includes(n)`) cuando la entrada no venga garantizada, como un código de estado leído de la red.
2. **`status.redirect`, `empty` y `retry` son objetos corrientes, no `Set`**: comprueba la pertenencia con `status.retry[code]`, no con `.has()`.
3. Corre tanto en el navegador como en Node (`ranuts/utils`), así que en el cliente dispones de la misma correspondencia código↔mensaje que usaría un manejador de `ranuts/node` en el servidor.
