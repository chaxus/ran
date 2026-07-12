# ranui Builder — fluent DOM + fine-grained reactivity

`ranui/builder` is a framework-free way to build DOM declaratively with
SwiftUI/Solid-style fine-grained reactivity. No virtual DOM, no re-render of a
whole tree — a signal change updates only the exact node bound to it.

```ts
import {
  View,
  Div,
  Span,
  ButtonBuilder, // element factories
  signal,
  computed,
  createEffect,
  batch,
  untrack, // reactivity
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // ownership
  EventManager, // lifecycle-scoped events
} from 'ranui/builder';
```

The builder does **not** register custom elements. To use `<r-button>` etc.,
also import the component subpath once: `import 'ranui/button'`.

---

## 1. Elements

Factories return an `ElementBuilder` (chainable). `build()` returns the DOM node.

```ts
const box = Div().class('card').text('hi').build();

const submit = View('r-button') // any tag, incl. custom elements
  .attr('type', 'primary')
  .text('Save')
  .on('click', onSave)
  .build();
```

Factories: `View(tag)`, `Div`, `Span`, `Slot`, `ButtonBuilder`, `InputBuilder`,
`Label`, `Ul`, `Li`, `Section`, `Article`, `Nav`, `Header`, `Footer`, `Main`,
`Style`, `DeclarativeShadow`. For anything else use `View('tag')`.

### Chainable API

| Group          | Methods                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Identity/class | `id(v)`, `class(v)`, `addClass(...v)`, `removeClass(...v)`                                                  |
| Attributes     | `attr(name, v)`, `attrs({...})`, `boolAttr(name, on, enabledValue?)`, `part(v)`, `data(key, v)`             |
| Style          | `style(prop, v)` / `style({...})`, `cssVar(name, v)`                                                        |
| A11y           | `aria(key, v)`, `role(v)`, `tabIndex(n)`, `label(v)`, `labelledBy(id)`, `describedBy(id)`, `ariaHidden(b?)` |
| Content        | `text(v)`, `children(...nodes)`, `replaceChildren(...nodes)`                                                |
| Refs/shadow    | `ref(holder)`, `shadow(opts?)` → `ShadowBuilder`                                                            |
| Terminal       | `build()`, `serialize()` (SSR HTML string)                                                                  |

`children()` accepts elements, strings, other `ElementBuilder`s, arrays, and
`null`/`undefined` (skipped) — nest freely:

```ts
Ul()
  .class('list')
  .children(
    items.map((it) => Li().text(it.name)),
    extra && Li().text('extra'),
  )
  .build();
```

### Events

```ts
.on(type, handler, options?)      // permanent listener (element lifetime)
.listen(manager, type, handler)   // lifecycle-managed (removed via manager.abort())
.delegate(manager, selector, type, handler) // event delegation on a container
```

---

## 2. Reactivity

```ts
const [count, setCount] = signal(0);
count(); // read (tracked inside effects/memos)
setCount(1); // write; setCount(n => n + 1) also works
setCount(1); // no-op if unchanged (Object.is; override via signal(v, { equals }))

const double = computed(() => count() * 2); // LAZY + memoized: recomputes only
double(); // when read after a dep changed
// A memo re-notifies its readers only when its VALUE changes (override the
// comparison via computed(fn, { equals })), so effects behind a stable memo sleep.

const dispose = createEffect(() => {
  // runs now + on every dependency change
  console.log(count());
  return () => {
    /* optional cleanup, runs before re-run and on dispose */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // one flush, effects deduped
untrack(() => count()); // read without subscribing
```

- **`computed` is lazy** — an unread memo never recomputes. Diamond dependencies
  run a dependent effect **once** per change, not once per path.
- **Effects auto-track**: only signals actually read on the latest run are
  subscribed (conditionals never leave stale subscriptions).
- **Cyclic guard**: an effect that writes a signal it reads throws instead of
  looping forever.

### Reactive bindings

Any of `text`, `attr`, `class`, `boolAttr`, `style`, `part`, `data`, `aria`,
`role`, `label` accepts a **getter** — pass a signal (or `computed`) and the
attribute/text updates itself, no manual effect:

```ts
const [label, setLabel] = signal('Connect');
const btn = View('r-button').text(label).build(); // updates when setLabel(...) runs

const [active, setActive] = signal(true);
Div()
  .class(() => (active() ? 'row active' : 'row')) // recomputes on toggle
  .boolAttr('disabled', () => !active())
  .build();
```

A getter binding creates an effect **owned by the current scope** (see below), so
it is cleaned up automatically when that scope is disposed. Reactivity applies to
the single-value forms — `style(prop, getter)`, not the `style({...})` /
`attrs({...})` map forms, which apply once. A getter dropped into a map is called
once and never re-runs.

---

## 3. Ownership — the key to leak-free apps (and MPAs)

Every effect/memo (including reactive bindings) is owned by the scope that
created it. Disposing a scope disposes everything under it — nested effects,
bindings, and `onCleanup` callbacks.

```ts
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(msg).build(); // this binding is owned by the root
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

// later:
dispose(); // removes the binding's effect + runs cleanups
```

Build reactive UI **inside a `createRoot`**. Bindings created with no owner still
work but won't auto-dispose (dispose them manually).

> **Inside a Web Component?** A component's `constructor`/`connectedCallback` are
> _not_ reactive scopes, so a getter binding or `createEffect` created there is
> orphaned (never disposed). Don't use getter bindings in component code — build
> with plain values and drive updates with explicit `createEffect`s whose dispose
> functions you collect and call in `disconnectedCallback`, re-arming on reconnect.
> See the ranui component guide (`CLAUDE.md` → "Using reactivity inside a component").

### Multi-page / SPA pattern

Give each page/route its own root and dispose it on navigation — every effect,
binding, timer, and listener that page created is torn down in one call:

```ts
let disposePage: (() => void) | null = null;

function showPage(render: (host: HTMLElement) => void, host: HTMLElement) {
  disposePage?.(); // tear down the previous page
  disposePage = createRoot((dispose) => {
    render(host); // effects/bindings register to this root
    return dispose;
  });
}
```

ranui's `<r-route>` has this built in. Two modes:

- **Static (default)** — slotted content, shown/hidden by URL; all routes stay in
  the DOM (great for SSG — every page is pre-rendered): `<r-route path="/a">…</r-route>`.
- **Lazy (`src`)** — code-split, mount on match / unmount on leave:
  `<r-route path="/a" src="/pages/a.js">`. On match the module is dynamically
  imported and its `default: (host) => void | (() => void)` render runs **inside a
  `createRoot`**; on leave that root is disposed — every effect, binding, and
  `onCleanup` the page registered is torn down automatically. The per-page-lifecycle
  mode for larger multi-page apps (client-rendered).

`getOwner()` / `runWithOwner()` let a router capture and restore a scope across
async boundaries.

---

## 4. Web-component listeners — `EventManager`

For listeners inside a custom element, use `EventManager` (backed by
`AbortController`) so `disconnectedCallback` removes them all at once:

```ts
private events = new EventManager();
connectedCallback() {
  this.events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (e, el) => this.run(el.dataset.action));
}
disconnectedCallback() { this.events.abort(); } // resets for the next connect
```

---

## Notes

- **SSR**: builders work under `defineSSR` / `renderToString`; `build()` returns a
  mock node, `serialize()` returns HTML. Reactive bindings run once during SSR.
- **Components vs builder**: use registered `<r-*>` elements (see
  [COMPONENTS.md](./COMPONENTS.md)) for rich widgets; use the builder for
  layout/glue and reactive views. Theme tokens: [DESIGN.md](./DESIGN.md).
