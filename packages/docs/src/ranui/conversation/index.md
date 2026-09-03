---
description: 'Renders an append-only event log as a conversation, handling projection, bottom-follow, and row reconciliation, with each kind of content registered as an independent view.'
---

# Conversation

Renders an append-only event log as a conversation. The element owns the three things that are
tedious and easy to get wrong, and nothing else: projecting events into nodes, keeping the view
pinned to its floor without fighting the reader, and reconciling rows against the node list.

> **Use when** you are rendering a streaming transcript (a chat, an agent session, a log) and
> want each kind of content (message, tool call, status line) to be an independent registration
> rather than another branch in a growing renderer.

What a message or a tool call _looks like_ is a registered view, not the element's business. Its
projection is [ranuts/conversation](../../ranuts/conversation/) and its scrolling is
`createBottomFollower` from [ranuts/utils](../../ranuts/utils/).

## Quick Start

```html
<r-conversation empty="No messages yet" style="height: 400px"></r-conversation>
```

```ts
const chat = document.querySelector('r-conversation');

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
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });
```

`<r-markdown>` is the intended row for prose: in its default `mode="streaming"` it already
closes half-streamed `**bold`, backticks, links and `$$` math, so a view never has to.

## Rules that bite if broken

- **Register every view before the first `push`.** The projection is built once from the
  registered set, so a later registration would silently miss every event already folded in. The
  element throws rather than doing that.
- **`update` folds state; `patch` writes it to the DOM.** They are named apart because they are
  different jobs: `patch` folds nothing, and runs once per frame on a streaming row, so keep it
  cheap.
- **`mount` is optional.** A view without it contributes state that other views read through
  `reader.previous`, and renders nothing.
- **Rows keep the position they opened in.** A streaming message does not jump to the end of the
  list on every delta.

## Bottom-follow

On by default. The view stays pinned to its floor as content arrives, stops the instant the
reader scrolls up, and re-pins when they come back down, all without fighting them, because the
follower distinguishes its own scroll writes from the reader's rather than listening for input
devices.

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"` leaves the reader in control from the start; `scrollToBottom()` takes it back.
For paging in older content, call `captureAnchor()` before the prepend and `restoreAnchor()`
after, so the reader keeps looking at what they were looking at.

## API Reference

### Properties

| Property | Type      | Default | Description                                                              |
| -------- | --------- | ------- | ------------------------------------------------------------------------ |
| `follow` | `boolean` | `true`  | Follow new content until the reader scrolls away from the floor.         |
| `empty`  | `string`  | `''`    | Text shown while the projection has produced no rows. Hidden when empty. |
| `pinned` | `boolean` | `true`  | Read-only. Whether the view is currently following new content.          |
| `sheet`  | `string`  | `''`    | CSS injected into the element's shadow DOM.                              |

### Methods

| Method                | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `register(view)`      | Registers one kind of content. Throws after the first `push`. |
| `push(event)`         | Projects one event and renders whatever it changed.           |
| `reset()`             | Drops every node and row, keeping the registered views.       |
| `scrollToBottom()`    | Scrolls to the floor and resumes following.                   |
| `captureAnchor(key?)` | Remembers a row's position before older content is prepended. |
| `restoreAnchor()`     | Restores the captured row to where it was.                    |

### Events

| Event          | Detail                | Fired when                       |
| -------------- | --------------------- | -------------------------------- |
| `pinnedchange` | `{ pinned: boolean }` | Bottom-follow is gained or lost. |

### Slots

| Slot     | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| `footer` | Sticky area below the rows: a composer belongs here, and its height is observed. |

### Parts

`conversation` (the scrollport), `list`, `row`, `footer`, `empty`.

Each row also carries `data-kind` and `data-key`, so a consumer can style or find one without
reaching into the shadow tree.

## Styling

`<r-conversation>` exposes **14 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from, such as `:root`, a wrapper, or the element:

```css
r-conversation {
  --ran-conversation-background: var(--ran-color-bg-subtle);
}
```

Parts: `conversation` · `empty` · `footer` · `list` · `older`

The full list is in [style tokens](/src/ranui/style-tokens#conversation); which token to reach for is the [design system](/src/ranui/design-system/).

## See also

- [ranuts/stream](../../ranuts/stream/): turn a provider's SSE into the events pushed here
- [ranuts/conversation](../../ranuts/conversation/): the projection, including cadence
- [Markdown](../markdown/): the streaming-aware row for prose
