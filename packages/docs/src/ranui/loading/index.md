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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `'circle'` | Loading animation type |
| `size` | `string` | `'medium'` | Loading size: `small`, `medium`, `large` |
| `color` | `string` | `''` | Loading animation color |

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

### Custom Size `size`

<r-loading name="circle" size="small"></r-loading>
<r-loading name="circle" size="medium"></r-loading>
<r-loading name="circle" size="large"></r-loading>

```html
<r-loading name="circle" size="small"></r-loading>
<r-loading name="circle" size="medium"></r-loading>
<r-loading name="circle" size="large"></r-loading>
```

### Custom Color `color`

<r-loading name="circle" color="#1890ff"></r-loading>
<r-loading name="circle" color="#52c41a"></r-loading>
<r-loading name="circle" color="#faad14"></r-loading>

```html
<r-loading name="circle" color="#1890ff"></r-loading>
<r-loading name="circle" color="#52c41a"></r-loading>
<r-loading name="circle" color="#faad14"></r-loading>
```

## All Loading Animations

<Loading />

## Best Practices

- **Scene Selection**: Choose appropriate loading animations for different scenarios
- **Size Control**: Use smaller loading animations when space is limited
- **Color Matching**: Use colors consistent with page theme
- **Performance**: Avoid using too many loading animations simultaneously
