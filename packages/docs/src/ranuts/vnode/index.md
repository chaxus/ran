# Virtual DOM (vnode)

A lightweight, Snabbdom-style virtual DOM. It represents your UI as plain JavaScript objects
(`VNode`s), diffs an old tree against a new one, and applies only the differences to the real
DOM.

- `init()` builds the reconciler and returns a `patch` function. The bundled modules
  (class / props / attrs / style / events) are registered automatically.
- `patch(oldVnode, newVnode)` mounts a tree (when `oldVnode` is a real DOM element) or diffs
  two vnode trees and updates the DOM in place.
- `h(sel, dataOrChildren?, children?)` is the hyperscript helper that builds `VNode`s.

## Import

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> Note: in this implementation `init()` takes **no arguments** — the module set is fixed and
> registered internally, so the individual `*Module` exports do not need to be passed to
> `init`. They are exported for reference and inspection.

## Example

### Quick start

```js
import { init, h } from 'ranuts/vnode';

// init() returns a `patch` function.
// The bundled modules (class, props, attrs, style, events) are registered automatically.
const patch = init();

const container = document.getElementById('app');

// Build a vnode tree
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// Initial render: pass a real DOM element as the old vnode to mount into it
patch(container, vnode);

// Later: build an updated tree and patch the previous vnode into it.
// Only the differences (text, style, listeners) are applied to the DOM.
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // keep the latest tree for the next patch
```

### Building nodes with `h`

```js
// tag only
h('div');

// tag + data
h('div', { class: { active: true } });

// tag + a single text child
h('span', 'hello');

// tag + children array
h('ul', [h('li', 'one'), h('li', 'two')]);

// tag + data + children
h('a', { attrs: { href: '/home' } }, 'Home');

// CSS-style selectors set id and classes
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// SVG namespaces are applied automatically when the selector starts with "svg"
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

Creates the reconciler and returns a `patch` function. The bundled modules are registered
internally; it takes no arguments.

#### Return

| Value   | Description                                   | Type                                              |
| ------- | --------------------------------------------- | ------------------------------------------------- |
| `patch` | Mounts / diffs vnode trees against the real DOM | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

Returned by `init()`. On the first call, pass a real DOM `Element` as `oldVnode` to mount the
tree into it. On later calls, pass the previous `VNode` to diff-and-update in place. Returns
the new `VNode`, which you keep as the "old" value for the next call.

#### Parameters

| Parameter  | Description                                        | Type               |
| ---------- | ------------------------------------------------- | ------------------ |
| `oldVnode` | The previous vnode, or a DOM element on first mount | `VNode \| Element` |
| `vnode`    | The new vnode tree to render                        | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

Hyperscript helper that builds a `VNode`. It is overloaded:

| Signature                                   | Description                                        |
| ------------------------------------------- | -------------------------------------------------- |
| `h(sel)`                                    | Element from a selector only                        |
| `h(sel, data)`                              | Element with `VNodeData` (`data` may be `null`)     |
| `h(sel, children)`                          | Element with children — a text/number, a `VNode`, or an array |
| `h(sel, data, children)`                    | Element with data and children                      |

#### Parameters

| Parameter | Description                                                                                   | Type                              |
| --------- | -------------------------------------------------------------------------------------------- | --------------------------------- |
| `sel`     | CSS-style selector: `tag`, `tag#id`, `tag.class`, combined (`div#id.a.b`). `svg…` auto-adds the SVG namespace | `string`                          |
| `data`    | Node data — class / props / attrs / style / listeners / key / hook. May be `null`             | `VNodeData \| null`               |
| `children`| A text or number (becomes a text node), a single `VNode`, or an array of them                 | `VNodeChildren`                   |

#### `VNodeData` fields

| Field   | Description                                                                 | Type                        | Applied by            |
| ------- | -------------------------------------------------------------------------- | --------------------------- | --------------------- |
| `props` | DOM properties set via `elm[key] = value`                                  | `Record<string, any>`       | `propsModule`         |
| `attrs` | HTML attributes set via `setAttribute` (`true`/`false` toggle the attr)     | `Record<string, string \| number \| boolean>` | `attributesModule` |
| `class` | Conditional classes — a `name → boolean` map                                | `Record<string, boolean>`   | `classModule`         |
| `style` | Inline styles — a `name → value` map (`--var` keys use CSS variables)        | `Record<string, any>`       | `styleModule`         |
| `on`    | Event listeners — `event → handler` (or an array of handlers)               | `Record<string, Function \| Function[]>` | `eventListenersModule` |
| `key`   | Stable identity used by the diff algorithm to match/reorder children        | `string \| number`          | (diff core)           |
| `ns`    | Namespace URI (set automatically for SVG subtrees)                          | `string`                    | (diff core)           |
| `hook`  | Per-vnode lifecycle hooks (`Hooks`)                                          | `Hooks`                     | (type surface — see note) |

> Note: `hook` and the `Hooks` type are part of the public type surface. This trimmed
> implementation drives the DOM through the **module** lifecycle (`create` / `update` /
> `destroy`); per-vnode `data.hook` callbacks are not invoked by the current `patch` loop.

### Modules

Each module handles one slice of `VNodeData`. `init()` registers all of them; they are also
exported individually.

| Export                  | Handles      | Description                                                        |
| ----------------------- | ------------ | ----------------------------------------------------------------- |
| `classModule`           | `data.class` | Adds/removes classes from a `name → boolean` map                  |
| `propsModule`           | `data.props` | Assigns DOM properties directly (`elm[key] = value`)              |
| `attributesModule`      | `data.attrs` | Sets/removes HTML attributes via `setAttribute` (incl. xml/xlink) |
| `styleModule`           | `data.style` | Sets inline styles and CSS custom properties                      |
| `eventListenersModule`  | `data.on`    | Attaches/detaches event listeners                                 |
| `modules`               | —            | The default registry object mapping each module name to its module |

### Lower-level exports

| Export        | Type                                                              | Description                                                                                     |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `vnode`       | `(sel, data, children, text, elm) => VNode`                      | Low-level `VNode` factory used internally by `h`. Prefer `h` in application code.               |
| `addNS`       | `(data, children, sel) => void`                                  | Recursively applies the SVG namespace to a subtree. Called automatically by `h` for `svg…` selectors. |
| `htmlDomApi`  | `DOMAPI`                                                         | The default browser DOM adapter used internally by `patch` (create/insert/remove/text nodes, etc.). |
| `is`          | `{ array, isStr, primitive, isVnode }`                          | Small type-guard helpers used across the vnode internals.                                       |
| `Chain`       | `class Chain`                                                    | A chainable imperative DOM builder (`setAttribute`, `append`, `setTextContent`, …). Independent of the vnode diff. |
| `create`      | `(tagName, options?) => Chain`                                  | Convenience factory returning a new `Chain`.                                                    |

### Types

| Type                | Shape / meaning                                                                 |
| ------------------- | ------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }` — a virtual node           |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }` — see fields above   |
| `VNodes`            | `VNode[]`                                                                        |
| `VNodeChildElement` | `VNode \| string \| number`                                                     |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                       |
| `ArrayOrElement<T>` | `T \| T[]`                                                                       |
| `Key`               | `string \| number`                                                              |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | Interface describing the DOM operations `patch` uses (see `htmlDomApi`)          |
| `Fragment`          | `DocumentFragment` extension used for fragment handling                          |
| `Modules`           | `Record<string, Record<string, ModuleHook>>` — the module registry shape         |
| `ModuleHook`        | A single module lifecycle callback                                              |

## Notes

1. **Browser only.** `ranuts/vnode` touches `document` and DOM APIs; import it in browser code,
   not in Node.
2. **Keep the last vnode.** `patch` returns the new `VNode`. Store it and pass it as `oldVnode`
   on the next update so diffs are computed against the current tree.
3. **`text` and `children` are mutually exclusive** on a `VNode` — a node is either a text node
   or an element with children.
4. **Use `key` for lists.** When rendering dynamic lists, give siblings stable `key` values so
   the diff can match and reorder nodes instead of recreating them.
