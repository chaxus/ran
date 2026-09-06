# withTimeout / deferred

As peças de promessa que o JavaScript não traz: uma promessa resolvida de fora e uma espera com limite.

## API

| Função                                                   | Descrição                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| `deferred<T>()`                                          | `{ promise, resolve, reject }`, para resolvê-la de fora      |
| `withTimeout(promise, ms, options?)`                     | Rejeita com `TimeoutError` se não tiver se resolvido em `ms` |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | Resolve com `fallback` em vez de rejeitar                    |
| `delay(ms)`                                              | Resolve depois de `ms`                                       |
| `TimeoutError`                                           | A classe de erro que o `withTimeout` lança                   |

### `withTimeout` options

| Opção       | Descrição                                               | Padrão                             |
| ----------- | ------------------------------------------------------- | ---------------------------------- |
| `message`   | Mensagem do erro                                        | `operation timed out after {ms}ms` |
| `onTimeout` | Chamado quando o prazo vence, para desmontar a operação | —                                  |

## Exemplo

### Limitar uma requisição e abortá-la ao vencer

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### Degradar em vez de falhar

```js
import { withTimeoutFallback } from 'ranuts';

// Um salvamento lento deve devolver o arquivo original, não quebrar o fluxo.
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### Resolver uma promessa a partir de um callback

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### Enfileirar operações com prazo

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## Notas

1. **O temporizador é sempre limpo**, inclusive quando a tarefa vence a corrida. A versão artesanal de sempre (`Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])`) deixa o temporizador vazando toda vez que a tarefa termina primeiro. No Node isso mantém o processo vivo pelo prazo inteiro; nos testes deixa um temporizador solto disparando dentro do teste seguinte.

2. **O vencimento não cancela o trabalho.** Uma promessa não pode ser cancelada. `onTimeout` é onde você aborta o fetch, encerra o worker ou fecha a conexão.

3. **`withTimeoutFallback` absorve apenas o prazo.** Uma rejeição de verdade vinda da promessa embrulhada continua se propagando: um vencimento não é um erro, mas um erro continua sendo.

4. **`delay` usa o `setTimeout` puro**, então funciona igual no Node, em Web Workers e no navegador. `window.setTimeout` lançaria fora de um documento.

5. **`deferred` é melhor que uns `let` de fora.** Atribuir os argumentos do executor a variáveis declaradas fora é a alternativa comum; o TypeScript não consegue provar que elas foram atribuídas, e é fácil errar de um jeito sutil.
