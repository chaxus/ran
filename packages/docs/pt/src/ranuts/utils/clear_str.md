# clearStr

Tira de uma string os espaços das pontas, a codificação de URL e as aspas.

## API

### clearStr

#### Retorna

| Argumento | Descrição      | Tipo     |
| --------- | -------------- | -------- |
| `string`  | A string limpa | `string` |

#### Parâmetros

| Parâmetro | Descrição              | Tipo             | Padrão      |
| --------- | ---------------------- | ---------------- | ----------- |
| `str`     | String que será limpa  | `string`         | Obrigatório |
| `options` | Opções de configuração | `ClearStrOption` | `{}`        |

#### Opções

| Parâmetro    | Descrição               | Tipo      | Padrão |
| ------------ | ----------------------- | --------- | ------ |
| `urlencoded` | Se a URL é decodificada | `boolean` | `true` |

## Exemplo

### Uso básico

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### String codificada para URL

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (decodificado sozinho)
```

### Desligar a decodificação

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (sem decodificar)
```

### Aspas

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## Notas

1. **O que tira**: os espaços das pontas, as aspas simples e as duplas.
2. **Decodificação**: por padrão decodifica a URL; para desligar, use `urlencoded: false`.
3. **Quando usar**: é comum para limpar o que o usuário digita ou valores tirados dos parâmetros de uma URL.
