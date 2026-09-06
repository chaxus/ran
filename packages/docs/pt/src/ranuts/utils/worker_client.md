# WorkerClient

Requisição e resposta sobre um Web Worker. Um worker puro só sabe «enviar uma mensagem» e «receber uma mensagem»: mande duas tarefas ao mesmo tempo e voltam duas mensagens sem como saber qual é de qual. O `WorkerClient` carimba um identificador em cada requisição e encaminha cada resposta para a promessa que lhe cabe.

## API

### new WorkerClient(options)

| Parâmetro         | Descrição                                               | Tipo                | Padrão                    |
| ----------------- | ------------------------------------------------------- | ------------------- | ------------------------- |
| `create`          | Como o worker é construído                              | `() => Worker`      | Obrigatório               |
| `isProgress`      | É uma mensagem de progresso? (não resolve a requisição) | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | Tira o conteúdo do progresso                            | `(res) => Progress` | `res.progress`            |
| `isError`         | É uma mensagem de erro?                                 | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | O texto do erro                                         | `(res) => string`   | `res.message`             |
| `timeout`         | Prazo por requisição (ms); rejeita apenas aquela        | `number`            | nenhum                    |

| Membro                                  | Descrição                                                |
| --------------------------------------- | -------------------------------------------------------- |
| `send(request, onProgress?, transfer?)` | Envia uma requisição e espera a resposta                 |
| `dispose()`                             | Encerra o worker e rejeita tudo que estiver em andamento |
| `active`                                | Se o worker já foi criado                                |
| `pendingCount`                          | Quantas requisições estão em andamento                   |

### serveWorker(handler, options?) — o lado do worker

A contraparte que roda _dentro_ do worker. Lê o `operationId` de cada requisição, espera o seu manipulador e devolve a resposta carregando esse mesmo identificador.

| Parâmetro            | Descrição                                                                                  | Tipo       |
| -------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| `handler`            | `(request, { progress }) => Response \| Promise<Response>`                                 | `Function` |
| `options.scope`      | Onde escutar. Por padrão `self`; troque para uma porta ou um teste                         | object     |
| `options.resultType` | O `type` da resposta quando o manipulador devolve algo que não é objeto. Padrão `'result'` | `string`   |

Devolve uma função `stop` que tira o ouvinte.

## Exemplo

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

E o lado do worker:

```js
// nlp.worker.ts
import { serveWorker } from 'ranuts';

serveWorker(async (request, { progress }) => {
  if (request.type === 'load') {
    const device = await loadModel(request.modelId, (p) => progress(p));
    return { type: 'loaded', device };
  }
  return { type: 'result', scores: await classify(request.lines) };
});
```

## Notas

1. **O worker é criado preguiçosamente**, no primeiro `send`: trabalho pesado não deve começar no carregamento da página.
2. **Mensagens de progresso não resolvem a requisição**, de modo que uma única requisição pode emitir várias atualizações e ainda assim resolver uma vez no fim.
3. **Se o worker quebra, todas as requisições em andamento são rejeitadas.** Um erro não capturado dentro de um worker não traz `operationId`, então não dá para atribuí-lo a uma requisição.
4. **`dispose()` encerra e rejeita**; o `send` seguinte reconstrói o worker.
5. **Um prazo vencido rejeita só aquela requisição** e deixa o worker vivo.
6. **Use `transfer` para buffers grandes**, para passar a posse em vez de clonar uma cópia.
7. **O `serveWorker` também captura exceções síncronas.** Uma exceção síncrona dentro do `onmessage` escapa para o manipulador de erros do worker, e por esse caminho não viaja nenhum `operationId`; o cliente então só poderia derrubar _todas_ as requisições em andamento, e não a que de fato quebrou.
8. **As duas metades vêm juntas de propósito.** Escrever à mão o lado do worker é justamente onde o eco do identificador e o envelope do erro começam a divergir de projeto para projeto.
