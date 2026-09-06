# WorkerClient

Petición y respuesta sobre un Web Worker. Un worker a secas solo sabe «enviar un mensaje» y «recibir un mensaje»: manda dos tareas a la vez y volverán dos mensajes sin manera de saber cuál corresponde a cuál. `WorkerClient` sella cada petición con un identificador y encamina cada respuesta a la promesa que le toca.

## API

### new WorkerClient(options)

| Parámetro         | Descripción                                           | Tipo                | Por defecto               |
| ----------------- | ----------------------------------------------------- | ------------------- | ------------------------- |
| `create`          | Cómo se construye el worker                           | `() => Worker`      | Obligatorio               |
| `isProgress`      | ¿Es un mensaje de progreso? (no resuelve la petición) | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | Saca el contenido del progreso                        | `(res) => Progress` | `res.progress`            |
| `isError`         | ¿Es un mensaje de error?                              | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | El texto del error                                    | `(res) => string`   | `res.message`             |
| `timeout`         | Plazo por petición (ms); solo rechaza esa petición    | `number`            | ninguno                   |

| Miembro                                 | Descripción                                           |
| --------------------------------------- | ----------------------------------------------------- |
| `send(request, onProgress?, transfer?)` | Envía una petición y espera su respuesta              |
| `dispose()`                             | Termina el worker y rechaza todo lo que esté en curso |
| `active`                                | Si el worker ya se ha creado                          |
| `pendingCount`                          | Cuántas peticiones hay en curso                       |

### serveWorker(handler, options?) — el lado del worker

La contraparte que corre _dentro_ del worker. Lee el `operationId` de cada petición, espera a tu manejador y devuelve la respuesta con ese mismo identificador.

| Parámetro            | Descripción                                                                                             | Tipo       |
| -------------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| `handler`            | `(request, { progress }) => Response \| Promise<Response>`                                              | `Function` |
| `options.scope`      | Dónde escuchar. Por defecto `self`; cámbialo para un puerto o una prueba                                | object     |
| `options.resultType` | El `type` de la respuesta cuando el manejador devuelve algo que no es un objeto. Por defecto `'result'` | `string`   |

Devuelve una función `stop` que quita el escuchador.

## Ejemplo

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

Y el lado del worker:

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

1. **El worker se crea de forma perezosa**, en el primer `send`: el trabajo pesado no debería arrancar al cargar la página.
2. **Los mensajes de progreso no resuelven la petición**, de modo que una sola petición puede ir emitiendo muchas actualizaciones y aun así resolverse una vez al final.
3. **Si el worker revienta, se rechazan todas las peticiones en curso.** Un error sin capturar dentro de un worker no lleva `operationId`, así que no se puede atribuir a una petición concreta.
4. **`dispose()` termina y rechaza**; el siguiente `send` vuelve a levantar el worker.
5. **Un vencimiento rechaza solo esa petición** y deja el worker con vida.
6. **Usa `transfer` para búferes grandes** y así traspasar la propiedad en vez de clonar una copia.
7. **`serveWorker` también captura las excepciones síncronas.** Una excepción síncrona dentro de `onmessage` se escapa al manejador de errores del worker, y por ese camino no viaja ningún `operationId`, con lo que el cliente solo podría hacer fallar _todas_ las peticiones en curso en lugar de la que de verdad se rompió.
8. **Las dos mitades vienen juntas a propósito.** Escribir a mano el lado del worker es justo donde el eco del identificador y el sobre del error empiezan a divergir de un proyecto a otro.
