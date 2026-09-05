# mathjs

Função de cálculo exato que contorna os problemas de precisão dos flutuantes do JavaScript e aceita encadeamento.

## API

### mathjs

#### Retorna

| Argumento             | Descrição                         | Tipo                                 |
| --------------------- | --------------------------------- | ------------------------------------ |
| `ComputeNumberResult` | Objeto com o resultado do cálculo | `{ result: number, next: Function }` |

#### Parâmetros

| Parâmetro | Descrição                     | Tipo     | Padrão      |
| --------- | ----------------------------- | -------- | ----------- |
| `a`       | Primeiro número               | `number` | Obrigatório |
| `type`    | Operação (`+`, `-`, `*`, `/`) | `string` | Obrigatório |
| `b`       | Segundo número                | `number` | Obrigatório |

#### ComputeNumberResult

| Propriedade | Descrição                       | Tipo       |
| ----------- | ------------------------------- | ---------- |
| `result`    | O resultado do cálculo          | `number`   |
| `next`      | Função para continuar o cálculo | `Function` |

## Exemplo

### Uso básico

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3 (exato, não 0.30000000000000004)
```

### Encadeamento

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // O resultado exato
```

### Contornar os problemas de precisão

```js
import { mathjs } from 'ranuts';

// O cálculo nativo do JavaScript perde precisão
console.log(0.1 + 0.2); // 0.30000000000000004

// Com o mathjs o resultado é exato
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### Um cálculo mais longo

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // O resultado exato
```

## Notas

1. **Precisão**: cuida sozinho dos problemas de vírgula flutuante e evita o clássico `0.1 + 0.2 !== 0.3`.
2. **Encadeamento**: dá para encadear cálculos com o método `next`.
3. **Operações**: as quatro básicas: `+` (somar), `-` (subtrair), `*` (multiplicar) e `/` (dividir).
4. **Custo**: um pouco mais lento que as operações nativas, mas a exatidão fica garantida.
