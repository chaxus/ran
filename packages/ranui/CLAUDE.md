# ranui — Component Library Reference

Web Components library built with TypeScript. All components use Shadow DOM encapsulation, CSS variable theming, and SSR support.

---

## Design Standards — read before building or changing any UI

**[docs/DESIGN.md](docs/DESIGN.md) is the authoritative, executable design standard.** Follow it whenever your work changes what a user sees. It is based on the Geist design system (light/dark only).

Five of the non-negotiables below are machine-checked by `pnpm -F ranui verify:design`, which CI runs on every pull request: dark-unsafe colour fallbacks, raw colour literals, the spacing scale, the sizing scale, and mouse-only drag loops. Known violations are ratcheted in [docs/design-rule-baseline.json](docs/design-rule-baseline.json) — you cannot add one, and you cannot silently undo a fix. The remaining rules are no less binding; they just are not mechanically decidable, so verify them by rendering the result.

For each element's **attributes / properties / events / slots / `::part()`**, consult **[docs/COMPONENTS.md](docs/COMPONENTS.md)** (generated — run `npm run doc:api` after changing any component's API; CI fails if you forget) and **[docs/style-tokens-public.md](docs/style-tokens-public.md)** for its CSS variables. The non-negotiables:

- **Color is a state ladder, not a palette.** Each scale step 100→1000 has one fixed job: 100 default bg · 200 hover bg · 300 active bg · 400 border · 500 hover border · 600 active border · 700 solid · 800 solid hover · 900 secondary text · 1000 primary text. Use the **semantic tokens** (`--ran-color-*`), never raw hex, in components.
- **Dark-safe fallbacks.** A component token's fallback must point at a token that _flips_ (`var(--ran-color-text, …)`, `var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`) — never a light-only literal like `rgba(0,0,0,.06)` or `#e6f7ff`, which breaks in dark mode.
- **Spacing:** the `--ran-space-*` scale only (4px base, 9 values). 8 within a group, 16 between groups, 32–40 between sections.
- **Sizing:** element intrinsic dimensions (icon size, control height, small square/rect controls) use the separate `--ran-size-*` scale (16/18/20/24/28/30/32), never `--ran-space-*` — spacing and sizing have different ranges/progressions and consumers need to retune one without perturbing the other. A one-off dimension that isn't shared across components (e.g. a menu's `min-width`) stays a plain component token with its own literal fallback instead of forcing a scale step.
- **Typography:** choose a role (heading / label / copy / button / mono), not a raw px size — each role is backed by real `--ran-text-*` tokens (`--ran-text-heading-1..4`, `-label-1..3`, `-copy-1..2`, `-button-size`, plus matching `-weight` tokens), see DESIGN.md §3. Text that doesn't map to any role (a one-off emphasis state) keeps its own component token rather than being forced in.
- **Elevation = role.** Pick the shadow by what the element _is_: in-flow surface (card/section) → `--ran-shadow-elevated`; floating overlay (dropdown, select, popover, toast/message) → `--ran-shadow-menu`; blocking dialog → `--ran-shadow-modal`. A floating overlay must never fall back to the card tier (`elevated`) — it looks flat.
- **Radius/motion:** use the tokens; prefer no motion (0ms) and keep what remains quick (150/200/300ms); respect `prefers-reduced-motion`.
- **Copy:** buttons = action + object ("Deploy project"); errors = what + how; toasts state the change ("Project deleted").
- **Accessibility:** WCAG AA contrast; never signal state by color alone (pair an icon/label); visible focus ring on every interactive element; icon-only controls need an `aria-label`; full keyboard nav.
- **Mobile and desktop, both.** Any drag/slider/gesture uses Pointer Events (`pointerdown/move/up/cancel`), never mouse-only, matched by `touch-action: none` on the exact drag surface. Any `trigger="hover"` overlay degrades to click/tap on touch (`isMobile()` gate — see `r-select`/`r-popover`). Prefer viewport-relative sizing (`%`, `min()`, `clamp()`, `vw`/`vh`) over inventing a one-off `@media` breakpoint. See DESIGN.md §8.
- **Verify rendered output** in light _and_ dark, at narrow _and_ wide widths, with mouse _and_ touch input, across the materially changed states — code review alone is not enough.

---

## Project Layout

```
packages/ranui/
├── components/           # One component per directory
│   └── {name}/
│       ├── index.ts      # Component class + defineSSR()
│       └── index.less    # Shadow DOM styles (auto-imports base.less)
├── utils/
│   ├── component.ts      # ensureShadowRoot, ensureShadowElement, attribute helpers
│   ├── builder/          # ElementBuilder fluent DOM builder
│   ├── router/           # RouterCore, createRouter, useRouter, enableMpaViewTransitions
│   ├── i18n/             # re-export of ranuts/i18n (the engine itself lives in ranuts)
│   ├── ssr-registry.ts   # defineSSR, SSR support
│   ├── theme.ts          # setTheme, setThemeToken(s), initTheme (light/dark/system)
│   ├── style.ts          # adoptStyles, adoptSheetText — binds ranui's markers onto ranuts'
│   ├── placement.ts      # re-export of ranuts/utils computePlacement (the algorithm itself lives in ranuts)
│   └── dom.ts            # falseList, isDisabled
├── theme/                # tokens.less (Geist base+semantic) + dark.less (dark mixin)
├── docs/DESIGN.md        # ⭐ AI-facing design standard — follow it for ANY UI work
├── docs/COMPONENTS.md    # ⭐ generated per-element API (attrs/props/events/slots/parts)
├── test/unit/            # *.contract.test.ts per component
├── demo/                 # Dev server entry (Vite); routed showcase (r-router)
├── index.ts              # Barrel exports + side-effect imports
├── theme.ts              # `ranui/theme` public entry (theming only, no components)
├── i18n.ts               # `ranui/i18n` public entry (i18n only, no components)
├── vite.config.ts        # Build + dev server config
├── vitest.config.ts      # Test config (jsdom, 80%+ coverage)
└── base.less             # Shared LESS variables/mixins (auto-imported)
```

---

## Component Architecture

### Canonical pattern

Every component follows this exact structure:

```typescript
import componentCss from './index.less?inline';
import { Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  ensureShadowElement,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

export class MyComponent extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _myEl!: HTMLElement; // store refs to queried elements

  static get observedAttributes(): string[] {
    return ['my-attr', 'sheet']; // always include 'sheet'
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const root = ensureShadowElement(this._shadowDom, '.ran-mycomp', () =>
      Div().class('ran-mycomp').attr('part', 'mycomp').children(Slot()).build(),
    );
    this._myEl = root.querySelector<HTMLElement>('.ran-mycomp-inner')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────
  get myAttr(): string {
    return getStringAttribute(this, 'my-attr');
  }
  set myAttr(v: string) {
    setStringAttribute(this, 'my-attr', v);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(v: string) {
    setStringAttribute(this, 'sheet', v);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this._myEl, 'click', this._handleClick);
    // add other lifecycle-bound listeners here via _events.on(...)
  }

  disconnectedCallback(): void {
    this._events.abort(); // removes ALL listeners registered via _events
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return; // ALWAYS guard here
    if (name === 'my-attr') this._syncMyAttr();
    if (name === 'sheet') this.handlerExternalCss();
  }

  private _syncMyAttr(): void {
    this._myEl.textContent = this.getAttribute('my-attr') ?? '';
  }

  private _handleClick = (): void => {
    // handle click
  };
}

defineSSR('r-mycomp', MyComponent as unknown as new () => HTMLElement);
export default MyComponent;
```

**Rules:**

- Extend `RanElement` (= `HTMLElement` in browser, `HTMLElementMock` in SSR)
- Always use `ensureShadowRoot` — never call `attachShadow` directly
- Always use `ensureShadowElement` to build the Shadow DOM subtree (idempotent)
- Always guard `attributeChangedCallback` with `if (old === next) return;`
- Always include `sheet` in `observedAttributes` and wire `syncSheetAttribute`
- Always call `defineSSR` (not bare `customElements.define`)
- Export both named (`export class`) and default (`export default`)
- Use `EventManager` from `@/utils/builder` for lifecycle-bound listeners in `connectedCallback`; call `manager.abort()` in `disconnectedCallback` — never manually call `removeEventListener` per listener

### Async external-lib renderer components (`r-mermaid`, `r-math`, `r-markdown`)

Some components lazy-load a heavy third-party library and render its output into the shadow root. Follow this specialized recipe (full evaluation + enrichment roadmap in [`docs/RENDERER_COMPONENTS.md`](docs/RENDERER_COMPONENTS.md) — read it before building or enriching one, so it isn't re-analyzed):

- **Dependency**: the lib is a regular `dependency` (auto-installs with ranui — peerDependency is wrong here: yarn classic never auto-installs peers), reached only via a **dynamic `import()` inside `render()`**, so it lands as an async chunk only when the component actually renders. The ES build externalizes everything in `dependencies` (`RUNTIME_DEPENDENCIES` in `vite.config.ts`), so the lib resolves from the consumer's node_modules instead of being copied into `dist/`; only the CJS/IIFE single-file outputs inline it. Verify nothing static leaks into `index.js` (for `r-mermaid`: `dist/mermaid.js` is a 91-byte stub; the lib is a separate `mermaid.core-*` chunk. For `r-math`: `dist/math.js` is an 80-byte stub; `temml`, the Latin Modern font, and the script font are three separate lazy chunks). `r-math` uses **Temml → native MathML** (not KaTeX): Temml compiles LaTeX to MathML the browser lays out itself.
- **Source**: a URI-encoded attribute (`code` / `latex`, so multiline / `<|--` / `$$` survive HTML parsing) **or** `this.textContent.trim()`.
- **Errors → DOM, not console**: render an `::part(error)` box + dispatch an `error` CustomEvent (`bubbles+composed`). Both `r-mermaid` and `r-math` do this.
- **Theme**: `r-mermaid` uses `theme=auto|light|dark` with a `MutationObserver` on `documentElement` (disconnected in `disconnectedCallback`) because it bakes colors into its SVG and must re-render. `r-math` needs **none of that** — native MathML inherits `color` via `currentColor`, so `:host { color: var(--ran-color-text) }` flips light/dark in the same paint with zero JS.
- **Bundled fonts for consistency (r-math)**: MathML's appearance depends on the reader's system math font, so `r-math` bundles **Latin Modern Math** (+ a small script/prime face), inlined as `?inline` data-URIs, **dynamically imported** (own lazy chunk — never eager in the barrel) and registered **once at the document level** (Chromium ignores `@font-face` inside a shadow root). See `assets/fonts/LICENSE.md`.
- **`r-markdown`** is the composed renderer: parser chunk (marked + DOMPurify + remend) lazy, shiki lazy + opt-in, and it embeds `<r-mermaid>` / `<r-math>` for fences / math instead of re-implementing them. Streaming = `remend` (closes half-streamed markdown) → `parseMarkdownIntoBlocks` (marked lexer) → re-render only the block whose text changed. Everything ranui adds to the rendered HTML (code header, buttons, wrappers, `<r-mermaid>`/`<r-math>`) is built with the builder; only markdown-produced nodes are located by query.
- **Interactive controls (fullscreen / zoom-pan / copy / download) are opt-in** boolean attributes — a bare element renders a clean static result. Reuse existing mechanisms: **`r-modal`** for the fullscreen overlay, the `r-colorpicker`/`r-player` pointer-drag idiom (`range()` + `getBoundingClientRect()`) + a `wheel`/`transform:scale()` for pan-zoom, `<r-icon>`+`registerIcon` for toolbar buttons (the pattern `r-player` itself now uses throughout — see `docs/PLAYER_ROADMAP.md` §1.4). Do **not** reinvent overlay/focus-trap.

### Name-driven lazy variant loading (`r-loading`, `r-icon`)

For a component whose `name=""` attribute selects one of **many mutually-exclusive, self-contained variants** (each with its own DOM + CSS), do **not** put every variant in one `index.ts` + one monolithic `index.less`. A single component that statically references all variants (e.g. a `NAME_MAP` of every render fn, or one `?inline` LESS blob with all 29 animations) **defeats tree-shaking**: using `name="circle"` still bundles all variants' JS and injects all their CSS. `name` is resolved at runtime, so the bundler can't statically know which variant is needed.

The fix keeps the `name` API and adds **zero** consumer imports — usage stays `<r-loading name="circle">` / `<r-icon name="home">`:

- **Co-locate each variant** as its own module owning its DOM builder **and** its CSS: `variants/<name>/index.ts` (`import css from './index.less?inline'; export default { css, render } satisfies LoadingVariant`). See `components/loading/variants/*` and its `types.ts`.
- **Shell maps `name` → a dynamic `import()`.** Auto-generate the table with `import.meta.glob('./variants/*/index.ts', { import: 'default' })` (no hand-maintained list — adding a folder is enough). Vite code-splits each variant (JS + inlined CSS string) into its own async chunk; the consumer downloads only the `name` it uses. Inject the resolved variant's CSS on demand with `adoptStyles(this._shadowDom, variant.css)` (cached per cssText, idempotent across instances).
- **Sync-core the common few** to avoid an async flash on the default: statically `import` the default + high-frequency variants (loading: `circle` + `dot`) into the shell and render them synchronously; lazy-load the rest. The `[INEFFECTIVE_DYNAMIC_IMPORT]` build warning for those is **expected and desired** — you _want_ them in the entry chunk.
- **Guard the async race**: bump a render token before each render; in the `.then`, bail if the token changed (name switched mid-load). Expose the in-flight `Promise` (e.g. `_pending`) so tests can `await` it — non-core variants render asynchronously now, so `loading.name = 'pacman'; await loading._pending` before asserting the DOM.
- **`r-icon` variant** of the same idea: builtins are a **known finite set** (`assets/icons/*.svg`), so a cache miss on a builtin name **lazy-loads that one SVG chunk** and `registerIcon`s it (the existing `ranui-icon-registered` event re-renders). This removes the registry chore for shipped icons entirely — `import 'ranui/icons'` (eager, all ~43) and per-icon `registerIcon` become opt-in, not required. `registerIcon` still exists for **custom** icons (the lib can't know arbitrary user SVGs). There is no eager "core" subset — every builtin, including ones ranui's own components reuse by name (e.g. `<r-mermaid>`'s `<r-icon name="copy">`, `r-player`'s `fullscreen`), goes through the same lazy path and pays one async fetch on first use. A component that needs its own chrome available with zero fetch should self-register that icon instead (see r-select's `arrow-down`).
- **SSR-safe for free**: rendering happens in `connectedCallback` / a `document`-guarded method, which SSR serialization never calls, so no dynamic import fires during SSR.

### Registering in the package

After creating `components/mycomp/index.ts`:

1. **`index.ts`** — add both lines:

   ```ts
   export * from '@/components/mycomp'; // types
   import '@/components/mycomp'; // side-effect registration
   ```

2. **`vite.config.ts`** — add entry to `es.lib.entry`:

   ```ts
   mycomp: resolve(__dirname, 'components/mycomp/index.ts'),
   ```

3. **`package.json`** — add export:
   ```json
   "./mycomp": {
     "types": "./dist/index.d.ts",
     "import": "./dist/mycomp.js",
     "require": "./dist/index.cjs"
   }
   ```

---

## Utility Reference

### `utils/component.ts`

```typescript
// Create or reuse shadow root (cached via WeakMap, applies CSS)
ensureShadowRoot(host: HTMLElement, cssText?: string, options?: ShadowRootInit): ShadowRoot

// Query element from shadow root; if missing, run factory() and append
ensureShadowElement<T>(root: ShadowRoot, selector: string, factory: () => T): T

// getAttribute with fallback (null → fallback)
getStringAttribute(element: HTMLElement, name: string, fallback?: string): string

// setAttribute. A null/undefined value writes the EMPTY STRING, not nothing —
// `removeEmpty: true` is what removes the attribute, for null/undefined and ''
// alike. Reach for it whenever a `:host(:not([attr]))` rule depends on absence.
setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined, options?: { removeEmpty?: boolean }): void

// Sets/removes boolean attribute, optionally mirrors to aria-{aria}
setBooleanAttribute(element: HTMLElement, name: string, value: boolean, options?: { aria?: string }): void

// Calls adoptSheetText when sheet attribute changes; noop if name!='sheet' or old===new or sheet empty
syncSheetAttribute(host: HTMLElement, root: ShadowRoot, name: string, old: string | null, next: string | null): void
```

### `utils/builder/` — Fluent DOM builder

> **DESIGN INVARIANT — fine-grained, build-once. Do not regress this.**
> A view function runs **once**; a state change updates only the exact node bound
> to a signal. There is **no re-render of a view/component on state change** — that
> is the React/JSX model this builder exists to avoid. When you need reactive
> structure, use the primitive that matches the shape, never a coarser one:
>
> - **value** → a getter binding: `.text(getter)`, `.attr/.class/.style(…, getter)`
> - **conditional** → `Show` (1 branch) / `Switch`+`Match` (n branches) — rebuilds
>   only when the chosen branch flips
> - **list** → `For` (keyed, by identity) / `Index` (by position, item is a signal)
> - a raw getter child (`() => node`) is the **coarse escape hatch** — it rebuilds
>   its whole region on every read; use it only for content that truly changes
>   shape each update, never for a plain conditional or list.
>
> When adding API, never introduce anything that re-runs a whole view/subtree on a
> state change. Reactivity flows through fine-grained bindings + these primitives.

```typescript
// Factory functions (all return ElementBuilder<T>)
Div()      // → ElementBuilder<HTMLDivElement>
Span()     // → ElementBuilder<HTMLSpanElement>
Slot()     // → ElementBuilder<HTMLSlotElement>
ButtonBuilder()
InputBuilder()
Label(), Style(), Ul(), Li()
Section(), Article(), Nav(), Header(), Footer(), Main()

// ElementBuilder chainable API
.id(v)               .class(name)         .addClass(...names)
.attr(name, value)   .attrs(record)       .boolAttr(name, bool)
.part(value)         .data(key, value)    .style(key, value)
.cssVar(name, value)                      // sets --name
.aria(key, value)    .role(value)         .tabIndex(n)
.label(v)            .ariaHidden(bool)
.on(type, listener, options)              // permanent, build-time
.listen(manager, type, handler, options)  // lifecycle-managed via EventManager
.children(...items)  .text(value)         .ref(holder)
//   children() items may be nodes/strings/builders/arrays/null, a getter
//   () => node|node[]|null (reactive region — coarse: full rebuild on change),
//   Show({when,children,fallback}) for a FINE-GRAINED conditional (rebuilds only
//   when truthiness flips), or For({each,key,render}) for a KEYED list (reuses
//   nodes). Prefer Show/For over a raw getter; getters/For/Show render once on SSR.
.build(): T          // returns the DOM element
// Typed ref to a custom element's imperative methods: import its class and
//   createRef<Popover>() (from 'ranui') → ref.current?.closePopover() — no cast.
```

**Example:**

```typescript
const header = Div()
  .class('ran-mycomp-header')
  .attr('part', 'header')
  .role('heading')
  .children(Div().class('ran-mycomp-title').attr('part', 'title'), Slot().attr('name', 'extra').attr('part', 'extra'))
  .build();
```

### `utils/builder/events.ts` — EventManager

Centralises lifecycle-bound listeners with `AbortController`. Import from `@/utils/builder`.

```typescript
import { EventManager } from '@/utils/builder';

// In component class:
private _events = new EventManager();

connectedCallback(): void {
  this._events
    .on(this._input, 'input', this.handleInput)
    .on(this._slot, 'slotchange', this.handleSlotChange)
    .on(this, 'click', this.handleClick, { capture: true });
}

disconnectedCallback(): void {
  this._events.abort(); // removes every listener, resets for next connect
}
```

| API                                           | Description                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `manager.on(target, type, handler, options?)` | Register listener scoped to manager's signal. Fluent — returns `this`.      |
| `manager.abort()`                             | Remove all listeners, reset `AbortController`. Safe to call multiple times. |
| `manager.signal`                              | The raw `AbortSignal` — pass to `addEventListener` directly when needed.    |

**When to use `.on()` vs `.listen()` vs `EventManager.on()`:**

|               | `ElementBuilder.on()`                   | `EventManager.on()` / `.listen()`          |
| ------------- | --------------------------------------- | ------------------------------------------ |
| Registered at | Build time (constructor)                | Connect time (`connectedCallback`)         |
| Removed when  | Element GC'd                            | `manager.abort()`                          |
| Use for       | Permanent internal shadow DOM listeners | Any listener needing cleanup on disconnect |

### `utils/builder/signal.ts` — Reactive primitives

Fine-grained reactivity (SwiftUI `@Observable` / Solid.js signals). Auto-tracks dependencies — no manual subscription.

```typescript
import { signal, createEffect, computed, batch } from '@/utils/builder';

// signal — reactive value, [getter, setter] tuple
const [count, setCount] = signal(0);
const [name, setName] = signal('Jane', { equals: (a, b) => a === b });

count(); // read — auto-subscribes inside createEffect / computed
setCount(1); // write — notifies dependents; skips if unchanged
setCount((n) => n + 1); // updater form

// createEffect — runs immediately, re-runs when read signals change
// Before each re-run: removes itself from signals it no longer reads (stale-subscription cleanup)
// On dispose: removes from all signals (GC-safe)
const dispose = createEffect(() => {
  el.textContent = `${count()}`;
  return () => {
    /* optional cleanup before re-run */
  };
});
dispose(); // stop tracking, remove all subscriptions

// computed — derived read-only signal
const doubled = computed(() => count() * 2);

// batch — coalesce multiple writes into one effect flush
batch(() => {
  setCount(0);
  setName('reset');
}); // effects run once, not twice
```

**SwiftUI parallel:**

| JS               | SwiftUI                                               |
| ---------------- | ----------------------------------------------------- |
| `signal()`       | `@State` / `@Observable` property                     |
| `createEffect()` | `body` (auto-tracks; cleans stale deps before re-run) |
| `computed()`     | Swift computed property                               |
| `batch()`        | Automatic mutation coalescing in same event handler   |

**Page section pattern** (signal + EventManager together):

```typescript
function initSection(container: HTMLElement) {
  const [value, setValue] = signal('');
  const scope = new EventManager();

  const output = Span().build();
  const input = InputBuilder()
    .listen(scope, 'input', (e) => setValue((e.target as HTMLInputElement).value))
    .build();

  const dispose = createEffect(() => {
    output.textContent = value();
  });
  container.append(input, output);
  return () => {
    dispose();
    scope.abort();
  };
}
```

#### Using reactivity **inside a component** (signal / createEffect)

Most components need no signals at all — their reactive source is **attributes**, so
the canonical pattern (imperative sync in `attributeChangedCallback`) already has the
correct lifecycle for free. Reach for signals only when you have **several
interdependent internal states** (e.g. colorpicker's HSV↔RGB↔alpha). When you do,
follow these rules:

- **A getter binding / effect only auto-disposes inside an active `createRoot`.** A
  component's `constructor` **and** `connectedCallback` are _not_ reactive scopes
  (`currentOwner` is `null`), so an effect created there is **orphaned** — never
  disposed. Two failure modes: (1) if the signal outlives the element (a module-level
  or shared store), the signal's `observers` set pins the effect → pins the element →
  **it can't be GC'd after removal**; (2) the effect's cleanup never runs and it keeps
  firing on a detached node. A per-instance signal doing a pure DOM binding forms an
  isolated cycle that GC _can_ still collect, but you lose cleanup — so don't rely on it.
- **Don't use `Div().text(getter)` getter bindings in component code.** Reserve getter
  bindings for `createRoot`-scoped page/route glue. Inside a component, build with
  **plain values** and either sync imperatively in `attributeChangedCallback`, or drive
  updates with explicit `createEffect`s whose dispose functions you **collect and call
  on disconnect**. Canonical example — `components/colorpicker` (`setupEffects` pushes
  disposers into `_effectDisposers`; `disposeEffects` runs them in `disconnectedCallback`):

  ```typescript
  private _disposers: Array<() => void> = [];

  private setupEffects = (): void => {
    this._disposers.push(
      createEffect(() => { this._el.textContent = this._value(); }),
    );
  };

  connectedCallback(): void {
    // ...build DOM once...
    if (this._panelBuilt && this._disposers.length === 0) this.setupEffects(); // re-arm
  }
  disconnectedCallback(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
  ```

- **Keep effect setup and teardown lifecycle-symmetric.** If you `disposeEffects()` on
  every `disconnectedCallback`, you must be able to **re-arm** them on reconnect —
  otherwise a moved/re-parented element (a spec-supported disconnect→reconnect) goes
  silently inert. If effects are built lazily (e.g. once when a panel first opens),
  guard `connectedCallback` to re-run setup when the DOM already exists but the
  disposers were cleared (`if (this._built && this._disposers.length === 0) this.setupEffects();`).

> **Leak footgun — reactive builder bindings without an owner.** `ElementBuilder`
> accepts a getter (`Div().text(mySignal)`, `.class(() => …)`) which creates an
> effect **owned by the current reactive scope**. A component **constructor has no
> owner**, so a getter binding built there (the canonical ranui pattern) never gets
> disposed: the signal keeps the effect — and the element it closes over — alive,
> and the effect keeps firing after `disconnectedCallback`. Inside a component,
> either pass **plain values** to the builder and update them imperatively in
> `attributeChangedCallback`, or drive updates with an explicit `createEffect`
> whose dispose you collect and call on disconnect (see `components/colorpicker`
> `setupEffects` / `_effectDisposers`). Reserve getter bindings for code that runs
> inside a `createRoot` (page/route glue), where the scope disposes them for you.

### `utils/ssr-registry.ts`

```typescript
defineSSR(tagName: string, ctor: new () => HTMLElement): void
// Browser: customElements.define(tagName, ctor)
// SSR: stores in registry Map

getSSRConstructor(tagName: string): (new () => HTMLElement) | undefined
getSSRRegistry(): ReadonlyMap<string, new () => HTMLElement>
```

`RanElement` is exported from `utils/index.ts`:

```typescript
export const RanElement = HTMLElementSSR()!;
// Returns HTMLElement in browser, HTMLElementMock in SSR
```

### `utils/theme.ts`

Light/dark only — **there are no theme packs** (they were removed; `setThemePack`/`getThemePack`/`RanThemePackName` no longer exist). The token system is Geist-based; see [docs/DESIGN.md](docs/DESIGN.md) and [docs/THEME_STYLE_SYSTEM_DESIGN.md](docs/THEME_STYLE_SYSTEM_DESIGN.md).

Exported from the `ranui` barrel **and** from the dedicated **`ranui/theme`** subpath entry
(`theme.ts` → built to `dist/theme.js`), which registers no custom elements — consumers who
only want tokens/dark mode can `import { initTheme } from 'ranui/theme'` without the
components. Documented at `docs/src/ranui/theme/`.

```typescript
type RanThemeName = 'light' | 'dark' | 'system'
type ThemeTarget = HTMLElement | Document

initTheme(target?: ThemeTarget): void       // call once on page load; restores from localStorage
setTheme(name: RanThemeName, target?: ThemeTarget): void   // 'system' tracks prefers-color-scheme
getTheme(target?: ThemeTarget): RanThemeName | ''
setThemeToken(name: string, value: string | number, target?: HTMLElement): void
clearThemeToken(name: string, target?: HTMLElement): void
setThemeTokens(tokens: Record<string, string | number | null | undefined>, target?: HTMLElement): void
```

localStorage key: `'ran-theme'`. SSR-safe (all `document`/`localStorage` access guarded).

Dark mode is a single source of truth: `theme/dark.less` redefines only the base scale via the `.ran-theme-dark()` mixin; semantic tokens reference the scale and flip automatically.

**Dark-mode activation signals** (any one turns on dark tokens on `:root`):

- `@media (prefers-color-scheme: dark)` — system default, unless explicitly overridden to light (`[data-ran-theme='light']`, `[theme='light']`, or `.light`).
- `[data-ran-theme='dark']` — set by `setTheme()` / `initTheme()` (the canonical API).
- `[theme='dark']` — legacy attribute, still honored.
- `.dark` class — the Tailwind / VitePress convention, so class-based consumers get dark tokens with **zero glue** (no JS bridge). Prefer this when integrating a host that already toggles a `.dark` class.

Because dark is class-drivable, a host that flips `.dark` synchronously (e.g. VitePress) switches ranui **in the same paint** — no attribute-sync lag.

### `utils/i18n/index.ts` — framework-agnostic i18n

**The engine lives in ranuts** (`ranuts/i18n` → `packages/ranuts/src/utils/i18n.ts`); this
module is a re-export so `@/utils/i18n`, `ranui/i18n` and the `ranui` barrel keep working
unchanged. It moved because nothing in it touches the DOM or a component, and the locale
plumbing it needs (guarded `localStorage`, navigator matching) already lived in ranuts.
`detectNavigator` now goes through ranuts' `resolveLocale`, which reads the whole ordered
`navigator.languages` list instead of only `navigator.language`.

Same core/singleton shape as the router. Exported from the `ranui` barrel **and** from the
dedicated **`ranui/i18n`** subpath entry (`i18n.ts` → built to `dist/i18n.js`), which
registers no custom elements so consumers can `import { createI18n } from 'ranui/i18n'`
without pulling in every component. `MessageDict` is **flat** (`t()` does a direct
`messages[locale][key]` lookup) — keys are literal strings like `'hero.title'`, not nested
objects. `t(key, params)` interpolates `{name}` placeholders; `{{`/`}}` escape to literal
`{`/`}` (Rust/Python/.NET `format` convention) — a lone or spaced brace is left as-is, so
CSS/JSON in a message is safe. Persisted locale key: `'ran-locale'`. Documented at
`docs/src/ranui/i18n/`.

```typescript
const i18n = createI18n({ messages: { en, zh }, fallbackLocale: 'en', persist: true, detectNavigator: true });
useI18n()!.t('hero.title', { name }); // fallback locale → key; {param} interpolation
useI18n()!.setLocale('zh'); // persists; notifies onChange subscribers
```

`I18nCore`: `t` / `setLocale` / `getLocale` / `onChange(fn)→unsub` / `addMessages` / `getMessages` / `availableLocales` / `destroy`. SSR-safe.

### `utils/dom.ts`

```typescript
const falseList = [false, 'false', null, undefined]
isDisabled(element: Element): boolean   // getAttribute('disabled') not in falseList
```

### `utils/router/index.ts` — Client-side Router

JS routing engine. Exported from the public `ranui` barrel as `createRouter`, `useRouter`, `RouterCore`, `enableMpaViewTransitions`.

```typescript
import { createRouter, useRouter, enableMpaViewTransitions } from 'ranui';
import type { RouterConfig, RouteLocation, NavigationGuard, RouteChangeHandler, ViewTransitionMode } from 'ranui';
```

**`createRouter(config?)`** — creates and registers a global `RouterCore` singleton. Call once, before any `r-router` element connects.

```typescript
const router = createRouter({
  mode: 'history', // 'history' (default) | 'hash'
  base: '/app', // strip prefix from all paths
  routes: [
    // optional metadata; does not create DOM outlets
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'both', // false (default) | true/'spa' | 'mpa' | 'both'
});
```

**`useRouter()`** — returns the active `RouterCore` or `null`.

**`RouterCore` public API:**

| Method / Property                       | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| `push(path)` → `Promise<void>`          | Navigate, add history entry                 |
| `replace(path)` → `Promise<void>`       | Navigate, replace entry                     |
| `back() / forward() / go(delta)`        | Delegate to `window.history`                |
| `beforeEach(guard)` → `() => void`      | Add navigation guard; returns unsubscribe   |
| `afterEach(handler)` → `() => void`     | Post-nav hook; returns unsubscribe          |
| `onRouteChange(handler)` → `() => void` | Subscribe to every route change             |
| `onPageSwap(handler)` → `() => void`    | MPA `pageswap` event (MPA/both mode only)   |
| `onPageReveal(handler)` → `() => void`  | MPA `pagereveal` event (MPA/both mode only) |
| `currentRoute`                          | `RouteLocation \| null`                     |
| `destroy()`                             | Remove listeners and injected CSS           |

**`_bind(component)` / `_unbind(component)`** — called by `r-router` in `connectedCallback` / `disconnectedCallback`. Registers the DOM element so `RouterCore._notify()` can call `_syncRoutes()` on it directly without an event bus.

**View Transitions:**

| `viewTransition`  | Behavior                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `false` (default) | No transition                                                                                         |
| `true` / `'spa'`  | Wraps `syncDOM()` in `document.startViewTransition()` (Chrome 111+)                                   |
| `'mpa'`           | Injects `@view-transition { navigation: auto }` into `<head>`; adds `pageswap`/`pagereveal` listeners |
| `'both'`          | Both spa + mpa                                                                                        |

**SSR / SSG compatibility:**

- `RouterCore` constructor: safe — no browser API access in constructor body.
- `_getCurrentPath()`: returns `'/'` when `typeof window === 'undefined'`.
- `push()` / `replace()`: skip `history.pushState` / `replaceState` in SSR but still run guards and `_notify()`.
- `back()` / `forward()` / `go()`: no-op in SSR.
- `injectMpaTransitionStyle()`: guarded with `typeof document === 'undefined'`.
- `_enableMpa()`: `window.addEventListener` is guarded.
- `r-router`, `r-route`, `r-link` components: SSR-safe via `RanElement` + `defineSSR` (same as all other components). `connectedCallback` is not called during SSR serialization, so `window` access inside it is not a concern.

**`enableMpaViewTransitions()`** — standalone helper; injects the `@view-transition` style without a router. Returns a cleanup function that removes the style element.

---

## LESS Conventions

Every component's `index.less` automatically receives `@import "base.less"` via Vite preprocessor config. **Never import base.less manually.**

### CSS variable naming tiers

```less
/* Global semantic tokens (provided by theme + theme packs) */
--ran-color-primary        /* #2563eb default */
--ran-color-success
--ran-color-warning
--ran-color-danger
--ran-color-bg             /* page background */
--ran-color-bg-elevated    /* card/surface */
--ran-color-bg-muted       /* subtle surface */
--ran-color-text
--ran-color-text-secondary
--ran-color-text-disabled
--ran-color-border
--ran-color-border-secondary
--ran-color-link

--ran-radius-sm 6 | --ran-radius-md 12 | --ran-radius-lg 16 | --ran-radius-full
--ran-space-1..24          /* 4 8 12 16 24 32 40 64 96 */
--ran-size-1..7            /* 16 18 20 24 28 30 32 — element dimensions (icons, controls), separate from Spacing */
--ran-text-heading-1..4 (32/24/20/16) | -label-1..3 (14/13/12) | -copy-1..2 (16/14) | -button-size (14)
--ran-text-heading-weight 600 | -label-weight 500 | -copy-weight 400 | -button-weight 500 | -mono-weight-regular/medium 400/500
--ran-shadow-elevated | --ran-shadow-menu | --ran-shadow-modal | --ran-focus-ring
--ran-z-modal 1000 | --ran-z-dropdown 1100 | --ran-z-message 1200   /* overlay stacking ladder; see DESIGN.md §4 */

/* Geist base scales (rarely used directly; semantic tokens map onto them) */
--ran-gray-100..1000 | --ran-gray-alpha-100..1000
--ran-blue/red/amber/green-100..1000 | --ran-background-100/200

/* Skin layer — only these four remain (pack-only ones were removed) */
--ran-skin-font-family
--ran-skin-border-width
--ran-skin-border-style
--ran-skin-raised-shadow

--ran-motion-duration-fast | --ran-motion-duration-base

/* Component-scoped tokens (always provide fallback) */
--ran-card-gap, var(--ran-space-4, 16px)
--ran-card-padding, var(--ran-space-4, 16px)
--ran-card-radius, var(--ran-radius-md)
--ran-card-background, var(--ran-color-bg-muted)
--ran-card-shadow, none
--ran-card-min-height, 0
--ran-card-title-color, var(--ran-color-text)
--ran-card-title-font-size, var(--ran-text-heading-4, 16px)
--ran-card-title-font-weight, var(--ran-text-heading-weight, 600)
--ran-card-description-color, var(--ran-color-text-secondary)
--ran-card-description-font-size, var(--ran-text-copy-2, 14px)

/* Button example */
--ran-btn-background, var(--ran-color-primary, #1890ff)
--ran-btn-color, #fff
```

### LESS template for a new component

```less
:host {
  display: var(--ran-mycomp-display, block);
  box-sizing: border-box;
}

.ran-mycomp {
  padding: var(--ran-mycomp-padding, 16px);
  border-width: var(--ran-skin-border-width, 1px);
  border-style: var(--ran-skin-border-style, solid);
  border-color: var(--ran-color-border);
  border-radius: var(--ran-mycomp-radius, var(--ran-radius-md));
  background: var(--ran-mycomp-background, var(--ran-color-bg-elevated));
  box-sizing: border-box;

  &-title {
    color: var(--ran-mycomp-title-color, var(--ran-color-text));
    font-size: var(--ran-mycomp-title-font-size, 16px);

    &:empty {
      display: none;
    } /* hide empty text nodes */
  }
}
```

---

## Component Reference

### r-card

A structured content container with header, body, and footer zones.

```html
<r-card title="Card Title" description="Optional subtitle" sheet=".ran-card { background: red; }">
  <!-- Default slot: body content -->
  <p>Body content goes here</p>

  <!-- extra slot: right side of header (badges, links, actions) -->
  <span slot="extra" class="badge">tag</span>

  <!-- footer slot: shown only when this slot has assigned elements -->
  <a slot="footer" href="#docs">View notes</a>
</r-card>
```

**Attributes / Properties:**

| Name          | Type     | Default | Description                                   |
| ------------- | -------- | ------- | --------------------------------------------- |
| `title`       | `string` | `''`    | Card heading (hidden when empty via `:empty`) |
| `description` | `string` | `''`    | Subtitle below title (hidden when empty)      |
| `sheet`       | `string` | `''`    | CSS injected into shadow DOM                  |

**Header visibility:** Controlled by `:host(:not([title]):not([description])) .ran-card-header { display: none }` — header is invisible when neither attribute is set.

**Footer visibility:** Controlled by `slotchange` on `slot[name="footer"]` — footer `div` starts with `style.display='none'`, shown when `slot.assignedElements().length > 0`.

**`::part()` exports:** `card`, `header`, `title`, `description`, `extra`, `body`, `footer`

**CSS variables exposed:** `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-shadow`, `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`

**Styling override example:**

```css
/* Via CSS variables */
.my-section r-card {
  --ran-card-background: var(--surface-2);
  --ran-color-border: var(--line);
  --ran-card-min-height: 148px;
}

/* Via ::part() */
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

---

### r-conversation

Renders an append-only event log as a conversation. It owns the three things that are
tedious and easy to get wrong, and nothing else: projecting events into nodes, keeping the
view pinned to its floor without fighting the reader, and reconciling rows against the node
list. What a message or a tool call _looks like_ is a registered view, not the element's
business.

The projection is [`ranuts/conversation`](../ranuts/CLAUDE.md); bottom-follow is
`createBottomFollower` from `ranuts/utils`. Read those before writing a view — the rules
about cadence and scroll ownership live there.

```ts
const chat = document.querySelector('r-conversation')!;

chat.register({
  kind: 'message',
  // Which events are mine, and which node they belong to.
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // Fold them into my own state.
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // Per-token deltas coalesce to one repaint per frame; discrete facts do not wait.
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // How that state reaches the screen.
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    (el as Markdown).content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });
```

Rules that bite if broken:

- **Register every view before the first `push`.** The projection is built once from the
  registered set, so a later registration would silently miss every event already folded
  in. It throws rather than doing that.
- **`update` folds state; `patch` writes it to the DOM.** They are named apart because they
  are different jobs — `patch` folds nothing, and runs once per frame on a streaming row.
- **`mount` is optional.** A view without it contributes state that other views read
  through `reader.previous`, and renders nothing.
- **Rows keep the position they opened in.** A streaming message does not jump to the end
  of the list on every delta.
- **`r-markdown` is the intended row for prose.** It already closes half-streamed
  `**bold`, backticks, links and `$$` math in `mode="streaming"` — do not re-solve that in
  a view.

**`batch(run)` for any replay, restore, or bulk insert.** Without it every event publishes
and every publication walks the whole transcript. Restoring 600 messages that way was 5.4
seconds of blocked main thread, measured in a browser; batched it is 158ms. A live stream
does not need it. The element also patches only the rows the engine reports as changed, so
one delta into a long transcript writes one row.

**Long transcripts are a layout problem, not a markup one.** Every streamed delta changes
the last row's height and the bottom-follower reads `scrollHeight` right after, which lays
out the whole column. Rows therefore carry `content-visibility: auto` with
`contain-intrinsic-size: auto 8rem`: the browser skips layout and paint for off-screen rows
while leaving them in the DOM, so find-in-page, text selection and screen readers still see
the whole conversation — which is exactly what windowing gives up. On a 3000-message
transcript that took streaming from 45ms per frame to 8ms, and replay from 1.8s to 311ms.
Virtualization was considered and is not here: the measured cost was layout, and this
removes it without removing the transcript.

**`truncate(key)` cuts the conversation.** Editing a message, regenerating an answer and
branching are one operation: the conversation diverges at a row, and every row opened after
it goes with it. It returns how many rows went; zero means no such row is live.

Bottom-follow: on by default, `follow="false"` leaves the reader in control from the start.
The element fires `pinnedchange` with `detail.pinned` so a "jump to latest" affordance can
track it, and `scrollToBottom()` takes control back. For paging in older content, call
`captureAnchor()` before the prepend and `restoreAnchor()` after, so the reader keeps
looking at what they were looking at.

**A cut needs one of the two, deliberately chosen.** Truncating shrinks the transcript, and
the follower reads a shrinking scrollport as the reader having scrolled up — it was not the
reader. After an edit or a regeneration `scrollToBottom()` is right: what the reader wants
is the end of what is left. After switching between alternatives it is wrong: they are
comparing two answers at one point, the alternatives differ in length, and the floor is
somewhere else — hold the row with `captureAnchor` / `restoreAnchor` instead.

**Rows live in a closed shadow root.** A listener on the page cannot see them in
`composedPath()`, so a row that offers controls must dispatch its own
`composed: true` CustomEvent carrying what was clicked. Reading the path from outside
silently finds nothing.

---

### r-tool-card

Renders a tool call and its result from a **declared intent** rather than from markup.

A tool that returns HTML has picked a renderer, a theme, and a layout on the UI's behalf,
and it does so in the one place — the model-facing result — where UI concerns do not belong.
Declaring an intent keeps the two apart: the tool names the shape of what it did, and each
surface renders that shape its own way.

```ts
const card = document.querySelector('r-tool-card')!;
card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';
// …later
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';
```

Card kinds: `generic` (title, key/value input, content), `terminal` (command, cwd, output,
exit code), `diff` (per-file hunks, rendered through `diffLines` from `ranuts/utils`; a null
`oldText` means the file is being created). Any `locations` on a call render as buttons that
fire `locationclick`, so an editor can jump to what the tool touched.

Two rules, both from the same place — these views are computed on a live call **and again
when a log is replayed**:

- **A view is a pure function of the call's arguments** (plus the result, for a result
  view). No I/O, no clock, no session state, or a replay disagrees with what the user
  originally saw. A `diff` built at call time uses `oldText: null` for a create precisely
  because a caller has no prior content to read.
- **An unrecognised card degrades, it never throws.** A newer producer's card kind, or a
  value mangled in storage, renders as `generic` with whatever title it has. Display must
  not be able to break a replay — the element treats anything it does not recognise as
  generic, and a malformed view renders empty rather than raising.

Use it as a `mount` target from an `r-conversation` view: the tool-call node's `patch`
assigns `call`, `result` and `status`.

---

### r-reasoning

A collapsible chain of thought.

Reasoning is the one part of a response a reader wants to watch while it happens and almost
never wants to keep afterwards, so the element expands while `streaming` is set and
collapses when it clears.

**Until the reader touches it.** Once they expand or collapse it themselves — or a caller
sets `open` from script — the automatic behaviour stops for good. That is the same
ownership rule `createBottomFollower` applies to scrolling, for the same reason: an
interface that keeps re-deciding something the reader already decided is worse than one
that never decided at all.

```ts
const reasoning = document.querySelector('r-reasoning')!;
reasoning.streaming = true; // expands
reasoning.content += delta; // grows while visible
reasoning.duration = 4200; // "4.2s" beside the label
reasoning.streaming = false; // collapses, unless the reader intervened
```

Sub-second durations render as nothing: a reader cares that it was fast, not that it was
340ms. The default slot replaces the rendered text, for a caller that wants `<r-markdown>`
in the body. `ranuts/stream` already separates `reasoning-delta` from `text-delta`, so a
conversation view can feed this directly from `snapshot().blocks`.

### r-attachments

The files staged alongside a message: it holds the list, previews it, validates what
arrives, and owns the object URLs it creates.

It does **not** collect files. Paste, drag-and-drop and a file picker are three gestures
belonging to three different elements of a composer, and which of them an app offers is the
app's decision — call `add()` from whichever it wires.

```ts
input.addEventListener('paste', (e) => {
  // Only when the clipboard actually carries files; intercepting every paste breaks pasting
  // text, which is what the box is mostly for.
  if (e.clipboardData?.files.length) {
    e.preventDefault();
    strip.add(e.clipboardData.files);
  }
});
```

- **Previews are object URLs, not data URLs.** Previewing costs a reference to bytes the
  browser already holds; reading a 10 MB photo into base64 to show a 40px thumbnail costs
  the string. The data URL is built later, once, by whoever sends. Every URL created here is
  revoked here — on detach, on clear, and on disconnect.
- **Rejection is reported, never silent.** A file that vanishes because it was 3 MB over a
  limit nobody mentioned reads as a bug in the page. `attachmentrejected` carries the file
  and one of `too-large` / `type-not-accepted` / `too-many` / `duplicate`.
- **The same file twice is a slip, not an instruction** — name, size and modification time
  together, which is what a file manager treats as the same file.
- **`detach(id)`, not `remove(id)`.** Every element already has a `remove()` that takes no
  arguments and takes itself out of the document; shadowing it with different semantics is
  a trap for anyone reaching for the standard method.
- The thumbnail's alt text is **the file name**, not "image": four attachments all announced
  as "image" have told the reader nothing about which is which. Each remove button is named
  after its file for the same reason.

### r-voice-button

Dictation for a text composer, over `createSpeechRecognizer` from `ranuts/utils`.

A microphone button, and nothing else. It owns the capture and reports what was heard;
where that text goes is the caller's decision, because a component that also wrote into an
input would have to know which input, whether to append or replace, and what to do about
the caret — three answers that differ per app.

```ts
const mic = document.querySelector('r-voice-button')!;
let base = '';
mic.addEventListener('voicestart', () => {
  base = input.value;
});
mic.addEventListener('voiceresult', (e) => {
  input.value = base + e.detail.transcript; // the whole capture, revised as it firms up
});
```

Decisions worth not re-litigating:

- **It does not send.** Recognition is wrong often enough that committing on the speaker's
  behalf takes away the review they need. It fills the box and stops.
- **The whole capture is reported, not the newest fragment.** Interim results are revised,
  so a consumer that appended each event would end up with `你好你好世界`. Remember the
  text that was already there and concatenate once.
- **It hides itself where speech recognition does not exist** — Firefox, and anything with
  the API absent. `hidden`, not `disabled`: disabled says "not now", absent says "not here".
- **Only `denied` and `failed` are worth showing.** `noSpeech` and `aborted` are a silent
  pause and a programmatic stop; they arrive through the same channel as a real failure and
  are not one. Showing them nags after every capture.
- **`toggle()` reads the recognizer, not the reflected attribute.** The attribute follows
  the platform's start event, and a capture that has begun without reporting it would leave
  the two disagreeing — the next activation would try to open a second capture, be refused,
  and the button would sit there doing nothing.
- **The accessible name changes with the state**, not only the icon, and `aria-pressed`
  carries the toggle. Escape discards a capture rather than committing it.
- **`lang` is read per capture** and defaults to the document's, so an app that switches
  locale mid-session dictates in the language it is showing.

## Testing

### Setup

- **Runner:** Vitest + jsdom
- **Config:** `vitest.config.ts` — include `test/unit/**/*.test.ts`
- **Setup file:** `test/setup.ts` — polyfills for `localStorage`, `matchMedia`, `ResizeObserver`
- **Coverage thresholds:** statements 80%, branches 70%, functions 85%, lines 80%

```bash
npm run test:unit          # run all unit tests once
npm run test:unit:watch    # watch mode
npm run test:unit:coverage # with coverage report
```

### E2E (Playwright)

```bash
npm run test:e2e           # provisions the browser, then runs the suite
npm run e2e:install        # provision only (idempotent — a no-op once installed)
npm run test:update        # refresh screenshot snapshots
npm run test:report        # open the last HTML report
```

`@playwright/test` being a devDependency only installs the **library** — the browser binaries
live outside `node_modules`, in `~/Library/Caches/ms-playwright`, and are not provisioned by
`pnpm install`. A fresh clone therefore used to fail every e2e test with
`browserType.launch: Executable doesn't exist`, which reads like a broken suite rather than a
missing download. `test:e2e` / `test:ui` / `test:update` now run `e2e:install` first, so that
cannot happen; `playwright install` exits immediately when the browser is already present, so
the guard costs nothing on repeat runs.

The `chromium` and `Mobile Chrome` projects both use Playwright's bundled Chromium, which
`e2e:install` provides. The **`Google Chrome` project uses `channel: 'chrome'`** — the real,
system-installed Google Chrome. It is deliberately not part of `e2e:install` (installing a
branded browser touches the OS, not `node_modules`); install Chrome normally, or run
`npx playwright install chrome`.

#### Visual regression is local-only, on purpose

`toHaveScreenshot` baselines are the 128 PNGs committed next to each spec under
`test/e2e/*.spec.ts-snapshots/`. Playwright puts the platform in the filename, so every one of
them ends in `-darwin.png`.

**There is no visual gate on CI, and that is a deliberate choice, not an oversight.** The Ubuntu
runner would look for `-linux.png`, find nothing, fail the first attempt with "A snapshot doesn't
exist, writing actual", then pass on retry against the file it just wrote — going green having
compared each screenshot with itself. A gate that cannot fail is worse than no gate, because it
looks like one. `ignoreSnapshots: !!process.env.CI` therefore turns screenshot comparison off
there, and `e2e.yml` gates on the **functional** assertions, which run identically on Linux.

Making it a real CI gate needs a second, Linux-rendered baseline set, generated in a container
matching the runner and committed alongside the macOS one — 128 more binaries and a container
step. That is the open option if visual regressions start slipping through; until then this is
recorded as a known gap rather than papered over.

> A hosted service (Argos) was wired in for exactly this and has been **removed**. Its token was
> never configured, so `if (process.env.ARGOS_TOKEN)` was always false: 77 `argosScreenshot`
> calls across 15 specs uploaded nothing, and the workflow named "Visual Regression" gated on
> nothing. An inert dependency that looks like coverage is worse than none. The `visual/` specs'
> assertions were converted to `toHaveScreenshot`, so no coverage was lost locally.

**`npm run test:update` rewrites tracked files.** It overwrites all 128 baselines and your next
commit carries them. Review that diff — a wholesale refresh silently absorbs a real regression
into the new baseline.

#### What cannot be screenshotted deterministically

Two things on the demo route defeat pixel comparison no matter how long you wait, and both are
now asserted functionally instead — don't reintroduce a screenshot for them:

- **A live `<video>`.** `#component-player` holds the demo's HLS stream; a decoding video never
  yields two identical frames. When a full-page shot has to include it, mask it
  (`{ mask: [page.locator('#component-player')] }`).
- **A full-page shot of the demo route with an overlay open.** `r-modal`'s dialog is
  `position: fixed` inside a **closed** shadow root, so no page locator can reach it and the
  only option is `expect(page)` — which drags the whole route into frame. Masking the player
  fixed chromium and Google Chrome but not the narrow Mobile Chrome viewport. The modal's
  appearance is covered deterministically by `modal — open` in `test/e2e/modal.spec.ts`, which
  mounts it in an isolated body.

`<canvas>` rasterisation is not bit-identical run to run either (~100px on the colorpicker
panel); that one assertion carries a `maxDiffPixels: 200` allowance rather than a mask.

**Residual flake: roughly 1 test in 3–4 full runs**, and not the same one twice — small
sub-pixel diffs on `r-tab`'s indicator and similar. Re-run before assuming a real regression.

#### Determinism rules for visual specs

Three things make component screenshots flaky, and all three have already bitten:

- **Animations do not stop at the shadow boundary.** Components use **closed** shadow roots, so
  `page.addStyleTag()` (document-level) and Playwright's `animations: 'disabled'`
  (`document.getAnimations()`) both miss them entirely, silently. The freeze that works is
  `contextOptions: { reducedMotion: 'reduce' }` in `playwright.config.ts`, which triggers the
  `REDUCED_MOTION_CSS` that `ensureShadowRoot` adopts _inside_ every root. Note the option must
  go through `contextOptions` — `@playwright/test` 1.61 has no top-level `use.reducedMotion`.
- **Wait for lazily-loaded variants, not for milliseconds.** `r-loading` / `r-icon` resolve
  `name` through a dynamic `import()`; use `settlePending(page, 'r-loading')` from `helpers.ts`
  rather than `waitForTimeout`.
- **Settle fonts before anything measures itself.** `isolatedSetup` awaits `document.fonts.ready`
  because components that cache their own layout (r-tab's sliding indicator) otherwise measure
  against fallback metrics and land a few pixels off, non-deterministically.

#### Reaching into a component from a spec

`host.shadowRoot` is **always `null`** — the roots are closed. Components expose theirs as the
`_shadowDom` instance property; use that. Two specs asserted through `host.shadowRoot`, silently
degraded to "element not found", and could never have passed.

Likewise, don't assert `toBeVisible()` on a host whose content is `position: fixed` inside the
shadow root (`r-modal`): `:host` is `position: static` with no box of its own, so Playwright
correctly reports it hidden. Assert on the shadow content instead.

### Test file naming

`test/unit/{component}.contract.test.ts` for component tests.
`test/unit/utils.{name}.test.ts` for utility tests.

### Canonical test structure

```typescript
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Card } from '@/components/card';
import '@/components/card'; // ensure customElements.define runs

describe('r-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // clean DOM between tests
  });

  it('renders shadow DOM structure', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-card')).not.toBeNull();
  });

  it('reflects attribute to internal element', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('title', 'Hello');
    expect((card as any)._titleEl.textContent).toBe('Hello');
  });

  it('skips attributeChangedCallback when old === new', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const spy = vi.spyOn(card as any, '_syncTitle');
    card.attributeChangedCallback('title', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('injects external CSS via sheet attribute (fallback path)', () => {
    const origCSS = window.CSSStyleSheet;
    try {
      class MockSheet {
        replaceSync() {
          throw new Error('force fallback');
        }
      }
      (window as any).CSSStyleSheet = MockSheet;

      const card = document.createElement('r-card') as Card;
      document.body.appendChild(card);
      card.setAttribute('sheet', '.ran-card { color: red; }');

      const shadow = (card as any)._shadowDom as ShadowRoot;
      expect(shadow.innerHTML).toContain('.ran-card { color: red; }');
    } finally {
      window.CSSStyleSheet = origCSS;
    }
  });
});
```

### Key patterns

| Task                       | How                                                                      |
| -------------------------- | ------------------------------------------------------------------------ |
| Access shadow DOM          | `(el as any)._shadowDom as ShadowRoot`                                   |
| Access private field       | `(el as any)._fieldName`                                                 |
| Spy on private method      | `vi.spyOn(el as any, '_methodName')`                                     |
| Simulate async slot update | `await new Promise(r => setTimeout(r, 50))`                              |
| Test sheet CSS injection   | Mock `CSSStyleSheet.replaceSync` to throw, then check `shadow.innerHTML` |
| Clean DOM between tests    | `document.body.innerHTML = ''` in `beforeEach`                           |

### jsdom limitations

- `slot.assignedElements()` always returns `[]` — cannot test slotchange-driven display logic end-to-end; test the initial `style.display` state instead
- `window.getComputedStyle` returns empty for shadow DOM CSS rules — test attribute and style values directly, not computed CSS
- `adoptedStyleSheets` is frozen — sheet injection tests require the mock pattern above

### Testing philosophy — why unit coverage alone is not enough

High unit-test coverage guarantees each component's **own API** is correct, but it does not guarantee the **assembled page** is correct. The gap lives at the integration layer.

| Layer                               | What it catches                                                                                             | What it misses                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Unit (`test/unit/`)                 | Attribute reflection, event dispatch, shadow DOM structure, CSS injection                                   | Layout interactions between components, slot projection into host, height/width in real parent context |
| Integration (`test/integration/`)   | Component-in-component layout, slot content rendering, CSS variable inheritance across component boundaries | Full user flows                                                                                        |
| Visual regression (screenshot diff) | Any unintended pixel change after a refactor                                                                | —                                                                                                      |

**Rule:** every time a bug is found on the demo page or in a composition scenario, the fix must be accompanied by an integration test that would have caught it. Do not rely on raising the unit coverage number to prevent that class of bug.

### Integration test patterns

File naming: `test/integration/{scenario}.test.ts`

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/card';
import '@/components/progress';
import '@/components/checkbox';
import '@/components/select/option';

describe('component composition', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Layout: percentage-height component inside a card ────────────────
  it('r-progress inside r-card has bounded height', () => {
    const card = document.createElement('r-card');
    const progress = document.createElement('r-progress');
    progress.setAttribute('percent', '72');
    card.appendChild(progress);
    document.body.appendChild(card);

    // host height must be a fixed token value, not unbounded
    const hostHeight = (progress as HTMLElement).style.getPropertyValue('--ran-progress-height');
    // or verify offsetHeight is not larger than a sane threshold
    expect(progress.clientHeight).toBeLessThan(50);
  });

  // ── Slot projection: label text inside r-checkbox ────────────────────
  it('r-checkbox projects label text via slot', () => {
    const cb = document.createElement('r-checkbox') as HTMLElement;
    cb.textContent = 'Accept terms';
    document.body.appendChild(cb);

    // shadow DOM must contain a slot element so light DOM is projected
    const shadow = (cb as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  // ── Custom element constructor rule ──────────────────────────────────
  it('document.createElement does not throw for any registered element', () => {
    // If a constructor calls this.setAttribute(), Chrome throws NotSupportedError.
    const tags = [
      'r-button',
      'r-input',
      'r-select',
      'r-option',
      'r-checkbox',
      'r-progress',
      'r-card',
      'r-tabs',
      'r-tab',
    ];
    for (const tag of tags) {
      expect(() => document.createElement(tag)).not.toThrow();
    }
  });
});
```

### Three integration bugs and their test signatures

These bugs slipped through unit tests. Each has a regression test pattern to prevent recurrence.

| Bug                                   | Root cause                                                                                                    | Regression test signal                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `r-progress` height 126px inside card | `:host` had no height; `.ran-progress { height: 100% }` resolved to container height                          | `progress.clientHeight < 50` when placed inside `r-card`         |
| `r-checkbox` label invisible          | Shadow DOM had no `<slot>`, so light DOM children were not projected                                          | `shadow.querySelector('slot') !== null`                          |
| `r-option` `NotSupportedError` (×11)  | Constructor called `this.setAttribute('class', …)` — forbidden by Custom Elements spec during `createElement` | `expect(() => document.createElement('r-option')).not.toThrow()` |

---

## Build & Config

### Path aliases (vite + vitest)

```
@/components → components/
@/utils      → utils/
@/assets     → assets/
@/public     → public/
```

### LESS auto-import

`base.less` is injected by Vite into every LESS file:

```typescript
// vite.config.ts
less: {
  additionalData: `@import "${resolve(__dirname, 'base.less')}";`;
}
```

### ES build output

Each component gets its own `dist/{name}.js` ES module. The barrel `dist/index.js` includes all components. CJS + IIFE bundle at `dist/index.cjs`.

---

## Common Pitfalls

| Pitfall                                                                                                                                                                                                     | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attributeChangedCallback` fires when attribute set to same value                                                                                                                                           | Add `if (old === next) return;` as first line                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Shadow DOM re-attached on reconnect                                                                                                                                                                         | Use `ensureShadowRoot` (WeakMap cache), never bare `attachShadow`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Styles not applied in SSR                                                                                                                                                                                   | Use `RanElement` base class and `defineSSR`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `adoptedStyleSheets` frozen in jsdom                                                                                                                                                                        | `syncSheetAttribute` / `adoptSheetText` already handles `<style>` fallback                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Event listeners leak on disconnect                                                                                                                                                                          | Use `EventManager` — call `manager.abort()` in `disconnectedCallback`; never track individual `removeEventListener` calls                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Reactive `createEffect` / getter binding built in a component's `constructor` or `connectedCallback`                                                                                                        | Those aren't reactive scopes (`currentOwner` is `null`) → the effect is orphaned and never disposed (leaks the element if the signal is external; cleanup never runs). Don't use getter bindings in components; use explicit `createEffect` and collect its dispose into an array you clear in `disconnectedCallback` (see `components/colorpicker`). Reserve getter bindings / auto-owned effects for `createRoot`-scoped page/route glue.                                                                                                                                                                                                                                                                                                 |
| Effects disposed on `disconnectedCallback` but only set up once (lazily) → component goes inert after a move/re-parent                                                                                      | Setup and teardown must be lifecycle-symmetric. If effects are built lazily (e.g. on first panel open) and disposed on every disconnect, re-arm them on reconnect: `if (this._built && this._disposers.length === 0) this.setupEffects();` in `connectedCallback`. A disconnect→reconnect is spec-supported (DOM moves).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `import '@/components/mycomp'` not in index.ts                                                                                                                                                              | Components won't register for users who `import 'ranui'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Missing `card` entry in vite.config.ts                                                                                                                                                                      | `dist/card.js` won't be built; per-component imports break                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Factory function wrapper pattern (`function Custom() { defineSSR(...); return Class; } export default Custom()`)                                                                                            | Anti-pattern — `defineSSR` handles registration; use `defineSSR(...); export default ClassName;` directly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `border-color: var(--token)` without hex fallback                                                                                                                                                           | Add hex fallback: `var(--ran-color-border, #d9d9d9)` so borders show without theme tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Shadow root `mode: 'open'`                                                                                                                                                                                  | Always use default closed mode via `ensureShadowRoot(this, css)` — never pass `{ mode: 'open' }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `this.setAttribute(…)` called in constructor                                                                                                                                                                | Forbidden by Custom Elements spec — Chrome throws `NotSupportedError: The result must not have attributes` on `document.createElement`. Move all `this.setAttribute` / `this.classList` calls to `connectedCallback`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Component `:host` has no height + inner div uses `height: 100%`                                                                                                                                             | `100%` resolves to the parent container height when `:host` has no explicit size, expanding the component unexpectedly. Always set `display: block; height: var(--token, <default>)` on `:host` for height-aware components (e.g. `r-progress`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Shadow DOM has no `<slot>` for label/child content                                                                                                                                                          | Light DOM children are silently not rendered; the component appears broken when used with text content. Always add a `Slot()` to the shadow DOM when the component is designed to accept slotted content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Accessing `window` / `document` in `RouterCore` utility code                                                                                                                                                | `RouterCore` is imported at the module level and can be instantiated in SSR. All `window.*` / `document.*` calls must be guarded with `typeof window !== 'undefined'` / `typeof document !== 'undefined'`. The existing utility guards are in `_getCurrentPath`, `_navigate`, `back/forward/go`, `injectMpaTransitionStyle`, and `_enableMpa/_disableMpa`. Add the same guard to any new code that touches browser globals.                                                                                                                                                                                                                                                                                                                 |
| Calling `createRouter()` after `r-router` elements have already connected                                                                                                                                   | `r-router` calls `useRouter()?._bind(this)` in `connectedCallback`. If `createRouter` is called after the component is already in the DOM, the component will not be registered. Always call `createRouter()` before mounting `r-router`, or trigger reconnection manually.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `viewTransition: 'mpa'` with SPA navigation                                                                                                                                                                 | MPA mode only injects `@view-transition { navigation: auto }` for full-page navigations. `push()` / `replace()` will NOT trigger this CSS-based transition — they bypass the browser's navigation pipeline. Use `'both'` when you need transitions for both SPA navigation and full-page links.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Hard-coded color that should follow the theme (e.g. `rgba(0,0,0,.06)`, `#e6f7ff`, black canvas text)                                                                                                        | Breaks in dark mode. Point the fallback at a token that flips: `var(--ran-color-text, …)`, `var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`. For canvas/JS-drawn colors, read the CSS var via `getComputedStyle(this).getPropertyValue('--ran-color-text')`. See DESIGN.md §1.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Text not vertically centered in a pill/button                                                                                                                                                               | Don't rely on `height: 100%` against an auto-height host (it collapses to `auto`) plus an inherited `line-height`. Give the host a fixed height and the inner element `display:flex; align-items:center; line-height:1; box-sizing:border-box`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Icon-only control (icon link/button) with no text                                                                                                                                                           | Add an `aria-label` — an `aria-hidden` icon alone has no accessible name. Watch responsive rules that hide a text label on mobile (the control becomes icon-only).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Animations/transitions without a reduced-motion escape                                                                                                                                                      | Add `@media (prefers-reduced-motion: reduce)` that zeroes transition/animation durations, disables smooth scroll, and removes hover transforms. DESIGN.md §5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Any palette prop (`background`, `color`, `border-color`, `box-shadow`) in a default `transition` — the component fades on theme toggle while the host page has already flipped                              | Palette props never get a default transition (hover feedback snaps). Only motion props (`transform`, `opacity`, box geometry) may animate. `transition: all` and bare-duration shorthands (`transition: 0.2s`) are banned. Keep the `--ran-*-transition` hook var with a motion-only or `none` default so consumers can opt in. DESIGN.md §5.                                                                                                                                                                                                                                                                                                                                                                                               |
| Opaque surface layer behind rounded content shows at the corners in dark mode (e.g. a `#fff`-defaulted layer under a rounded button/pill)                                                                   | Give the surface layer the **same `border-radius`** as the content (or make it transparent) so it can't poke out at the corners. Independently, the light-only fallback (`#fff`) should point at a flipping token. See `components/button` `.ran-btn`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| A `display:block` host used as a flex/inline item collapses to 0 width (e.g. `r-progress` renders as just its drag dot)                                                                                     | A block host with no intrinsic width shrinks to content (0) inside a flex row. Give it an explicit width (`style="width:100%"`) or place it in a block context. Width-aware components should document this.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| A drag/interaction affordance rendered in a non-interactive mode (e.g. progress `dot` handle shown when `type!='drag'`)                                                                                     | Gate the affordance on the mode that makes it interactive. A handle with no drag behavior reads as an orphaned artifact. See `components/progress` `appendProgressDot`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Signalling state with color alone (red/green only)                                                                                                                                                          | Pair color with an icon or text (e.g. ✓/✕ labels, an error message + icon). DESIGN.md §7.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Hiding navigation/affordances on mobile to save space                                                                                                                                                       | Don't remove the only way to do something. Reflow it (e.g. drop nav to its own row) instead of `display:none`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| A drag surface binds only `mousedown`/`mousemove`/`mouseup` (touch can't drive it), or CSS sets `touch-action: none` on a surface with no pointer/touch handler wired to it                                 | Bind Pointer Events (`pointerdown`/`pointermove`/`pointerup`/`pointercancel`) instead of the mouse-only trio, so mouse and touch share one code path — `touch-action: none` alone does nothing without a handler behind it. This shipped three times before being fixed: colorpicker's palette/sliders, progress's drag dot, and — longest-lived — the player's seek bar, whose scrubbing stayed on `mousedown` + `document` `mousemove`/`mouseup` while `core/gestures.ts` beside it already used Pointer Events, so the video could be double-tapped to seek on a phone but its progress dot could not be dragged. See `components/colorpicker/index.ts`, `components/progress/index.ts`, `components/player/core/seek.ts`. DESIGN.md §8. |
| A `trigger="hover"` overlay with no way to open it on a touch device                                                                                                                                        | Gate hover-trigger wiring with `!isMobile()` (from `ranuts/utils`) and always keep the click/tap trigger wired regardless of `trigger` value. See `r-select`/`r-popover`. DESIGN.md §8.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| A body-portaled panel (dropdown/popover/select) or an in-flow element positioned from `getBoundingClientRect()` (a sliding tab indicator, an arrow-centering offset) is measured once and never re-measured | Any px position/size derived from a live measurement goes stale the moment the page reflows for a reason that isn't the interaction that first computed it — a window resize, a sidebar collapsing, a font finishing load, wrapped label text. A portaled panel needs `scroll`(capture)+`resize` listeners while open (`r-select`'s `_attachReposition`, `r-popover`'s `_attachReposition`); an in-flow element needs a `ResizeObserver` on the container whose size actually drives the measurement (`r-tabs`'s `_navResizeObserver` on `_nav`, re-running `setTabLine`). DESIGN.md §8.                                                                                                                                                    |
| Styling an `r-link` host as a button/card                                                                                                                                                                   | The clickable `<a>` lives in the link's (closed) shadow. Put the surface (bg/border/radius) on the host and inject the `<a>` box model (`display`, `padding`, `width/height`, `line-height`) via the `sheet` attribute so the whole area is clickable and centered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Demo deploy target                                                                                                                                                                                          | The demo routes with `r-router` in **history mode**; static hosts need an SPA fallback. Cloudflare Pages: `demo/public/_redirects` → `/* /index.html 200`. (GitHub Pages can't rewrite → would need hash mode.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Floating overlay looks flat / has no visible shadow                                                                                                                                                         | Elevation is a **role**: an overlay (dropdown, select, popover, toast/message) must use `--ran-shadow-menu`; a dialog uses `--ran-shadow-modal`; only in-flow surfaces (card/section) use `--ran-shadow-elevated`. Never let an overlay fall back to the card tier, and make sure each tier is actually _perceptible_ (an invisible shadow is a failed shadow). See DESIGN.md §4.                                                                                                                                                                                                                                                                                                                                                           |
| Content moved out of the shadow root (e.g. `r-popover` / `r-select` dropdowns portal panel content into `document.body`) loses **all** shadow-scoped CSS — widths/heights collapse, gradients vanish        | Don't rely on the host's shadow stylesheet for portaled content. Ship the panel's styles in a `<style>` injected into the portaled subtree (uniquely-namespaced selectors + theme tokens, so it travels and stays dark-safe because tokens inherit from `:root` in light DOM), or inline the critical layout. Prefer percent-based positioning so it doesn't depend on measuring the relocated element. See `components/colorpicker/panel.less`.                                                                                                                                                                                                                                                                                            |
| A component renders `<r-icon name="…">` for its own chrome but never registers that icon                                                                                                                    | Register it in the component module (`registerIcon('…', svg)`) so the component is self-contained; never depend on the consumer having registered your internal icons. Use a theme token (not a hardcoded hex) for the icon `color` so it adapts to dark mode. See r-select's `arrow-down`.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| A portaled overlay (dropdown/popover/select) renders behind page content                                                                                                                                    | The element the consumer positions and portals to `<body>` must carry the overlay z-index itself — a z-index on an inner shadow element is trapped in the host's stacking context. Use the ladder tokens (`--ran-z-modal: 1000` < `--ran-z-dropdown: 1100` < `--ran-z-message: 1200`; dropdowns sit above modals so in-modal selects stay visible, toasts on top) and expose a `--ran-[component]-z-index` override so consumers needn't `!important`. See `r-dropdown` `:host`.                                                                                                                                                                                                                                                            |
| A floating overlay open while the page scrolls drifts away from its trigger                                                                                                                                 | A body-portaled overlay positioned once on open uses document coords; in a sticky/scroll context the trigger and overlay desync. Re-run placement on `scroll` (capture, to catch nested scroll containers) + `resize` while open, and remove the listeners on close/disconnect. See r-select's `_attachReposition`.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| A `name=""`-selected component packs every variant into one `index.ts` + one monolithic `index.less`                                                                                                        | Using one variant bundles all of them (JS + CSS) — `name` is runtime-resolved so tree-shaking can't drop the unused ones. Co-locate each variant as `variants/<name>/index.ts` (owns its `?inline` CSS) and map `name`→dynamic `import()` via `import.meta.glob`, sync-coring the common few. Usage is unchanged; only the used variant downloads. See "Name-driven lazy variant loading" above (`r-loading`, `r-icon`).                                                                                                                                                                                                                                                                                                                    |
