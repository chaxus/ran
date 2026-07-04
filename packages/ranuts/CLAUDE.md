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

| Import from     | Source                      | What                                                | Runtime          |
| --------------- | --------------------------- | --------------------------------------------------- | ---------------- |
| `ranuts`        | `index.ts`                  | Root barrel — re-exports the utils + visual surface | browser + node   |
| `ranuts/utils`  | `src/utils/index.ts`        | DOM/BOM, string, object, number, color, time, etc.  | browser + node\* |
| `ranuts/node`   | `src/node/index.ts`         | HTTP server, router, ws, fs, streams, middleware    | **node only**    |
| `ranuts/visual` | `src/utils/visual/index.ts` | 2D rendering engine (Canvas / WebGL / WebGPU)       | **browser only** |
| `ranuts/vnode`  | `src/vnode/index.ts`        | Snabbdom-style virtual DOM (`h`, `init`, modules)   | browser          |

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
│   ├── utils/                # ranuts/utils — the largest surface (~13.8k LOC)
│   │   ├── str.ts obj.ts number.ts color.ts bom.ts dom.ts time.ts …
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
   `@description:` tag (often Chinese) for the summary — the generator reads it:
   ```ts
   /**
    * @description: 防抖
    * @param fn 要执行的函数
    * @return 包装后的函数
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
- Keep `ranuts/node` server-only; never import it from browser-facing modules.

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

| Pitfall                                                                   | Fix                                                                                                |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Importing from a deep source path or `@/…`                                | Import from the public subpath (`ranuts/utils`, `ranuts/visual`, …). `@/…` is build-internal only. |
| Importing `ranuts/node` in browser code                                   | It externalizes `fs`/`http`/`child_process` — server-only. Use `ranuts/utils` for browser helpers. |
| `new Application()` then `render()` with WebGPU                           | Device init is async — use `await Application.create(...)`, then `app.start()`.                    |
| Hand-editing `docs/API.md`                                                | It's generated. Edit the source JSDoc and run `npm run doc:api`.                                   |
| Adding an export but it's missing from `docs/API.md`                      | Re-export it from the module's `index.ts` barrel, then `npm run doc:api`.                          |
| New entry point not importable as `ranuts/foo`                            | Wire all three: `package.json` exports + `vite.config.ts` es entry + generator `ENTRIES`.          |
| `console.log` left in a function that a test calls                        | `vitest.config.ts` `onConsoleLog` throws — remove it or the test fails.                            |
| Assuming a GPU/Canvas test can run in CI                                  | Test env is node (no DOM/GPU). Test pure logic; gate visual checks behind a browser demo.          |
| Passing a non-`#rrggbb` color to the GPU backend and expecting it to fail | It won't — `getRgb` resolves any CSS color via the browser parser, matching the Canvas backend.    |
