# Card

A structured content container with header, body, and footer zones for grouping related content. Cards are Geist-style bordered surfaces — page background plus a 1px border, not a gray fill — and stay inert on hover unless you opt in with `hoverable`.

> **Use when** you need to group related content into a bordered surface with title, description, body, and footer zones — `<r-card>` gives you those slots plus an optional `hoverable` interactive state.

## Quick Start

### Basic Usage

<Demo>
  <r-card title="Card title" description="Optional subtitle" style="max-width: 360px;">
    <span slot="extra" style="font-size: 12px;">tag</span>
    <p style="margin: 0;">Body content goes in the default slot.</p>
    <a slot="footer" href="#">View notes</a>
  </r-card>
</Demo>

```html
<r-card title="Card title" description="Optional subtitle">
  <span slot="extra">tag</span>
  <p>Body content goes in the default slot.</p>
  <a slot="footer" href="#">View notes</a>
</r-card>
```

## API Reference

### Properties

| Property      | Type      | Default | Description                                                                  |
| ------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `title`       | `string`  | `''`    | Card heading, shown at the top of the header. Hidden when empty.             |
| `description` | `string`  | `''`    | Subtitle rendered below the title. Hidden when empty.                        |
| `hoverable`   | `boolean` | `false` | Interactive card: hover darkens the border and lifts to the elevated shadow. |
| `sheet`       | `string`  | `''`    | CSS injected into the card's shadow DOM.                                     |

### Title `title`

The card heading, shown at the top of the header. Hidden when empty.

<Demo>
  <r-card title="Only a title" style="max-width: 360px;">
    <p style="margin: 0;">Body content.</p>
  </r-card>
</Demo>

```html
<r-card title="Only a title">
  <p>Body content.</p>
</r-card>
```

### Description `description`

A subtitle rendered below the title. Hidden when empty. When neither `title` nor `description` is set, the whole header is hidden.

<Demo>
  <r-card title="Title" description="A short supporting subtitle" style="max-width: 360px;">
    <p style="margin: 0;">Body content.</p>
  </r-card>
</Demo>

```html
<r-card title="Title" description="A short supporting subtitle">
  <p>Body content.</p>
</r-card>
```

### Interactive Card `hoverable`

Cards don't react to hover by default. Add the `hoverable` attribute on cards that are actually clickable: on hover the border darkens one step on the gray ladder (`--ran-color-border` → `--ran-color-border-hover`) and the surface takes the quiet elevated shadow (`--ran-shadow-elevated`).

<Demo>
  <r-card hoverable title="Hoverable card" description="Hover me" style="max-width: 360px; cursor: pointer;">
    <p style="margin: 0;">The border darkens and the card lifts slightly.</p>
  </r-card>
</Demo>

```html
<r-card hoverable title="Hoverable card" description="Hover me">
  <p>The border darkens and the card lifts slightly.</p>
</r-card>
```

`hoverable` is purely presentational — gate it to cards that respond to clicks, and keep non-interactive cards inert.

### External Styles `sheet`

CSS injected into the card's shadow DOM — the same `sheet` convention used by every other ranui component.

```html
<r-card title="Themed card" sheet=".ran-card { background: #f6ffed; }">
  <p>Body content.</p>
</r-card>
```

## Slots

| Slot        | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| _(default)_ | Body content, rendered in the card body.                                 |
| `extra`     | Right side of the header — badges, links, or actions.                    |
| `footer`    | Footer content. The footer is hidden until this slot has assigned nodes. |

## CSS Parts

The card exposes these `::part()` hooks for external styling:

| Part          | Description                        |
| ------------- | ---------------------------------- |
| `card`        | The outer card container.          |
| `header`      | The header row.                    |
| `title`       | The title text.                    |
| `description` | The subtitle text.                 |
| `extra`       | The `extra` slot in the header.    |
| `body`        | The body region (default slot).    |
| `footer`      | The footer region (`footer` slot). |

The following CSS variables can be overridden: `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-border-color`, `--ran-card-shadow`, `--ran-card-hover-border-color`, `--ran-card-hover-shadow` (the last two apply with `hoverable`), `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

## Events

The card is a passive container and dispatches no custom events.

## Best Practices

- **Title & Description**: Use `title` for the heading and `description` for a short supporting subtitle; omit both to hide the header entirely.
- **Body Content**: Place primary content in the default slot.
- **Header Actions**: Use the `extra` slot for badges, links, or actions aligned to the right of the header.
- **Footer**: Use the `footer` slot for secondary actions or links; it stays hidden until you slot content into it.
- **Hover Feedback**: Add `hoverable` only to cards that are clickable — non-interactive cards must not react to hover.
- **Theming**: Prefer CSS variables and `::part()` over the `sheet` attribute for reusable styling.
