# create

Helper function to create DOM elements, supporting both HTML and SVG elements.

## API

### create

#### Return

| Argument      | Description         | Type          |
| ------------- | ------------------- | ------------- |
| `HTMLElement` | Created DOM element | `HTMLElement` |

#### Parameters

| Parameter | Description                 | Type                     | Default  |
| --------- | --------------------------- | ------------------------ | -------- |
| `tagName` | Tag name                    | `string`                 | Required |
| `options` | Creation options (optional) | `ElementCreationOptions` | Optional |

## Example

### Basic Usage

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### Create SVG Element

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### Use Creation Options

```js
import { create } from 'ranuts';

// Create custom element
const customElement = create('my-custom-element', { is: 'my-element' });
```

## Notes

1. **Auto recognition**: Automatically recognizes SVG tags, uses correct namespace for creation.
2. **HTML elements**: Regular HTML elements use `document.createElement` to create.
3. **SVG elements**: SVG elements use `document.createElementNS` to create.
4. **Use case**: Commonly used for scenarios requiring SVG element creation, simplifying the creation process.
