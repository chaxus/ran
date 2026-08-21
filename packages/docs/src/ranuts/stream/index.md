# ranuts/stream — Streaming model responses

Server-Sent Events parsing, a provider-neutral vocabulary for one streamed model response, and
a fold from that vocabulary into renderable blocks.

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**Its own entry point.** Nothing here touches the DOM, so a response can be folded in a test or
on a server; importing it from `ranuts/utils` would drag DOM-facing modules along.

**No vendor lives here.** Every mainstream chat completion API streams the same four things —
assistant text, separately-billed reasoning text, tool calls, a token count — but each names and
interleaves them differently. Mapping one provider's event onto `StreamChunk` is the only
vendor-specific step, and it stays with you: baking one wire format in would make the other two
layers unusable for anyone else.

## Three layers

| Layer                       | What it does                                |
| --------------------------- | ------------------------------------------- |
| `parseEventStream(source)`  | bytes → `ServerSentEvent`. Transport only.  |
| `StreamChunk`               | the vocabulary one response streams in.     |
| `createStreamAccumulator()` | folds chunks into blocks a view can render. |

`mapEventStream(source, map)` joins the first two: it walks the events and lets your mapping
return zero or more chunks each. Returning `[]` is how a keep-alive or a `[DONE]` sentinel is
dropped.

## The vocabulary

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

- **`index` correlates interleaved deltas.** Reasoning and text arrive interleaved and several
  tool calls open at once, so arrival order is not grouping.
- **`block-end` carries the assembled block**, and wins over what the deltas built. A consumer
  that only wants finished blocks can ignore every delta.
- **Tool arguments stay raw JSON text.** Half a JSON document is not a value. Parse
  `arguments` once, after `finish` — parsing `argumentsDelta` mid-stream is where streaming tool
  calls usually break.
- **`block-start` is optional.** Several providers open a block with its first delta, so the
  accumulator opens one on demand. Do not require it in your mapping either.
- **`finish` terminates.** `usage` arrives before it; nothing follows it.

## Folding a response

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // arguments are still text — parse them here
```

`snapshot()` is immutable: a snapshot taken mid-stream keeps the values it had, so a view can
hold one without a later `push` mutating it underneath. `text()` and `reasoning()` concatenate
their blocks in index order, and `reset()` clears the instance for another response.

## What the SSE parser handles

The framing rules are small and almost never fully implemented. `parseEventStream` covers:

- a chunk boundary **anywhere**, including inside a multi-byte character and between the two
  halves of a `\r\n`
- repeated `data:` fields joined with `\n`
- exactly one space stripped after the colon
- `:` comment lines, which is how servers keep a connection warm
- a leading BOM
- a trailing block the server never terminated with a blank line
- a `ReadableStream` with no `Symbol.asyncIterator`

It accepts any `AsyncIterable<Uint8Array>` as well as a `ReadableStream`, so a test can feed it
byte slices without a network.

## A worked mapping

`packages/im` in this repository is a working consumer: an OpenAI-compatible SSE route, the
mapping onto `StreamChunk`, and a view that holds a snapshot rather than concatenating
deltas itself. Its round-trip test drives the real server's bytes through the real client at
several chunk sizes, so the two halves cannot drift apart.

## See also

- [ranuts/conversation](../conversation/) — project the resulting events into renderable nodes
- [`<r-conversation>`](../../ranui/conversation/) — render those nodes
