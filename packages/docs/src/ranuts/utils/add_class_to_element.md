# addClassToElement

Add a CSS class name to a specified DOM element.

## API

### addClassToElement

#### Return

No return value (`void`)

#### Parameters

| Parameter  | Description       | Type      | Default  |
| ---------- | ----------------- | --------- | -------- |
| `element`  | DOM element       | `Element` | Required |
| `addClass` | Class name to add | `string`  | Required |

## Example

### Basic Usage

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// element now has 'active' class
```

### Avoid Duplicate Addition

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // Won't add duplicate
```

### Server-Side Safety

```js
import { addClassToElement } from 'ranuts';

// Won't throw error in server-side environment, fails silently
addClassToElement(element, 'class-name'); // Server-side: no operation
```

## Notes

1. **Duplicate check**: If element already has the class name, won't add it again.
2. **Server-side safety**: In server-side environments (no `document` object), handles silently without throwing errors.
3. **Uses classList**: Uses modern `classList.add()` API, safer than directly manipulating `className`.
