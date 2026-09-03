---
description: 'Which ranuts utility to reach for: debounce or throttle, once or singleFlight, localStorage or IndexedDB, a bridge or a worker client — and when the platform already has it.'
---

# Choosing a utility

The [API reference](/src/ranuts/api) lists every export. This page answers the question it
cannot: **which of two similar things do I want, and why**.

> **Use when** you know roughly what you need — "run this less often", "only once", "store
> this", "talk to a worker" — but not which export does it.

## First: does the platform already have it?

ranuts is not trying to replace the standard library. Reach for the platform first, and use a
utility when it genuinely adds something:

| Instead of…                | The platform has…           | Use the ranuts one when…                                                                                                                                           |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cloneDeep(value)`         | `structuredClone(value)`    | The value contains functions or anything `structuredClone` refuses — it throws a `DataCloneError`, `cloneDeep` copies what it can and keeps the rest by reference. |
| `getAllQueryString(url)`   | `new URL(url).searchParams` | You want a plain object in one call rather than an iterator.                                                                                                       |
| `localStorageGetItem(key)` | `localStorage.getItem(key)` | The code also runs where storage is missing or blocked — the wrappers return `''` instead of throwing (Safari private mode, SSR, a sandboxed iframe).              |
| `escapeHtml(str)`          | `textContent = str`         | You are building a string, not a node.                                                                                                                             |

## Doing something less often

Four different questions hide behind "call this less":

| You want…                                                              | Use                | Behaviour                                                           |
| ---------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------- |
| Only the **last** call in a burst — a search box, a resize             | `debounce(fn, ms)` | Runs `ms` after the burst stops. Nothing runs during the burst.     |
| A **steady rate** during a burst — scroll position, a progress readout | `throttle(fn, ms)` | The first call runs immediately, then at most one per `ms`.         |
| It to run **exactly once**, ever — an init, a one-time warning         | `once(fn)`         | First call evaluates, every later call returns that same result.    |
| Concurrent callers to **share one in-flight request**                  | `singleFlight(fn)` | The async flavour of once: while a call is pending, others join it. |

**`memoize` is the former name of `once`** and does the same thing — it does not cache per
argument, which is what the name suggests. New code should say `once`.

The difference that bites: `debounce` on a keystroke handler means nothing runs while the user
is typing; `throttle` means something runs the whole time, just not on every key. A search
suggestion wants `debounce`; a "characters remaining" counter wants `throttle`.

## Running async work under control

| You want…                                                   | Use                                          |
| ----------------------------------------------------------- | -------------------------------------------- |
| To run many tasks, but only _n_ at a time                   | `new QuestQueue({ simultaneous: n })`        |
| To give up on a promise that takes too long                 | `withTimeout(promise, ms)`                   |
| …and carry on with a default instead of throwing            | `withTimeoutFallback(promise, ms, fallback)` |
| A promise you resolve from somewhere else entirely          | `deferred()`                                 |
| To chain async steps, Koa-style, each able to wrap the next | `compose(middleware)`                        |

`Promise.all` is right when you want _all_ of them at once; `QuestQueue` is right when "all at
once" would open sixty connections. `withTimeout` rejects — pair it with a `catch`, or use the
fallback variant when a timeout is not an error for you.

## Storing something

| Lifetime and size                                    | Use                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| A small string that survives reloads                 | `localStorageSetItem` / `localStorageGetItem` / `localStorageRemoveItem` |
| Structured data, many records, or more than a few MB | `new WebDB({ dbName, stores })` — a promise wrapper over IndexedDB       |
| One value handed from **this page to the next**      | `createHandoff({ dbName, storeName, key })`                              |

The `localStorage*` wrappers exist because the native calls **throw** where storage is
unavailable — Safari's private mode, a sandboxed iframe, a browser with site data blocked — and
a crash on read is a worse failure than a missing preference. They return `''` and carry on.

`createHandoff` is for the case neither of the others fits: a value that must survive exactly
one navigation and then be gone.

## Talking across contexts

| Between…                                      | Use                                                               |
| --------------------------------------------- | ----------------------------------------------------------------- |
| A page and a Web Worker, request/response     | `new WorkerClient({ create })` — correlates replies by request id |
| Any two `MessagePort` ends                    | `createPortBridge(port)`                                          |
| Two windows/iframes that must find each other | `acceptPortBridge()` on one side, the handshake on the other      |

`WorkerClient` is the one to reach for when the worker answers questions: without request ids,
two overlapping calls cannot tell whose reply arrived. A bridge is the lower level — use it when
the traffic is not request/response, or when the transport already exists.

## Working with objects

| You want…                            | Use                    | Note                                                  |
| ------------------------------------ | ---------------------- | ----------------------------------------------------- |
| A copy nothing else shares           | `cloneDeep(value)`     | Handles circular references and the common built-ins. |
| To know whether two values are alike | `isEqual(a, b)`        | Deep comparison, not reference identity.              |
| To combine two objects               | `merge(a, b)`          |                                                       |
| To drop some keys                    | `filterObj(obj, keys)` | Returns a copy without the listed keys.               |

## Locale and text

- **`resolveLocale({ supported, … })`** picks which of _your_ locales to use, from the usual
  chain (an explicit choice, storage, `navigator.languages`, a fallback). It answers "which
  language", not "what does this string say".
- **`createI18n` / `useI18n`** ([`ranuts/i18n`](/src/ranuts/i18n/)) is the translation engine —
  flat message dictionaries, `{param}` interpolation, runtime switching.
- **`segmentByRanges`** and **`paginateText`** are for laying text out: offsets and highlights,
  and cutting text into pages that fit a box.

Use `resolveLocale` even if you are not using the i18n engine — the decision it makes (respect
the reader's ordered `navigator.languages`, not only the first) is the part that is easy to get
wrong.

## Streaming a model response

Three layers, each usable alone:

1. **[`ranuts/stream`](/src/ranuts/stream/)** — parse SSE, then fold the deltas into a snapshot
   with `createStreamAccumulator()`. Provider-neutral: text, reasoning and tool-call deltas end
   up in the same shape regardless of who emitted them.
2. **[`ranuts/conversation`](/src/ranuts/conversation/)** — project an append-only event log
   into renderable nodes with `createConversationEngine()`. It decides _what_ a row is; it draws
   nothing.
3. **[`<r-conversation>`](/src/ranui/conversation/)** in ranui — the element that renders those
   nodes, keeps the view pinned to the bottom, and reconciles rows.

Stop at layer 1 if you are only rendering text; add 2 when a transcript has structure worth
projecting; add 3 when you want the scrolling and reconciliation solved.

## Which entry to import from

Every subpath is an independent, tree-shakeable barrel — import from the one that owns the
symbol, never from a deep source path.

| Import                | Contains                                                  | Runtime            |
| --------------------- | --------------------------------------------------------- | ------------------ |
| `ranuts`              | Root barrel — the utils + visual surface                  | browser + node     |
| `ranuts/utils`        | DOM/BOM, string, object, number, colour, time, storage, … | browser + node\*   |
| `ranuts/node`         | HTTP server, router, WebSocket, fs, streams, middleware   | **node only**      |
| `ranuts/visual`       | The 2D rendering engine (Canvas / WebGL / WebGPU)         | **browser only**   |
| `ranuts/i18n`         | The translation engine, DOM-free                          | browser + node     |
| `ranuts/sw`           | Cache strategies and the precache protocol's worker half  | **service worker** |
| `ranuts/vnode`        | Snabbdom-style virtual DOM                                | browser            |
| `ranuts/stream`       | SSE parsing, model-stream fold, token budget              | browser + node     |
| `ranuts/conversation` | Event log → renderable conversation nodes                 | browser + node     |

\* `ranuts/utils` is broad: most of it is browser-oriented, but the pure helpers (string,
object, number, `compose`, `cloneDeep`, …) run anywhere. **Do not import `ranuts/node` in
browser code** — it pulls in `fs` / `http` / `child_process`.

## Still not sure?

Search the [API reference](/src/ranuts/api) — every export is there with its signature and a
one-line description, generated from source. If two of them still look interchangeable after
reading both lines, that is a documentation bug worth
[reporting](https://github.com/chaxus/ran/issues).
