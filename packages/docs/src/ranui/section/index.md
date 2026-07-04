# Section

A page section surface with an optional heading and subtitle above a slotted body. The heading area is exposed as an ARIA heading (`role="heading"`, `aria-level="2"`) and is hidden entirely when both the heading and subtitle are empty.

## Code demo

<r-section heading="Section heading" subtitle="A short line describing this section.">
  <p style="margin: 0;">Body content goes in the default slot.</p>
</r-section>

```xml
<r-section heading="Section heading" subtitle="A short line describing this section.">
  <p>Body content goes in the default slot.</p>
</r-section>
```

## Attributes

### `heading`

The section heading, rendered as an ARIA level-2 heading. Hidden when empty.

<r-section heading="Only a heading">
  <p style="margin: 0;">Body content.</p>
</r-section>

```xml
<r-section heading="Only a heading">
  <p>Body content.</p>
</r-section>
```

### `subtitle`

A supporting line below the heading. Hidden when empty. When both `heading` and `subtitle` are empty, the header row is hidden.

<r-section heading="Heading" subtitle="Supporting subtitle text.">
  <p style="margin: 0;">Body content.</p>
</r-section>

```xml
<r-section heading="Heading" subtitle="Supporting subtitle text.">
  <p>Body content.</p>
</r-section>
```

### `sheet`

CSS injected into the section's shadow DOM — the same `sheet` convention used by every other ranui component.

```xml
<r-section heading="Themed section" sheet=".ran-section-heading { color: #006bff; }">
  <p>Body content.</p>
</r-section>
```

## Slots

| Slot        | Description                                     |
| ----------- | ---------------------------------------------- |
| _(default)_ | Body content, rendered below the header row.   |

## Styling

- **`::part()` exports** — `header`, `heading`, `subtitle`, `body`.
- **CSS variables** — `--ran-section-border-color`, `--ran-section-radius`, `--ran-section-background`, `--ran-section-shadow`, `--ran-section-padding`, `--ran-section-heading-color`, `--ran-section-heading-font-size`, `--ran-section-heading-font-weight`, `--ran-section-subtitle-color`.

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```
