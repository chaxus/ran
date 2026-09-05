# formatJson

Formata JSON para leitura. Aceita um objeto, ou uma string JSON que se queira reformatar.

## API

### formatJson(value, onError?, indent?)

| Parâmetro | Descrição                                            | Tipo                 | Padrão       |
| --------- | ---------------------------------------------------- | -------------------- | ------------ |
| `value`   | Objeto, ou string JSON (aspas simples são toleradas) | `string \| object`   | Obrigatório  |
| `onError` | Chamado com o erro de análise ou serialização        | `(e: Error) => void` | não faz nada |
| `indent`  | Espaços por nível                                    | `number`             | `4`          |

Devolve a string formatada, ou `''` quando a entrada não pode ser analisada.

## Exemplo

```js
import { formatJson } from 'ranuts';

formatJson({ a: 1, b: [2, 3] });
formatJson("{'a': 1}"); // aspas simples são toleradas
formatJson({ a: 1 }, undefined, 2); // recuo de dois espaços
formatJson('nope', (e) => console.warn(e)); // devolve '' e passa o erro ao callback
```

## Notas

1. **Uma string é reanalisada, não devolvida como veio.** Assim ela fica validada e com formato uniforme, em vez de se confiar no espaçamento que trazia.
2. **Os erros são avisados, nunca lançados.** JSON inválido, estruturas circulares e valores que o `JSON.stringify` não representa devolvem `''` e chamam `onError`.

::: warning Reescrito na 0.3
Isto era um formatador artesanal de umas 90 linhas que refazia o desenho enfiando quebras de linha com expressões regulares em volta de cada chave, colchete e vírgula, e depois tentava desfazer o estrago dentro das strings contando aspas por linha. Ele tratava mal as aspas escapadas e tomava por estrutura uma chave ou vírgula **dentro do valor de uma string**, então `{ css: 'a { color: red, }' }` saía corrompido. Agora é `JSON.stringify` com uma análise tolerante na frente: correto e muito mais rápido. O espaçamento da saída é o do `JSON.stringify`, não o do antigo desenho sob medida.
:::
