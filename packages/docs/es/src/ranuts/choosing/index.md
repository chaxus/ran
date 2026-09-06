---
description: 'Qué utilidad de ranuts elegir: debounce o throttle, once o singleFlight, localStorage o IndexedDB, un puente o un cliente de worker, y cuándo la plataforma ya lo trae.'
---

# Elegir una utilidad

La [referencia de la API](/es/src/ranuts/api) enumera todas las exportaciones. Esta página responde a lo que aquella no puede: **de dos cosas parecidas, cuál quiero y por qué**.

> **Úsala cuando** sepas más o menos lo que necesitas («que esto se ejecute menos», «solo una vez», «guardar esto», «hablar con un worker») pero no qué exportación lo hace.

## Lo primero: ¿no lo trae ya la plataforma?

ranuts no pretende sustituir a la biblioteca estándar. Recurre primero a la plataforma y echa mano de una utilidad cuando esta aporte algo de verdad:

| En vez de…                 | La plataforma ya trae…      | Usa la de ranuts cuando…                                                                                                                                                                    |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloneDeep(value)`         | `structuredClone(value)`    | El valor lleva funciones o cualquier cosa que `structuredClone` rechace: aquella lanza un `DataCloneError`, mientras que `cloneDeep` copia lo que puede y conserva el resto por referencia. |
| `getAllQueryString(url)`   | `new URL(url).searchParams` | Quieres un objeto llano de una sola llamada en vez de un iterador.                                                                                                                          |
| `localStorageGetItem(key)` | `localStorage.getItem(key)` | El código corre además donde no hay almacenamiento o está bloqueado: las envolturas devuelven `''` en lugar de lanzar (modo privado de Safari, SSR, un iframe en zona de arena).            |
| `escapeHtml(str)`          | `textContent = str`         | Estás construyendo una cadena, no un nodo.                                                                                                                                                  |

## Hacer algo con menos frecuencia

«que esto se llame menos» puede querer decir cuatro cosas distintas:

| Lo que quieres…                                                                                    | Usa                | Comportamiento                                                                                |
| -------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| Solo la **última** llamada de una ráfaga (un buscador, un redimensionado)                          | `debounce(fn, ms)` | Se ejecuta `ms` después de que la ráfaga pare. Durante la ráfaga no corre nada.               |
| Un **ritmo constante** durante la ráfaga (la posición del desplazamiento, una lectura de progreso) | `throttle(fn, ms)` | La primera llamada corre al momento; después, como mucho una cada `ms`.                       |
| Que corra **exactamente una vez** en toda su vida (una inicialización, un aviso único)             | `once(fn)`         | La primera llamada evalúa; todas las siguientes devuelven ese mismo resultado.                |
| Que quienes llamen a la vez **compartan una sola petición en curso**                               | `singleFlight(fn)` | La versión asíncrona de once: mientras una llamada está pendiente, las demás se suben a ella. |

**`memoize` es el antiguo nombre de `once`** y hace exactamente lo mismo: no guarda un resultado por argumento, que es lo que el nombre da a entender. En código nuevo, escribe `once`.

La diferencia que cuenta: con `debounce` en un manejador de teclas no se ejecuta nada mientras la persona escribe; con `throttle` algo se ejecuta todo el rato, solo que no en cada tecla. Una sugerencia de búsqueda quiere `debounce`; un contador de «caracteres restantes» quiere `throttle`.

## Llevar el trabajo asíncrono con riendas

| Lo que quieres…                                                                      | Usa                                          |
| ------------------------------------------------------------------------------------ | -------------------------------------------- |
| Correr muchas tareas, pero solo _n_ a la vez                                         | `new QuestQueue({ simultaneous: n })`        |
| Desistir de una promesa que tarda demasiado                                          | `withTimeout(promise, ms)`                   |
| …y seguir con un valor por defecto en vez de lanzar                                  | `withTimeoutFallback(promise, ms, fallback)` |
| Una promesa que resuelves desde otro sitio por completo                              | `deferred()`                                 |
| Encadenar pasos asíncronos al estilo de Koa, cada uno capaz de envolver al siguiente | `compose(middleware)`                        |

`Promise.all` es lo acertado cuando quieres _todas_ a la vez; `QuestQueue` lo es cuando «todas a la vez» abriría sesenta conexiones. `withTimeout` rechaza: acompáñalo de un `catch`, o usa la variante con valor de reserva cuando para ti agotar el tiempo no sea un error.

## Guardar algo

| Duración y tamaño                                              | Usa                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Una cadena pequeña que sobreviva a las recargas                | `localStorageSetItem` / `localStorageGetItem` / `localStorageRemoveItem`   |
| Datos con estructura, muchos registros, o más de unos pocos MB | `new WebDB({ dbName, stores })`: una envoltura de promesas sobre IndexedDB |
| Un valor que pasa **de esta página a la siguiente**            | `createHandoff({ dbName, storeName, key })`                                |

Las envolturas `localStorage*` existen porque las llamadas nativas **lanzan** allí donde el almacenamiento no está disponible (el modo privado de Safari, un iframe en zona de arena, un navegador con los datos del sitio bloqueados), y caerse al leer es un fallo peor que quedarse sin una preferencia. Ellas devuelven `''` y siguen adelante.

`createHandoff` es para el caso en que ninguna de las otras dos encaja: un valor que debe sobrevivir exactamente a una navegación y luego desaparecer.

## Hablar entre contextos

| Entre…                                               | Usa                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Una página y un Web Worker, con petición y respuesta | `new WorkerClient({ create })`: casa cada respuesta con su petición por identificador |
| Dos extremos cualesquiera de `MessagePort`           | `createPortBridge(port)`                                                              |
| Dos ventanas o iframes que tienen que encontrarse    | `acceptPortBridge()` de un lado y el apretón de manos del otro                        |

`WorkerClient` es lo que buscas cuando el worker responde preguntas: sin identificadores de petición, dos llamadas solapadas no pueden saber de quién es la respuesta que llegó. El puente es el nivel de abajo: úsalo cuando el tráfico no sea de petición y respuesta, o cuando el transporte ya exista.

## Trabajar con objetos

| Lo que quieres…                  | Usa                    | Nota                                                                        |
| -------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| Una copia que nadie más comparta | `cloneDeep(value)`     | Se apaña con las referencias circulares y con los tipos nativos habituales. |
| Saber si dos valores son iguales | `isEqual(a, b)`        | Comparación en profundidad, no identidad de referencia.                     |
| Juntar dos objetos               | `merge(a, b)`          | Fusión superficial: ganan las claves de `b`, y `a` queda modificado.        |
| Quitar algunas claves            | `filterObj(obj, keys)` | Devuelve una copia sin las claves indicadas.                                |

## Idioma y texto

- **`resolveLocale({ supported, … })`** decide cuál de _tus_ idiomas usar, siguiendo la cadena de siempre (una elección explícita, el almacenamiento, `navigator.languages`, un valor de reserva). Responde a «qué idioma», no a «qué dice esta cadena».
- **`createI18n` / `useI18n`** ([`ranuts/i18n`](/es/src/ranuts/i18n/)) es el motor de traducción: diccionarios planos de mensajes, interpolación con `{param}` y cambio en caliente.
- **`segmentByRanges`** y **`paginateText`** sirven para maquetar texto: la primera, desplazamientos y resaltados; la segunda, cortar el texto en páginas que quepan en una caja.

Usa `resolveLocale` aunque no uses el motor de i18n: la decisión que toma —respetar el orden completo de `navigator.languages` del lector, no solo el primero— es justo la parte que se hace mal con facilidad.

## Transmitir la respuesta de un modelo

Tres capas, y cada una sirve por sí sola:

1. **[`ranuts/stream`](/es/src/ranuts/stream/)**: interpreta el SSE y luego pliega los incrementos en una instantánea con `createStreamAccumulator()`. Es neutral respecto al proveedor: los incrementos de texto, de razonamiento y de llamadas a herramientas acaban con la misma forma, los emita quien los emita.
2. **[`ranuts/conversation`](/es/src/ranuts/conversation/)**: proyecta un registro de eventos de solo añadidura en nodos dibujables con `createConversationEngine()`. Decide _qué_ es cada fila; no dibuja nada.
3. **[`<r-conversation>`](/es/src/ranui/conversation/)** en ranui: el elemento que dibuja esos nodos, mantiene la vista pegada al fondo y concilia las filas.

Quédate en la capa 1 si solo pintas texto; añade la 2 cuando la transcripción tenga una estructura que merezca proyectarse; añade la 3 cuando quieras el desplazamiento y la conciliación ya resueltos.

## De qué entrada importar

Cada subruta es un barril independiente del que se puede podar lo no usado. Importa de la que sea dueña del símbolo, nunca de una ruta interna del código.

| Importación           | Contiene                                                                        | Dónde corre        |
| --------------------- | ------------------------------------------------------------------------------- | ------------------ |
| `ranuts`              | Barril raíz: las utilidades más la superficie visual                            | navegador + node   |
| `ranuts/utils`        | DOM/BOM, cadenas, objetos, números, color, tiempo, almacenamiento, …            | navegador + node\* |
| `ranuts/node`         | Servidor HTTP, enrutador, WebSocket, fs, flujos, middleware                     | **solo node**      |
| `ranuts/visual`       | El motor de dibujo 2D (Canvas / WebGL / WebGPU)                                 | **solo navegador** |
| `ranuts/i18n`         | El motor de traducción, sin DOM                                                 | navegador + node   |
| `ranuts/sw`           | Estrategias de caché y la mitad del protocolo de precarga que vive en el worker | **service worker** |
| `ranuts/vnode`        | DOM virtual al estilo de Snabbdom                                               | navegador          |
| `ranuts/stream`       | Lectura de SSE, plegado del flujo del modelo, presupuesto de tokens             | navegador + node   |
| `ranuts/conversation` | Del registro de eventos a nodos de conversación dibujables                      | navegador + node   |

\* `ranuts/utils` es ancho: la mayor parte mira al navegador, pero las ayudas puras (cadenas, objetos, números, `compose`, `cloneDeep`, …) corren en cualquier sitio. **No importes `ranuts/node` en código de navegador.** Arrastra `fs`, `http` y `child_process`.

## ¿Sigues con dudas?

Busca en la [referencia de la API](/es/src/ranuts/api): están todas las exportaciones con su firma y una línea de descripción, generadas a partir del código. Si después de leer ambas líneas dos de ellas siguen pareciendo intercambiables, eso es un fallo de documentación que vale la pena [comunicar](https://github.com/chaxus/ran/issues).
