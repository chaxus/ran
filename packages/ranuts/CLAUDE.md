# ranuts — Utility Library Reference

Experimental TypeScript utility library. A broad, learning-oriented collection: DOM/BOM
helpers, string/object/number utilities, algorithms, a 2D rendering engine, a virtual DOM,
and Node server tooling. Multi-entry, tree-shakeable, ships ESM + UMD.

> ⚠️ **Experimental** (`0.2.0-alpha.0`). APIs may change; primarily for learning. No
> framework runtime — these are standalone functions and classes.

---

## Start here

- **[docs/API.md](docs/API.md)** — ⭐ generated, authoritative list of **every exported
  symbol** with its signature + one-line description, grouped by entry point. Regenerate
  with `npm run doc:api` after changing any public API — CI fails if you forget. Read
  this to find what exists.
- **This file** — orientation: which entry to import, runtime constraints, conventions,
  and gotchas. Read this to decide _where_ things go and _how_ to add them.

When asked to "use ranuts" for a task: open `docs/API.md`, find the symbol, and import it
from the **subpath that owns it** (below) — not from a deep source path.

---

## Entry points (import map)

Each subpath is an independent, tree-shakeable barrel. Import from the subpath, never from
`ranuts/dist/...` or `@/...` (that alias is internal to the source).

| Import from           | Source                      | What                                                            | Runtime            |
| --------------------- | --------------------------- | --------------------------------------------------------------- | ------------------ |
| `ranuts`              | `index.ts`                  | Root barrel — re-exports the utils + visual surface             | browser + node     |
| `ranuts/utils`        | `src/utils/index.ts`        | DOM/BOM, string, object, number, color, time, etc.              | browser + node\*   |
| `ranuts/node`         | `src/node/index.ts`         | HTTP server, router, ws, fs, streams, middleware                | **node only**      |
| `ranuts/visual`       | `src/utils/visual/index.ts` | 2D rendering engine (Canvas / WebGL / WebGPU)                   | **browser only**   |
| `ranuts/i18n`         | `src/utils/i18n.ts`         | `I18nCore` / `createI18n` / `useI18n` — DOM-free                | browser + node     |
| `ranuts/sw`           | `src/sw/index.ts`           | Cache strategies + the precache protocol's SW half              | **service worker** |
| `ranuts/vnode`        | `src/vnode/index.ts`        | Snabbdom-style virtual DOM (`h`, `init`, modules)               | browser            |
| `ranuts/stream`       | `src/stream/index.ts`       | SSE parsing + provider-neutral model-stream fold + token budget | browser + node     |
| `ranuts/conversation` | `src/conversation/index.ts` | Event log → renderable conversation nodes                       | browser + node     |

\* `ranuts/utils` is broad: most functions are browser-oriented (touch `window`/`document`),
but pure helpers (`str`, `obj`, `number`, `compose`, `cloneDeep`, …) run anywhere. Functions
that read browser globals generally guard with `typeof window/document !== 'undefined'`; do
the same for any new code. **Do not import `ranuts/node` in browser code** — it pulls in
`fs`/`http`/`child_process` (these are marked external in the build).

---

## Project layout

```
packages/ranuts/
├── index.ts                  # Root barrel (re-exports utils + visual + selected)
├── src/
│   ├── utils/                # ranuts/utils — the largest surface (~14k LOC)
│   │   ├── str.ts obj.ts number.ts color.ts bom.ts dom.ts …
│   │   ├── time.ts           # formatDate / formatDuration / formatRelative + parseVttTimestamp / parseVttCueTiming
│   │   ├── bridge.ts         # postMessage request/response (split out of bom.ts)
│   │   ├── idb.ts            # WebDB (declarative stores) + createHandoff (one-shot value handoff)
│   │   ├── worker.ts         # WorkerClient — request/response over a Web Worker
│   │   ├── zip.ts            # ZIP read/rewrite — crc32, inflateRaw, rewriteZip, createZip
│   │   ├── binary.ts         # bytes ↔ base64 (chunked), gzip sniff/decompress, zip/HTML signature sniff, decodeTextBytes, saveFileToDisk
│   │   ├── async.ts          # deferred / withTimeout / withTimeoutFallback / delay / createRaceGuard
│   │   ├── storage.ts        # localStorage* + createStore (prefixed JSON view)
│   │   ├── segment.ts        # offsets ↔ chunks, range→segment splitting (highlights)
│   │   ├── localePath.ts     # createLocalePath — i18n sub-directory URL maths
│   │   ├── prefetch.ts       # whenIdle / networkAllowsDownload / prefetchUrls
│   │   ├── lang.ts           # detectLanguage + resolveLocale (query→cookie→storage→navigator)
│   │   ├── file.ts           # readFileAs* — FileReader promises
│   │   ├── i18n.ts           # ranuts/i18n — I18nCore, {param} interpolation, locale persistence
│   │   ├── event.ts          # EventManager (AbortController-scoped listeners + delegation) + createDoubleTapDetector
│   │   ├── chain.ts          # Chain / create — chainable DOM builder (shared with vnode)
│   │   ├── style.ts          # adoptStyles / adoptSheetText — Shadow DOM CSS injection
│   │   ├── canvas.ts         # Canvas 2D geometry — roundRectByArc, fanShapedByArc, getLinearGradient
│   │   ├── placement.ts      # computePlacement — flip/shift floating-panel placement (re-exported by ranui/utils/placement)
│   │   ├── tween.ts          # easing curves (quad/cubic/quart/quint/sine/expo/circ)
│   │   ├── scroll.ts         # createBottomFollower — follow the floor without fighting the reader
│   │   ├── diff.ts           # diffLines — line-level diff as unified-style hunks
│   │   ├── visual/           # ranuts/visual — 2D rendering engine (see below)
│   │   └── totp/             # TOTP + hand-rolled SHA
│   ├── node/                 # ranuts/node — mini HTTP framework
│   ├── vnode/                # ranuts/vnode — virtual DOM
│   ├── stream/               # ranuts/stream — SSE + StreamChunk + accumulator + budget
│   └── conversation/         # ranuts/conversation — event log → nodes, with publication cadence
├── bin/
│   ├── build.sh              # build (tsc types + vite es/umd)
│   └── generate-api-docs.ts  # ⭐ doc:api — emits docs/API.md from source + JSDoc
├── docs/API.md               # ⭐ generated API reference (do not hand-edit)
├── CLAUDE.md                 # this file
├── vite.config.ts            # multi-entry es + umd build
├── vitest.config.ts          # tests (node env, '@' alias)
└── package.json              # "exports" map ↔ entry points above
```

---

## The `visual/` rendering engine

A PixiJS-style 2D engine. The non-obvious parts, so you don't have to re-derive them:

- **Layering**: `Application` (lifecycle/RAF) → `Renderer` (abstract backend) → scene graph
  of `Container` (a "group") → `Graphics` (drawable). Add nodes to `app.stage`.
- **Async init**: use `await Application.create({ view, prefer })`, not `new Application()` —
  the WebGPU backend initializes its device asynchronously and must finish before the first
  render. Canvas/WebGL `init()` resolve immediately, so the factory is safe for all backends.
- **Three backends** (`RENDERER_TYPE`): `CANVAS` draws directly via Canvas2D API; `WEB_GL`
  and `WEB_GPU` share one `BatchRenderer` pipeline (triangulate → pack a single interleaved
  vertex buffer → one draw call). Backend chosen by `prefer`, default Canvas.
- **Dirty tracking**: the scene-graph root carries a `structureVersion`. Structural changes
  (add/remove child, redraw, clear) bubble to the root and bump it; the batch renderer
  rebuilds the big array only when the version changed, otherwise it just re-transforms
  vertices. Version-compare (not a boolean flag) so multiple renderers can share a scene.
- **Color**: all backends accept any CSS color. Geometry/background colors flow through
  `getRgb` (in `render/utils/index.ts`) which fast-paths `#rgb`/`#rrggbb` and falls back to
  the browser's own parser for named/`rgb()`/`hsl()` colors — keeping the three backends
  aligned. GPU vertex colors are premultiplied + packed little-endian into one u32.
- **Inherent backend difference**: stroke/join geometry is native `ctx.stroke()` on Canvas
  vs. custom triangulation (`render/utils/verticy.ts`) on GPU — not pixel-identical by design.
- **Post-processing (WebGL)**: `app.filters = [new ColorAdjustFilter({ saturation: 1.4 })]`
  runs full-screen passes after the scene. The WebGL backend draws the batch into a
  `WebGLRenderTarget` (FBO) and ping-pongs the `Filter` chain to the canvas; the last pass
  outputs to the screen. Extend `Filter` with any fragment shader (it samples the previous
  pass through `u_texture`/`u_resolution`). Zero cost when `filters` is empty (the batch draws
  straight to the canvas, unchanged); Canvas/WebGPU ignore filters. Lives in
  `render/{renderTarget,filter}.ts`.

Tests for the color pipeline and batch packing live next to the source as `*.test.ts`.
The colour-grade + interpolation helpers used by shaders (`fit`/`remap`/`lerp`/`smoothstep`
in `utils/number.ts`; `srgbToLinear`/`luma`/`blend*`/`saturation`/`cosinePalette` in
`utils/color.ts`) are exported from `ranuts/utils` for CPU-side reuse.

---

## Streaming a model response

`ranuts/stream` is four layers, each usable alone. The split is the point: only the
middle one is vendor-specific, and it is the one ranuts does **not** ship.

1. `parseEventStream(source)` — bytes → `ServerSentEvent`. Transport only, no model
   concepts. Handles the parts that bite: a chunk boundary anywhere (including inside a
   multi-byte character or between `\r` and `\n`), repeated `data:` joined with `\n`, one
   space stripped after the colon, `:` comment keep-alives, a leading BOM, and a trailing
   block the server never terminated.
2. `StreamChunk` — the provider-neutral vocabulary. **You write the mapping** from your
   provider's event shape onto it; `mapEventStream(source, map)` is the seam, and returning
   `[]` from the mapping is how a keep-alive or a `[DONE]` sentinel is dropped.
3. `createStreamAccumulator()` — folds chunks into blocks, so a view reads `snapshot()`,
   `text()`, `reasoning()`, or `toolCalls()` instead of concatenating deltas itself.
4. `estimateTokens` / `addUsage` / `planCompaction` — the budget. A chat client that skips
   this works for a week and then stops: every turn carries the whole history, the request
   grows monotonically, and one day the provider refuses it as a wall.

Non-obvious rules the vocabulary encodes:

- **Group by `index`, never by arrival order.** Reasoning and text interleave, and several
  tool calls open at once.
- **Tool arguments stay raw JSON text.** Half a JSON document is not a value. The
  accumulator never parses `argumentsDelta`; parse once, after `finish`.
- **`block-start` is optional.** Several providers open a block with its first delta, so
  the accumulator opens one on demand. Do not require it in your mapping either.
- **`block-end` wins.** When a provider sends an assembled block, it replaces whatever the
  deltas accumulated.
- **`finish` terminates.** `usage` arrives before it; nothing after it.

Non-obvious rules the budget encodes:

- **`estimateTokens` is an estimate, and CJK is not four characters a token.** A BPE
  vocabulary trained mostly on Latin script rarely merges CJK, so counting it at the Latin
  rate underestimates a Chinese conversation about fourfold — the difference between
  compacting in time and compacting after the provider refuses. A real tokenizer is a
  per-model dependency measured in megabytes, and this decides _when to act_, not billing.
- **`addUsage` keeps a field one side omitted.** Providers differ in what they send, and a
  running total that lost `outputTokens` the moment one response omitted it is worse than
  no total.
- **`planCompaction` counts the summary it will add.** Without that it returns "fits" for a
  request that does not. It also never touches the protected tail, and reports `fits: false`
  rather than compacting it anyway — the caller decides, because nothing can be done there
  that does not lose the user's own words.
- **It takes sizes, not messages.** What replaces a folded prefix, and which cut points a
  wire format allows, are the caller's business.

## Projecting an event log into a conversation

`ranuts/conversation` turns an append-only log into the nodes a view renders. The
alternative — a view that switches on event type and mutates a component tree — puts
ordering, identity and partial-update reconciliation in the view, where every new kind of
content has to be threaded through by hand.

Here each kind of content is an independently registered state machine:

```ts
const engine = createConversationEngine<Event>({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

A definition says which events are its own (`match`), folds them into its own state
(`start` / `update`), and never learns that the others exist. Adding a kind is adding a
definition, not editing a renderer.

Semantics you need before writing one:

- **Every definition sees every event.** Claims are independent; the engine does not stop
  at the first match, so one log event can drive two nodes.
- **Order is fixed at `start`.** A node that keeps updating stays where it opened, so a
  streaming message does not jump to the end of the list on every delta.
- **An `update` for an id with no open node is dropped.** That is honest when the start
  event was trimmed from a paged window; inventing a node from a partial update would
  render something that never existed.
- **`publication` is the streaming throttle.** `animation-frame` coalesces every delta
  between two paints into one notification; `immediate` is for discrete facts, where
  waiting a frame only adds latency; `none` records without waking the view. Cadence
  escalates and never relaxes — an `immediate` while a frame is pending fires now and
  cancels the frame.
- **`reader.previous(kind)` is backward-only**, so replaying the same log reproduces the
  same view. A definition that could see nodes started after it would not.
- **`truncate(key)` is what editing, regenerating and branching are made of.** All three
  mean "the conversation diverges here", and what follows the divergence is no longer part
  of it. It cuts by `seq` rather than by position — a node that opened before the cut
  survives even if its latest update came after it, which is the same rule node order
  follows — and returns how many nodes went, because zero is the caller's cue that its own
  idea of the conversation is stale. Without it the only way back is `reset()` and a full
  replay, which discards every node that did not change and makes the view flash.

`scheduler` is injectable, which is how the cadence tests run without a paint. The default
uses `requestAnimationFrame` in a browser and a microtask elsewhere.

`<r-conversation>` in ranui is the DOM consumer of all of this — see
[ranui/CLAUDE.md](../ranui/CLAUDE.md#r-conversation).

## Following the bottom of a scroller

`createBottomFollower` (from `ranuts/utils`) keeps an append-only view — a streaming
transcript, a log tail, a terminal — pinned to its floor without fighting the reader.

The hard part is telling your own scroll writes apart from the reader's. It uses an
**observed-top ledger**: every programmatic write records the `scrollTop` it produced, and
a scroll event whose position deviates from the ledger is the reader. That covers wheel,
touch, scrollbar, keyboard and stray `scrollIntoView` calls at once, without listening for
any input device — no list of device listeners is ever complete.

Using it:

- Call `follow()` whenever content changes; it is a no-op while the reader is scrolled up.
- Pass `observe: [column]` for growth that appends no node — streaming text grows an
  existing node, so it has to be observed rather than announced.
- Before loading older content, `captureAnchor(row)` on a row that is actually on screen,
  and `restoreAnchor()` after the prepend lands. Resolving to `null` means the row did not
  survive; omitting the resolver reuses the captured element.
- A shrink-clamp never transfers ownership. A reader who had scrolled up stays unpinned
  even when the clamp leaves them at the floor, and re-pins on their next scroll —
  re-pinning on a clamp would take control back with no input from them.
- Scrolling is always instant. Smooth scrolling animates toward a moving target during
  streaming, and its intermediate positions read as reader input on the next event.

## Conventions

### Adding a function to an existing module

1. Write it in the right `src/<module>/*.ts` file with a JSDoc block. This codebase uses the
   `@description:` tag for the summary — the generator reads it. **Comments and JSDoc are
   written in English**; user-facing translations belong in `packages/docs`, not in source:
   ```ts
   /**
    * @description: Debounce — run only the last call, `ms` after the calls stop.
    * @param fn function to debounce
    * @return wrapped function with cancel / flush / pending
    */
   export const debounce = (fn, ms = 300) => { … };
   ```
2. Re-export it from that module's `index.ts` barrel (named export; types via `export type`).
3. Run `npm run doc:api` to refresh `docs/API.md`.

### Adding a whole new entry point (subpath)

Wire it in **three** places (mirror an existing one):

1. **`package.json` → `exports`** — add `"./foo": { types, import, require }`.
2. **`vite.config.ts` → `es.lib.entry`** (and a `umd*` block if a UMD build is wanted) — add
   `foo: resolve(__dirname, 'src/foo/index.ts')`.
3. **`bin/generate-api-docs.ts` → `ENTRIES`** — add the subpath so it shows up in `docs/API.md`.

Then `npm run doc:api`.

### Runtime safety

- Guard every `window`/`document`/`localStorage`/`navigator` access with `typeof … !== 'undefined'`
  in code reachable from `ranuts/utils` (it's imported in node too).
- **Guard at call time, not module load.** `isClient` is a module-level constant evaluated when
  the module is first imported, so it is `false` forever in any SSR-then-hydrate or
  import-early/call-later flow — and it cannot be stubbed in tests. New code checks
  `typeof window === 'undefined'` inside the function. `isClient` stays exported for
  compatibility but should not be used for new branches.
- Never call `window.setTimeout` / `window.setInterval`. The bare globals work in Node, Web
  Workers and the browser alike; the `window.`-prefixed ones throw `ReferenceError` outside a
  document. (This is what made `throttle` unusable in SSR before 0.3.)
- Keep `ranuts/node` server-only; never import it from browser-facing modules. Same for
  `ranuts/sw`: it runs in a `ServiceWorkerGlobalScope` with no `window`/`document`, which is
  why it is its own entry rather than part of the utils barrel.

### Ship both halves of a protocol, or neither

`WorkerClient` without `serveWorker` meant every worker re-implemented the same id echo and
error envelope — and each got to invent its own bug (a sync throw escaping the handler, a
rejection with no id so the caller waits forever). Same for `prefetchUrls({ serviceWorkerMessage })`
without `servePrecache`. When a helper defines a message shape, the counterpart that answers
it belongs in the library too; a JSDoc block saying "just echo the id back" is not a substitute.

### Anything that installs something must return how to uninstall it

`debounce`, `throttle`, `watchMediaQuery`, `whenIdle`, `WorkerClient`, `QuestQueue` hand back
something holding a timer, a listener or a worker. `replaceOld`, `handleConsole`,
`handleFetchHook`, `handleXhrHook`, `handleError`, `handleClick`, `serveWorker`,
`servePrecache` and `Monitor.start()` patch a global or register a listener. **All of them
return a teardown function**, and callers are expected to use it.

A utility of this shape without a teardown path is incomplete. The failure modes are concrete:
a pending timer firing into a destroyed component; a hot reload re-patching an already-patched
`console` until every log is nested through a dozen wrappers and every event is reported N
times; a test that can never give the next test a clean global back.

`replaceOld`'s restore additionally checks that **its own** wrapper is still installed before
writing the original back — otherwise unwinding an inner layer would silently uninstall an
outer one.

### No hard-coded endpoints, cookie names or domains

A library cannot know where your telemetry goes or what your auth cookie is called. `report`
requires an endpoint (`setReportUrl` once, or per call) and returns `false` rather than
guessing; `createData` includes a user id only when `userIdCookie` is configured. This is what
`getHost` got wrong — it built a URL from a domain baked into this repo, and a stale edit had
already reduced its output to the unreachable literal `'//log.'`.

---

## Build, test, docs

```bash
npm run build        # tsc types + vite (es + umd) → dist/
npm run tsc          # type-check only (tsc --noEmit)
npm run test         # vitest run (node env)
npm run test:coverage
npm run doc:api      # regenerate docs/API.md from source + JSDoc
npm run doc:api:check  # verify it is fresh without writing (what CI runs)
```

- **Tests**: Vitest, **node environment** (no jsdom) — `vitest.config.ts` has no `environment`
  set. Co-locate as `*.test.ts` next to source; alias `@ → src`. Pure logic and anything that
  degrades gracefully without DOM is testable here; DOM/GPU-dependent paths are not (e.g.
  `getRgb`'s CSS fallback returns black without `document`).
- **`onConsoleLog` throws**: the test config fails any test that logs to console — don't leave
  stray `console.*` in code under test.
- **Never assert on unseeded randomness**: sampling the real CSPRNG can only estimate the property
  under test, and a window tight enough to catch a real bias also fails on chance every few
  thousand runs — which reads as a mystery CI failure on one matrix leg. Replace the sample with
  scripted bytes and assert the mapping exactly; `test/utils/secure.test.ts` has the `withBytes`
  helper that stubs `crypto.getRandomValues` for the length of one draw.

---

## Gotchas

| Pitfall                                                                          | Fix                                                                                                                                                     |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Importing from a deep source path or `@/…`                                       | Import from the public subpath (`ranuts/utils`, `ranuts/visual`, …). `@/…` is build-internal only.                                                      |
| Importing `ranuts/node` in browser code                                          | It externalizes `fs`/`http`/`child_process` — server-only. Use `ranuts/utils` for browser helpers.                                                      |
| `new Application()` then `render()` with WebGPU                                  | Device init is async — use `await Application.create(...)`, then `app.start()`.                                                                         |
| Hand-editing `docs/API.md`                                                       | It's generated. Edit the source JSDoc and run `npm run doc:api`.                                                                                        |
| Adding an export but it's missing from `docs/API.md`                             | Re-export it from the module's `index.ts` barrel, then `npm run doc:api`.                                                                               |
| New entry point not importable as `ranuts/foo`                                   | Wire all three: `package.json` exports + `vite.config.ts` es entry + generator `ENTRIES`.                                                               |
| `console.log` left in a function that a test calls                               | `vitest.config.ts` `onConsoleLog` throws — remove it or the test fails.                                                                                 |
| Assuming a GPU/Canvas test can run in CI                                         | Test env is node (no DOM/GPU). Test pure logic; gate visual checks behind a browser demo.                                                               |
| Passing a non-`#rrggbb` color to the GPU backend and expecting it to fail        | It won't — `getRgb` resolves any CSS color via the browser parser, matching the Canvas backend.                                                         |
| Branching on `isClient` in new code                                              | It's a module-load-time constant — wrong after SSR, unstubbable in tests. Check `typeof window === 'undefined'` inside the function.                    |
| Reaching for `randomString` / `getRandomString` to make a token or code          | Both are `Math.random()` based and predictable. Use `secureRandomString` / `secureToken` from `secure.ts` for anything an attacker would want to guess. |
| Comparing a secret with `===`                                                    | Returns early at the first differing byte, leaking the shared prefix through timing. Use `safeEqual`.                                                   |
| Asserting a distribution drawn from the real CSPRNG                              | The window that catches the bias also fires on sampling noise. Script the bytes with `withBytes` (`test/utils/secure.test.ts`) and assert an equality.  |
| Decoding chunked text per chunk                                                  | A multi-byte character straddling a boundary becomes replacement characters. `concatBytes` first, decode once.                                          |
| `window.setTimeout` in a `ranuts/utils` module                                   | Throws outside a document. Use the bare `setTimeout`.                                                                                                   |
| A module-level factory that keeps mutable state shared by everything it produces | Give each produced function its own state (this is why `generateThrottle` was removed).                                                                 |
| Reaching for `memoize` expecting per-argument caching                            | It only runs once and ignores later arguments. Use `once` (its new name), `singleFlight` for async, or a `Map` for real keyed caching.                  |
| Assuming `createSignal` deep-compares                                            | It uses `Object.is` since 0.3. Pass `{ equals: isEqual }` when you want deep comparison.                                                                |
| Testing a boolean URL flag with `getAllQueryString(url).embed`                   | `?embed` (no value) is the usual spelling and reads as `''`, which is falsy. Use `queryFlag('embed')`.                                                  |
| `Promise.race([task, timeoutPromise])` for a deadline                            | Leaks the timer when the task wins. Use `withTimeout` / `withTimeoutFallback` — they always clear it.                                                   |
| Expecting `rewriteZip` to recompress                                             | Rewritten and injected entries are written STORED, so the output is larger. Untouched entries keep their original compressed bytes.                     |
| Expecting `zip.ts` to open a >4 GiB archive                                      | No ZIP64, no encryption, no multi-disk. `readZipEntries` returns `[]` for anything it cannot parse.                                                     |
| Calling `createHandoff().take()` twice                                           | It is one-shot by design — the read and the delete share a transaction. The second call resolves `null`.                                                |

---

## Breaking changes in 0.3

The package is `0.x` and explicitly experimental, so these landed without a deprecation cycle.
Each fixed a defect rather than changing a preference.

| Symbol                                                                                | Change                                                                                                                                                                                                                                                                 | Migration                                                                      |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `generateThrottle`                                                                    | **Removed.** The factory's generated functions shared one timer and one timestamp, so unrelated throttled functions suppressed each other.                                                                                                                             | `const f = throttle(fn, delay)`                                                |
| `memoize`                                                                             | Renamed to `once`, kept as a deprecated alias. The old type declared zero arguments while forwarding them.                                                                                                                                                             | Prefer `once`; use `singleFlight` for the async case.                          |
| `createSignal`                                                                        | `{ equals: true }` used to freeze the signal (it meant "always equal"); every write ran `cloneDeep` + `isEqual`, which overrode `equals` and put an O(size) copy on the write path.                                                                                    | Pass `{ equals: isEqual }` if you relied on deep comparison.                   |
| `QuestQueue`                                                                          | Rewritten. `add()` never started anything, it popped LIFO, one promise carried unrelated tasks' results, and `allSettled` was off by one. The `total` constructor option is gone.                                                                                      | Use `await queue.add(task)`, `queue.allSettled(tasks)`, `queue.onIdle()`.      |
| `report`                                                                              | Return type narrowed to `boolean`; the image fallback is now reachable; **no default endpoint**.                                                                                                                                                                       | `setReportUrl(url)` once, or pass `report({ url })`.                           |
| `debounce` / `throttle`                                                               | Now generically typed and return `cancel()` / `flush()` / `pending()`.                                                                                                                                                                                                 | None; call `cancel()` on teardown.                                             |
| `getHost`                                                                             | **Removed.** Built a URL from a domain baked into this repo, and a stale edit had reduced its output to the unreachable literal `'//log.'`.                                                                                                                            | `setReportUrl` / `report({ url })`.                                            |
| `createData`                                                                          | No longer reads a hard-coded `chaxus_prod` cookie; `userId` appears only when configured.                                                                                                                                                                              | `setReportUrl({ userIdCookie })`.                                              |
| `formatJson`                                                                          | Now `JSON.stringify` with lenient parsing in front. The old hand-rolled formatter corrupted braces/commas **inside string values** and mis-handled escaped quotes. Gained an `indent` param.                                                                           | Output spacing now matches `JSON.stringify`.                                   |
| `timestampToTime`                                                                     | Deprecated in favour of `formatDate`. Chained case-insensitive `.replace()` calls made lowercase patterns like `yyyy-mm-dd` render as year-minute-day.                                                                                                                 | `formatDate(value, pattern)`.                                                  |
| `replaceOld`                                                                          | Returns a restore function instead of `void`.                                                                                                                                                                                                                          | Additive; keep the returned function.                                          |
| `handleConsole` / `handleFetchHook` / `handleXhrHook` / `handleError` / `handleClick` | Return a teardown function instead of `void`.                                                                                                                                                                                                                          | Additive; call it on teardown.                                                 |
| `Monitor`                                                                             | No longer auto-starts from the constructor (it was gated on a global `window.ranlog`, so a second instance silently did nothing). Takes `{ url, channels, … }`; `start()` returns `stop()`. `createData()` is now evaluated per event, not captured at install time.   | `new Monitor({ url }).start()`.                                                |
| bridge symbols                                                                        | Moved from `bom.ts` to `bridge.ts` (~600 lines of a different concern).                                                                                                                                                                                                | None — same barrel exports.                                                    |
| `getAllQueryString` / `getQuery`                                                      | Two byte-identical copies of a parser that **dropped every parameter without a value**, so `?embed` and `?readonly` read as absent. Rewritten once, aliased; bare flags now yield `''`, a fragment no longer leaks into the last value, and only the first `=` splits. | Use `queryFlag(key)` for boolean flags.                                        |
| `localStorageGetItem` / `localStorageSetItem`                                         | No longer branch on `isClient`, and no longer throw when storage access itself throws (blocked third-party frame, private mode, quota).                                                                                                                                | None. `createStore(prefix)` for JSON values.                                   |
| `hexToRgb`                                                                            | Return type narrowed from `RegExpExecArray \| null \| Array<number>` to `Array<number> \| null`, and 3-digit shorthand (`#abc`) is now expanded per CSS rules instead of failing to parse.                                                                             | None — strictly more inputs accepted, narrower type.                           |
| `hsbToRgb` / `hsvToRgb`                                                               | Rounds instead of floors the final 0–255 channels. Flooring biased every channel down by up to 1, so `rgb → hsb → rgb` never converged (a colour picker lost saturation on repeated drags).                                                                            | Values may differ by 1 per channel. None if you weren't asserting exact bytes. |
| `Chain` / `create` (`ranuts/vnode`)                                                   | `src/vnode/chainDom.ts` was a second copy missing SVG namespace support and listener management. Both entries now export the fuller `utils/chain` implementation.                                                                                                      | None — the surviving one is a superset.                                        |

## Breaking changes in 0.4

A pruning pass: every symbol below had zero call sites anywhere in this monorepo (checked with
a repo-wide grep, not just this package), no test, and — except `getQuery` — no narrative doc
page. Removed rather than deprecated, per the same `0.x`-experimental rationale as 0.3.

| Symbol                                         | Why removed                                                                                                                                          | Migration                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `getQuery`                                     | Byte-identical alias of `getAllQueryString` since 0.3; the alias itself was never a reason to keep it.                                               | `getAllQueryString`.                                        |
| `audioVendor` / `canvasVendor` / `webglVendor` | Browser-fingerprinting helpers (canvas/audio/webgl hashing) in `behavior.ts`. No consumer, no docs.                                                  | None.                                                       |
| `setAttributeByGlobal`                         | Wrote to `window`/`global` by string key with no guard — a footgun with no caller in this repo.                                                      | Assign the global directly.                                 |
| `getRegionalLatitudeAndLongitude`              | Never re-exported from the `ranuts/utils` barrel — unreachable through the public API.                                                               | `navigator.geolocation` directly.                           |
| `sameValueZero`                                | Same — defined in `obj.ts` but never wired into the barrel or into `isEqual`.                                                                        | `Object.is`.                                                |
| `isBangDevice`                                 | Notch heuristic hard-coded `screen.width`/`height` pairs through the iPhone 12 line only; already stale for 13–16 and rots further every generation. | `env('viewport-fit=cover')` + CSS `env(safe-area-inset-*)`. |
| `str2Xml`                                      | Thin wrapper over `DOMParser` (plus a dead `ActiveXObject` branch for pre-2016 IE).                                                                  | `new DOMParser().parseFromString(str, type)`.               |
| `changeHumpToLowerCase`                        | One-line camelCase→snake_case wrapper, no caller.                                                                                                    | `str.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase())`.      |
| `removeGhosting`                               | Real but narrow drag-ghost-image hack; documented but never called from anywhere in this repo.                                                       | Inline at the call site if needed.                          |
| `retain`                                       | Real but narrow back-button-override hack; same story as `removeGhosting`.                                                                           | Inline at the call site if needed.                          |

`packages/docs/.vitepress/plugins/env.ts` and `.vitepress/theme/index.ts` were the only actual
in-repo consumers found (`isBangDevice` for an unused `$env.isBang` field, `setAttributeByGlobal`
for a one-line `window.__VUE_PROD_DEVTOOLS__ = false`) — both inlined rather than kept as a
reason to preserve the library export.
