# createDocumentFragment

Create a DocumentFragment and add multiple child elements.

## API

### createDocumentFragment

#### Return

| Argument                        | Description             | Type                            |
| ------------------------------- | ----------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | DocumentFragment object | `DocumentFragment \| undefined` |

#### Parameters

| Parameter | Description              | Type        | Default  |
| --------- | ------------------------ | ----------- | -------- |
| `list`    | Array of elements to add | `Element[]` | Required |

## Example

### Basic Usage

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// Add to DOM at once
document.body.appendChild(fragment);
```

### Batch Add Elements

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = 'Item';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### Server-Side Safety

```js
import { createDocumentFragment } from 'ranuts';

// Returns undefined in server-side environment
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (server-side environment)
```

## Notes

1. **Performance optimization**: Using DocumentFragment can avoid multiple DOM operations, improving performance.
2. **Server-side safety**: Returns `undefined` in server-side environments (no `document` object), won't throw errors.
3. **One-time addition**: After Fragment is added to DOM, its child elements move to target element, Fragment itself is not retained.
4. **Use case**: Commonly used for batch adding elements, reducing reflow/repaint, improving performance, etc.
