# isEqual

Compara em profundidade se dois valores são iguais, inclusive tipos complexos como objetos, arrays e datas.

## API

### isEqual

#### Retorna

| Argumento | Descrição | Tipo |
| --------- | -------------------------------- | --------- |
| `boolean` | Se os dois valores são iguais | `boolean` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| --------- | ----------------------- | ----- | -------- |
| `value` | Primeiro valor a comparar | `any` | Obrigatório |
| `other` | Segundo valor a comparar | `any` | Obrigatório |

## Exemplo

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

### Comparar datas

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### Referências circulares

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (as referências circulares são tratadas)
```

## Notas

1. **Comparação profunda**: percorre recursivamente todas as propriedades de objetos e arrays.
2. **Referências circulares**: são tratadas corretamente.
3. **Confere o tipo**: se os tipos diferem, devolve `false`.
4. **Desempenho**: com objetos ou arrays grandes, comparar em profundidade pode demorar.
