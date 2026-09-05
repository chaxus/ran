# getCookie

Pega o valor do cookie com o nome informado.

## API

### Retorna

| Argumento | Descrição                              | Tipo     |
| --------- | -------------------------------------- | -------- |
| `string`  | O valor do cookie com o nome informado | `string` |

### Opções

| Argumento | Descrição            | Tipo     | Padrão      |
| --------- | -------------------- | -------- | ----------- |
| `name`    | Nome do cookie a ler | `string` | Obrigatório |

## Exemplo

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
