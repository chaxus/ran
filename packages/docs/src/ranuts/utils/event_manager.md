# EventManager / createDoubleTapDetector

A lifecycle-scoped event registry backed by `AbortController`, plus a small pointer-type-
agnostic double-tap detector for touch gestures.

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

## createDoubleTapDetector

Double-tap detection over raw `(x, y, time)` samples — pointer-type-agnostic, so it works
the same whether it's fed from Pointer, Touch, or Mouse events. Built for touch gestures
(double-tap to seek, to zoom, to like) where re-deriving the timestamp + distance
threshold logic at every call site is easy to get subtly wrong: comparing only one axis,
or forgetting to reset after a hit so three fast taps count as two overlapping
double-taps.

```ts
import { createDoubleTapDetector } from 'ranuts/utils';

const detector = createDoubleTapDetector();
el.addEventListener('pointerup', (e) => {
  if (detector.check(e.clientX, e.clientY)) seek();
});
```

### `createDoubleTapDetector(options?)`

#### Parameters (`DoubleTapDetectorOptions`)

| Option          | Description                                     | Type     | Default |
| ---------------- | -------------------------------------------------- | -------- | ------- |
| `windowMs`       | Max gap between the two taps, in ms                | `number` | `300`   |
| `maxDistancePx`  | Max 2D distance between the two taps, in px        | `number` | `60`    |

#### `DoubleTapDetector`

| Member    | Description                                                                                                                | Type                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `check`   | Record a tap at `(x, y)` and report whether it forms a double-tap with the immediately preceding one. A detected double-tap resets tracking, so a third rapid tap starts a fresh pair rather than counting as part of the same double-tap. | `(x: number, y: number, now?: number) => boolean` |
| `reset`   | Forget the last recorded tap — call this when a gesture other than a tap (a drag) starts                                     | `() => void`                                     |
