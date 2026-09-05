# strParse

Transforma uma string em objeto, com os separadores e o sinal de igual que você escolher.

## API

### strParse

#### Retorna

| Argumento | Descrição           | Tipo                     |
| --------- | ------------------- | ------------------------ |
| `Object`  | O objeto resultante | `Record<string, string>` |

#### Parâmetros

| Parâmetro | Descrição                              | Tipo               | Padrão |
| --------- | -------------------------------------- | ------------------ | ------ |
| `str`     | String a analisar                      | `string`           | `''`   |
| `sep`     | Separador entre os pares chave-valor   | `string \| RegExp` | `''`   |
| `eq`      | Sinal de igual entre a chave e o valor | `string \| RegExp` | `''`   |

## Exemplo

### Uso básico (string de consulta de uma URL)

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Trocar o separador

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### Usar uma expressão regular

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### Valores vazios

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' } (os valores vazios são descartados)
```

## Notas

1. **Separadores**: o primeiro argumento separa os pares chave-valor (`&`, por exemplo) e o segundo separa a chave do valor (`=`, por exemplo).
2. **Valores vazios**: se a chave ou o valor estiverem vazios, o par é descartado e não aparece no objeto resultante.
3. **Limpeza automática**: chaves e valores passam pelo `clearStr` (tira espaços, aspas e afins).
4. **Expressões regulares**: os separadores podem ser strings ou expressões regulares.
