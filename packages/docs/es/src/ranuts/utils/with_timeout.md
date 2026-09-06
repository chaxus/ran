# withTimeout / deferred

Las piezas de promesas que JavaScript no trae: una promesa que se resuelve desde fuera y una espera con límite.

## API

| Función | Descripción |
| -------------------------------------------------------- | -------------------------------------------------------- |
| `deferred<T>()` | `{ promise, resolve, reject }`, para resolverla desde fuera |
| `withTimeout(promise, ms, options?)` | Rechaza con `TimeoutError` si no se ha resuelto en `ms` |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | Resuelve con `fallback` en vez de rechazar |
| `delay(ms)` | Se resuelve al cabo de `ms` |
| `TimeoutError` | La clase de error que lanza `withTimeout` |

### `withTimeout` options

| Opción | Descripción | Por defecto |
| ----------- | ----------------------------------------------------------- | ---------------------------------- |
| `message` | Mensaje del error | `operation timed out after {ms}ms` |
| `onTimeout` | Se llama al vencer el plazo, para desmontar la operación | — |

## Ejemplo

### Poner límite a una petición y abortarla al vencer

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### Degradar en vez de fallar

```js
import { withTimeoutFallback } from 'ranuts';

// Un guardado lento debe devolver el archivo original, no romper el flujo.
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### Resolver una promesa desde un callback

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### Encadenar operaciones con un plazo

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## Notas

1. **El temporizador siempre se limpia**, también cuando la tarea gana la carrera. La versión artesanal de siempre (`Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])`) se deja el temporizador colgando cada vez que la tarea termina primero. En Node eso mantiene vivo el proceso durante todo el plazo; en las pruebas deja un temporizador suelto que dispara dentro de la prueba siguiente.

2. **Un vencimiento no cancela el trabajo.** Una promesa no se puede cancelar. `onTimeout` es donde abortas el fetch, terminas el worker o cierras la conexión.

3. **`withTimeoutFallback` solo absorbe el plazo.** Un rechazo de verdad de la promesa envuelta sigue propagándose: un vencimiento no es un error, pero un error sí lo sigue siendo.

4. **`delay` usa el `setTimeout` a secas**, así que funciona igual en Node, en Web Workers y en el navegador. `window.setTimeout` lanzaría fuera de un documento.

5. **`deferred` es mejor que unos `let` de fuera.** Asignar los argumentos del ejecutor a variables declaradas fuera es la alternativa habitual; TypeScript no puede demostrar que quedan asignadas, y es fácil equivocarse de forma sutil.
