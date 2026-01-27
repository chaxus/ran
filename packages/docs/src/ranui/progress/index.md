# Progress

Modern progress bar component with multiple types, draggable interaction, and indeterminate state.

## Quick Start

### Basic Usage

<r-progress percent="50"></r-progress>

```html
<r-progress percent="50"></r-progress>
```

## API Reference

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `percent` | `number` | `0` | Progress percentage (0-100) |
| `type` | `string` | `'line'` | Progress type: `line`, `circle`, `dashboard` |
| `size` | `string` | `'md'` | Progress size: `sm`, `md`, `lg` |
| `status` | `string` | `'normal'` | Progress status: `normal`, `success`, `error`, `warning`, `active` |
| `show-text` | `boolean` | `true` | Whether to show progress text |
| `stroke-width` | `number` | - | Stroke width for line progress |
| `draggable` | `boolean` | `false` | Whether progress can be dragged (interactive) |
| `width` | `number` | `120` | Width for circle/dashboard type (in px) |
| `indeterminate` | `boolean` | `false` | Indeterminate progress (loading state) |
| `color` | `string` | - | Progress color |

### Types `type`

#### Line Progress (Default)

<r-progress type="line" percent="70"></r-progress>

```html
<r-progress type="line" percent="70"></r-progress>
```

#### Circle Progress

<r-progress type="circle" percent="75"></r-progress>

```html
<r-progress type="circle" percent="75"></r-progress>
```

#### Dashboard Progress

<r-progress type="dashboard" percent="80"></r-progress>

```html
<r-progress type="dashboard" percent="80"></r-progress>
```

### Sizes `size`

<div style="display:flex;gap:12px;flex-direction:column;align-items:flex-start;">
<r-progress size="sm" percent="40"></r-progress>
<r-progress size="md" percent="60"></r-progress>
<r-progress size="lg" percent="80"></r-progress>
</div>

```html
<r-progress size="sm" percent="40"></r-progress>
<r-progress size="md" percent="60"></r-progress>
<r-progress size="lg" percent="80"></r-progress>
```

### Status `status`

<div style="display:flex;gap:12px;flex-direction:column;align-items:flex-start;">
<r-progress status="normal" percent="40"></r-progress>
<r-progress status="success" percent="100"></r-progress>
<r-progress status="error" percent="50"></r-progress>
<r-progress status="warning" percent="60"></r-progress>
<r-progress status="active" percent="70"></r-progress>
</div>

```html
<r-progress status="normal" percent="40"></r-progress>
<r-progress status="success" percent="100"></r-progress>
<r-progress status="error" percent="50"></r-progress>
<r-progress status="warning" percent="60"></r-progress>
<r-progress status="active" percent="70"></r-progress>
```

### Progress Text `show-text`

<div style="display:flex;gap:12px;flex-direction:column;align-items:flex-start;">
<r-progress percent="50" show-text></r-progress>
<r-progress percent="75" show-text="false"></r-progress>
</div>

```html
<r-progress percent="50" show-text></r-progress>
<r-progress percent="75" show-text="false"></r-progress>
```

### Draggable Progress `draggable`

<r-progress percent="30" draggable></r-progress>

```html
<r-progress percent="30" draggable></r-progress>
```

### Indeterminate State `indeterminate`

<r-progress indeterminate></r-progress>

```html
<r-progress indeterminate></r-progress>
```

### Custom Color `color`

<r-progress percent="70" color="#10b981"></r-progress>

```html
<r-progress percent="70" color="#10b981"></r-progress>
```

### Stroke Width `stroke-width`

<r-progress percent="60" stroke-width="10"></r-progress>

```html
<r-progress percent="60" stroke-width="10"></r-progress>
```

## Events

### Change Event

Fired when progress value changes (especially useful with draggable progress):

```html
<r-progress draggable percent="50"></r-progress>

<script>
  const progress = document.querySelector('r-progress');
  progress.addEventListener('progress-change', (e) => {
    console.log('Progress changed:', e.detail.percent);
  });
</script>
```

## CSS Parts

The progress component exposes the following CSS parts for styling:

```css
/* Target the container */
r-progress::part(container) {
  /* Custom styles */
}

/* Target the track */
r-progress::part(track) {
  /* Custom styles */
}

/* Target the bar */
r-progress::part(bar) {
  /* Custom styles */
}

/* Target the text */
r-progress::part(text) {
  /* Custom styles */
}

/* Target the handle (for draggable) */
r-progress::part(handle) {
  /* Custom styles */
}
```

## CSS Custom Properties

Customize the progress appearance using CSS variables:

```css
r-progress {
  /* Colors */
  --progress-color-track: #e5e7eb;
  --progress-color-bar: #3b82f6;
  --progress-color-text: #1f2937;

  /* Status colors */
  --progress-color-success: #10b981;
  --progress-color-error: #ef4444;
  --progress-color-warning: #f59e0b;

  /* Sizes */
  --progress-sm-height: 4px;
  --progress-md-height: 8px;
  --progress-lg-height: 12px;

  /* Border */
  --progress-border-radius: 100px;

  /* Transition */
  --progress-transition-duration: 300ms;
}
```

## Best Practices

- **Feedback**: Use progress bars to provide visual feedback for ongoing operations
- **Status**: Use appropriate status colors (success for complete, error for failed)
- **Text**: Show percentage text for precise progress indication
- **Indeterminate**: Use indeterminate state when progress cannot be determined
- **Draggable**: Enable draggable for seek/scrub functionality (media players, etc.)
- **Type**: Use circle/dashboard types for compact displays or when space is limited
- **Color**: Use custom colors to match your brand or indicate specific states

## Accessibility

The progress component follows WAI-ARIA best practices:

- Uses semantic `<progress>` element or appropriate ARIA roles
- Exposes current progress value via `aria-valuenow`
- Exposes minimum value (0) via `aria-valuemin`
- Exposes maximum value (100) via `aria-valuemax`
- Supports `aria-label` for descriptive text
- Announces progress updates to screen readers
- Maintains keyboard accessibility for draggable progress
