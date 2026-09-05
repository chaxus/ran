# debounce

Antirrebote: cuando una función se dispara muchas veces seguidas, se ejecuta **solo cuando los disparos cesan** durante `ms` milisegundos. Úsalo cuando lo único que importa es el estado final: buscar mientras se escribe, redimensionar la ventana, guardar solo.

Si necesitas también los valores intermedios, usa [throttle](./throttle).

## API

### debounce(fn, ms?)

#### Parámetros

| Parámetro | Descripción                             | Tipo       | Por defecto |
| --------- | --------------------------------------- | ---------- | ----------- |
| `fn`      | Función a la que aplicar el antirrebote | `Function` | Obligatorio |
| `ms`      | Tiempo de calma (ms)                    | `number`   | `500`       |

#### Devuelve

Una función con antirrebote que conserva el `this` del punto de llamada y los **últimos** argumentos, además de:

| Miembro     | Descripción                                                    | Tipo            |
| ----------- | -------------------------------------------------------------- | --------------- |
| `cancel()`  | Descarta la llamada pendiente                                  | `() => void`    |
| `flush()`   | Ejecuta ya la llamada pendiente (antes de enviar, por ejemplo) | `() => void`    |
| `pending()` | Si hay una llamada esperando                                   | `() => boolean` |

## Ejemplo

```js
import { debounce } from 'ranuts';

const save = debounce((draft) => api.save(draft), 800);
input.addEventListener('input', (e) => save(e.target.value));

form.addEventListener('submit', () => save.flush()); // que no se pierda la última tecla
onUnmount(() => save.cancel());
```

## Notas

1. **Solo se ejecuta la última llamada**, con los argumentos de esa última llamada.
2. **El `this` viene del punto de llamada**: `obj.handler()` ve `obj`.
3. **Llama siempre a `cancel()` al desmontar**; si no, el temporizador pendiente dispara sobre un contexto ya destruido.
4. **Tipado completo**: los tipos de los argumentos y del retorno se infieren de `fn`.
