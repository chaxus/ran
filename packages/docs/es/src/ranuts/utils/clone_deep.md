# cloneDeep

Clona en profundidad un objeto o un array, y crea una copia del todo independiente, incluidos los objetos y arrays anidados.

## API

### cloneDeep

#### Devuelve

| Argumento | Descripción                     | Tipo  |
| --------- | ------------------------------- | ----- |
| `any`     | El nuevo objeto o valor clonado | `any` |

#### Parámetros

| Parámetro | Descripción        | Tipo  | Por defecto |
| --------- | ------------------ | ----- | ----------- |
| `value`   | Valor que se clona | `any` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (el objeto original no cambia)
console.log(cloned.b.c); // 3
```

### Clonar un array

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (el array original no cambia)
console.log(cloned[2].a); // 4
```

### Clonar objetos anidados

```js
import { cloneDeep } from 'ranuts';

const original = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
  },
};

const cloned = cloneDeep(original);
cloned.user.address.city = 'Los Angeles';

console.log(original.user.address.city); // 'New York'
console.log(cloned.user.address.city); // 'Los Angeles'
```

### Clonar objetos `Date`

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## Notas

1. **Del todo independiente**: la copia no comparte nada con el original; cambiar una no toca la otra.
2. **En profundidad**: clona de forma recursiva todos los objetos y arrays anidados.
3. **Referencias circulares**: las trata correctamente.
4. **Rendimiento**: con objetos o arrays grandes, clonar en profundidad puede tardar.
5. **Funciones y objetos especiales**: cómo se clonan ciertos objetos (funciones, expresiones regulares y demás) puede variar según la implementación.
