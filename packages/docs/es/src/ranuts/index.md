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

| Importación                                       | Contiene                                                                      | Entorno            |
| ------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| `ranuts`                                          | El barril raíz: la superficie de utils y visual                               | navegador + node   |
| [`ranuts/utils`](/es/ranuts/utils/)               | DOM/BOM, cadenas, objetos, números, color, tiempo, almacenamiento, …          | navegador + node   |
| [`ranuts/visual`](/es/ranuts/visual/)             | Motor de dibujado 2D (Canvas / WebGL / WebGPU)                                | **solo navegador** |
| [`ranuts/i18n`](/es/ranuts/i18n/)                 | Motor de traducción: diccionarios planos, cambio en caliente                  | navegador + node   |
| [`ranuts/sw`](/es/ranuts/sw/)                     | Estrategias de caché y la mitad del protocolo de precaché que va en el worker | **service worker** |
| [`ranuts/vnode`](/es/ranuts/vnode/)               | DOM virtual al estilo de Snabbdom                                             | navegador          |
| [`ranuts/stream`](/es/ranuts/stream/)             | Análisis de SSE, plegado de flujos de modelos, presupuesto de tokens          | navegador + node   |
| [`ranuts/conversation`](/es/ranuts/conversation/) | Registro de eventos → nodos de conversación dibujables                        | navegador + node   |

## Qué hay dentro

**Funcional**: [debounce](/es/ranuts/utils/debounce) · [throttle](/es/ranuts/utils/throttle) ·
[once / singleFlight](/es/ranuts/utils/memoize) ·
[QuestQueue](/es/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/es/ranuts/utils/with_timeout) ·
[compose](/es/ranuts/utils/compose)

**Datos**: [cloneDeep](/es/ranuts/utils/clone_deep) · [isEqual](/es/ranuts/utils/is_equal) ·
[merge](/es/ranuts/utils/merge) · [filterObj](/es/ranuts/utils/filter_obj) ·
[dar formato a números y analizarlos](/es/ranuts/utils/parse_number) ·
[conversión y mezcla de color](/es/ranuts/utils/color)

**Texto**: [truncate](/es/ranuts/utils/truncate) ·
[detectLanguage](/es/ranuts/utils/detect_language) ·
[resolveLocale](/es/ranuts/utils/resolve_locale) ·
[segmentByRanges](/es/ranuts/utils/segment) · [paginate](/es/ranuts/utils/paginate) ·
[escapeHtml](/es/ranuts/utils/escape_html)

**Navegador**: [almacenamiento](/es/ranuts/utils/local_storage) ·
[IndexedDB](/es/ranuts/utils/web_db) · [cliente de worker](/es/ranuts/utils/worker_client) ·
[puente de postMessage](/es/ranuts/bridge/) · [prefetch](/es/ranuts/utils/prefetch) ·
[detección de dispositivo](/es/ranuts/utils/current_device) ·
[rendimiento](/es/ranuts/utils/get_performance) · [ZIP](/es/ranuts/utils/zip) ·
[grabación de audio](/es/ranuts/utils/audio_recorder) ·
[voz a texto](/es/ranuts/utils/speech)

**IA y chat**: [stream](/es/ranuts/stream/) · [conversation](/es/ranuts/conversation/) ·
[i18n](/es/ranuts/i18n/)

**Dibujado**: [motor 2D](/es/ranuts/visual/) · [DOM virtual](/es/ranuts/vnode/) ·
[ayudas para canvas](/es/ranuts/utils/canvas) · [tween](/es/ranuts/utils/tween)

Esto es una selección. La [referencia de la API](/es/ranuts/api) tiene **todas** las exportaciones con su firma y su descripción, generadas desde el código para que no puedan quedarse atrás.

## A dónde ir después

| Si quieres…                                               | Lee                                                                     |
| --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Averiguar si una función existe, y con qué firma          | [Referencia de la API](/es/ranuts/api)                                  |
| Decidir entre dos utilidades parecidas                    | [Elegir una utilidad](/es/ranuts/choosing/)                             |
| Curiosear por categorías                                  | [Índice de utilidades](/es/ranuts/utils/)                               |
| Dibujar la respuesta de un modelo que llega por streaming | [stream](/es/ranuts/stream/) → [conversation](/es/ranuts/conversation/) |
| Construir interfaz encima                                 | [ranui](/es/ranui/)                                                     |

Los dos paquetes incluyen un `CLAUDE.md` dentro del tarball de npm: orientación para agentes de código, legible directamente desde `node_modules` y sin acceso a la red.
