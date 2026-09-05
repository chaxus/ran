# QuestQueue

Uma fila de tarefas assíncronas com concorrência limitada. Rodam ao mesmo tempo no máximo `simultaneous` tarefas; as demais esperam, e cada vez que uma termina abre uma vaga. Use para uploads ou requisições em lote: qualquer coisa que você não possa disparar de uma vez só.

## API

### new QuestQueue({ simultaneous })

| Parâmetro      | Descrição                                | Tipo     | Padrão |
| -------------- | ---------------------------------------- | -------- | ------ |
| `simultaneous` | Concorrência máxima; `<= 0` equivale a 1 | `number` | `1`    |

| Membro                                      | Descrição                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| `add(task)`                                 | Enfileira uma tarefa e devolve **a promessa dela**. Começa quando houver vaga |
| `allSettled(tasks)`                         | Enfileira um lote; resolve como `Promise.allSettled`, na ordem de entrada     |
| `onIdle()`                                  | Espera a fila esvaziar                                                        |
| `clear()`                                   | Descarta tudo que ainda não começou (as tarefas em andamento seguem)          |
| `running` / `pending` / `executed` / `idle` | Contadores ao vivo                                                            |

## Exemplo

```js
import { QuestQueue } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 3 });
const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));

// Ou dispare e esqueça; depois espere por tudo, falhas incluídas
urls.forEach((url) => queue.add(() => fetch(url)).catch(report));
await queue.onIdle();
```

## Notas

1. **FIFO**: as tarefas rodam na ordem em que foram acrescentadas.
2. **Uma falha não trava a fila.** Cada tarefa rejeita a própria promessa e a seguinte começa do mesmo jeito.
3. **Uma tarefa que lança de forma síncrona também é capturada**, então ela não escapa de `add()` nem deixa o contador de concorrência preso.
4. **`allSettled` mantém a ordem de entrada** e relata cada resultado separadamente.

::: warning Reescrito na 0.3
A implementação anterior era inutilizável. `add()` só enfileirava (era preciso chamar `running()` na mão); desempilhava em LIFO; uma mesma promessa carregava os resultados de tarefas alheias; e `allSettled` escrevia os resultados a partir do índice 1 e resolvia na primeira tarefa. A opção `total` do construtor sumiu: use `onIdle()` ou `allSettled(tasks)` no lugar.
:::
