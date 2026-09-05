# strParse

Convierte una cadena en un objeto, con los separadores y el signo igual que tú elijas.

## API

### strParse

#### Devuelve

| Argumento | Descripción          | Tipo                     |
| --------- | -------------------- | ------------------------ |
| `Object`  | El objeto resultante | `Record<string, string>` |

#### Parámetros

| Parámetro | Descripción                           | Tipo               | Por defecto |
| --------- | ------------------------------------- | ------------------ | ----------- |
| `str`     | Cadena que se analiza                 | `string`           | `''`        |
| `sep`     | Separador entre pares clave-valor     | `string \| RegExp` | `''`        |
| `eq`      | Signo igual entre la clave y el valor | `string \| RegExp` | `''`        |

## Ejemplo

### Uso básico (cadena de consulta de una URL)

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Cambiar el separador

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### Usar una expresión regular

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Valores vacíos

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' } (los valores vacíos se descartan)
```

## Notas

1. **Separadores**: el primer argumento separa los pares clave-valor (`&`, por ejemplo) y el segundo separa la clave del valor (`=`, por ejemplo).
2. **Valores vacíos**: si la clave o el valor están vacíos, el par se descarta y no aparece en el objeto resultante.
3. **Limpieza automática**: las claves y los valores pasan por `clearStr` (quita espacios, comillas y demás).
4. **Expresiones regulares**: los separadores pueden ser cadenas o expresiones regulares.
