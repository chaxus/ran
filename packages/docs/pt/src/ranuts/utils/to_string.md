# toString

Converte um valor para o tipo string.

## API

### toString

#### Retorna

| Argumento | Descrição           | Tipo     |
| --------- | ------------------- | -------- |
| `string`  | A string resultante | `string` |

#### Parâmetros

| Parâmetro | Descrição         | Tipo               | Padrão      |
| --------- | ----------------- | ------------------ | ----------- |
| `value`   | Valor a converter | `string \| number` | Obrigatório |

## Exemplo

### Uso básico

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### Conversão de tipo

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## Notas

1. **Invólucro simples**: é um invólucro fino sobre a função `String()`.
2. **Tipos aceitos**: aceita a conversão de string e de número.
3. **Quando usar**: comum em conversões de tipo, tratamento de strings e afins.
