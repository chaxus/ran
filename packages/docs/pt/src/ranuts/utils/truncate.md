# truncate

Encurta uma string até um tamanho máximo e marca o corte com reticências. Lida bem com Unicode e sabe que _qual ponta_ você guarda muda o sentido do corte.

## Uso

```ts
import { truncate } from 'ranuts/utils';

truncate('the quick brown fox', 12); // 'the quick b…'

truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' });
// '…de/app/src/index.ts'

truncate('0xabcdef0123456789', { length: 11, position: 'middle' });
// '0xabc…56789'
```

## API

### `truncate(value, options)`

#### Parâmetros

| Parâmetro | Descrição                                         | Tipo                        | Padrão      |
| --------- | ------------------------------------------------- | --------------------------- | ----------- |
| `value`   | A string que será encurtada                       | `string`                    | Obrigatório |
| `options` | Um número sozinho é a forma curta de `{ length }` | `TruncateOptions \| number` | Obrigatório |

#### `TruncateOptions`

| Campo      | Descrição                                          | Tipo                           | Padrão  |
| ---------- | -------------------------------------------------- | ------------------------------ | ------- |
| `length`   | Tamanho máximo do resultado, reticências incluídas | `number`                       | —       |
| `position` | Qual ponta sobrevive; veja abaixo                  | `'end' \| 'start' \| 'middle'` | `'end'` |
| `ellipsis` | A marca colocada no corte                          | `string`                       | `'…'`   |

`position` decide qual ponta sobrevive, e essa escolha carrega informação de verdade:

- `'end'` (padrão) guarda o começo: o certo para prosa e títulos.
- `'start'` guarda o **fim**, que é o que um caminho de arquivo pede: `/Users/alguem/trabalho/…` é a parte que quem lê já conhece; `…/src/utils/str.ts` é a que interessa.
- `'middle'` guarda as duas pontas, para identificadores em que o começo _e_ o fim significam algo, como um hash ou um número de conta.

#### Retorna

`string`: nunca maior que `length`. Se `length` for menor que as próprias reticências, o que se corta são elas, em vez de transbordar.

## Notas

1. **Corta por ponto de código Unicode, não por unidade UTF-16.** Um `value.slice(i)` ingênuo pode cair dentro de um par substituto: qualquer caractere fora do plano multilíngue básico (emoji, alguns caracteres de extensão CJK) ocupa duas unidades UTF-16, e deixa junto às reticências um substituto solto que aparece como caracteres corrompidos. O `truncate` percorre por ponto de código, então nunca parte um caractere de várias unidades.
2. Um `value` menor que `length` volta como está, sem reticências.
3. Passe o seu próprio `ellipsis` (`'...'` ou `'[cut]'`, por exemplo) se o caractere `'…'` não existir na fonte com que você desenha.
