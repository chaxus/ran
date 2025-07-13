<script setup>
import Loading from '../../../vue/loading.vue'
</script>

# Loading

Provides various beautiful loading animations to enhance user experience.

## Quick Start

### Basic Usage

<r-loading name="circle"></r-loading>

```html
<r-loading name="circle"></r-loading>
```

## API Reference

### Properties

| Property | Type     | Default    | Description            |
| -------- | -------- | ---------- | ---------------------- |
| `name`   | `string` | `'circle'` | Loading animation type |

### Loading Types `name`

The component provides various beautiful loading animations

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

### Custom Styling

The Loading component uses CSS variables for styling control. You can customize the appearance by setting CSS variables.

#### Size Customization

Each loading type has corresponding size CSS variables:

```css
/* Circle type */
r-loading {
  --loading-circle-width: 2em;
  --loading-circle-height: 2em;
}

/* Double-bounce type */
r-loading {
  --loading-double-bounce-width: 3em;
  --loading-double-bounce-height: 3em;
}

/* Rotate type */
r-loading {
  --loading-rotate-width: 4em;
  --loading-rotate-height: 4em;
}

/* Stretch type */
r-loading {
  --loading-stretch-width: 5em;
  --loading-stretch-height: 6em;
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

#### Live Examples

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="circle" style="--loading-circle-width: 2em; --loading-circle-height: 2em; --loading-circle-container-div-background: #1890ff;"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="double-bounce" style="--loading-double-bounce-width: 3em; --loading-double-bounce-height: 3em; --loading-double-bounce1-background: #52c41a; --loading-double-bounce2-background: #52c41a;"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate" style="--loading-rotate-width: 4em; --loading-rotate-height: 4em; --loading-rotate-background: #faad14;"></r-loading>
</div>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 2em; --loading-circle-height: 2em; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="double-bounce"
  style="--loading-double-bounce-width: 3em; --loading-double-bounce-height: 3em; --loading-double-bounce1-background: #52c41a; --loading-double-bounce2-background: #52c41a;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 4em; --loading-rotate-height: 4em; --loading-rotate-background: #faad14;"
></r-loading>
```

#### Common CSS Variables

| Variable                                | Default   | Description                  |
| --------------------------------------- | --------- | ---------------------------- |
| `--loading-{type}-width`                | `4em`     | Loading animation width      |
| `--loading-{type}-height`               | `4em`     | Loading animation height     |
| `--loading-{type}-background`           | `#4096ff` | Main background color        |
| `--loading-{type}-div-background-color` | `#4096ff` | Sub-element background color |

> Note: Replace `{type}` with the specific loading type name, such as `circle`, `double-bounce`, `rotate`, etc.

## All Loading Animations

<Loading />

## Best Practices

- **Scene Selection**: Choose appropriate loading animations for different scenarios
- **CSS Variables**: Use CSS variables to customize size and color instead of separate properties
- **Performance**: Avoid using too many loading animations simultaneously
- **Consistency**: Maintain consistent CSS variable naming patterns across your application
- **Theme Adaptation**: Easily adapt to different theme colors through CSS variables
