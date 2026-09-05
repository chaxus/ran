# isEqual

Compara en profundidad si dos valores son iguales, incluidos tipos complejos como objetos, arrays o fechas.

## API

### isEqual

#### Devuelve

| Argumento | Descripción | Tipo |
| --------- | -------------------------------- | --------- |
| `boolean` | Si los dos valores son iguales | `boolean` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | ----------------------- | ----- | -------- |
| `value` | Primer valor a comparar | `any` | Obligatorio |
| `other` | Segundo valor a comparar | `any` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### Comparar objetos

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### Comparar arrays

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### Comparar fechas

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### Referencias circulares

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (las referencias circulares están contempladas)
```

## Notas

1. **Comparación profunda**: recorre de forma recursiva todas las propiedades de objetos y arrays.
2. **Referencias circulares**: las trata correctamente.
3. **Comprueba el tipo**: si los tipos difieren, devuelve `false`.
4. **Rendimiento**: con objetos o arrays grandes, comparar en profundidad puede tardar.
