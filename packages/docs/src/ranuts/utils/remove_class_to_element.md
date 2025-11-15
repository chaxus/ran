# removeClassToElement

Remove a CSS class name from a specified DOM element.

## API

### removeClassToElement

#### Return

No return value (`void`)

#### Parameters

| Parameter     | Description          | Type      | Default  |
| ------------- | -------------------- | --------- | -------- |
| `element`     | DOM element          | `Element` | Required |
| `removeClass` | Class name to remove | `string`  | Required |

## Example

### Basic Usage

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// 'active' class has been removed from element
```

### Conditional Removal

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### Server-Side Safety

```js
import { removeClassToElement } from 'ranuts';

// Won't throw error in server-side environment, fails silently
removeClassToElement(element, 'class-name'); // Server-side: no operation
```

## Notes

1. **Existence check**: Only removes the class if the element has it.
2. **Server-side safety**: In server-side environments (no `document` object), handles silently without throwing errors.
3. **Uses classList**: Uses modern `classList.remove()` API, safer than directly manipulating `className`.
