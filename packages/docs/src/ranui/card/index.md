# Card

A structured content container with header, body, and footer zones. The header shows an optional title and description; the body holds the default slotted content; the footer appears only when you slot content into it.

## Code demo

<r-card title="Card title" description="Optional subtitle" style="max-width: 360px;">
  <span slot="extra" style="font-size: 12px;">tag</span>
  <p style="margin: 0;">Body content goes in the default slot.</p>
  <a slot="footer" href="#">View notes</a>
</r-card>

```xml
<r-card title="Card title" description="Optional subtitle">
  <span slot="extra">tag</span>
  <p>Body content goes in the default slot.</p>
  <a slot="footer" href="#">View notes</a>
</r-card>
```

## Attributes

### `title`

The card heading, shown at the top of the header. Hidden when empty.

<r-card title="Only a title" style="max-width: 360px;">
  <p style="margin: 0;">Body content.</p>
</r-card>

```xml
<r-card title="Only a title">
  <p>Body content.</p>
</r-card>
```

### `description`

A subtitle rendered below the title. Hidden when empty. When neither `title` nor `description` is set, the whole header is hidden.

<r-card title="Title" description="A short supporting subtitle" style="max-width: 360px;">
  <p style="margin: 0;">Body content.</p>
</r-card>

```xml
<r-card title="Title" description="A short supporting subtitle">
  <p>Body content.</p>
</r-card>
```

### `sheet`

CSS injected into the card's shadow DOM — the same `sheet` convention used by every other ranui component.

```xml
<r-card title="Themed card" sheet=".ran-card { background: #f6ffed; }">
  <p>Body content.</p>
</r-card>
```

## Slots

| Slot          | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| _(default)_   | Body content, rendered in the card body.                                |
| `extra`       | Right side of the header — badges, links, or actions.                   |
| `footer`      | Footer content. The footer is hidden until this slot has assigned nodes. |

## Styling

- **`::part()` exports** — `card`, `header`, `title`, `description`, `extra`, `body`, `footer`.
- **CSS variables** — `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-shadow`, `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

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
