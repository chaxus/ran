# prefetch

Deja un recurso pesado ya calentito en la caché del navegador antes de que haga falta, sin gastar los datos de quien navega a sus espaldas.

El dato clave: si un Service Worker atiende los GET del mismo origen dando prioridad a la caché, basta con hacer `fetch` de una URL una vez para que quede en CacheStorage. Cualquier petición posterior a esa misma URL da en la caché y funciona sin conexión. La precarga, por tanto, no necesita ningún descargador especial: solo hay que traerse los bytes.

## API

| Función                            | Descripción                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `whenIdle(callback, options?)`     | Ejecuta cuando el navegador está ocioso; devuelve una función para cancelar |
| `networkAllowsDownload(options?)`  | ¿Podemos gastar ahora mismo los datos de quien navega?                      |
| `isUrlCached(url)`                 | ¿Está ya esta URL en CacheStorage?                                          |
| `prefetchUrl(url)`                 | Trae una URL a la caché; se la salta si ya está y falla en silencio         |
| `prefetchUrls(urls, options?)`     | Lo mismo para una lista, **una detrás de otra**                             |
| `prefetchWhenIdle(urls, options?)` | Las tres juntas: permiso → ocio → precarga en serie. No bloquea             |

### Opciones

| Opción                 | Se aplica a    | Descripción                                                                           | Por defecto         |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------- | ------------------- |
| `timeout`              | `whenIdle`     | Espera máxima por `requestIdleCallback` (ms)                                          | `8000`              |
| `fallbackDelay`        | `whenIdle`     | Espera cuando no existe `requestIdleCallback` (ms)                                    | `2500`              |
| `optOutKey`            | permiso de red | Clave de localStorage; cualquier valor significa que la persona desactivó la precarga | —                   |
| `slowTypes`            | permiso de red | Valores de `effectiveType` que se dan por demasiado lentos                            | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls` | El `type` del mensaje con que se pasa la lista a un SW que controle la página         | —                   |

## Ejemplo

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// Más tarde: ¿ya está en local? (mira el archivo que termina de bajar el último)
const ready = await isUrlCached(modelFiles.at(-1));
```

## Notas

1. **La precarga gasta datos ajenos.** `networkAllowsDownload` se niega con el ahorro de datos activado, con una conexión lenta o cuando la persona ha dicho que no.
2. **Lo desconocido cuenta como permitido.** La Network Information API no existe en Safari ni en Firefox; no poder leer la conexión no es motivo para no precargar nunca.
3. **Las listas se traen una detrás de otra**: saturar el tubo ralentizaría la página que la persona está mirando de verdad.
4. **Mejor por la vía del Service Worker.** Un SW que use `event.waitUntil` sigue descargando aunque se cambie de página; un fetch del hilo principal muere en cuanto la persona se va. Sin un SW que controle la página, se recurre a esa vía automáticamente.
5. **Comprueba el archivo más grande** al mirar si un conjunto está en caché, o una descarga a medias parecerá completa.
6. **Que los fallos sean silenciosos es a propósito**: una precarga fallida solo significa que la carga de verdad descargará más tarde.
