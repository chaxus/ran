---
description: 'ranui/builder — a framework-free fluent DOM builder with SwiftUI/Solid-style fine-grained reactivity: build once, then update only the node a signal is bound to.'
---

# Builder

`ranui/builder` builds DOM declaratively, with fine-grained reactivity and no virtual DOM. It
is what the components themselves are written with, published as its own entry so an app can
use it for its own layout and glue.

> **Use when** you want reactive views without a framework — a page, a route, a widget — or you
> are writing a custom element and want the same construction style ranui uses internally.

> **The principle: build once, update in place.** A view function runs **once**. A state change
> updates only the exact node bound to that signal; there is no re-render of a tree. Pick the
> primitive that matches the shape — value → a getter binding; conditional → `Show` / `Switch`;
> list → `For` / `Index`.

```js
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

The builder registers **no** custom elements. To use `<r-button>` and friends, import the
component entry too: `import 'ranui/button'`.

## Elements

Factories return a chainable `ElementBuilder`; `build()` returns the DOM node.

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`, `Span()`, `ButtonBuilder()`, `InputBuilder()`, `Label()`, `Ul()`, `Li()`, `Section()`,
`Article()`, `Nav()`, `Header()`, `Footer()`, `Main()`, `Style()`, `Slot()` — plus
`View('any-tag')` for anything else, including custom elements.

### Chainable API

| Group          | Methods                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| Identity/class | `id(v)`, `class(v)`, `addClass(...v)`, `removeClass(...v)`                                                    |
| Attributes     | `attr(name, v)`, `attrs({…})`, `boolAttr(name, on, enabledValue?)`, `part(v)`, `data(key, v)`                 |
| Style          | `style(prop, v)` / `style({…})`, `cssVar(name, v)`                                                            |
| Accessibility  | `aria(key, v)`, `role(v)`, `tabIndex(n)`, `label(v)`, `labelledBy(id)`, `describedBy(id)`, `ariaHidden(b?)`   |
| Content        | `text(v)`, `children(…nodes)`, `replaceChildren(…nodes)`                                                      |
| Refs / shadow  | `ref(holder)`, `shadow(opts?)` → `ShadowBuilder`                                                              |
| Events         | `on(type, handler, options?)`, `listen(manager, type, handler)`, `delegate(manager, selector, type, handler)` |
| Terminal       | `build()`, `serialize()` (SSR HTML string)                                                                    |

`children()` accepts elements, strings, other builders, arrays, `null` / `undefined` (skipped)
and getters (live regions — see below).

### Refs

`createRef<T>()` plus `.ref(holder)` captures the built element. Typing the ref with a
component's element class gets you its imperative methods with no cast:

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## Reactivity

```js
const [count, setCount] = signal(0);
count(); // read — tracked inside effects and memos
setCount(1); // write; setCount((n) => n + 1) works too
// a write with an unchanged value is a no-op (Object.is; override with signal(v, { equals }))

const double = computed(() => count() * 2); // lazy + memoized

const dispose = createEffect(() => {
  console.log(count()); // runs now, and on every dependency change
  return () => {
    /* optional cleanup, before the next run and on dispose */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // one flush, effects deduped
untrack(() => count()); // read without subscribing
```

- **`computed` is lazy** — an unread memo never recomputes, and it re-notifies only when its
  _value_ changes, so effects behind a stable memo stay asleep.
- **Effects auto-track**: only the signals read on the latest run stay subscribed, so a
  conditional never leaves a stale subscription behind.
- **A cyclic effect throws** rather than looping — an effect that writes a signal it reads is
  a bug the runtime refuses to run forever.

### Reactive bindings

`text`, `attr`, `class`, `boolAttr`, `style`, `part`, `data`, `aria`, `role` and `label` all
accept a **getter**, so the binding updates itself with no explicit effect:

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

Only the single-value forms are reactive: `style(prop, getter)` is, the `style({…})` and
`attrs({…})` map forms apply once.

### Conditionals and lists

| Shape                               | Use                                  | Behaviour                                                       |
| ----------------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| One branch                          | `Show({ when, children, fallback })` | Rebuilds only when the _truthiness_ of `when` flips.            |
| Several branches                    | `Switch` + `Match`                   | Rebuilds only when the chosen branch changes.                   |
| A list with stable ids              | `For({ each, key, render })`         | Matches items by `key` and **reuses their nodes**.              |
| A list where position is identity   | `Index({ each, render })`            | Reuses the node at each position; the item itself is a signal.  |
| Content that changes shape entirely | a raw getter child                   | Coarse: tears down and rebuilds the whole region on every read. |

```js
Ul().children(
  For({
    each: () => rows(), // reactive source array
    key: (row) => row.id, // stable and unique
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

Four rules that decide whether `For` actually reuses anything:

- **`key` must be unique.** A duplicate is ignored (only the first item renders) and warned
  about in development. Don't key by array index — that defeats reuse on reorder.
- **Update with a new array.** `each` reads a signal, so mutating the same array in place and
  re-setting it is skipped by equality and the list never updates.
- **`render` runs once per item**, not per list change. Drive per-row updates with signals;
  `index` is a getter, so it stays correct after a reorder.
- **Removing an item disposes that row's scope** — its effects and cleanups go with it.

Prefer `Show` / `For` over a raw getter child: the getter rebuilds its whole region on every
change it reads, even one that does not alter the result, so focus, scroll position, input
values and transitions inside it are lost.

## Ownership

Every effect, memo and reactive binding is owned by the scope that created it. Disposing the
scope disposes everything under it.

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // this binding is owned by the root
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

dispose(); // removes the binding's effect and runs the cleanups
```

**Build reactive UI inside a `createRoot`.** A binding created with no owner still works but
never auto-disposes.

### Per-page teardown

Give each page or route its own root and dispose it on navigation — every effect, binding,
timer and listener that page created goes in one call:

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

[`<r-route>`](/src/ranui/route/) has this built in: with `src`, the page module is imported on
match, its default export runs inside a `createRoot`, and that root is disposed on leave.
`getOwner()` / `runWithOwner()` let a router carry a scope across an `await`.

::: warning Inside a Web Component, don't use getter bindings
A component's `constructor` and `connectedCallback` are **not** reactive scopes, so a getter
binding or `createEffect` created there is orphaned and never disposed — it keeps firing on a
detached node, and if the signal outlives the element it pins the element in memory. Build with
plain values and drive updates with explicit `createEffect`s whose dispose functions you collect
and call in `disconnectedCallback`, re-arming on reconnect. See the
[coding guidelines](/src/ranui/coding-guides/).
:::

## Listeners inside a custom element

`EventManager` is backed by an `AbortController`, so one call removes every listener:

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // removes all of them, and resets for the next connect
}
```

## Server rendering

Builders work under [SSR](/src/ranui/ssr/): `build()` returns a mock node and `serialize()`
returns HTML. Reactive bindings, `For` and `Show` render **once** on the server, as a static
snapshot — there is no reconciliation until the code runs in a browser.

## Full reference

This page is the working subset. The complete reference — every factory, every operator, the
SVG namespace rules, and the `Switch` / `Match` details — is
[BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md) in the
repository, which also ships inside the npm package.
