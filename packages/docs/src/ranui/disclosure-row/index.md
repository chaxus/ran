---
description: 'The ranui DisclosureRow (<r-disclosure-row>) is a one-line "title · summary" row that expands to reveal a body, with a busy shimmer while the work behind it runs.'
---

# DisclosureRow

The one-line `[leading] title · summary` chrome that expands to reveal a body. It is the row
shared by `<r-reasoning>` and `<r-tool-card>`, so a transcript carrying both has one
disclosure language instead of two.

> **Use when** you have a compact line that stands for something larger (a tool call, a
> chain of thought, a log group) and the detail is worth hiding until asked for.

## Quick Start

### Basic Usage

<Demo column>
  <r-disclosure-row heading="Read file" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">The body appears when the row is open.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Read file" summary="packages/ranui/index.ts" expandable>
  <div>The body appears when the row is open.</div>
</r-disclosure-row>
```

The **heading is the fixed-width left half** and the **summary is the truncating right half**,
so a column of rows lines up on the same spine no matter how long each summary is. An empty
summary drops the separator with it.

### While the work is running

`busy` draws a shimmer sweep across the row. A spinner says _something somewhere_ is
happening; a sweep over the row says **this** row is the one still working.

<Demo column>
  <r-disclosure-row heading="Run tests" summary="2351 passed" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="Run tests" summary="2351 passed" expandable></r-disclosure-row>
</Demo>

### With a leading indicator

The `leading` slot and its hover chevron share one grid cell, so the swap on hover costs no
layout.

<Demo column>
  <r-disclosure-row heading="Build" summary="failed in 4.2s" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">Bundle exceeds the size limit.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Build" summary="failed in 4.2s" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>Bundle exceeds the size limit.</div>
</r-disclosure-row>
```

## API Reference

### Properties

| Property     | Attribute    | Type      | Default | Description                                                      |
| ------------ | ------------ | --------- | ------- | ---------------------------------------------------------------- |
| `heading`    | `heading`    | `string`  | `''`    | The fixed-width left half of the line.                           |
| `summary`    | `summary`    | `string`  | `''`    | The truncating right half. Empty drops the separator with it.    |
| `open`       | `open`       | `boolean` | `false` | Whether the body is shown. Reflected, so `:has([open])` works.   |
| `expandable` | `expandable` | `boolean` | `false` | Whether the row has a body worth opening.                        |
| `busy`       | `busy`       | `boolean` | `false` | Whether the work this row stands for is still running.           |
| `tone`       | `tone`       | `string`  | `''`    | `error` colours the summary; anything else is the ordinary tone. |
| `sheet`      | `sheet`      | `string`  | `''`    | CSS injected into the shadow root.                               |

::: warning The attribute is `heading`, not `title`
`title` is a native `HTMLElement` attribute the browser renders as a tooltip, so a component
that used it for a heading would make every instance sprout a tooltip repeating the text
already on screen, and nothing turns that off once it is set. `<r-card>` and `<r-modal>`
carry the same rename for the same reason.
:::

### Events

| Event              | Detail | Dispatch          | Description                        |
| ------------------ | ------ | ----------------- | ---------------------------------- |
| `disclosuretoggle` | —      | bubbles, composed | The row was expanded or collapsed. |

::: warning The event is `disclosuretoggle`, not `toggle`
`toggle` is what `<details>` fires, and its `ToggleEvent` carries `oldState` / `newState`
rather than a `detail`; a listener typed against the platform name finds nothing in it. Read
the state from the element: `row.open`.
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? 'opened' : 'closed');
});
```

### Slots

| Slot      | Content                                                     |
| --------- | ----------------------------------------------------------- |
| `default` | The body, revealed while `open`.                            |
| `leading` | An indicator before the heading, typically `<r-state-dot>`. |

### Parts

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## Styling

`<r-disclosure-row>` exposes **15 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from, such as `:root`, a wrapper, or the element:

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Parts: `body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

The full list is in [style tokens](/src/ranui/style-tokens#disclosure-row); which token to reach for is the [design system](/src/ranui/design-system/).

## Best Practices

- **Give a row a body, or don't make it expandable.** A chevron that opens an empty area is a
  dead end; leave `expandable` off and the row stays a line.
- **Keep the heading a fixed vocabulary** (`Read file`, `Run tests`, `Search`) and put the
  variable part in the summary. That is what makes a column of rows scannable.
- **Pair `tone="error"` with words, never colour alone**: the summary should say what failed.
