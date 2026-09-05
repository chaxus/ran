# ranuts/stream — Respuestas de modelos por streaming

Análisis de Server-Sent Events, un vocabulario neutral respecto al proveedor para una respuesta de modelo transmitida, y un plegado de ese vocabulario en bloques dibujables.

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**Es un punto de entrada propio.** Nada de lo que hay aquí toca el DOM, así que una respuesta se puede plegar dentro de una prueba o en un servidor; importarlo desde `ranuts/utils` arrastraría módulos orientados al DOM.

**Aquí no vive ningún proveedor.** Toda API de chat convencional transmite las mismas cuatro cosas (texto del asistente, texto de razonamiento facturado aparte, llamadas a herramientas, un recuento de tokens), pero cada una las nombra y las entrelaza a su manera. Trasladar el evento de un proveedor a `StreamChunk` es el único paso específico del proveedor, y se queda contigo: cocinar un formato de cable dentro dejaría las otras dos capas inservibles para cualquier otro.

## Tres capas

| Capa                        | Qué hace                                                  |
| --------------------------- | --------------------------------------------------------- |
| `parseEventStream(source)`  | bytes → `ServerSentEvent`. Solo transporte.               |
| `StreamChunk`               | el vocabulario en el que llega una respuesta.             |
| `createStreamAccumulator()` | pliega los trozos en bloques que una vista puede dibujar. |

`mapEventStream(source, map)` une las dos primeras: recorre los eventos y deja que tu correspondencia devuelva cero o más trozos por cada uno. Devolver `[]` es la forma de tirar un keep-alive o un centinela `[DONE]`.

## El vocabulario

```ts
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
```

- **`index` correlaciona los deltas entrelazados.** El razonamiento y el texto llegan mezclados y varias llamadas a herramientas se abren a la vez, así que el orden de llegada no agrupa nada.
- **`block-end` trae el bloque ya montado**, y gana sobre lo que construyeron los deltas. Quien solo quiera bloques terminados puede ignorar cada delta.
- **Los argumentos de las herramientas siguen siendo texto JSON crudo.** Medio documento JSON no es un valor. Analiza `arguments` una sola vez, después de `finish`: analizar `argumentsDelta` a media transmisión es justo donde suelen romperse las llamadas a herramientas por streaming.
- **`block-start` es opcional.** Varios proveedores abren un bloque con su primer delta, así que el acumulador abre uno cuando hace falta. No lo exijas tampoco en tu correspondencia.
- **`finish` termina.** `usage` llega antes; después no viene nada.

## Plegar una respuesta

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // los argumentos siguen siendo texto: analízalos aquí
```

`snapshot()` es inmutable: una instantánea tomada a media transmisión conserva los valores que tenía, así que una vista puede sostener una sin que un `push` posterior se la cambie por debajo. `text()` y `reasoning()` concatenan sus bloques en orden de índice, y `reset()` deja la instancia limpia para otra respuesta.

## De qué se ocupa el analizador de SSE

Las reglas de trama son pocas y casi nunca se implementan del todo. `parseEventStream` cubre:

- un límite de trozo **en cualquier sitio**, incluso dentro de un carácter multibyte y entre las dos mitades de un `\r\n`
- campos `data:` repetidos, unidos con `\n`
- exactamente un espacio retirado tras los dos puntos
- líneas de comentario `:`, que es como los servidores mantienen viva una conexión
- un BOM al principio
- un bloque final que el servidor nunca cerró con una línea en blanco
- un `ReadableStream` sin `Symbol.asyncIterator`

Acepta cualquier `AsyncIterable<Uint8Array>` además de un `ReadableStream`, así que una prueba puede pasarle rodajas de bytes sin red de por medio.

## Una correspondencia trabajada

`packages/im`, en este repositorio, es un consumidor que funciona: una ruta SSE compatible con OpenAI, la correspondencia hacia `StreamChunk` y una vista que sostiene una instantánea en vez de concatenar deltas por su cuenta. Su prueba de ida y vuelta lleva los bytes del servidor real a través del cliente real con varios tamaños de trozo, así que las dos mitades no pueden separarse.

## Véase también

- [ranuts/conversation](../conversation/): proyecta los eventos resultantes en nodos dibujables
- [`<r-conversation>`](../../ranui/conversation/): dibuja esos nodos
