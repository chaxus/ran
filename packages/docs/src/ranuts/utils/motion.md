# spring / stagger / observeEntry

Motion primitives that leave the drawing to you. A spring solved exactly (also as a CSS `linear()` easing), stagger delays, a one-shot viewport entry and the reader's reduced-motion preference. None of them owns an animation loop, so they drive Web Animations, CSS transitions or your own `requestAnimationFrame` equally.

## API

### spring(options?)

Returns `{ at, duration, easing }`. `at(seconds)` is progress from 0 to 1 (an underdamped spring passes 1 before settling); `duration` is how long it takes to stay within 0.1% of the target; `easing` is the same curve as a CSS `linear()` string over that duration.

| Option      | Description                                                  | Default |
| ----------- | ------------------------------------------------------------ | ------- |
| `stiffness` | Pull towards the target; higher is faster                    | `170`   |
| `damping`   | Resistance; below `2 * sqrt(stiffness * mass)` it overshoots | `26`    |
| `mass`      | Inertia                                                      | `1`     |
| `velocity`  | Starting speed, in progress units per second                 | `0`     |

### stagger(index, count, options?)

Delay, in seconds, for item `index` of `count`, starting from the first item, the last or the centre (`from`).

### observeEntry(element, options)

Calls `onEnter` once, when the element's top first passes `line` (a fraction of the viewport height from the top), then stops observing. The callback receives `{ reduced }`: when it is `true`, show the end state without animating. Returns a function that stops observing early.

### prefersReducedMotion()

`true` when the reader asked for reduced motion; `false` where there is no window (SSR, Node).

## Example

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## Notes

1. **Content stays visible without script.** Animate _from_ an offset with `fill: 'backwards'` rather than hiding elements in CSS, so a failed script or reduced motion leaves everything in place.
2. **Where IntersectionObserver is missing, `observeEntry` enters at once** instead of leaving the element waiting.
3. **The spring is exact, not stepped,** so the same options give the same curve at any frame rate.
