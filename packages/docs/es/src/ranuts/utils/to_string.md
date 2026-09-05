# toString

Convierte un valor al tipo cadena.

## API

### toString

#### Devuelve

| Argumento | Descripción          | Tipo     |
| --------- | -------------------- | -------- |
| `string`  | La cadena resultante | `string` |

#### Parámetros

| Parámetro | Descripción                 | Tipo               | Por defecto |
| --------- | --------------------------- | ------------------ | ----------- |
| `value`   | Valor que se va a convertir | `string \| number` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### Conversión de tipo

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## Notas

1. **Envoltorio sencillo**: es un envoltorio fino sobre la función `String()`.
2. **Tipos admitidos**: admite la conversión de cadenas y de números.
3. **Cuándo usarlo**: es habitual en conversiones de tipo, tratamiento de cadenas y similares.
