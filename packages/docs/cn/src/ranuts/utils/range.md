# range

限制数字在指定的最小值和最大值范围内。

## API

### range

#### Return

| 参数     | 说明         | 类型     |
| -------- | ------------ | -------- |
| `number` | 限制后的数字 | `number` |

#### Parameters

| 参数  | 说明         | 类型     | 默认值 |
| ----- | ------------ | -------- | ------ |
| `num` | 要限制的数字 | `number` | 无     |
| `min` | 最小值       | `number` | `0`    |
| `max` | 最大值       | `number` | `1`    |

## Example

### 基础用法

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (被限制到最大值)
console.log(range(-5, 0, 10)); // 0 (被限制到最小值)
```

### 百分比限制

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### 自定义范围

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (超出范围被限制)
```

### 颜色值限制

```js
import { range } from 'ranuts';

const red = 300; // RGB 值应该在 0-255
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## 注意事项

1. **限制逻辑**：如果数字小于最小值，返回最小值；如果大于最大值，返回最大值；否则返回原值。
2. **默认范围**：默认范围是 0 到 1，适合处理百分比或比例值。
3. **用途**：常用于限制用户输入、计算进度值、颜色值等场景。

## 插值与区间映射

Shader 风格的插值与区间映射函数，也就是 GLSL 里 `mix`/`clamp`/`smoothstep` 提供的那套原语，适合做动画缓动、把滚动位置映射成透明度，或者在两个不相关的数值区间之间转换。

### clamp

行为和上面的 `range` 完全一样，只是参数顺序是 GLSL 风格：`clamp(value, min, max)` 对比 `range(num, min, max)`。之所以在这个数学工具簇里也加了一份，是为了和其他 shader 风格函数的参数顺序保持一致：调用处哪个顺序读起来顺，就用哪个。

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)` 按 `t` 从 `a` 插值到 `b`（`t=0` → `a`，`t=1` → `b`）。`inverseLerp(a, b, value)` 是它的逆运算：给定一个介于 `a` 和 `b` 之间的 `value`，返回它所处位置的 `0..1` 比例。两者都不做 clamp：如果 `value` 超出 `[a, b]`，`t`（或者结果）也会超出 `0..1`。

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 —— 不会被 clamp
```

#### 参数

| 函数                       | 参数     | 说明          | 类型     |
| -------------------------- | -------- | ------------- | -------- |
| `lerp(a, b, t)`            | `a`、`b` | 起点 / 终点值 | `number` |
|                            | `t`      | 插值系数      | `number` |
| `inverseLerp(a, b, value)` | `a`、`b` | 起点 / 终点值 | `number` |
|                            | `value`  | 要探测的值    | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)` 把 `value` 从 `[a1, a2]` 线性映射到 `[b1, b2]`，不做 clamp。`fit` 是它的 clamp 版本，也就是 shader 里的 `fit`：先做同样的映射，再把结果限制在输出区间内。

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 —— 超出了 [0,10]，映射结果也就超出了 [0,100]

fit(15, 0, 10, 0, 100); // 100 —— 被限制到输出区间内
```

### linearstep / smoothstep

两者都是当 `x` 从 `edge0` 走到 `edge1` 时，从 `0` 斜坡上升到 `1`，超出这个区间就被 clamp。`linearstep` 是一条直线；`smoothstep` 是 GLSL 里 Hermite 平滑过的曲线（`3t² - 2t³`），一种缓入缓出，而不是线性斜坡，通常用在动画和 shader 渐变里。

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5（中点结果一样，差异体现在其他位置）
smoothstep(0, 1, 0.1); // 0.028 —— 经过缓动，比 linearstep 的 0.1 更慢地离开 0
```

#### 注意事项

1. **不做 clamp 的：`lerp`、`inverseLerp`、`remap`。** 传入超出预期范围的 `value`/`t`，得到的是外推结果，而不是报错或被夹住的值。
2. **会做 clamp 的：`fit`、`linearstep`、`smoothstep`。** 这三个的返回值始终落在各自的输出区间内。
3. `linearstep(edge0, edge1, x)` 在 `edge0 === edge1` 时，`x < edge0` 返回 `0`，否则返回 `1`，而不会除以零。
