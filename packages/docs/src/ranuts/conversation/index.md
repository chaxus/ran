# ranuts/conversation — Event log to renderable nodes

Projects an append-only event log into the nodes a conversation view renders.

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**Its own entry point**, and DOM-free: the projection is testable, and server-renderable, on its
own. [`<r-conversation>`](../../ranui/conversation/) is the DOM consumer.

## Why not switch on event type

The usual way to render a conversation is a view that switches on event type and mutates a
component tree. That puts ordering, identity, and partial-update reconciliation **in the view**,
so every new kind of content — a tool call, an approval prompt, a status line — has to be
threaded through by hand, and the view grows a branch per kind.

Here each kind is an **independently registered state machine**. A definition says which events
are its own, folds them into its own state, and never learns the others exist. Adding a kind is
adding a definition, not editing a renderer.

## A definition

```ts
const message = {
  kind: 'message',
  // Which events are mine, and which node they belong to.
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // Fold them into my own state.
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // How often subscribers should see the result.
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions` is declared over `unknown` state, so definitions with different state types
register side by side without a cast at the call site while each stays fully typed where it is
written.

## Semantics

- **Every definition sees every event.** The engine does not stop at the first claim, so one log
  event can drive two nodes.
- **Order is fixed at `start`.** A node that keeps updating stays where it opened, so a
  streaming message does not jump to the end of the list on every delta.
- **An `update` for an id with no open node is dropped.** That is the honest outcome when the
  start event was trimmed from a paged window; inventing a node from a partial update would
  render something that never existed.
- **A repeated `start` re-opens the node in place.** The definition decided this is a new node,
  so the old state is discarded rather than merged into — and the position is kept.
- **`reader.previous(kind)` is backward-only.** A definition that could see nodes started after
  it would give a different answer depending on when it ran, and replaying the same log would
  not reproduce the same view.

## Publication cadence

`publication` is the streaming throttle, and the only performance knob you need:

| Cadence           | Use for                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| `animation-frame` | per-token deltas — every delta between two paints coalesces into one notification |
| `immediate`       | discrete facts — a tool result, an approval; waiting a frame only adds latency    |
| `none`            | state a later publication will carry anyway; recorded without waking the view     |

**Cadence escalates and never relaxes.** An `immediate` publication while a frame is pending
fires now and cancels the frame, rather than notifying twice. Omitting `publication` means
`immediate`.

The `scheduler` option replaces frame scheduling, which is how cadence is tested without a
paint. The default uses `requestAnimationFrame` in a browser and a microtask elsewhere.

## Nodes

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`, stable for the node's whole life
  kind: string;
  id: string;
  seq: number; // ordinal of the start event — the ordering key
  state: State;
}
```

`nodes()` returns the same array until the next accepted event, and each node is frozen, so a
view can hold one across a publication without it changing underneath.

## See also

- [ranuts/stream](../stream/) — produce the events
- [`<r-conversation>`](../../ranui/conversation/) — render the nodes
- `createBottomFollower` in [ranuts/utils](../utils/) — keep the view pinned to its floor
