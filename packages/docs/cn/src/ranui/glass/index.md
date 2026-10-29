---
description: '液态玻璃表面：选一种材质，它就会把背后的内容磨砂化，并在透镜般的边缘处弯折光线。叠在图片或视频上时，会用 WebGL2 直接折射像素本身。'
---

# Glass 毛玻璃

液态玻璃表面。选好 `material`，一块玻璃就成型了：背后的内容被磨砂，到了弧形边缘像透镜一样发生弯折，边缘还带一点色散，并被照亮。任何单项参数都可以用同名属性单独覆盖。内容放进默认插槽，文字颜色会自动适配玻璃，保证看得清。

> **适用场景**：面板叠在色彩丰富的内容之上，比如 hero 卡片、悬浮工具条、媒体浮层。背景如果是纯色，就没有东西可弯折，效果也就看不出来了。

## 演练场

拖动玻璃，切换材质和背景，然后复制代码。代码片段只包含和材质默认值不同的部分。

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## 材质

四种材质覆盖了大多数场景，默认是 `regular`。

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| 材质      | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## 叠在图片上

玻璃叠在 `<img>` 或 `<video>` 上时，加上 `backdrop`。不写值时，它取玻璃父元素里的第一张图片或第一个视频；也可以写一个选择器指定别的元素。之后玻璃会用 WebGL2 读取这个元素的像素，并按波长分别折射。只要浏览器支持 WebGL2 就能生效，而 CSS 方案只有 Chromium 才能弯折光线。图片依然留在页面里，它的 alt 文本和周围的内容都不受影响。

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

跨域图片要设置 `crossorigin`，并且服务端返回 CORS 响应头，才能读取像素；否则玻璃会保留 CSS 磨砂效果。

## 色调与文字颜色

`tone` 描述玻璃背后是什么。在深色或彩色背景上，边缘被照亮，内容是白色；在浅色背景上，白边会看不见，所以边缘改成压暗，内容也变成深色。叠在 `backdrop` 图片上时，除非手动设置，色调会跟随被覆盖区域的亮度。当前生效的色调可以用 `:state(light)` 和 `:state(dark)` 选中，内容颜色则可以用 `--ran-glass-ink` 覆盖。

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## 嵌套

`<r-glass>` 可以组合使用：一层套一层，做出叠加的材质，比如玻璃面板上再放一条玻璃工具条。每一层都会弯折它背后的内容。

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## API 参考

### 属性

| 属性          | 类型      | 默认值    | 说明                                                                                                                              |
| ------------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular` | `thin`、`regular`、`thick` 或 `clear`：一次性设定下面所有光学参数。                                                               |
| `blur`        | `number`  | 随材质    | 磨砂半径，单位 px。                                                                                                               |
| `saturate`    | `number`  | 随材质    | 背后内容的饱和度，百分比。                                                                                                        |
| `displace`    | `number`  | 随材质    | 边缘把背景向内拉的距离，单位 px。`0` 就是一块平板玻璃。                                                                           |
| `bevel`       | `number`  | 随材质    | 负责弯折光线的弧形边缘带宽度，单位 px。                                                                                           |
| `dispersion`  | `number`  | 随材质    | 边缘处颜色分离的程度，以 `displace` 的百分比表示。                                                                                |
| `specular`    | `number`  | 随材质    | 高光强度，百分比。                                                                                                                |
| `radius`      | `number`  | `20`      | 圆角半径，单位 px。                                                                                                               |
| `tint`        | `string`  | 随材质    | 磨砂之上的填充，可以是任意 CSS 背景值。                                                                                           |
| `tone`        | `string`  | `dark`    | `dark` 或 `light`：玻璃背后是深色还是浅色。叠在 `backdrop` 上且未设置时，跟随图片亮度。                                           |
| `backdrop`    | `string`  | —         | 用 WebGL2 折射某个 `<img>` 或 `<video>`。留空取父元素里的第一个；写选择器则指定别的元素。                                         |
| `rim`         | `boolean` | `false`   | GPU 渲染的光照边缘：外壁与内壁、主光与补光，外加闪光点。只取决于玻璃自身的形状。                                                  |
| `sheen`       | `boolean` | `false`   | 一道扫过表面的高光。                                                                                                              |
| `interactive` | `boolean` | `false`   | hover 抬升与按下反馈，用于可点击的玻璃。同时让 host 成为可键盘操作的按钮：`role="button"`、可 tab 聚焦、Enter 和 Space 等同点击。 |

### 折射 `displace`

`displace` 决定边缘把背后内容往中心拉多远，于是边缘内侧的背景被拉伸铺满边缘，就像厚厚的凸边会放大图像。`bevel` 决定这条弧形带有多宽。超过 bevel 的一半后，边缘会把图像向内翻折，真实的厚玻璃边缘也是这样。

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### 流光与交互

`sheen` 加一道流动的高光；`interactive` 加上 hover 抬升和按下后平稳复位的反馈。

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim：GPU 镜面边缘（可选开启）

`rim` 在 GPU 上绘制边缘：一道明亮的外壁，加上 bevel 与平面交界处一道较淡的内壁；主光从左上方打来，右下方有一道较暗的补光，边缘厚度沿着边缘变化，偶尔还会闪光。在 `light` 色调下，内外壁改为压暗。它从不采样背景：着色器只知道玻璃的尺寸、圆角和 bevel。它先用 WebGL 渲染，浏览器支持 WebGPU 时在后台切换过去；两者都不可用时，CSS 高光保持不变。

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### CSS parts 与 token

可以用 `::part(glass)`、`::part(specular)`、`::part(refraction)`，以及开启 `rim` 时的 `::part(rim)` 定制内部样式，也可以覆盖 `--ran-glass-*` 自定义属性：

| Token                                         | 作用                                       |
| --------------------------------------------- | ------------------------------------------ |
| `--ran-glass-ink`                             | 内容颜色。默认白色，浅色色调下为接近黑色。 |
| `--ran-glass-tint`                            | 磨砂之上的填充。                           |
| `--ran-glass-border`                          | 边缘描边。                                 |
| `--ran-glass-shadow`                          | 阴影叠加（高光与景深）。                   |
| `--ran-glass-brightness`                      | 背后内容的亮度。                           |
| `--ran-glass-specular-background`             | CSS 高光的背景。                           |
| `--ran-glass-specular-opacity`                | CSS 高光强度；对这一层会覆盖 `specular`。  |
| `--ran-glass-reduced-transparency-background` | 系统开启“降低透明度”时的兜底表面。         |
| `--ran-glass-reduced-transparency-shadow`     | 同一状态下的兜底阴影。                     |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## 说明

- **两种渲染路径**：不加 `backdrop` 时，由 `backdrop-filter` 对玻璃背后的实时页面做磨砂，背后的文字、视频和控件都照常可用；透镜般带色散的边缘是一个 SVG 滤镜，只在 Chromium 里渲染，Safari 和 Firefox 保留磨砂效果。加上 `backdrop` 后，只要浏览器支持 WebGL2，就由 WebGL2 折射那一张图片或那一段视频。
- **可读性**：内容颜色取自 `--ran-glass-ink`。长段文字请放在不透明的内层面上，别指望玻璃撑起对比度。
- **降低透明度**：系统开启“降低透明度”或“增强对比度”（`prefers-reduced-transparency: reduce`）时，玻璃会变成跟随主题的不透明表面（`--ran-color-bg-elevated`），不再有磨砂、折射和高光。
- **动效**：表面只过渡 `transform`，所以切换主题时一帧就完成。流光和按下效果都遵循 `prefers-reduced-motion`。
- **性能开销**：玻璃的尺寸、圆角或 bevel 变化时，SVG 透镜贴图会重建。WebGL 折射在玻璃可见期间每帧检查一次玻璃和图片，只有其中之一移动了才重新绘制。
