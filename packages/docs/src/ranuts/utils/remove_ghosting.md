# removeGhosting

Remove drag event shadow (ghost image), create a transparent drag icon.

## API

### removeGhosting

#### Return

No return value (`void`)

#### Parameters

| Parameter | Description       | Type        | Default  |
| --------- | ----------------- | ----------- | -------- |
| `event`   | Drag event object | `DragEvent` | Required |

## Example

### Basic Usage

```js
import { removeGhosting } from 'ranuts';

const dragElement = document.getElementById('draggable');
dragElement.addEventListener('dragstart', removeGhosting);
```

### Multiple Event Listeners

```js
import { removeGhosting } from 'ranuts';

const dragElement = document.getElementById('draggable');

// Can be used in multiple events
dragElement.addEventListener('mouseenter', removeGhosting);
dragElement.addEventListener('dragstart', removeGhosting);
dragElement.addEventListener('drag', removeGhosting);
```

### Custom Drag Icon

```js
import { removeGhosting } from 'ranuts';

dragElement.addEventListener('dragstart', (e) => {
  // Remove default shadow
  removeGhosting(e);

  // Can continue to set custom drag icon
  // e.dataTransfer.setDragImage(customIcon, 0, 0);
});
```

## Notes

1. **Transparent icon**: Creates a 1x1 pixel transparent GIF image as drag icon.
2. **Event types**: Commonly used for drag-related events like `dragstart`, `drag`, `mouseenter`, etc.
3. **Browser compatibility**: Uses standard `dataTransfer.setDragImage()` API.
4. **Use case**: Commonly used for custom drag effects, removing browser default drag shadow.
