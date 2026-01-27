# Image

Modern image component with lazy loading, placeholders, error handling, and loading states support.

## Code Demo

### Basic Usage

Specify image address using the `src` property.

<r-img src="https://picsum.photos/200/300"></r-img>

```xml
<r-img src="https://picsum.photos/200/300"></r-img>
```

### Lazy Loading

Enable image lazy loading using `loading="lazy"` attribute. The image will only load when it enters the viewport.

<r-img
  src="https://picsum.photos/400/300"
  loading="lazy"
  alt="Lazy loading example">
</r-img>

```xml
<r-img
  src="https://picsum.photos/400/300"
  loading="lazy"
  alt="Lazy loading example">
</r-img>
```

### Object Fit Mode

Set the image fill mode using the `objectFit` property. Options: `fill`, `contain`, `cover` (default), `none`, `scale-down`.

<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <r-img
    src="https://picsum.photos/150/100"
    width="150px"
    height="150px"
    objectFit="fill">
  </r-img>
  <r-img
    src="https://picsum.photos/150/100"
    width="150px"
    height="150px"
    objectFit="contain">
  </r-img>
  <r-img
    src="https://picsum.photos/150/100"
    width="150px"
    height="150px"
    objectFit="cover">
  </r-img>
</div>

```xml
<r-img objectFit="fill" width="150px" height="150px"></r-img>
<r-img objectFit="contain" width="150px" height="150px"></r-img>
<r-img objectFit="cover" width="150px" height="150px"></r-img>
```

### Loading Placeholder

Set a loading placeholder using the `placeholder` property.

<r-img
  src="https://picsum.photos/300/200"
  placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3C/svg%3E">
</r-img>

```xml
<r-img
  src="https://picsum.photos/300/200"
  placeholder="data:image/svg+xml,...">
</r-img>
```

### Fallback Image

Set a fallback image for loading failures using the `fallback` property.

<r-img
  src="https://invalid-url.com/image.jpg"
  fallback="data:image/png;base64,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"
  alt="Fallback example">
</r-img>

```xml
<r-img
  src="https://invalid-url.com/image.jpg"
  fallback="data:image/png;base64,..."
  alt="Fallback example">
</r-img>
```

### Size Control

Control image dimensions using `width` and `height` properties.

<r-img
  src="https://picsum.photos/400/300"
  width="200px"
  height="150px">
</r-img>

```xml
<r-img
  src="https://picsum.photos/400/300"
  width="200px"
  height="150px">
</r-img>
```

### Border Radius and Circular

Set image border radius using the `borderRadius` property.

<div style="display: flex; gap: 16px;">
  <r-img
    src="https://picsum.photos/100/100"
    width="100px"
    height="100px"
    borderRadius="8px">
  </r-img>
  <r-img
    src="https://picsum.photos/100/100"
    width="100px"
    height="100px"
    borderRadius="50%">
  </r-img>
</div>

```xml
<r-img borderRadius="8px"></r-img>
<r-img borderRadius="50%"></r-img>
```

## API

### Image Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| src | Image URL | `string` | - |
| alt | Image description | `string` | - |
| width | Image width | `string` | `auto` |
| height | Image height | `string` | `auto` |
| loading | Loading strategy | `'eager' \| 'lazy'` | `eager` |
| objectFit | Fill mode | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `cover` |
| placeholder | Loading placeholder | `string` | - |
| fallback | Fallback image for loading failures | `string` | Default error image |
| borderRadius | Border radius | `string` | `0` |

### Image Events

| Event | Description | Callback Parameter |
| --- | --- | --- |
| load | Triggered when image loads successfully | `CustomEvent<ImageLoadEventDetail>` |
| error | Triggered when image fails to load | `CustomEvent<ImageErrorEventDetail>` |

### CSS Custom Properties

| Property | Description | Default |
| --- | --- | --- |
| --image-width | Image width | `auto` |
| --image-height | Image height | `auto` |
| --image-border-radius | Image border radius | `0` |
| --image-object-fit | Image fill mode | `cover` |
| --image-background | Background color (loading) | `#f5f5f5` |
| --placeholder-opacity | Placeholder opacity | `1` |
| --placeholder-transition | Placeholder transition | `opacity 0.3s ease` |

### CSS Parts

| Part | Description |
| --- | --- |
| container | Image container |
| image | Image element |
| placeholder | Placeholder |

## Accessibility

- Always provide an `alt` attribute to describe the image
- Image container has appropriate ARIA attributes
- Loading state is indicated via `aria-busy` attribute for screen readers
- Supports keyboard navigation and focus management
