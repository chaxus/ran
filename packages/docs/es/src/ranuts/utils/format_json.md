# formatJson

Formatea JSON para leerlo con comodidad. Acepta un objeto, o una cadena JSON que se quiera reformatear.

## API

### formatJson(value, onError?, indent?)

| Parámetro | Descripción                                             | Tipo                 | Por defecto  |
| --------- | ------------------------------------------------------- | -------------------- | ------------ |
| `value`   | Objeto, o cadena JSON (se toleran las comillas simples) | `string \| object`   | Obligatorio  |
| `onError` | Se llama con el error de análisis o serialización       | `(e: Error) => void` | no hace nada |
| `indent`  | Espacios por nivel                                      | `number`             | `4`          |

Devuelve la cadena formateada, o `''` si la entrada no se puede analizar.

## Ejemplo

```js
import { formatJson } from 'ranuts';

formatJson({ a: 1, b: [2, 3] });
formatJson("{'a': 1}"); // se toleran las comillas simples
formatJson({ a: 1 }, undefined, 2); // sangría de dos espacios
formatJson('nope', (e) => console.warn(e)); // devuelve '' y pasa el error al callback
```

## Notas

1. **Una cadena se vuelve a analizar, no se devuelve tal cual.** Así queda validada y con un formato uniforme, en vez de confiar en el espaciado que traía.
2. **Los errores se avisan, nunca se lanzan.** El JSON inválido, las estructuras circulares y los valores que `JSON.stringify` no puede representar devuelven `''` y llaman a `onError`.

::: warning Reescrito en la 0.3
Esto era un formateador artesanal de unas 90 líneas que rehacía el diseño metiendo saltos de línea con expresiones regulares alrededor de cada llave, corchete y coma, y luego intentaba deshacer el estropicio dentro de las cadenas contando comillas por línea. Manejaba mal las comillas escapadas y tomaba por estructura una llave o una coma **dentro del valor de una cadena**, así que `{ css: 'a { color: red, }' }` salía corrupto. Ahora es `JSON.stringify` con un análisis indulgente por delante: correcto y muchísimo más rápido. El espaciado de la salida es el de `JSON.stringify`, no el del antiguo diseño a medida.
:::
