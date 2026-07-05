# Section

Page section surface with an optional heading and subtitle above a slotted body.

## Quick Start

### Basic Usage

<Demo align="stretch">
  <r-section heading="Section heading" subtitle="A short line describing this section.">
    <p style="margin: 0;">Body content goes in the default slot.</p>
  </r-section>
</Demo>

```html
<r-section heading="Section heading" subtitle="A short line describing this section.">
  <p>Body content goes in the default slot.</p>
</r-section>
```

## API Reference

### Properties

| Property   | Type     | Default | Description                                          |
| ---------- | -------- | ------- | ---------------------------------------------------- |
| `heading`  | `string` | `''`    | Section heading, rendered as an ARIA level-2 heading |
| `subtitle` | `string` | `''`    | Supporting line below the heading                    |
| `sheet`    | `string` | `''`    | CSS injected into the section's shadow DOM           |

The header row (heading + subtitle) is hidden entirely when both `heading` and `subtitle` are empty.

### Heading `heading`

The section heading, rendered as an ARIA level-2 heading (`role="heading"`, `aria-level="2"`). Hidden when empty.

<Demo align="stretch">
  <r-section heading="Only a heading">
    <p style="margin: 0;">Body content.</p>
  </r-section>
</Demo>

```html
<r-section heading="Only a heading">
  <p>Body content.</p>
</r-section>
```

### Subtitle `subtitle`

A supporting line below the heading. Hidden when empty.

<Demo align="stretch">
  <r-section heading="Heading" subtitle="Supporting subtitle text.">
    <p style="margin: 0;">Body content.</p>
  </r-section>
</Demo>

```html
<r-section heading="Heading" subtitle="Supporting subtitle text.">
  <p>Body content.</p>
</r-section>
```

### Shadow CSS `sheet`

CSS injected into the section's shadow DOM — the same `sheet` convention used by every other ranui component.

<Demo align="stretch">
  <r-section heading="Themed section" subtitle="Heading recolored via sheet." sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">Body content.</p>
  </r-section>
</Demo>

```html
<r-section heading="Themed section" sheet=".ran-section-heading { color: #006bff; }">
  <p>Body content.</p>
</r-section>
```

## Slots

| Slot        | Description                                  |
| ----------- | -------------------------------------------- |
| _(default)_ | Body content, rendered below the header row. |

## CSS Parts

| Part       | Description                                |
| ---------- | ------------------------------------------ |
| `header`   | The header row wrapping heading + subtitle |
| `heading`  | The ARIA level-2 heading element           |
| `subtitle` | The supporting subtitle line               |
| `body`     | The body wrapper around the default slot   |

CSS variables exposed: `--ran-section-border-color`, `--ran-section-radius`, `--ran-section-background`, `--ran-section-shadow`, `--ran-section-padding`, `--ran-section-heading-color`, `--ran-section-heading-font-size`, `--ran-section-heading-font-weight`, `--ran-section-subtitle-color`.

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

## Best Practices

- **Section titles**: Set `heading` to label each major region of a page.
- **Context**: Use `subtitle` for a short supporting line; omit both to render a plain surface with no header row.
- **Accessibility**: The heading is exposed as an ARIA level-2 heading, so it participates in the document outline — keep headings meaningful.
- **Theming**: Prefer the `--ran-section-*` CSS variables or `::part()` selectors over the `sheet` attribute for reusable styling.
