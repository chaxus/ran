---
description: 'Renders a tool call and its result from a declared intent — generic, terminal, or diff — rather than from markup a tool had to choose.'
---

# Tool Card

Renders a tool call and its result from a **declared intent** rather than from markup.

> **Use when** you are showing what an agent or a job actually did — a shell command, a file
> edit, a lookup — and want the tool to say _what it is_ while the surface decides what it
> looks like.

A tool that returns HTML has picked a renderer, a theme, and a layout on the UI's behalf, and
it does so in the one place — the model-facing result — where UI concerns do not belong.
Declaring an intent keeps the two apart: the same call can render as a terminal block here, a
single line in a compact transcript, and a jump target in an editor, without the tool knowing
any of them exist.

## Quick Start

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.querySelector('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …when the call returns
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';
```

## Card kinds

### `generic`

The default, and the fallback. Title, an optional key/value table of arguments worth showing,
and optional result content.

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

The call _is_ a shell command. `title` is the command; `description` and `cwd` render above the
output. A non-zero `exitCode` is surfaced; zero is not.

```ts
card.call = { card: 'terminal', title: 'ls -la', description: 'List the tree', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

The call creates or modifies files. Each entry renders as unified-style hunks with both
gutters, computed by `diffLines` from [ranuts/utils](../../ranuts/utils/). **A null `oldText`
means the file is being created** — which is what a call-time view has, since a caller has no
prior content to read.

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## Two rules that bite

These views are computed on a live call **and again when a log is replayed**. Everything else
follows from that.

- **A view is a pure function of the call's arguments** (plus the result, for a result view).
  No I/O, no clock, no session state — otherwise a replay disagrees with what the user
  originally saw.
- **An unrecognised card degrades, it never throws.** A card kind from a newer producer, or a
  value mangled in storage, renders as `generic` with whatever title it has, and a malformed
  view renders empty. Display must not be able to break a replay.

## Locations

Any `locations` on a call render as buttons that fire `locationclick`, so an editor can follow
along:

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## API Reference

### Properties

| Property | Type                                | Default     | Description                                          |
| -------- | ----------------------------------- | ----------- | ---------------------------------------------------- |
| `call`   | `ToolCallView \| null`              | `null`      | The pending view, derived from the call's arguments. |
| `result` | `ToolResultView \| null`            | `null`      | The completed view. Replaces the pending one.        |
| `status` | `'running' \| 'success' \| 'error'` | `'running'` | Reflected, so styling can key off it.                |
| `open`   | `boolean`                           | `false`     | Whether the body is expanded.                        |
| `sheet`  | `string`                            | `''`        | CSS injected into the element's shadow DOM.          |

An unknown `status` value reads back as `running`.

### Events

| Event           | Detail                       | Fired when                     |
| --------------- | ---------------------------- | ------------------------------ |
| `locationclick` | `{ location: ToolLocation }` | A file reference is activated. |

### Parts

`card`, `header`, `status`, `title`, `toggle`, `body`, `description`, `exit`, `input`,
`output`, `file`, `path`, `hunk`, `line`, `locations`, `location`.

Diff lines carry `data-kind` of `context`, `added`, or `removed`.

### Accessibility

The header is a real `<button type="button">` with `aria-expanded`, so it is reachable and
operable from the keyboard without any extra wiring.

## Styling

`<r-tool-card>` exposes **24 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from — `:root`, a wrapper, or the element:

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Parts: `body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

The full list is in [style tokens](/src/ranui/style-tokens#tool-card); which token to reach for is the [design system](/src/ranui/design-system/).

## See also

- [Conversation](../conversation/) — use this as the `mount` target for a tool-call view
- [ranuts/utils](../../ranuts/utils/) — `diffLines`, which renders the `diff` card
