# getStatus / status

Uma tabela que casa códigos de estado HTTP com suas mensagens, mais o auxiliar de mão dupla `getStatus`: os mesmos dados que o próprio `http.STATUS_CODES` do Node oferece, empacotados também para o navegador.

## Uso

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' — strings numéricas são lidas antes como código
getStatus('not found'); // 404 — se não, busca pela mensagem, sem diferenciar maiúsculas

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### Parâmetros

| Parâmetro | Descrição                                                          | Tipo               | Padrão      |
| --------- | ------------------------------------------------------------------ | ------------------ | ----------- |
| `code`    | Um código de estado, uma string numérica ou uma mensagem de estado | `number \| string` | Obrigatório |

#### Retorna

`number | string`. Passe um `number` e receba a **mensagem**; passe uma `string` e receba o **código** (uma string numérica como `'404'` é lida primeiro como código, e só é buscada como mensagem se não for um código conhecido). Lança uma exceção se a entrada não casar com nenhum dos dois.

### `status`

| Campo      | Descrição                                                                  | Tipo                   |
| ---------- | -------------------------------------------------------------------------- | ---------------------- |
| `message`  | Código → mensagem                                                          | `Map<number, string>`  |
| `code`     | Mensagem em minúsculas → código                                            | `Map<string, number>`  |
| `codes`    | Todos os códigos conhecidos                                                | `number[]`             |
| `redirect` | Códigos que redirecionam (`300`, `301`, `302`, `303`, `305`, `307`, `308`) | `Record<number, true>` |
| `empty`    | Códigos sem corpo (`204`, `205`, `304`)                                    | `Record<number, true>` |
| `retry`    | Códigos que vale a pena repetir (`502`, `503`, `504`)                      | `Record<number, true>` |

## Notas

1. **`getStatus` lança uma exceção com código ou mensagem desconhecidos**: `TypeError` se o argumento não for `number` nem `string`, e `Error` nos demais casos. Envolva em `try`/`catch` (ou confira antes `status.codes.includes(n)`) quando a entrada não vier garantida, como um código de estado lido da rede.
2. **`status.redirect`, `empty` e `retry` são objetos comuns, não `Set`**: confira a presença com `status.retry[code]`, e não com `.has()`.
3. Roda tanto no navegador quanto no Node (`ranuts/utils`), então no cliente você tem o mesmo mapeamento código↔mensagem que um manipulador de `ranuts/node` usaria no servidor.
