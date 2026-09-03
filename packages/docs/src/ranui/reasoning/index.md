---
description: 'A collapsible chain of thought that expands while reasoning streams and collapses when it ends, until the reader decides otherwise.'
---

# Reasoning

A collapsible chain of thought.

> **Use when** a model exposes its reasoning separately from its answer and you want the
> reader to watch it happen without keeping it on screen afterwards.

Reasoning is the one part of a response a reader wants to watch while it happens and almost
never wants to keep. So the element expands while `streaming` is set and collapses when it
clears.

**Until the reader touches it.** Once they expand or collapse it themselves, the automatic
behaviour stops for good. The same ownership rule
[`createBottomFollower`](../../ranuts/utils/) applies to scrolling, and for the same reason:
an interface that keeps re-deciding something the reader has already decided is worse than
one that never decided at all. Setting `open` from script counts as taking control too,
since script is acting for a caller who has an opinion.

## Quick Start

```html
<r-reasoning label="Thinking"></r-reasoning>
```

```ts
const reasoning = document.querySelector('r-reasoning');

reasoning.streaming = true; // expands
reasoning.content += delta; // grows while visible
reasoning.duration = 4200; // "4.2s" beside the label
reasoning.streaming = false; // collapses, unless the reader intervened
```

`ranuts/stream` already keeps `reasoning-delta` apart from `text-delta`, so a view can feed
this straight from a snapshot:

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## Details worth knowing

- **Sub-second durations render as nothing.** A reader cares that it was fast, not that it
  was 340ms.
- **The label pulses while streaming**, so a long silent think does not read as a stall.
  `prefers-reduced-motion` turns the animation off without removing the information.
- **The default slot replaces the rendered text**, for a caller that wants `<r-markdown>` in
  the body instead of plain text.

## API Reference

### Properties

| Property    | Type             | Default       | Description                                                     |
| ----------- | ---------------- | ------------- | --------------------------------------------------------------- |
| `content`   | `string`         | `''`          | The reasoning text. Assigning repeatedly is the streaming path. |
| `streaming` | `boolean`        | `false`       | Whether reasoning is still arriving.                            |
| `open`      | `boolean`        | `false`       | Whether the body is expanded.                                   |
| `label`     | `string`         | `'Reasoning'` | Summary text.                                                   |
| `duration`  | `number \| null` | `null`        | Milliseconds spent thinking. Hidden below one second.           |
| `sheet`     | `string`         | `''`          | CSS injected into the element's shadow DOM.                     |

A `duration` that is not a finite, non-negative number reads back as `null`.

### Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| (default) | Replaces the rendered text with your own body content. |

### Parts

`reasoning`, `summary`, `marker`, `label`, `meta`, `body`, `text`.

### Accessibility

The summary is a real `<button type="button">` with `aria-expanded`, so it is reachable and
operable from the keyboard without extra wiring.

## Styling

`<r-reasoning>` exposes **4 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from, such as `:root`, a wrapper, or the element:

```css
r-reasoning {
  --ran-reasoning-color: var(--ran-color-text-secondary);
}
```

Parts: `body` · `row` · `text`

The full list is in [style tokens](/src/ranui/style-tokens#reasoning); which token to reach for is the [design system](/src/ranui/design-system/).

## See also

- [Conversation](../conversation/): mount this as the reasoning row of a transcript
- [ranuts/stream](../../ranuts/stream/): where `reasoning-delta` comes from
