---
description: 'ranui FanGallery（<r-fan-gallery>）把子元素像一手扑克牌那样扇形摊开：第一次滚入视口时以弹簧动效展开，指针悬停或获得焦点的那一张会抬起。'
---

# FanGallery 扇形画廊

把子元素像一手牌那样扇形摊开。每个子元素都绕着行下方的同一个点旋转，
整组看上去是一个整体，而不是一排并列的卡片。

> **适用场景**：几张封面、截图或卡片要作为一组来看，而且"有好几张"比"每张都看全"更重要。
> 如果读者需要把内容并排对比，请改用网格。

## 快速开始

### 基础用法

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

子元素就是你自己的元素。链接、按钮和图片保留原有的角色、名称和 Tab 顺序，
画廊只负责移动它们。

### 展开角度

`spread` 是第一个和最后一个子元素之间的夹角，单位为度。设为 `0` 时所有子元素叠在一起。

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## 动效

- **展开。** 画廊第一次滚入视口之前，子元素叠成一摞，最前面那张从一开始就能看清。
  进入视口后，扇面以弹簧动效依次展开。每个页面只展开一次，滚走再滚回来不会重放。
- **指针与焦点。** 指针下方或持有焦点的子元素会抬起并移到最前，相邻的子元素稍稍向两侧让开。
  响应是即时的，新的手势会从上一个手势停下的位置接着走。
- **减少动态效果。** 在 `prefers-reduced-motion: reduce` 下，扇面一开始就是展开的，
  所有变化都直接生效，没有过渡。

## API 参考

### 属性

| 属性值   | 属性     | 类型     | 默认值 | 说明                                           |
| -------- | -------- | -------- | ------ | ---------------------------------------------- |
| `spread` | `spread` | `string` | `'24'` | 展开后第一个与最后一个子元素之间的角度（度）。 |
| `sheet`  | `sheet`  | `string` | `''`   | 注入 shadow root 的 CSS。                      |

### Part

| Part    | 元素                       |
| ------- | -------------------------- |
| `stage` | 所有子元素叠放其中的网格。 |

### 样式

| 令牌                        | 默认值           | 作用                                       |
| --------------------------- | ---------------- | ------------------------------------------ |
| `--ran-fan-gallery-padding` | `--ran-space-10` | stage 四周留给旋转后卡角摆出去的空间。     |
| `--ran-fan-gallery-pivot`   | `320px`          | 旋转中心在行下方多远。越短，扇面张得越开。 |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | 指针下方或持有焦点的子元素向外移出的距离。 |

画廊的高度等于最高的子元素。旋转后的卡角会超出 stage，所以要在它四周留出空间，
或者调大 `--ran-fan-gallery-padding`。
