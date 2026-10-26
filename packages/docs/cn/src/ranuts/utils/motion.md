# spring / stagger / observeEntry

几个只负责算、不负责画的动效基础件：一个精确求解的弹簧（也能直接输出 CSS `linear()` 缓动）、错峰延迟、一次性的进场检测，以及读者是否开启了减弱动效。它们都不持有动画循环，所以既能配合 Web Animations、CSS 过渡，也能用在你自己的 `requestAnimationFrame` 循环里。

## API

### spring(options?)

返回 `{ at, duration, easing }`。`at(seconds)` 是 0 到 1 的进度（欠阻尼的弹簧会先越过 1 再回落）；`duration` 是稳定在目标值 0.1% 以内所需的秒数；`easing` 是同一条曲线在这段时长上的 CSS `linear()` 字符串。

| 参数        | 说明                                             | 默认值 |
| ----------- | ------------------------------------------------ | ------ |
| `stiffness` | 拉向目标的力度，越大越快                         | `170`  |
| `damping`   | 阻力；小于 `2 * sqrt(stiffness * mass)` 时会回弹 | `26`   |
| `mass`      | 惯性                                             | `1`    |
| `velocity`  | 初速度，单位是每秒走完多少进度                   | `0`    |

### stagger(index, count, options?)

第 `index` 个（共 `count` 个）元素的延迟秒数，可以从第一个、最后一个或中间开始（`from`）。

### observeEntry(element, options)

元素顶部第一次越过 `line`（距视口顶部的高度比例）时调用一次 `onEnter`，之后不再观察。回调参数是 `{ reduced }`：为 `true` 时直接显示终态，不要做动画。返回值可以提前停止观察。

### prefersReducedMotion()

读者开启了减弱动效时为 `true`；没有 window 的环境（SSR、Node）返回 `false`。

## 示例

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

## 说明

1. **没有脚本时内容也可见。** 用 `fill: 'backwards'` 从偏移位置动画*过来*，不要先在 CSS 里把元素藏起来，这样脚本加载失败或开启减弱动效时，内容都停在原位。
2. **没有 IntersectionObserver 的环境里，`observeEntry` 会立即进场**，不会让元素一直等着。
3. **弹簧是解析求解的，不是逐帧步进，** 同样的参数在任何帧率下都得到同一条曲线。
