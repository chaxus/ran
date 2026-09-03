# range

Limit a number within a specified minimum and maximum range.

## API

### range

#### Return

| Argument | Description    | Type     |
| -------- | -------------- | -------- |
| `number` | Clamped number | `number` |

#### Parameters

| Parameter | Description     | Type     | Default  |
| --------- | --------------- | -------- | -------- |
| `num`     | Number to clamp | `number` | Required |
| `min`     | Minimum value   | `number` | `0`      |
| `max`     | Maximum value   | `number` | `1`      |

## Example

### Basic Usage

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (clamped to max)
console.log(range(-5, 0, 10)); // 0 (clamped to min)
```

### Percentage Clamping

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### Custom Range

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (out of range, clamped)
```

### Color Value Clamping

```js
import { range } from 'ranuts';

const red = 300; // RGB value should be 0-255
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## Notes

1. **Clamping logic**: If number is less than minimum, returns minimum; if greater than maximum, returns maximum; otherwise returns original value.
2. **Default range**: Default range is 0 to 1, suitable for handling percentages or ratio values.
3. **Use case**: Commonly used to limit user input, calculate progress values, color values, etc.

## Interpolation & remapping

Shader-style interpolation and range-remapping: the same primitives GLSL's `mix`/`clamp`/`smoothstep` provide. Useful for animation easing, mapping a scroll position to an opacity, or converting between unrelated numeric ranges.

### clamp

Same behavior as `range` above, with GLSL-style argument order: `clamp(value, min, max)` vs `range(num, min, max)`. Added alongside the rest of this cluster for parity; pick whichever argument order reads better at the call site.

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)` interpolates from `a` to `b` by `t` (`t=0` → `a`, `t=1` → `b`). `inverseLerp(a, b, value)` is its inverse: given a `value` between `a` and `b`, returns where it sits as `0..1`. Neither is clamped: `t` (or the result) can go outside `0..1` if `value` is outside `[a, b]`.

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 — not clamped
```

#### Parameters

| Function                   | Parameter | Description          | Type     |
| -------------------------- | --------- | -------------------- | -------- |
| `lerp(a, b, t)`            | `a`, `b`  | Start / end value    | `number` |
|                            | `t`       | Interpolation factor | `number` |
| `inverseLerp(a, b, value)` | `a`, `b`  | Start / end value    | `number` |
|                            | `value`   | Probed value         | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)` linearly maps `value` from `[a1, a2]` onto `[b1, b2]`, unclamped. `fit` is the clamped version: the same remap, then clamped into the output range.

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 — outside [0,10], so outside [0,100] too

fit(15, 0, 10, 0, 100); // 100 — clamped to the output range
```

### linearstep / smoothstep

Both ramp from `0` to `1` as `x` goes from `edge0` to `edge1`, clamped outside that range. `linearstep` is a straight line; `smoothstep` is the GLSL Hermite-smoothed curve (`3t² - 2t³`), an ease-in-ease-out instead of a linear ramp and the usual choice for animation and shader fades.

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5 (midpoint is the same; the curve differs elsewhere)
smoothstep(0, 1, 0.1); // 0.028 — eased, slower to leave 0 than linearstep's 0.1
```

#### Notes

1. **Not clamped: `lerp`, `inverseLerp`, `remap`.** Feed them a `value`/`t` outside the expected range and you get an extrapolated result, not an error or a clamped one.
2. **Clamped: `fit`, `linearstep`, `smoothstep`.** These three always return a value within their output range.
3. `linearstep(edge0, edge1, x)` with `edge0 === edge1` returns `0` for `x < edge0`, `1` otherwise, rather than dividing by zero.
