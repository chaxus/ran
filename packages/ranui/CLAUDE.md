# ranui — Component Library Reference

Web Components library built with TypeScript. All components use Shadow DOM encapsulation, CSS variable theming, and SSR support.

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
│   ├── ssr-registry.ts   # defineSSR, SSR support
│   ├── theme.ts          # setTheme, setThemePack, initTheme
│   ├── style.ts          # adoptStyles, adoptSheetText
│   └── dom.ts            # falseList, isDisabled
├── theme-packs/          # Optional CSS-only theme packs
├── test/unit/            # *.contract.test.ts per component
├── demo/                 # Dev server entry (Vite, port 5173)
├── index.ts              # Barrel exports + side-effect imports
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
import { Div, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot, ensureShadowElement,
  getStringAttribute, setStringAttribute, syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

export class MyComponent extends RanElement {
  _shadowDom!: ShadowRoot;
  _myEl!: HTMLElement;          // store refs to queried elements

  static get observedAttributes(): string[] {
    return ['my-attr', 'sheet'];  // always include 'sheet'
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const root = ensureShadowElement(this._shadowDom, '.ran-mycomp', () =>
      Div()
        .class('ran-mycomp')
        .attr('part', 'mycomp')
        .children(Slot())
        .build()
    );
    this._myEl = root.querySelector<HTMLElement>('.ran-mycomp-inner')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────
  get myAttr(): string { return getStringAttribute(this, 'my-attr'); }
  set myAttr(v: string) { setStringAttribute(this, 'my-attr', v); }

  get sheet(): string { return getStringAttribute(this, 'sheet'); }
  set sheet(v: string) { setStringAttribute(this, 'sheet', v); }

  // ── Lifecycle ──────────────────────────────────────────────────────────
  connectedCallback(): void {
    this._syncMyAttr();
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;                     // ALWAYS guard here
    if (name === 'my-attr') this._syncMyAttr();
    if (name === 'sheet') syncSheetAttribute(this, this._shadowDom, name, old, next);
  }

  private _syncMyAttr(): void {
    this._myEl.textContent = this.getAttribute('my-attr') ?? '';
  }
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

### Registering in the package

After creating `components/mycomp/index.ts`:

1. **`index.ts`** — add both lines:
   ```ts
   export * from '@/components/mycomp';   // types
   import '@/components/mycomp';          // side-effect registration
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

// setAttribute; removes attribute if value is null/undefined
// removeEmpty:true → also removes on falsy string ('')
setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined, options?: { removeEmpty?: boolean }): void

// Sets/removes boolean attribute, optionally mirrors to aria-{aria}
setBooleanAttribute(element: HTMLElement, name: string, value: boolean, options?: { aria?: string }): void

// Calls adoptSheetText when sheet attribute changes; noop if name!='sheet' or old===new or sheet empty
syncSheetAttribute(host: HTMLElement, root: ShadowRoot, name: string, old: string | null, next: string | null): void
```

### `utils/builder/` — Fluent DOM builder

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
.build(): T          // returns the DOM element
```

**Example:**
```typescript
const header = Div()
  .class('ran-mycomp-header')
  .attr('part', 'header')
  .role('heading')
  .children(
    Div().class('ran-mycomp-title').attr('part', 'title'),
    Slot().attr('name', 'extra').attr('part', 'extra'),
  )
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

| API | Description |
|-----|-------------|
| `manager.on(target, type, handler, options?)` | Register listener scoped to manager's signal. Fluent — returns `this`. |
| `manager.abort()` | Remove all listeners, reset `AbortController`. Safe to call multiple times. |
| `manager.signal` | The raw `AbortSignal` — pass to `addEventListener` directly when needed. |

**When to use `.on()` vs `.listen()` vs `EventManager.on()`:**

| | `ElementBuilder.on()` | `EventManager.on()` / `.listen()` |
|---|---|---|
| Registered at | Build time (constructor) | Connect time (`connectedCallback`) |
| Removed when | Element GC'd | `manager.abort()` |
| Use for | Permanent internal shadow DOM listeners | Any listener needing cleanup on disconnect |

### `utils/builder/signal.ts` — Reactive primitives

Fine-grained reactivity (SwiftUI `@Observable` / Solid.js signals). Auto-tracks dependencies — no manual subscription.

```typescript
import { signal, createEffect, computed } from '@/utils/builder';

// signal — reactive value, [getter, setter] tuple
const [count, setCount] = signal(0);
const [name, setName]   = signal('Jane', { equals: (a, b) => a === b });

count()           // read — auto-subscribes inside createEffect / computed
setCount(1)       // write — notifies dependents
setCount(n => n + 1)  // updater form

// createEffect — runs immediately, re-runs when read signals change
const dispose = createEffect(() => {
  el.textContent = `${count()}`;
  return () => { /* optional cleanup before re-run */ };
});
dispose(); // stop tracking

// computed — derived read-only signal
const doubled = computed(() => count() * 2);
doubled() // always up-to-date, recalculates lazily
```

**SwiftUI parallel:**
| JS | SwiftUI |
|----|---------|
| `signal()` | `@State` / `@Observable` property |
| `createEffect()` | `body` (auto-tracks reads, re-computes on writes) |
| `computed()` | Swift computed property |

**Page section pattern** (signal + EventManager together):
```typescript
function initSection(container: HTMLElement) {
  const [value, setValue] = signal('');
  const scope = new EventManager();

  const output = Span().build();
  const input = InputBuilder()
    .listen(scope, 'input', (e) => setValue((e.target as HTMLInputElement).value))
    .build();

  const dispose = createEffect(() => { output.textContent = value(); });
  container.append(input, output);
  return () => { dispose(); scope.abort(); };
}
```

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
export const RanElement = HTMLElementSSR()!
// Returns HTMLElement in browser, HTMLElementMock in SSR
```

### `utils/theme.ts`

```typescript
type RanThemeName = 'light' | 'dark' | 'system'
type RanThemePackName =
  | 'default' | 'windows-98' | 'windows-xp' | 'system-6'
  | 'wired' | 'paper' | 'pixel-retro' | 'neo-brutalism'
type ThemeTarget = HTMLElement | Document

initTheme(target?: ThemeTarget): void       // call once on page load; restores from localStorage
setTheme(name: RanThemeName, target?: ThemeTarget): void
getTheme(target?: ThemeTarget): RanThemeName | ''
setThemePack(name: RanThemePackName, target?: ThemeTarget): void
getThemePack(target?: ThemeTarget): RanThemePackName | ''
setThemeToken(name: string, value: string | number, target?: HTMLElement): void
clearThemeToken(name: string, target?: HTMLElement): void
setThemeTokens(tokens: Record<string, string | number | null | undefined>, target?: HTMLElement): void
```

localStorage keys: `'ran-theme'`, `'ran-theme-pack'`

### `utils/dom.ts`

```typescript
const falseList = [false, 'false', null, undefined]
isDisabled(element: Element): boolean   // getAttribute('disabled') not in falseList
```

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

--ran-radius-sm | --ran-radius-md | --ran-radius-lg

--ran-skin-font-family
--ran-skin-border-width    /* 1px default, 2px in neo-brutalism */
--ran-skin-border-style    /* solid | inset */
--ran-skin-raised-shadow   /* embossed effect */
--ran-skin-inset-shadow
--ran-skin-control-height-sm | -md

--ran-motion-duration-fast | --ran-motion-duration-base

/* Component-scoped tokens (always provide fallback) */
--ran-card-gap, 14px
--ran-card-padding, 16px
--ran-card-radius, var(--ran-radius-md)
--ran-card-background, var(--ran-color-bg-muted)
--ran-card-shadow, none
--ran-card-min-height, 0
--ran-card-title-color, var(--ran-color-text)
--ran-card-title-font-size, 16px
--ran-card-title-font-weight, 600
--ran-card-description-color, var(--ran-color-text-secondary)
--ran-card-description-font-size, 14px

/* Button example */
--ran-btn-content-background-color, var(--ran-color-primary, #1890ff)
--ran-btn-content-color, #fff
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

    &:empty { display: none; }   /* hide empty text nodes */
  }
}
```

---

## Component Reference

### r-card

A structured content container with header, body, and footer zones.

```html
<r-card
  title="Card Title"
  description="Optional subtitle"
  sheet=".ran-card { background: red; }">

  <!-- Default slot: body content -->
  <p>Body content goes here</p>

  <!-- extra slot: right side of header (badges, links, actions) -->
  <span slot="extra" class="badge">tag</span>

  <!-- footer slot: shown only when this slot has assigned elements -->
  <a slot="footer" href="#docs">View notes</a>
</r-card>
```

**Attributes / Properties:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `''` | Card heading (hidden when empty via `:empty`) |
| `description` | `string` | `''` | Subtitle below title (hidden when empty) |
| `sheet` | `string` | `''` | CSS injected into shadow DOM |

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

### Test file naming

`test/unit/{component}.contract.test.ts` for component tests.
`test/unit/utils.{name}.test.ts` for utility tests.

### Canonical test structure

```typescript
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Card } from '@/components/card';
import '@/components/card';    // ensure customElements.define runs

describe('r-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';   // clean DOM between tests
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
      class MockSheet { replaceSync() { throw new Error('force fallback'); } }
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

| Task | How |
|------|-----|
| Access shadow DOM | `(el as any)._shadowDom as ShadowRoot` |
| Access private field | `(el as any)._fieldName` |
| Spy on private method | `vi.spyOn(el as any, '_methodName')` |
| Simulate async slot update | `await new Promise(r => setTimeout(r, 50))` |
| Test sheet CSS injection | Mock `CSSStyleSheet.replaceSync` to throw, then check `shadow.innerHTML` |
| Clean DOM between tests | `document.body.innerHTML = ''` in `beforeEach` |

### jsdom limitations

- `slot.assignedElements()` always returns `[]` — cannot test slotchange-driven display logic end-to-end; test the initial `style.display` state instead
- `window.getComputedStyle` returns empty for shadow DOM CSS rules — test attribute and style values directly, not computed CSS
- `adoptedStyleSheets` is frozen — sheet injection tests require the mock pattern above

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
  additionalData: `@import "${resolve(__dirname, 'base.less')}";`
}
```

### ES build output

Each component gets its own `dist/{name}.js` ES module. The barrel `dist/index.js` includes all components. CJS + IIFE bundle at `dist/index.cjs`.

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| `attributeChangedCallback` fires when attribute set to same value | Add `if (old === next) return;` as first line |
| Shadow DOM re-attached on reconnect | Use `ensureShadowRoot` (WeakMap cache), never bare `attachShadow` |
| Styles not applied in SSR | Use `RanElement` base class and `defineSSR` |
| `adoptedStyleSheets` frozen in jsdom | `syncSheetAttribute` / `adoptSheetText` already handles `<style>` fallback |
| Event listeners leak on disconnect | Use `EventManager` — call `manager.abort()` in `disconnectedCallback`; never track individual `removeEventListener` calls |
| `import '@/components/mycomp'` not in index.ts | Components won't register for users who `import 'ranui'` |
| Missing `card` entry in vite.config.ts | `dist/card.js` won't be built; per-component imports break |
| Factory function wrapper pattern (`function Custom() { defineSSR(...); return Class; } export default Custom()`) | Anti-pattern — `defineSSR` handles registration; use `defineSSR(...); export default ClassName;` directly |
| `border-color: var(--token)` without hex fallback | Add hex fallback: `var(--ran-color-border, #d9d9d9)` so borders show without theme tokens |
| Shadow root `mode: 'open'` | Always use default closed mode via `ensureShadowRoot(this, css)` — never pass `{ mode: 'open' }` |
