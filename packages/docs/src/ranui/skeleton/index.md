# Skeleton

Provides placeholder graphics where content is loading, offering a better user experience.

## Code Demo

### Basic Usage

The skeleton width automatically follows the parent element's width.

<div style="width: 100px;margin-top:10px">
    <r-skeleton></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton></r-skeleton>
</div>
<div style="width: 200px;margin-top:10px">
    <r-skeleton></r-skeleton>
</div>

```xml
<r-skeleton></r-skeleton>
```

## Properties

### Width `width`

Specify the skeleton width using the `width` property. Supports any CSS width value.

<r-skeleton width="200px"></r-skeleton>
<r-skeleton width="50%"></r-skeleton>
<r-skeleton width="100px"></r-skeleton>

```xml
<r-skeleton width="200px"></r-skeleton>
<r-skeleton width="50%"></r-skeleton>
<r-skeleton width="100px"></r-skeleton>
```

### Height `height`

Specify the skeleton height using the `height` property. Supports any CSS height value. Default is `16px`.

<r-skeleton height="30px"></r-skeleton>
<r-skeleton height="40px"></r-skeleton>
<r-skeleton height="50px"></r-skeleton>

```xml
<r-skeleton height="30px"></r-skeleton>
<r-skeleton height="40px"></r-skeleton>
<r-skeleton height="50px"></r-skeleton>
```

### Border Radius `borderRadius`

Customize the skeleton's border radius using the `borderRadius` property. Default is `4px`.

<r-skeleton borderRadius="0"></r-skeleton>
<r-skeleton borderRadius="8px"></r-skeleton>
<r-skeleton borderRadius="50%"></r-skeleton>

```xml
<r-skeleton borderRadius="0"></r-skeleton>
<r-skeleton borderRadius="8px"></r-skeleton>
<r-skeleton borderRadius="50%"></r-skeleton>
```

### Animation `animation`

Set the skeleton animation effect using the `animation` property. Options: `wave` (wave animation, default), `pulse` (pulse animation), `none` (no animation).

<r-skeleton animation="wave"></r-skeleton>
<r-skeleton animation="pulse"></r-skeleton>
<r-skeleton animation="none"></r-skeleton>

```xml
<r-skeleton animation="wave"></r-skeleton>
<r-skeleton animation="pulse"></r-skeleton>
<r-skeleton animation="none"></r-skeleton>
```

### Variant `variant`

Specify the skeleton shape variant using the `variant` property. Options: `text` (text, default), `rectangular` (rectangle), `circular` (circle), `rounded` (rounded rectangle).

<r-skeleton variant="text"></r-skeleton>
<r-skeleton variant="rectangular" height="100px"></r-skeleton>
<r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
<r-skeleton variant="rounded" height="60px"></r-skeleton>

```xml
<r-skeleton variant="text"></r-skeleton>
<r-skeleton variant="rectangular" height="100px"></r-skeleton>
<r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
<r-skeleton variant="rounded" height="60px"></r-skeleton>
```

### Combined Example

Create complex skeleton layouts by combining different properties.

<div style="display: flex; gap: 10px; align-items: center; padding: 16px;">
    <r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
    <div style="flex: 1;">
        <r-skeleton width="80%" height="16px"></r-skeleton>
        <r-skeleton width="60%" height="14px" style="margin-top: 8px;"></r-skeleton>
    </div>
</div>

```xml
<div style="display: flex; gap: 10px; align-items: center;">
    <r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
    <div style="flex: 1;">
        <r-skeleton width="80%" height="16px"></r-skeleton>
        <r-skeleton width="60%" height="14px"></r-skeleton>
    </div>
</div>
```

## API

### Skeleton Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| width | Width | `string` | `100%` |
| height | Height | `string` | `16px` |
| borderRadius | Border radius | `string` | `4px` |
| animation | Animation effect | `'wave' \| 'pulse' \| 'none'` | `wave` |
| variant | Shape variant | `'text' \| 'rectangular' \| 'circular' \| 'rounded'` | `text` |

### CSS Custom Properties

| Property | Description | Default |
| --- | --- | --- |
| --skeleton-background | Skeleton background color | `rgba(0, 0, 0, 0.11)` |
| --skeleton-wave-background | Wave animation gradient | `linear-gradient(...)` |
| --skeleton-border-radius | Border radius | `4px` |
| --skeleton-animation-duration | Animation duration | `1.5s` |

### CSS Parts

| Part | Description |
| --- | --- |
| container | Skeleton container |

## Accessibility

- Skeleton has `role="status"` and `aria-busy="true"` attributes indicating content is loading
- Uses `aria-label` to provide screen reader-friendly loading status description
- Supports `prefers-reduced-motion` media query to automatically disable animations when users prefer reduced motion
