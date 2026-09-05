# cloneDeep

Clona em profundidade um objeto ou array, criando uma cópia totalmente independente, com os objetos e arrays aninhados junto.

## API

### cloneDeep

#### Retorna

| Argumento | Descrição                      | Tipo  |
| --------- | ------------------------------ | ----- |
| `any`     | O novo objeto ou valor clonado | `any` |

#### Parâmetros

| Parâmetro | Descrição      | Tipo  | Padrão      |
| --------- | -------------- | ----- | ----------- |
| `value`   | Valor a clonar | `any` | Obrigatório |

## Exemplo

### Uso básico

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (o objeto original não muda)
console.log(cloned.b.c); // 3
```

### Clonar um array

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (o array original não muda)
console.log(cloned[2].a); // 4
```

### Clonar objetos aninhados

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

1. **Totalmente independente**: a cópia não compartilha nada com o original; mexer numa não toca na outra.
2. **Em profundidade**: clona recursivamente todos os objetos e arrays aninhados.
3. **Referências circulares**: são tratadas corretamente.
4. **Desempenho**: com objetos ou arrays grandes, clonar em profundidade pode demorar.
5. **Funções e objetos especiais**: como certos objetos são clonados (funções, expressões regulares e afins) pode variar conforme a implementação.
