# ranui Builder — fluent DOM + fine-grained reactivity

`ranui/builder` is a framework-free way to build DOM declaratively with
SwiftUI/Solid-style fine-grained reactivity. No virtual DOM, no re-render of a
whole tree — a signal change updates only the exact node bound to it.

> **Principle: build once, update in place.** A view function runs once; state
> changes flow through fine-grained bindings, never by re-running the view. Pick
> the primitive that matches the shape — value → getter binding; conditional →
> [`Show`](#conditionals--show) / [`Switch`](#multi-branch--switch--match); list →
> [`For`](#keyed-lists--for) / [`Index`](#index-lists--index). A raw getter child
> is the coarse fallback (rebuilds its whole region on any read).

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

`children()` accepts elements, strings, other `ElementBuilder`s, arrays,
`null`/`undefined` (skipped), **and getters `() => …`** (reactive regions, see
[Reactive children](#reactive-children)) — nest freely:

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

### Refs (incl. imperative custom-element methods)

`createRef<T>()` + `.ref(holder)` capture the built element. For a custom
element with imperative methods, **type the ref with the component's element
class** (each component exports it) — then its methods are typed, no cast:

```ts
import { Popover } from 'ranui'; // the element class
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover(); // typed method, no `as` cast
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

### Reactive children

`children()` / `replaceChildren()` also take a **getter** as any argument. The
getter marks a live region: it re-runs when a signal it reads changes, replacing
the region — no `createRef` + `createEffect` + `replaceChildren` boilerplate.
Return a node, a `null` (conditional), or an array (list). Static siblings around
the getter keep their position.

> **Semantics — this is a full rebuild, not a keyed diff.** On each change the
> whole region is torn down and re-created; there is no per-item keying, and it
> re-runs on **every** change the getter reads — even one that doesn't alter the
> result. It is the coarse escape hatch. Prefer the fine-grained primitives:
> [`Show`](#conditionals--show) for conditionals (rebuilds only when the branch
> flips) and [`For`](#keyed-lists--for) for lists (reuses nodes by key). Reach for
> a raw getter only for content whose shape genuinely changes on every update.

### Conditionals — `Show`

`Show` is a **fine-grained** conditional: it rebuilds a branch only when the
_truthiness_ of `when` flips, not on every change `when` reads. Content inside a
branch updates through its own bindings — the branch is built once. (A raw getter
child, by contrast, tears down and rebuilds on every dependency tick.)

```ts
import { Show } from 'ranui/builder';

Div().children(
  Show({
    when: () => user(), // reads a signal
    children: (u) => Span().text(() => u().name), // built once; text updates in place
    fallback: () => Span().text('Signed out'), // optional
  }),
);
```

`children` gets an accessor to the narrowed truthy value — read it inside a
binding so it updates without rebuilding. `Show` returns a getter, so it slots
into `children()` anywhere.

### Multi-branch — `Switch` / `Match`

`Switch` is the n-way `Show`: it renders the **first** `Match` whose `when` is
truthy (else `fallback`), and is equally fine-grained — only the _index_ of the
winning branch is memoized, so it rebuilds only when the active branch changes.
Evaluation short-circuits at the first match.

```ts
import { Switch, Match } from 'ranui/builder';

Div().children(
  Switch({
    fallback: () => Span().text('idle'),
    children: [
      Match({ when: () => status() === 'loading', children: () => Spinner() }),
      Match({ when: () => error(), children: (e) => ErrorView(e) }), // e: accessor to the truthy value
    ],
  }),
);
```

```ts
// Conditional — toggles a node in/out between static siblings
Div().children(Header().text('H'), () => (open() ? Div().class('panel').text('body') : null), Footer().text('F'));

// List — reconciles as the array changes
Ul().children(() => rows().map((r) => Li().text(r.title)));
```

On **SSR** a getter is evaluated once (static snapshot); reactivity is a
client-only concern. Like all bindings, reactive children must be built inside a
`createRoot` so their effects are owned and disposed with the page (see §3 Ownership).

### Keyed lists — `For`

For lists that add/remove/reorder, `For` matches items by `key` and **reuses
their DOM nodes** — only changed items touch the DOM, so focus, scroll, input
values and transitions inside surviving rows are preserved (a plain getter child
would rebuild all of them). Pass the handle straight to `children()`.

```ts
import { For } from 'ranui/builder';

const [rows, setRows] = signal([{ id: 1, title: 'a' }]);

Ul().children(
  For({
    each: () => rows(), // reactive source array
    key: (r) => r.id, // stable, UNIQUE identity per item
    render: (r, index) => Li().text(() => `${index()}. ${r.title}`),
  }),
);
```

- `key` **must be unique** — it is how a node is matched to its item across
  updates. A duplicate key is ignored (only the first item with it renders) and
  warned in dev. (Don't use the array index as the key — that defeats reuse on
  reorder.)
- `each` reads a signal, so update it with a **new array** (`setRows([...])`).
  Mutating the same array in place and re-setting it is skipped (`Object.is`
  equality), and the list won't update.
- `render` runs **once per item**, not on every list change. Drive per-row
  updates with signals (e.g. `.text(() => …)`); `index` is a **getter** so it
  stays correct after reorders.
- Removing an item disposes that row's scope (its effects/cleanups). The whole
  list is disposed with its owning `createRoot`.
- **SSR**: rendered once as a static snapshot (no reconciliation).

### Index lists — `Index`

`Index` is the position-keyed counterpart to `For`: the node at index `i` is
reused across updates and its **item is a signal** — when the value at that
position changes, it updates in place (the node is not rebuilt); nodes never
move. Use it when position is the identity (primitive arrays, fixed rows); use
`For` when items have a stable id and can reorder.

```ts
import { Index } from 'ranui/builder';

Ul().children(
  Index({
    each: () => nums(),
    render: (n, i) => Li().text(() => `${i}: ${n()}`), // n is an accessor; i is a fixed number
  }),
);
```

Rule of thumb: **`Show`/`Switch` for conditionals; `For` (keyed by id) or `Index`
(keyed by position) for lists; a raw getter child only for content that changes
shape on every update.**

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
