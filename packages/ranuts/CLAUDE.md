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
  with `npm run doc:api` after changing any public API. Read this to find what exists.
- **This file** — orientation: which entry to import, runtime constraints, conventions,
  and gotchas. Read this to decide _where_ things go and _how_ to add them.

When asked to "use ranuts" for a task: open `docs/API.md`, find the symbol, and import it
from the **subpath that owns it** (below) — not from a deep source path.

---

## Entry points (import map)

Each subpath is an independent, tree-shakeable barrel. Import from the subpath, never from
`ranuts/dist/...` or `@/...` (that alias is internal to the source).

| Import from     | Source                      | What                                                | Runtime            |
| --------------- | --------------------------- | --------------------------------------------------- | ------------------ |
| `ranuts`        | `index.ts`                  | Root barrel — re-exports the utils + visual surface | browser + node     |
| `ranuts/utils`  | `src/utils/index.ts`        | DOM/BOM, string, object, number, color, time, etc.  | browser + node\*   |
| `ranuts/node`   | `src/node/index.ts`         | HTTP server, router, ws, fs, streams, middleware    | **node only**      |
| `ranuts/visual` | `src/utils/visual/index.ts` | 2D rendering engine (Canvas / WebGL / WebGPU)       | **browser only**   |
| `ranuts/i18n`   | `src/utils/i18n.ts`         | `I18nCore` / `createI18n` / `useI18n` — DOM-free    | browser + node     |
| `ranuts/sw`     | `src/sw/index.ts`           | Cache strategies + the precache protocol's SW half  | **service worker** |
| `ranuts/vnode`  | `src/vnode/index.ts`        | Snabbdom-style virtual DOM (`h`, `init`, modules)   | browser            |

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
│   │   ├── visual/           # ranuts/visual — 2D rendering engine (see below)
│   │   └── totp/             # TOTP + hand-rolled SHA
│   ├── node/                 # ranuts/node — mini HTTP framework
│   └── vnode/                # ranuts/vnode — virtual DOM
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

Tests for the color pipeline and batch packing live next to the source as `*.test.ts`.

---

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
```

- **Tests**: Vitest, **node environment** (no jsdom) — `vitest.config.ts` has no `environment`
  set. Co-locate as `*.test.ts` next to source; alias `@ → src`. Pure logic and anything that
  degrades gracefully without DOM is testable here; DOM/GPU-dependent paths are not (e.g.
  `getRgb`'s CSS fallback returns black without `document`).
- **`onConsoleLog` throws**: the test config fails any test that logs to console — don't leave
  stray `console.*` in code under test.

---

## Gotchas

| Pitfall                                                                          | Fix                                                                                                                                    |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Importing from a deep source path or `@/…`                                       | Import from the public subpath (`ranuts/utils`, `ranuts/visual`, …). `@/…` is build-internal only.                                     |
| Importing `ranuts/node` in browser code                                          | It externalizes `fs`/`http`/`child_process` — server-only. Use `ranuts/utils` for browser helpers.                                     |
| `new Application()` then `render()` with WebGPU                                  | Device init is async — use `await Application.create(...)`, then `app.start()`.                                                        |
| Hand-editing `docs/API.md`                                                       | It's generated. Edit the source JSDoc and run `npm run doc:api`.                                                                       |
| Adding an export but it's missing from `docs/API.md`                             | Re-export it from the module's `index.ts` barrel, then `npm run doc:api`.                                                              |
| New entry point not importable as `ranuts/foo`                                   | Wire all three: `package.json` exports + `vite.config.ts` es entry + generator `ENTRIES`.                                              |
| `console.log` left in a function that a test calls                               | `vitest.config.ts` `onConsoleLog` throws — remove it or the test fails.                                                                |
| Assuming a GPU/Canvas test can run in CI                                         | Test env is node (no DOM/GPU). Test pure logic; gate visual checks behind a browser demo.                                              |
| Passing a non-`#rrggbb` color to the GPU backend and expecting it to fail        | It won't — `getRgb` resolves any CSS color via the browser parser, matching the Canvas backend.                                        |
| Branching on `isClient` in new code                                              | It's a module-load-time constant — wrong after SSR, unstubbable in tests. Check `typeof window === 'undefined'` inside the function.   |
| `window.setTimeout` in a `ranuts/utils` module                                   | Throws outside a document. Use the bare `setTimeout`.                                                                                  |
| A module-level factory that keeps mutable state shared by everything it produces | Give each produced function its own state (this is why `generateThrottle` was removed).                                                |
| Reaching for `memoize` expecting per-argument caching                            | It only runs once and ignores later arguments. Use `once` (its new name), `singleFlight` for async, or a `Map` for real keyed caching. |
| Assuming `createSignal` deep-compares                                            | It uses `Object.is` since 0.3. Pass `{ equals: isEqual }` when you want deep comparison.                                               |
| Testing a boolean URL flag with `getQuery(url).embed`                            | `?embed` (no value) is the usual spelling and reads as `''`, which is falsy. Use `queryFlag('embed')`.                                 |
| `Promise.race([task, timeoutPromise])` for a deadline                            | Leaks the timer when the task wins. Use `withTimeout` / `withTimeoutFallback` — they always clear it.                                  |
| Expecting `rewriteZip` to recompress                                             | Rewritten and injected entries are written STORED, so the output is larger. Untouched entries keep their original compressed bytes.    |
| Expecting `zip.ts` to open a >4 GiB archive                                      | No ZIP64, no encryption, no multi-disk. `readZipEntries` returns `[]` for anything it cannot parse.                                    |
| Calling `createHandoff().take()` twice                                           | It is one-shot by design — the read and the delete share a transaction. The second call resolves `null`.                               |

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
