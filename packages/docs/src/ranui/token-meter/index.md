---
description: 'The ranui TokenMeter (<r-token-meter>) shows how much of a model context window a conversation is using, before the provider refuses the next request.'
---

# TokenMeter

How much of the context window a conversation is using.

> **Use when** you are building a chat UI against a model with a context limit. Every client
> that omits this works for a week and then stops working: each turn carries the whole
> history, the request grows monotonically, and one day the provider refuses it. The refusal
> arrives as a wall — this is the instrument that makes the growth visible before then.

## Quick Start

### Basic Usage

<Demo column>
  <r-token-meter limit="65536" used="12800"></r-token-meter>
  <r-token-meter limit="65536" used="54000"></r-token-meter>
  <r-token-meter limit="65536" used="69000"></r-token-meter>
</Demo>

```html
<r-token-meter limit="65536" used="12800"></r-token-meter>
```

```js
const meter = document.querySelector('r-token-meter');
meter.limit = 65536;
meter.used = 41200; // context the next request will carry
meter.spent = 128431; // tokens billed across the conversation, optional
```

The bar fills to `used / limit` and escalates through three levels: **ok**, **warn** (from 80%
of the limit) and **over**. `level` is reflected onto the host, so the page can react to the
same escalation the bar shows:

```css
r-token-meter[level='warn'] ~ .composer-hint {
  display: block;
}
```

### `used` and `spent` are different numbers

- **`used`** — what the _next request_ will carry: the history, not the whole conversation.
  This is the number the limit applies to, and the one the bar draws.
- **`spent`** — what has been billed _across_ the conversation so far. It only ever grows, and
  it is not bounded by the window.

Truncating a transcript lowers `used` and leaves `spent` alone. Showing only one of them
answers only one of the two questions a user has ("will the next message fit?" and "what has
this cost me?").

### Without a limit

With `limit` unset or zero the bar disappears and only the counts remain — useful while the
window size is unknown.

<Demo>
  <r-token-meter used="41200" spent="128431"></r-token-meter>
</Demo>

### Relabelling

<Demo>
  <r-token-meter label="上下文" limit="65536" used="41200"></r-token-meter>
</Demo>

```html
<r-token-meter label="上下文" limit="65536" used="41200"></r-token-meter>
<!-- label="" leaves only the counts -->
```

## API Reference

### Properties

| Property | Attribute | Type                       | Default     | Description                                                                                    |
| -------- | --------- | -------------------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `limit`  | `limit`   | `number`                   | `0`         | Context window size in tokens. Zero or absent hides the bar.                                   |
| `used`   | `used`    | `number`                   | `0`         | Tokens the next request will carry.                                                            |
| `spent`  | `spent`   | `number`                   | `0`         | Tokens billed across the conversation so far.                                                  |
| `label`  | `label`   | `string`                   | `'Context'` | Prefix for the readout; `''` leaves only the counts.                                           |
| `level`  | `level`   | `'ok' \| 'warn' \| 'over'` | derived     | How full the window is. **Set by the element** — writing it is overwritten on the next update. |
| `sheet`  | `sheet`   | `string`                   | `''`        | CSS injected into the shadow root.                                                             |

Counts are formatted the way a reader scans them: exact below a thousand (`847` is a number
someone can hold), abbreviated above (`41.2k`, `128k`) — the third digit of `128,431` tells a
reader nothing they act on.

### Parts

| Part    | Element              |
| ------- | -------------------- |
| `meter` | The whole element    |
| `track` | The bar's background |
| `fill`  | The filled portion   |
| `text`  | The label and counts |

## Accessibility

The element always carries a `title` stating the numbers, so **colour is never the only
carrier** of the warning — the bar going amber is a second signal, not the only one. Keep it
that way if you restyle the levels.

## Styling

`<r-token-meter>` exposes **9 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from — `:root`, a wrapper, or the element:

```css
r-token-meter {
  --ran-token-meter-fill-background: var(--ran-color-bg-subtle);
}
```

Parts: `fill` · `meter` · `text` · `track`

The full list is in [style tokens](/src/ranui/style-tokens#token-meter); which token to reach for is the [design system](/src/ranui/design-system/).

## Best Practices

- **Update `used` from the same place you build the request**, not from a rendering pass —
  the number people trust is the one the next request will actually send.
- **Escalate around the meter, not inside it.** At `level="over"` the useful UI is a
  suggestion (summarise, start a new thread), and that belongs to the app.
- **Don't animate the fill on a theme change** — see
  [design guidelines](/src/ranui/design-guides/#motion).
