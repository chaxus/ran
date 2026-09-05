# isString

Determina si un valor es del tipo cadena.

## API

### isString

#### Devuelve

| Argumento | Descripción      | Tipo      |
| --------- | ---------------- | --------- |
| `boolean` | Si es una cadena | `boolean` |

#### Parámetros

| Parámetro | Descripción            | Tipo      | Por defecto |
| --------- | ---------------------- | --------- | ----------- |
| `obj`     | Valor que se comprueba | `unknown` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### Comprobación de tipo

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('Es una cadena:', value.toUpperCase());
  } else {
    console.log('No es una cadena');
  }
}

processValue('hello'); // 'Es una cadena: HELLO'
processValue(123); // 'No es una cadena'
```

### Validación de argumentos

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('La entrada debe ser una cadena');
  }
  return input.trim();
}
```

## Notas

1. **Cómo detecta el tipo**: usa `Object.prototype.toString.call()`, que distingue con precisión.
2. **Rigor**: solo devuelve `true` cuando el valor es una cadena de verdad; los demás tipos (incluidos los objetos String) devuelven `false`.
3. **Cuándo usarlo**: es habitual para comprobar tipos, validar argumentos y similares.
