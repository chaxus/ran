# Chain

Chainable DOM manipulation class supporting element creation, attribute setting, event listening, etc.

## API

### Chain

#### Constructor

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### Main Methods

| Method             | Description                        | Return Value |
| ------------------ | ---------------------------------- | ------------ |
| `setAttribute`     | Set element attribute              | `Chain`      |
| `removeAttribute`  | Remove element attribute           | `Chain`      |
| `append`           | Add child element                  | `Chain`      |
| `remove`           | Remove child element               | `Chain`      |
| `setTextContent`   | Set text content                   | `Chain`      |
| `setStyle`         | Set style                          | `Chain`      |
| `addChild`         | Add child element (supports array) | `Chain`      |
| `listen`           | Add event listener                 | `Chain`      |
| `clearListener`    | Remove event listener              | `Chain`      |
| `clearAllListener` | Remove all event listeners         | `Chain`      |

#### Properties

| Property  | Description | Type          |
| --------- | ----------- | ------------- |
| `element` | DOM element | `HTMLElement` |

## Example

### Basic Usage

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### Chaining

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('Click Me')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('Button clicked');
  });

document.body.appendChild(button.element);
```

### Add Child Elements

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('Title'))
  .addChild(new Chain('p').setTextContent('Content'));

document.body.appendChild(container.element);
```

### Batch Add Child Elements

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('Item 1'),
  new Chain('li').setTextContent('Item 2'),
  new Chain('li').setTextContent('Item 3'),
]);

document.body.appendChild(list.element);
```

### SVG Elements

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## Notes

1. **Chaining**: All methods return `Chain` instance, supporting chaining.
2. **SVG support**: Automatically recognizes SVG tags, uses correct namespace for creation.
3. **Event management**: Internally maintains event listener mapping for easy management and removal.
4. **Use case**: Commonly used for dynamically creating DOM structures, building UI components, etc.
