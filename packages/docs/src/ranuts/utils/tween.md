# Easing functions (tween)

Seven easing families, each with an `easeIn` and an `easeOut` form. They are pure maths: no DOM,
no RAF loop of their own. You feed the current time in from your own animation frame and get back
the value that frame should use.

Parameters follow Robert Penner's classic convention:

- `t`: current time (how much has elapsed)
- `b`: beginning value
- `c`: change in value (the end value is `b + c`)
- `d`: duration

Every function clamps internally on `t >= d`, so calling past the end returns the final value
rather than extrapolating out of range.

## Usage

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // 0 → 300 over 600ms
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## Available curves

| Export  | Curve            | Feel                                      |
| ------- | ---------------- | ----------------------------------------- |
| `quad`  | quadratic (`t²`) | The gentlest acceleration; a safe default |
| `cubic` | cubic (`t³`)     | Noticeably snappier than `quad`           |
| `quart` | quartic (`t⁴`)   | Strong acceleration                       |
| `quint` | quintic (`t⁵`)   | Very strong; the end dominates the motion |
| `sine`  | sinusoidal       | Softest of all, barely reads as an ease   |
| `expo`  | exponential      | Nearly still, then a sudden run           |
| `circ`  | circular         | Slow start, very abrupt finish            |

## API

Every export has the same shape:

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### Parameters

| Parameter | Description                     | Type     | Default  |
| --------- | ------------------------------- | -------- | -------- |
| `t`       | Elapsed time                    | `number` | Required |
| `b`       | Beginning value                 | `number` | Required |
| `c`       | Change in value (end = `b + c`) | `number` | Required |
| `d`       | Duration                        | `number` | Required |

#### Return

| Argument | Description           | Type     |
| -------- | --------------------- | -------- |
| `value`  | The value at time `t` | `number` |

## Notes

`easeIn` starts slow and accelerates; `easeOut` starts fast and decelerates. For UI that responds
to a user action, `easeOut` usually reads better: the element moves immediately and settles,
rather than hesitating first.

With thanks to [zhangxinxu/Tween](https://github.com/zhangxinxu/Tween).
