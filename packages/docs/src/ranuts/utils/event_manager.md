# EventManager

A lifecycle-scoped event registry backed by `AbortController`.

The problem it solves is _taking listeners back off_. `removeEventListener` only works when you
hand it the **exact same** function reference and options you registered with — wrap a handler in
an arrow function on the way in and you can never remove it again. Components that mount and
unmount repeatedly then leak a listener per cycle. `AbortController` turns all of that into a
single `abort()`.

## Usage

### In a Web Component

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // removes every listener, and resets for the next connect
  }
}
```

### In ordinary page code

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // call when the section is torn down
}
```

## API

### on

Register a listener scoped to this manager. Chainable.

#### Parameters

| Parameter | Description                               | Type                                     | Default  |
| --------- | ----------------------------------------- | ---------------------------------------- | -------- |
| `target`  | The event target                          | `EventTarget`                            | Required |
| `type`    | Event name                                | `string`                                 | Required |
| `handler` | Handler function                          | `EventListener`                          | Required |
| `options` | `addEventListener` options minus `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`      |

#### Return

| Argument | Description               | Type           |
| -------- | ------------------------- | -------------- |
| `this`   | The manager, for chaining | `EventManager` |

### delegate

Event delegation: attach **one** listener to `parent` and fire `handler` only when the event
originated from a descendant matching `selector`. Chainable.

The handler receives the original event and the matched element.

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### Parameters

| Parameter  | Description                               | Type                                     | Default  |
| ---------- | ----------------------------------------- | ---------------------------------------- | -------- |
| `parent`   | Element the single listener is bound to   | `HTMLElement`                            | Required |
| `selector` | Selector a descendant must match          | `string`                                 | Required |
| `type`     | Event name                                | `string`                                 | Required |
| `handler`  | `(event, matchedElement) => void`         | `Function`                               | Required |
| `options`  | `addEventListener` options minus `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`      |

#### Return

| Argument | Description               | Type           |
| -------- | ------------------------- | -------------- |
| `this`   | The manager, for chaining | `EventManager` |

### abort

Remove every registered listener and reset the internal `AbortController`. Safe to call more
than once; subsequent `on()` / `delegate()` calls start from a clean scope.

#### Return

No return value (`void`)

### signal

The underlying `AbortSignal`, in case you want to pass it to `addEventListener` yourself.

| Argument | Description                | Type          |
| -------- | -------------------------- | ------------- |
| `signal` | The manager's abort signal | `AbortSignal` |
