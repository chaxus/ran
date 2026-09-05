# ranuts/sw — Service Worker

Piezas para construir un Service Worker: las dos estrategias de caché que todo SW acaba escribiendo, y la mitad del protocolo de precaché que va en el worker, cuya mitad de página vive en [prefetch](../utils/prefetch).

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**Es un punto de entrada propio.** Este código corre en un `ServiceWorkerGlobalScope`, donde no existen `window` ni `document`; importarlo desde `ranuts/utils` arrastraría módulos orientados al DOM hacia el paquete del worker.

**Da por hecho un Service Worker empaquetado.** Un `sw.js` escrito a mano y servido como archivo estático no puede importar de `node_modules`: o lo empaquetas, o copias las piezas que necesites.

## API

| Función                            | Descripción                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `cacheFirst(request, options)`     | Sirve la copia en caché y, si no la hay, la busca y la guarda        |
| `networkFirst(request, options)`   | Busca en la red y refresca la caché; sin conexión, recurre a ella    |
| `precache(cacheName, urls, opts?)` | Llena una caché, saltándose lo que ya esté dentro                    |
| `dropCachesExcept(keep, opts?)`    | Borra todas las demás cachés; devuelve los nombres borrados          |
| `servePrecache(options)`           | Responde a `prefetchUrls({ serviceWorkerMessage })`; devuelve `stop` |

Opciones de estrategia: `{ cacheName, shouldCache?, scope? }`. `shouldCache` es por defecto «cualquier GET respondido con 200»; `scope` sustituye al global, para pruebas o para un worker que no lo sea.

## Ejemplo

```js
// sw.ts
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';

const ASSETS = `assets_${BUILD_ID}`;
const MODELS = 'models';

self.addEventListener('install', (e) => e.waitUntil(precache(ASSETS, PRECACHE_URLS)));
self.addEventListener('activate', (e) => e.waitUntil(dropCachesExcept([ASSETS, MODELS])));

self.addEventListener('fetch', (event) => {
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith(
    isNavigation
      ? networkFirst(event.request, { cacheName: ASSETS })
      : cacheFirst(event.request, { cacheName: ASSETS }),
  );
});

// El otro extremo de prefetchUrls({ serviceWorkerMessage: 'precache-models' })
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## Notas

1. **`cacheFirst` para recursos inmutables con hash de contenido**: scripts, estilos, tipografías, pesos de modelos. **`networkFirst` para todo lo que deba reflejar un despliegue de inmediato**: navegaciones HTML, un manifiesto.
2. **Ninguna de las dos estrategias rechaza.** Un fallo de red sin nada en caché se resuelve en un 408, así que un `respondWith` nunca lanza.
3. **La respuesta se clona de forma síncrona, antes de leer el cuerpo.** Esperar primero a `caches.open()` y clonar después es el fallo clásico: para entonces el cuerpo puede estar ya viajando hacia la página, y `clone()` lanza.
4. **`precache` es idempotente y tolerante URL a URL**: un solo 404 en la lista no debe abortar una instalación.
5. **Descargar dentro del SW es justamente el sentido de `servePrecache`.** El trabajo va envuelto en `event.waitUntil`, así que sobrevive a las navegaciones; una descarga del lado de la página se aborta en cuanto la persona se va, y un recurso grande vuelve a empezar de cero en la siguiente visita.
