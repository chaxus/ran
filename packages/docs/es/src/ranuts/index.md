---
description: 'ranuts es una biblioteca de utilidades de JavaScript/TypeScript apta para tree-shaking: DOM/BOM, ayudas para cadenas, objetos, números y color, almacenamiento, streaming, un motor de dibujado 2D y un DOM virtual.'
---

# ranuts

Una biblioteca de utilidades para el navegador y para Node, publicada como **puntos de entrada independientes y aptos para tree-shaking**. Importa desde la subruta que contiene lo que necesitas y el resto nunca llega a tu paquete. Todo es TypeScript, y cada exportación está documentada desde el código fuente.

- **npm**: <a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **código**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## Puntos de entrada

| Importación                                           | Contiene                                                                      | Entorno            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| `ranuts`                                              | El barril raíz: la superficie de utils y visual                               | navegador + node   |
| [`ranuts/utils`](/es/src/ranuts/utils/)               | DOM/BOM, cadenas, objetos, números, color, tiempo, almacenamiento, …          | navegador + node\* |
| [`ranuts/node`](/es/src/ranuts/node/)                 | Servidor HTTP, enrutador, WebSocket, fs, streams, middleware                  | **solo node**      |
| [`ranuts/visual`](/es/src/ranuts/visual/)             | Motor de dibujado 2D (Canvas / WebGL / WebGPU)                                | **solo navegador** |
| [`ranuts/i18n`](/es/src/ranuts/i18n/)                 | Motor de traducción: diccionarios planos, cambio en caliente                  | navegador + node   |
| [`ranuts/sw`](/es/src/ranuts/sw/)                     | Estrategias de caché y la mitad del protocolo de precaché que va en el worker | **service worker** |
| [`ranuts/vnode`](/es/src/ranuts/vnode/)               | DOM virtual al estilo de Snabbdom                                             | navegador          |
| [`ranuts/stream`](/es/src/ranuts/stream/)             | Análisis de SSE, plegado de flujos de modelos, presupuesto de tokens          | navegador + node   |
| [`ranuts/conversation`](/es/src/ranuts/conversation/) | Registro de eventos → nodos de conversación dibujables                        | navegador + node   |

\* `ranuts/utils` es amplio: casi todo apunta al navegador, pero las ayudas puras corren en cualquier sitio. **No importes `ranuts/node` en código de navegador.** Arrastra `fs` / `http` / `child_process`.

## Qué hay dentro

**Funcional**: [debounce](/es/src/ranuts/utils/debounce) · [throttle](/es/src/ranuts/utils/throttle) ·
[once / singleFlight](/es/src/ranuts/utils/memoize) ·
[QuestQueue](/es/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/es/src/ranuts/utils/with_timeout) ·
[compose](/es/src/ranuts/utils/compose)

**Datos**: [cloneDeep](/es/src/ranuts/utils/clone_deep) · [isEqual](/es/src/ranuts/utils/is_equal) ·
[merge](/es/src/ranuts/utils/merge) · [filterObj](/es/src/ranuts/utils/filter_obj) ·
[dar formato a números y analizarlos](/es/src/ranuts/utils/parse_number) ·
[conversión y mezcla de color](/es/src/ranuts/utils/color)

**Texto**: [md5](/es/src/ranuts/utils/md5) · [truncate](/es/src/ranuts/utils/truncate) ·
[detectLanguage](/es/src/ranuts/utils/detect_language) ·
[resolveLocale](/es/src/ranuts/utils/resolve_locale) ·
[segmentByRanges](/es/src/ranuts/utils/segment) · [paginate](/es/src/ranuts/utils/paginate) ·
[escapeHtml](/es/src/ranuts/utils/escape_html)

**Navegador**: [almacenamiento](/es/src/ranuts/utils/local_storage) ·
[IndexedDB](/es/src/ranuts/utils/web_db) · [cliente de worker](/es/src/ranuts/utils/worker_client) ·
[puente de postMessage](/es/src/ranuts/bridge/) · [prefetch](/es/src/ranuts/utils/prefetch) ·
[detección de dispositivo](/es/src/ranuts/utils/current_device) ·
[rendimiento](/es/src/ranuts/utils/get_performance) · [ZIP](/es/src/ranuts/utils/zip) ·
[grabación de audio](/es/src/ranuts/utils/audio_recorder) ·
[voz a texto](/es/src/ranuts/utils/speech)

**IA y chat**: [stream](/es/src/ranuts/stream/) · [conversation](/es/src/ranuts/conversation/) ·
[i18n](/es/src/ranuts/i18n/)

**Dibujado**: [motor 2D](/es/src/ranuts/visual/) · [DOM virtual](/es/src/ranuts/vnode/) ·
[ayudas para canvas](/es/src/ranuts/utils/canvas) · [tween](/es/src/ranuts/utils/tween)

**Node**: [servidor HTTP y enrutador](/es/src/ranuts/node/) ·
[operaciones con archivos](/es/src/ranuts/file/write_file) ·
[tipos MIME](/es/src/ranuts/mime_type/mime_type)

Esto es una selección. La [referencia de la API](/es/src/ranuts/api) tiene **todas** las exportaciones con su firma y su descripción, generadas desde el código para que no puedan quedarse atrás.

## A dónde ir después

| Si quieres…                                               | Lee                                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Averiguar si una función existe, y con qué firma          | [Referencia de la API](/es/src/ranuts/api)                                      |
| Decidir entre dos utilidades parecidas                    | [Elegir una utilidad](/es/src/ranuts/choosing/)                                 |
| Curiosear por categorías                                  | [Índice de utilidades](/es/src/ranuts/utils/)                                   |
| Dibujar la respuesta de un modelo que llega por streaming | [stream](/es/src/ranuts/stream/) → [conversation](/es/src/ranuts/conversation/) |
| Construir interfaz encima                                 | [ranui](/es/src/ranui/)                                                         |

Los dos paquetes incluyen un `CLAUDE.md` dentro del tarball de npm: orientación para agentes de código, legible directamente desde `node_modules` y sin acceso a la red.
