# Button

Modern button component with multiple variants, sizes, and interaction states.

## Quick Start

### Basic Usage

<r-button>Button</r-button>

```html
<r-button>Button</r-button>
```

## API Reference

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `string` | `'solid'` | Button variant: `solid`, `outline`, `ghost`, `link` |
| `type` | `string` | `'default'` | Button type: `default`, `primary`, `success`, `warning`, `danger` |
| `size` | `string` | `'md'` | Button size: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `loading` | `boolean` | `false` | Whether the button is in loading state |
| `icon` | `string` | - | Icon name to display |
| `icon-position` | `string` | `'left'` | Icon position: `left`, `right` |
| `full-width` | `boolean` | `false` | Whether the button takes full width |
| `shape` | `string` | `'default'` | Button shape: `default`, `round`, `circle` |

### Variants `variant`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="solid" type="primary">Solid</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="outline" type="primary">Outline</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button variant="ghost" type="primary">Ghost</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button variant="link" type="primary">Link</r-button>
</div>

```html
<r-button variant="solid" type="primary">Solid</r-button>
<r-button variant="outline" type="primary">Outline</r-button>
<r-button variant="ghost" type="primary">Ghost</r-button>
<r-button variant="link" type="primary">Link</r-button>
```

### Button Types `type`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="default">Default</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">Primary</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="success">Success</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="warning">Warning</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="danger">Danger</r-button>
</div>

```html
<r-button type="default">Default</r-button>
<r-button type="primary">Primary</r-button>
<r-button type="success">Success</r-button>
<r-button type="warning">Warning</r-button>
<r-button type="danger">Danger</r-button>
```

### Sizes `size`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button size="sm" type="primary">Small</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button size="md" type="primary">Medium</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button size="lg" type="primary">Large</r-button>
</div>

```html
<r-button size="sm" type="primary">Small</r-button>
<r-button size="md" type="primary">Medium</r-button>
<r-button size="lg" type="primary">Large</r-button>
```

### Disabled State `disabled`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" disabled>Primary Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="outline" type="primary" disabled>Outline Button</r-button>
</div>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button variant="outline" type="primary" disabled>Outline Button</r-button>
```

### Loading State `loading`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" loading>Loading</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="outline" type="primary" loading>Loading</r-button>
</div>

```html
<r-button type="primary" loading>Loading</r-button>
<r-button variant="outline" type="primary" loading>Loading</r-button>
```

### Icon Button `icon`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="home">Home</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="user" icon-position="right">Profile</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="plus" shape="circle"></r-button>
</div>

```html
<r-button type="primary" icon="home">Home</r-button>
<r-button type="primary" icon="user" icon-position="right">Profile</r-button>
<r-button type="primary" icon="plus" shape="circle"></r-button>
```

### Shapes `shape`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" shape="default">Default</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" shape="round">Round</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="plus" shape="circle"></r-button>
</div>

```html
<r-button type="primary" shape="default">Default</r-button>
<r-button type="primary" shape="round">Round</r-button>
<r-button type="primary" icon="plus" shape="circle"></r-button>
```

### Full Width `full-width`

<r-button type="primary" full-width>Full Width Button</r-button>

```html
<r-button type="primary" full-width>Full Width Button</r-button>
```

## Events

### Click Event

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## CSS Parts

The button exposes the following CSS parts for styling:

```css
/* Target the button container */
r-button::part(button) {
  /* Custom styles */
}

/* Target the icon */
r-button::part(icon) {
  /* Custom styles */
}

/* Target the loading spinner */
r-button::part(loading) {
  /* Custom styles */
}
```

## CSS Custom Properties

Customize the button appearance using CSS variables:

```css
r-button {
  /* Colors */
  --button-color-primary: #3b82f6;
  --button-color-success: #10b981;
  --button-color-warning: #f59e0b;
  --button-color-danger: #ef4444;

  /* Sizes */
  --button-sm-height: 32px;
  --button-md-height: 40px;
  --button-lg-height: 48px;

  /* Border radius */
  --button-border-radius: 6px;

  /* Transition */
  --button-transition-duration: 150ms;
}
```

## Best Practices

- **Primary Actions**: Use `type="primary"` with `variant="solid"` for main CTAs
- **Destructive Actions**: Use `type="danger"` for destructive operations (delete, remove)
- **Success Actions**: Use `type="success"` for positive confirmations
- **Secondary Actions**: Use `variant="outline"` or `variant="ghost"` for secondary actions
- **Disabled State**: Use `disabled` when actions are temporarily unavailable
- **Loading State**: Use `loading` during async operations to provide feedback
- **Icons**: Add relevant icons to enhance UX and make actions more recognizable
- **Accessibility**: Always provide meaningful text content, even for icon-only buttons

## Accessibility

The button component follows WAI-ARIA best practices:

- Uses semantic `<button>` element
- Supports keyboard navigation (Enter/Space)
- Properly manages `disabled` and `aria-disabled` states
- Maintains focus indicators
- Supports `aria-label` for icon-only buttons
