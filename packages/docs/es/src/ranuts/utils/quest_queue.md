# QuestQueue

Una cola de tareas asíncronas con la concurrencia limitada. A la vez corren como mucho `simultaneous` tareas; las demás esperan, y cada vez que una termina se libera un hueco. Úsala para subidas o peticiones en lote: cualquier cosa que no puedas lanzar toda de golpe.

## API

### new QuestQueue({ simultaneous })

| Parámetro      | Descripción                              | Tipo     | Por defecto |
| -------------- | ---------------------------------------- | -------- | ----------- |
| `simultaneous` | Concurrencia máxima; `<= 0` equivale a 1 | `number` | `1`         |

| Miembro                                     | Descripción                                                                               |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `add(task)`                                 | Encola una tarea y devuelve **su propia** promesa de resultado. Arranca cuando haya hueco |
| `allSettled(tasks)`                         | Encola un lote; se resuelve como `Promise.allSettled`, en el orden de entrada             |
| `onIdle()`                                  | Espera a que la cola se vacíe                                                             |
| `clear()`                                   | Descarta todo lo que no haya arrancado (las tareas en curso siguen)                       |
| `running` / `pending` / `executed` / `idle` | Contadores en vivo                                                                        |

## Ejemplo

```js
import { QuestQueue } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 3 });
const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));

// O lánzalas y olvídate; luego espera a todo, fallos incluidos
urls.forEach((url) => queue.add(() => fetch(url)).catch(report));
await queue.onIdle();
```

## Notas

1. **FIFO**: las tareas corren en el orden en que se añadieron.
2. **Un fallo no atasca la cola.** Cada tarea rechaza su propia promesa y la siguiente arranca igual.
3. **Una tarea que lanza de forma síncrona también se captura**, así que no se escapa de `add()` ni deja bloqueado el contador de concurrencia.
4. **`allSettled` conserva el orden de entrada** e informa de cada resultado por separado.

::: warning Reescrito en la 0.3
La implementación anterior era inservible. `add()` solo encolaba (había que llamar a `running()` a mano); sacaba en orden LIFO; una misma promesa cargaba con los resultados de tareas ajenas; y `allSettled` escribía los resultados a partir del índice 1 y se resolvía con la primera tarea. La opción `total` del constructor ha desaparecido: usa `onIdle()` o `allSettled(tasks)` en su lugar.
:::
