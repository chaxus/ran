# Checkbox

Modern checkbox component with indeterminate state, multiple sizes, and form integration.

## Quick Start

### Basic Usage

<r-checkbox>Checkbox</r-checkbox>

```html
<r-checkbox>Checkbox</r-checkbox>
```

## API Reference

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Whether the checkbox is checked |
| `value` | `string` | `''` | Checkbox value for form submission |
| `disabled` | `boolean` | `false` | Whether the checkbox is disabled |
| `readonly` | `boolean` | `false` | Whether the checkbox is readonly |
| `required` | `boolean` | `false` | Whether the checkbox is required |
| `indeterminate` | `boolean` | `false` | Whether the checkbox is in indeterminate state |
| `size` | `string` | `'md'` | Checkbox size: `sm`, `md`, `lg` |
| `status` | `string` | `'normal'` | Checkbox status: `normal`, `error`, `warning`, `success` |
| `name` | `string` | - | Checkbox name for form submission |
| `label` | `string` | - | Label text |

### Checked State `checked`

<div style="display:flex;gap:12px;align-items:center;">
<r-checkbox>Unchecked</r-checkbox>
<r-checkbox checked>Checked</r-checkbox>
</div>

```html
<r-checkbox>Unchecked</r-checkbox>
<r-checkbox checked>Checked</r-checkbox>
```

### Sizes `size`

<div style="display:flex;gap:12px;align-items:center;">
<r-checkbox size="sm">Small</r-checkbox>
<r-checkbox size="md">Medium</r-checkbox>
<r-checkbox size="lg">Large</r-checkbox>
</div>

```html
<r-checkbox size="sm">Small</r-checkbox>
<r-checkbox size="md">Medium</r-checkbox>
<r-checkbox size="lg">Large</r-checkbox>
```

### Status `status`

<div style="display:flex;gap:12px;align-items:center;flex-direction:column;align-items:flex-start;">
<r-checkbox status="normal" checked>Normal</r-checkbox>
<r-checkbox status="success" checked>Success</r-checkbox>
<r-checkbox status="warning" checked>Warning</r-checkbox>
<r-checkbox status="error" checked>Error</r-checkbox>
</div>

```html
<r-checkbox status="normal" checked>Normal</r-checkbox>
<r-checkbox status="success" checked>Success</r-checkbox>
<r-checkbox status="warning" checked>Warning</r-checkbox>
<r-checkbox status="error" checked>Error</r-checkbox>
```

### Disabled State `disabled`

<div style="display:flex;gap:12px;align-items:center;">
<r-checkbox disabled>Disabled Unchecked</r-checkbox>
<r-checkbox disabled checked>Disabled Checked</r-checkbox>
</div>

```html
<r-checkbox disabled>Disabled Unchecked</r-checkbox>
<r-checkbox disabled checked>Disabled Checked</r-checkbox>
```

### Indeterminate State `indeterminate`

<r-checkbox indeterminate>Indeterminate</r-checkbox>

```html
<r-checkbox indeterminate>Indeterminate</r-checkbox>
```

### Readonly State `readonly`

<r-checkbox readonly checked>Readonly</r-checkbox>

```html
<r-checkbox readonly checked>Readonly</r-checkbox>
```

### Required Field `required`

<r-checkbox required>Required Checkbox</r-checkbox>

```html
<r-checkbox required>Required Checkbox</r-checkbox>
```

## Events

### Change Event

Fired when the checkbox state changes:

```html
<r-checkbox>Accept Terms</r-checkbox>

<script>
  const checkbox = document.querySelector('r-checkbox');
  checkbox.addEventListener('checkbox-change', (e) => {
    console.log('Checked:', e.detail.checked);
    console.log('Value:', e.detail.value);
  });
</script>
```

## Methods

### toggle()

Toggle the checkbox state programmatically:

```javascript
const checkbox = document.querySelector('r-checkbox');
checkbox.toggle();
```

## Form Integration

The checkbox component integrates with native HTML forms using the ElementInternals API:

```html
<form id="myForm">
  <r-checkbox name="terms" value="accepted" required>I accept the terms and conditions</r-checkbox>
  <r-checkbox name="newsletter" value="yes">Subscribe to newsletter</r-checkbox>
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.getElementById('myForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('Form data:', Object.fromEntries(formData));
  });
</script>
```

## CSS Parts

The checkbox component exposes the following CSS parts for styling:

```css
/* Target the container */
r-checkbox::part(container) {
  /* Custom styles */
}

/* Target the input element */
r-checkbox::part(input) {
  /* Custom styles */
}

/* Target the checkbox box */
r-checkbox::part(checkbox) {
  /* Custom styles */
}

/* Target the checkmark */
r-checkbox::part(checkmark) {
  /* Custom styles */
}

/* Target the label */
r-checkbox::part(label) {
  /* Custom styles */
}
```

## CSS Custom Properties

Customize the checkbox appearance using CSS variables:

```css
r-checkbox {
  /* Colors */
  --checkbox-color-border: #d1d5db;
  --checkbox-color-bg: #ffffff;
  --checkbox-color-checked: #3b82f6;
  --checkbox-color-checkmark: #ffffff;
  --checkbox-color-disabled: #e5e7eb;

  /* Status colors */
  --checkbox-color-error: #ef4444;
  --checkbox-color-warning: #f59e0b;
  --checkbox-color-success: #10b981;

  /* Sizes */
  --checkbox-sm-size: 16px;
  --checkbox-md-size: 20px;
  --checkbox-lg-size: 24px;

  /* Border */
  --checkbox-border-width: 2px;
  --checkbox-border-radius: 4px;

  /* Transition */
  --checkbox-transition-duration: 150ms;
}
```

## Best Practices

- **Labels**: Always provide clear labels for checkboxes
- **Groups**: Group related checkboxes together
- **Indeterminate**: Use indeterminate state for "select all" scenarios
- **Required**: Mark required checkboxes clearly
- **Status**: Use status colors to indicate validation state
- **Disabled**: Use disabled state when options are temporarily unavailable
- **Form Integration**: Use `name` and `value` attributes for proper form submission

## Accessibility

The checkbox component follows WAI-ARIA best practices:

- Uses semantic `<input type="checkbox">` element
- Supports keyboard navigation (Space to toggle)
- Properly manages `checked`, `disabled`, `readonly`, and `indeterminate` states
- Maintains focus indicators
- Associates labels with checkboxes
- Exposes validation states via `aria-invalid`
- Supports `aria-required` for required fields
- Announces state changes to screen readers
