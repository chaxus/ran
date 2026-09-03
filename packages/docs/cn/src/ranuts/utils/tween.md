# 缓动函数（tween）

七组缓动曲线，每组都有 `easeIn` 和 `easeOut` 两种形态。它们是纯数学映射，不碰 DOM，也不自带 RAF 循环。你在自己的动画帧里把当前时间传入，就能拿到这一帧该用的值。

参数沿用 Robert Penner 的经典约定：

- `t`：已经过去的时间
- `b`：初始值
- `c`：总变化量（终值 = `b + c`）
- `d`：总时长

每个函数内部都做了 `t >= d` 的钳制，所以超时调用返回终值而不是越界外推。

## 使用

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // 600ms 内从 0 走到 300
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## 可用曲线

| 导出    | 曲线           | 手感                         |
| ------- | -------------- | ---------------------------- |
| `quad`  | 二次方（`t²`） | 最平缓的加速；稳妥的默认选择 |
| `cubic` | 三次方（`t³`） | 明显比 `quad` 更利落         |
| `quart` | 四次方（`t⁴`） | 加速很强                     |
| `quint` | 五次方（`t⁵`） | 非常强，运动感集中在末段     |
| `sine`  | 正弦           | 最柔和，几乎读不出「缓动」   |
| `expo`  | 指数           | 先几乎不动，然后突然窜出去   |
| `circ`  | 圆形           | 起步慢，收尾非常突兀         |

## API

每个导出都是同一个形状：

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### 参数

| 参数 | 说明                       | 类型     | 默认值 |
| ---- | -------------------------- | -------- | ------ |
| `t`  | 已过时间                   | `number` | 必填   |
| `b`  | 初始值                     | `number` | 必填   |
| `c`  | 总变化量（终值 = `b + c`） | `number` | 必填   |
| `d`  | 总时长                     | `number` | 必填   |

#### 返回

| 参数    | 说明         | 类型     |
| ------- | ------------ | -------- |
| `value` | `t` 时刻的值 | `number` |

## 说明

`easeIn` 起步慢、逐渐加速；`easeOut` 起步快、逐渐减速。响应用户操作的 UI 通常用 `easeOut` 观感更好：元素立刻动起来然后稳住，而不会先迟疑一下再动。

感谢 [zhangxinxu/Tween](https://github.com/zhangxinxu/Tween)。
