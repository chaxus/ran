# computePlacement

Position a floating panel (dropdown, popover, tooltip) relative to an anchor rect: flips to the
opposite side when the preferred side lacks room and the opposite side has more, then shifts
along the cross axis to stay within a boundary. Mirrors Floating UI's `flip`/`shift` middleware,
minus the dependency.

Pure geometry — it never touches the DOM itself. Pass in `getBoundingClientRect()` results and
it hands back the coordinates to write.

## Usage

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement` is the side actually used, after flip — use it to pick an entrance
// animation class or an arrow direction.
```

## API

### computePlacement

#### Parameters

| Parameter           | Description                                                                                  | Type                                     | Default         |
| ------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `options.anchor`    | Anchor (trigger) rect, in viewport coordinates (e.g. `getBoundingClientRect()`)              | `{ top, left, width, height }`           | Required        |
| `options.floating`  | The floating panel's own size                                                                | `{ width, height }`                      | Required        |
| `options.placement` | Preferred side. Flips to the opposite side when it lacks room and the opposite side has more | `'top' \| 'bottom' \| 'left' \| 'right'` | Required        |
| `options.offset`    | Gap kept between the anchor and the floating panel, in px                                    | `number`                                 | `0`             |
| `options.boundary`  | Region the panel must stay inside, in viewport coordinates                                   | `{ top, left, width, height }`           | Window viewport |
| `options.padding`   | Minimum gap kept between the panel and the boundary edge when shifting, in px                | `number`                                 | `8`             |

#### Return

| Argument    | Description                                               | Type                                     |
| ----------- | --------------------------------------------------------- | ---------------------------------------- |
| `top`       | Resolved `top`, in the same coordinate space as `anchor`  | `number`                                 |
| `left`      | Resolved `left`, in the same coordinate space as `anchor` | `number`                                 |
| `placement` | The side actually used, after flip                        | `'top' \| 'bottom' \| 'left' \| 'right'` |

## Notes

1. **Coordinates are viewport-relative throughout** — the same space as `anchor`. If the panel
   is positioned with `position: absolute` against the document, add `scrollX`/`scrollY`
   yourself when writing the style (see the usage example above).
2. **No real layout, no flip/shift.** When `anchor` or `floating` has a zero width/height —
   jsdom (which never performs actual layout), or a panel read before its content has
   settled — the space calculations would spuriously "detect" a collision on every call, so
   `computePlacement` skips flip/shift entirely and returns the caller's preferred `placement`
   as-is.
3. **Shift is skipped when the panel is larger than the boundary itself** — clamping would only
   move it further off-screen the other way.
4. Used internally by `ranui`'s `r-popover` and `r-select` to keep a body-portaled dropdown on
   screen.
