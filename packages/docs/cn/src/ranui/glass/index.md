---
description: '液态磨砂玻璃表面——backdrop 模糊、SVG 液态光线弯折、镜面亮边，在不支持 backdrop-filter 时优雅降级。'
---

# Glass 毛玻璃

液态 / 磨砂玻璃表面。`<r-glass>` 会对它背后的内容做磨砂与折射——`backdrop-filter` 的模糊 + 提饱和做磨砂，SVG `feDisplacementMap` 做液态光线弯折，再加镜面亮边与高光形成"玻璃感"。所有视觉参数都可通过属性与 token 调节，内容放默认插槽。

> **何时使用**：需要在丰富内容之上叠一层高级的半透明面板时——hero 卡片、悬浮工具条、媒体浮层。`displace` 控制"液态"程度（0 为纯磨砂平面）。在不支持 `backdrop-filter` 的环境会优雅降级为普通半透明面。

## 演练场

拖动舞台里的玻璃、调节每个旋钮、复制对应代码。默认参数就是 iOS 磨砂材质的观感。

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> 把 `<r-glass>` 放在彩色或复杂的内容之上——在纯色背景上看不出效果。

## 嵌套

`<r-glass>` 可组合：一层套一层做出叠加材质（比如玻璃面板上再放一个玻璃工具条），每一层都会折射它背后的内容。

<Demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">外层面板</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">嵌套的玻璃工具条</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass radius="26">
  <div class="panel">
    外层面板
    <r-glass radius="16" displace="6">
      <div class="toolbar">嵌套的玻璃工具条</div>
    </r-glass>
  </div>
</r-glass>
```

## Rim —— GPU 镜面边缘（可选开启）

`rim` 加一层镜面高光：固定从左上方打光的镜面边缘，加上圆角边框处一圈细微的色散（RGB 分离）描边。跟 `displace` 的折射不同，**它完全不采样背景**——着色器只知道面板自身的宽高和圆角半径，所以不会有"整体截取背景做折射"那种方案的交互性/可访问性代价（见下方[说明](#说明)）。它只是叠加在同一个 `backdrop-filter` 磨砂效果之上的纯装饰层，开关它不会改变玻璃背后采样的内容或方式。

优先用 WebGL 渲染——同步创建、几乎所有浏览器都支持，所以 rim 自己的首次出现不会被拖慢——如果浏览器同时支持 WebGPU，会在后台悄悄升级过去（效果完全一样，像素级一致）。两种 GPU API 都不可用时（很老的浏览器、被禁用、SSR）会静默降级为普通的 CSS 镜面渐变——不存在"坏掉"的中间状态。

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">无 rim</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</Demo>

```html
<r-glass>…普通 CSS 镜面高光…</r-glass> <r-glass rim>…GPU 镜面边缘 + 色散描边（WebGL，可升级到 WebGPU）…</r-glass>
```

## API 参考

### 属性

| 属性          | 类型      | 默认值  | 说明                                                             |
| ------------- | --------- | ------- | ---------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | 背景模糊半径（px），即磨砂程度。                                 |
| `saturate`    | `number`  | `180`   | 背景饱和度百分比，提升玻璃后内容的色彩（vibrancy）。             |
| `displace`    | `number`  | `8`     | 液态折射强度（SVG 位移 scale）。`0` 为纯磨砂平面，越大越"波浪"。 |
| `frequency`   | `number`  | `0.005` | 湍流基频，越小则涟漪越大越平滑。                                 |
| `radius`      | `number`  | `20`    | 圆角半径（px）。                                                 |
| `tint`        | `string`  | 淡白    | 玻璃填充色，任意 CSS 背景值。                                    |
| `sheen`       | `boolean` | `false` | 表面流动的镜面高光动画。                                         |
| `interactive` | `boolean` | `false` | hover 抬升 + 按下回弹反馈，用于可点击的玻璃。同时让 host 变成可键盘操作的按钮——`role="button"`、可 tab 到、Enter/Space 等同点击。 |
| `rim`         | `boolean` | `false` | 可选开启的镜面边缘 + 色散描边，观感更"有光"。优先 WebGL（始终同步可用），后台悄悄升级到 WebGPU（若可用）。两者都不可用时降级为普通 CSS 镜面渐变。 |

### CSS parts 与 token

用 `::part(glass)`、`::part(specular)`、以及（开启 `rim` 时的）`::part(rim)` 或覆盖 `--ran-glass-*` 自定义属性来定制内部：

| Token                          | 作用                  |
| ------------------------------ | --------------------- |
| `--ran-glass-blur`             | 背景模糊半径。        |
| `--ran-glass-saturate`         | 背景饱和度。          |
| `--ran-glass-radius`           | 圆角半径。            |
| `--ran-glass-tint`             | 填充背景。            |
| `--ran-glass-border`           | 亮边。                |
| `--ran-glass-shadow`           | 阴影（高光 + 景深）。 |
| `--ran-glass-specular-background` | 镜面高光背景。        |
| `--ran-glass-specular-opacity` | 镜面高光强度。        |
| `--ran-glass-reduced-transparency-background` | 系统"降低透明度"开启时的兜底背景。 |
| `--ran-glass-reduced-transparency-shadow` | 同一状态下的兜底阴影。 |

## 说明

- **背景采样**：`<r-glass>` 通过 `backdrop-filter` 折射它背后的 DOM，因此背后可选中的文字、正在播放的视频、可交互元素都照常可用。上面的 `rim` 是一个只根据面板自身形状计算的纯装饰 GPU 层，不采样背景。
- **可读性**：正文请放在不透明的内层面上，不要只靠玻璃扛对比度。
- **降低透明度**：`<r-glass>` 响应系统级"降低透明度 / 提高对比度"设置（`prefers-reduced-transparency: reduce`）：会切换成一个不透明、跟随主题的实色面（默认 `--ran-color-bg-elevated`），而不是继续磨砂/折射。系统原生控件是自动适配的，这是自定义元素对等的实现。
- **跨浏览器折射差异**：`feDisplacementMap` 液态效果目前只在 Chromium 内核渲染，Safari/Firefox 会丢弃 `backdrop-filter` 里这一段、保留模糊/饱和度/亮度的磨砂效果——这是合理的（虽然更平的）降级，不是坏掉了。
- **动效纪律**：表面只过渡 `transform`（绝不过渡颜色），所以明暗主题切换始终一帧完成；流光与按下都遵循 `prefers-reduced-motion`。
