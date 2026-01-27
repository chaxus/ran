<script setup>
import Loading from '../../../vue/loading.vue'
</script>

# Loading

Modern loading component with various beautiful animation effects, supporting size, color customization, and accessibility features.

## Quick Start

### Basic Usage

Specify the loading animation type using the `name` property.

<r-loading name="circle"></r-loading>

```html
<r-loading name="circle"></r-loading>
```

## Code Demo

### Loading Animation Types

The component provides various beautiful loading animation effects selected via the `name` property.

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="double-bounce"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
     <r-loading name="stretch"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
     <r-loading name="cube"></r-loading>
</div>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

### Size Settings

Quickly set loading animation size using the `size` property. Supports `small`, `medium` (default), and `large` preset sizes, or pass in CSS size values (like `60px`).

<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="small"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="medium"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="large"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="80px"></r-loading>
</div>

```html
<r-loading name="circle" size="small"></r-loading>
<r-loading name="circle" size="medium"></r-loading>
<r-loading name="circle" size="large"></r-loading>
<r-loading name="circle" size="80px"></r-loading>
```

### Color Settings

Set loading animation color using the `color` property.

<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" color="#1890ff"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="rotate" color="#52c41a"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="stretch" color="#faad14"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="double-bounce" color="#f5222d"></r-loading>
</div>

```html
<r-loading name="circle" color="#1890ff"></r-loading>
<r-loading name="rotate" color="#52c41a"></r-loading>
<r-loading name="stretch" color="#faad14"></r-loading>
<r-loading name="double-bounce" color="#f5222d"></r-loading>
```

### Combined Usage

Use size and color properties together.

<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="cube" size="large" color="#722ed1"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="rotate" size="60px" color="#eb2f96"></r-loading>
</div>

```html
<r-loading name="cube" size="large" color="#722ed1"></r-loading>
<r-loading name="rotate" size="60px" color="#eb2f96"></r-loading>
```

## API Reference

### Loading Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| name | Loading animation type | `'circle' \| 'double-bounce' \| 'rotate' \| 'stretch' \| 'cube' \| ...` | `circle` |
| size | Loading animation size | `'small' \| 'medium' \| 'large' \| string` | `medium` |
| color | Loading animation color | `string` | `#4096ff` |

### Size Description

Preset sizes and their actual dimensions:

- `small`: 32px
- `medium`: 48px (default)
- `large`: 64px
- Custom: Any CSS size value, such as `80px`, `5rem`, etc.

### All Loading Animation Types

<Loading />

Available loading animation types:
- `circle` - Circle loading
- `double-bounce` - Double bounce
- `rotate` - Rotating square
- `stretch` - Stretch bars
- `cube` - Cube
- And many more animation effects

## Custom Styling

### Via CSS Variables

The Loading component uses CSS variables for style control. You can customize the appearance by setting CSS variables.

#### Size Customization

Each loading type has corresponding size CSS variables:

```css
/* Circle type */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce type */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate type */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch type */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

#### Color Customization

Each loading type has corresponding color CSS variables:

```css
/* Circle type */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce type */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate type */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch type */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

#### Practical Examples

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</div>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### CSS Variable Reference

| Variable | Default | Description |
| --- | --- | --- |
| `--loading-{type}-width` | `48px` | Loading animation width |
| `--loading-{type}-height` | `48px` | Loading animation height |
| `--loading-{type}-background` | `#4096ff` | Main background color |
| `--loading-{type}-div-background-color` | `#4096ff` | Child element background color |

> Note: `{type}` should be replaced with the specific loading type name, such as `circle`, `double-bounce`, `rotate`, etc.

### CSS Parts

| Part | Description |
| --- | --- |
| container | Loading animation container |

## Accessibility

- Loading component has `role="status"` and `aria-busy="true"` attributes
- Uses `aria-label="Loading"` to provide screen reader description
- Supports `prefers-reduced-motion` media query to reduce animation speed when users prefer reduced motion

## Best Practices

- **Scene Selection**: Choose appropriate loading animations based on use cases
  - `circle` - Suitable for buttons, small area loading
  - `stretch` - Suitable for full screen, large area loading
  - `rotate` - Suitable for data loading, refresh operations

- **Size Selection**:
  - Use `size` property to quickly set common sizes
  - Use CSS variables for precise control for special size requirements

- **Color Consistency**:
  - Use `color` property to maintain consistency with brand colors
  - Use light-colored loading animations on dark backgrounds

- **Performance Considerations**:
  - Avoid displaying too many loading animations simultaneously
  - Remove component promptly after loading completes

- **User Experience**:
  - Provide progress indicators for long loading times
  - Consider using skeleton screens instead of loading animations
