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

## API 参考

### 属性

| 属性          | 类型      | 默认值  | 说明                                                                 |
| ------------- | --------- | ------- | -------------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | 背景模糊半径（px），即磨砂程度。                                      |
| `saturate`    | `number`  | `180`   | 背景饱和度百分比，提升玻璃后内容的色彩（vibrancy）。                  |
| `displace`    | `number`  | `8`     | 液态折射强度（SVG 位移 scale）。`0` 为纯磨砂平面，越大越"波浪"。      |
| `frequency`   | `number`  | `0.005` | 湍流基频，越小则涟漪越大越平滑。                                      |
| `radius`      | `number`  | `20`    | 圆角半径（px）。                                                      |
| `tint`        | `string`  | 淡白    | 玻璃填充色，任意 CSS 背景值。                                         |
| `sheen`       | `boolean` | `false` | 表面流动的镜面高光动画。                                              |
| `interactive` | `boolean` | `false` | hover 抬升 + 按下回弹反馈，用于可点击的玻璃。                         |

### CSS parts 与 token

用 `::part(glass)`、`::part(specular)` 或覆盖 `--ran-glass-*` 自定义属性来定制内部：

| Token                          | 作用                       |
| ------------------------------ | -------------------------- |
| `--ran-glass-blur`             | 背景模糊半径。             |
| `--ran-glass-saturate`         | 背景饱和度。               |
| `--ran-glass-radius`           | 圆角半径。                 |
| `--ran-glass-tint`             | 填充背景。                 |
| `--ran-glass-border`           | 亮边。                     |
| `--ran-glass-shadow`           | 阴影（高光 + 景深）。       |
| `--ran-glass-specular`         | 镜面高光背景。             |
| `--ran-glass-specular-opacity` | 镜面高光强度。             |

## 说明

- **背景采样**：`<r-glass>` 通过 `backdrop-filter` 折射它背后的 DOM，因此在普通页面内容上直接可用。要折射 **WebGPU / 3D canvas** 场景则需要着色器方案——那部分放在独立 demo，不打包进本组件以保持轻量。
- **可读性**：正文请放在不透明的内层面上，不要只靠玻璃扛对比度。
- **动效纪律**：表面只过渡 `transform`（绝不过渡颜色），所以明暗主题切换始终一帧完成；流光与按下都遵循 `prefers-reduced-motion`。
