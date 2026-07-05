# Card

A structured content container with header, body, and footer zones for grouping related content.

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

| Property      | Type     | Default | Description                                                      |
| ------------- | -------- | ------- | ---------------------------------------------------------------- |
| `title`       | `string` | `''`    | Card heading, shown at the top of the header. Hidden when empty. |
| `description` | `string` | `''`    | Subtitle rendered below the title. Hidden when empty.            |
| `sheet`       | `string` | `''`    | CSS injected into the card's shadow DOM.                         |

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

The following CSS variables can be overridden: `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-shadow`, `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

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
- **Theming**: Prefer CSS variables and `::part()` over the `sheet` attribute for reusable styling.
