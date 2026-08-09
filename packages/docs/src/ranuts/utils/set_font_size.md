# setFontSize2html

Set the root `<html>` `font-size` proportionally to the viewport, so a design mocked up
at a fixed width (375px, a typical mobile design width) scales with the real screen —
the classic "flexible rem" technique for mobile web layouts built in `rem` units.

## Usage

```ts
import { setFontSize2html } from 'ranuts/utils';

setFontSize2html(); // design width defaults to 375px
// or, for a design mocked up at a different width:
setFontSize2html(414);
```

Call it once at startup. It re-runs itself on resize and on orientation change, so a
single call is enough for the lifetime of the page.

```css
/* A box drawn at 200px in the 375px-wide mockup */
.box {
  width: 5.33333rem; /* 200 / 375 * 100 */
}
```

## API

### `setFontSize2html(designWidth?)`

#### Parameters

| Parameter     | Description                                             | Type     | Default |
| -------------- | -------------------------------------------------------- | -------- | ------- |
| `designWidth`  | The width, in px, your design mockup was created at       | `number` | `375`   |

#### Return

No return value (`void`) — it sets `documentElement.style.fontSize` as a side effect and
installs its own `resize` / `orientationchange` listeners.

## Notes

1. **iPad gets a different baseline automatically.** When `currentDevice()` reports an
   iPad, the design width and aspect ratio switch to `768` / `1024:768` instead of using
   `designWidth` as passed — this function assumes a phone mockup by default and adjusts
   for the one common exception.
2. **There's no teardown.** Unlike most listener-installing helpers in this library,
   `setFontSize2html` doesn't return an unsubscribe function — it's meant to be called once
   for the page's entire lifetime, not scoped to a component that mounts and unmounts.
3. Requires `document`/`window` — guard the call site if this code can run during SSR.
4. Pairs with a CSS build step (postcss-pxtorem or similar) that converts your `px` mockup
   values to `rem` at the same base — `setFontSize2html` only sets the root font size, it
   doesn't convert your stylesheet.
