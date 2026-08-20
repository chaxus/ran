---
name: ranuts
description: Use when working with the ranuts utility library — DOM/BOM/string/object/number/color/time helpers and reactivity from `ranuts/utils` (e.g. createSignal, throttle/debounce, cloneDeep, escapeHtml, getMime, MessageCodec, localStorage helpers), the node-only server toolkit `ranuts/node`, the 2D rendering engine `ranuts/visual`, or the `ranuts/vnode` virtual DOM. Covers the import map, inventory, conventions, and where the full function reference lives.
---

# ranuts — utility library

A broad, tree-shakeable utility toolkit. Four independent entry points; import from the
subpath, never from `ranuts/dist/...` or the internal `@/...` alias.

## Authoritative reference (read for exact signatures — don't guess)

When `ranuts` is installed, its docs ship inside the package:

- **`node_modules/ranuts/docs/API.md`** — the full generated function reference for
  `ranuts/utils` (signatures + one-line descriptions). This is the source of truth.
- **`node_modules/ranuts/CLAUDE.md`** — usage guide: entry-point map, project layout,
  the `visual/` engine, conventions, and gotchas.

## Import map

| Import from     | What                                                        | Runtime          |
| --------------- | ---------------------------------------------------------- | ---------------- |
| `ranuts`        | Root barrel — re-exports utils + visual surface            | browser + node   |
| `ranuts/utils`  | DOM/BOM, string, object, number, color, time, reactivity   | browser + node\* |
| `ranuts/node`   | HTTP server, router, ws, fs, streams, middleware           | **node only**    |
| `ranuts/visual` | 2D rendering engine (Canvas / WebGL / WebGPU)              | **browser only** |
| `ranuts/vnode`  | Snabbdom-style virtual DOM (`h`, `init`, modules)          | browser          |
| `ranuts/stream` | SSE parsing + provider-neutral streamed-response fold      | browser + node   |
| `ranuts/conversation` | Event log → renderable conversation nodes           | browser + node   |

\* Most `ranuts/utils` functions are browser-oriented (touch `window`/`document`) but
guard with `typeof window/document !== 'undefined'`; pure helpers run anywhere. **Never
import `ranuts/node` in browser code** — it pulls in `fs`/`http`/`child_process`.

## `ranuts/utils` — frequently used

Reactivity: `createSignal(value, opts?)` → `[getter, setter]` (signal primitive).

Timing: `throttle`, `debounce`, `generateThrottle`, `durationHandler`, `getFrame`.

String/HTML: `escapeHtml`, `clearStr`, `clearBr`, `changeHumpToLowerCase`,
`getMatchingSentences`, `checkEncoding`.

Object/data: `cloneDeep`, `filterObj`, `compose` (async→sync middleware), `createData`.

Files/MIME: `getMime(ext)`, `getExtensions(mimeType)`, `createObjectURL(blob|buffer)`,
`convertImageToBase64(file)`.

URL/cookie/query: `appendUrl`, `encodeUrl`, `getAllQueryString`, `getQuery`, `getCookie`,
`getCookieByName`, `getHost`.

Env/device: `currentDevice`, `Platform`, `connection`, `getPerformance`, `getPixelRatio`,
`canvasVendor`/`audioVendor` (fingerprints).

Storage: `localStorageGetItem`, `localStorageSetItem` (SSR-safe wrappers).

DOM: `addClassToElement`, `removeClassToElement`, `create(tag)`,
`createDocumentFragment`, `scriptOnLoad`.

Messaging: `MessageCodec` (structured message encode/decode, used for cross-context /
desktop integration).

> This is a shortlist. See `node_modules/ranuts/docs/API.md` for the complete, exact list.

## `ranuts/stream` + `ranuts/conversation` — streaming conversations

Three layers in `stream`, and **the vendor-specific one is not shipped**: you write the
mapping from your provider's SSE event onto `StreamChunk`.

- `parseEventStream(source)` — bytes → `ServerSentEvent`. Handles chunk boundaries anywhere
  (including mid multi-byte character and mid CRLF), repeated `data:`, `:` keep-alives, BOM,
  and an unterminated trailing block.
- `mapEventStream(source, map)` — your mapping, returning `[]` to drop `[DONE]`/keep-alives.
- `createStreamAccumulator()` — folds chunks into blocks: `snapshot()`, `text()`,
  `reasoning()`, `toolCalls()`.

Rules that bite: group by `index`, never arrival order; **never parse tool arguments
mid-stream** (`argumentsDelta` is text — parse after `finish`); `block-end` wins over deltas;
`block-start` is optional.

`conversation` projects the resulting events into nodes. Each kind of content is an
independently registered state machine — `match` / `start` / `update` — so adding a kind is
adding a definition, not editing a renderer. `publication` is the streaming throttle:
`animation-frame` for per-token deltas, `immediate` for discrete facts, `none` to record
without waking the view. Order is fixed at `start`, so a streaming message keeps its place.

`createBottomFollower` (from `ranuts/utils`) keeps such a view pinned to its floor without
fighting the reader: call `follow()` on every content change, pass `observe: [column]` for
growth that appends no node, and anchor with `captureAnchor`/`restoreAnchor` around a prepend.

`diffLines(oldText, newText, { context })` (from `ranuts/utils`) returns unified-style
hunks with both gutters, degrading to a wholesale replacement past a table cap rather
than allocating unbounded memory.

`<r-conversation>` and `<r-tool-card>` in ranui compose all of this.

## Usage example

```ts
import { createSignal, throttle, escapeHtml, getMime, cloneDeep } from 'ranuts/utils';

// Reactive signal
const [count, setCount] = createSignal(0);
setCount(1);
count(); // 1

// Throttle a scroll handler
const onScroll = throttle(() => console.log('scrolled'), 200);
window.addEventListener('scroll', onScroll);

escapeHtml('<b>hi</b>');   // "&lt;b&gt;hi&lt;/b&gt;"
getMime('png');            // "image/png"
cloneDeep({ a: { b: 1 } }); // deep copy, handles cycles
```

## Conventions & gotchas

- Import from the subpath (`ranuts/utils`), not `ranuts/dist/...` or `@/...`.
- Guard browser globals (`typeof window !== 'undefined'`) in any code that might run
  under SSR/node.
- `ranuts/node` is node-only and marked external in builds — keep it out of browser
  bundles.
- `ranuts/visual` is browser-only (needs Canvas/WebGL/WebGPU).
