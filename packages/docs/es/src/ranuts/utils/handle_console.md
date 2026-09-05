# Hooks de instrumentación

Engánchate a `console`, `fetch`, `XMLHttpRequest`, los clics y los errores sin capturar, ya sea para un backend de monitorización, una capa de depuración o unas pruebas.

**Todos devuelven una función para desmontarlos. Guárdala y llámala.** Instrumentar un global sin manera de deshacerlo significa que las pruebas no pueden limpiar lo que ensucian, y que cada recarga en caliente vuelve a parchear un global ya parcheado hasta que cada llamada atraviesa una docena de envoltorios y cada evento se informa N veces.

## API

| Function | Instrumenta | Devuelve |
| ---------------------------- | ------------------------------------ | ------------- |
| `handleConsole(hook)` | `console.log/info/warn/error/assert` | `restore` |
| `handleFetchHook(options)` | `window.fetch` | `restore` |
| `handleXhrHook(options)` | `XMLHttpRequest#open` / `#send` | `restore` |
| `handleError(hook)` | `error` y `unhandledrejection` | `unsubscribe` |
| `handleClick(hook)` | Clics en el documento (fase de captura) | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | Cualquier propiedad de cualquier objeto | `restore` |

`handleFetchHook` y `handleXhrHook` reciben `{ requestHook, responseHook, errorHook }`.

## Ejemplo

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// al desmontar (recarga en caliente, cambio de ruta, limpieza de pruebas)
teardown.forEach((off) => off());
```

## Notas

1. **El comportamiento original se conserva.** Las respuestas pasan de largo, los errores se vuelven a lanzar y la consola sigue imprimiendo.
2. **El `restore` de `replaceOld` solo deshace su propio parche.** Si después otra capa parcheó por encima, restaurar a ciegas la desinstalaría en silencio, así que en ese caso se abstiene.
3. **`handleXhrHook` parchea el prototipo**, de modo que vale para todas las instancias; sus escuchadores se registran con `{ once: true }` para que un objeto XHR reutilizado no los acumule.
4. **No informes de la salida de consola a un backend que escriba en consola**: el hook se dispara con la misma llamada que él produce. (Por eso el canal `console` de `Monitor` viene apagado.)

::: warning Cambiado en la 0.3
Antes todos devolvían `void`, sin manera de desinstalarlos. Ahora devuelven una función para desmontarlos; el código que ya los usaba sigue funcionando y solo tiene que empezar a aprovecharla.
:::
