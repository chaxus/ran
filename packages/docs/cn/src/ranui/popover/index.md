---
description: 'ranui Popover（<r-popover>）在悬停或点击时弹出浮动气泡卡片，用于提示、菜单与上下文内容。'
---

# Popover 气泡卡片

点击/鼠标移入元素，弹出气泡式的卡片浮层。

> **适用场景**：需要一个在触发器悬停或点击时打开的浮动气泡面板时，`<r-popover>` 会帮你定位、传送（portal）其 `<r-content>` 面板，并接好无障碍访问支持。

## 快速开始

### 基础用法

触发器放在默认插槽中；浮层内容包裹在嵌套的 `<r-content>` 元素里。

<ran-demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>这是浮层内容</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>这是浮层内容</div>
  </r-content>
</r-popover>
```

## API 参考

### 属性

| 属性                  | 类型     | 默认值    | 说明                                                                                                              |
| --------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | 面板相对触发器的位置：`top`、`bottom`、`left`、`right`，每个都可以再加 `-start`（默认）、`-center` 或 `-end` 后缀 |
| `trigger`             | `string` | `'hover'` | 面板打开方式：`hover` 或 `click`（`click` 事件始终会绑定）                                                        |
| `getPopupContainerId` | `string` | `''`      | 面板定位所在容器的元素 `id`（在打开时读取，不会反映为属性）                                                       |
| `sheet`               | `string` | `''`      | 注入到组件 Shadow DOM 的 CSS                                                                                      |

### 触发方式 `trigger`

<ran-demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### 位置 `placement`

<ran-demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### 对齐方式 `placement="<方向>-<对齐>"`

只写方向时，面板的起始边与触发器的起始边对齐。需要面板在触发器上居中、或与触发器的末尾边对齐时，加
`-center` 或 `-end` 后缀。顶栏右端的菜单要的就是后者：它向内展开，而不是先溢出视口、再被平移推回来。
后缀会跟着自动翻转一起保留：`bottom-end` 翻转后是 `top-end`，而不是 `top`。

<ran-demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — 等同于 bottom-start</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## 插槽

| 组件          | 插槽   | 说明                                                                       |
| ------------- | ------ | -------------------------------------------------------------------------- |
| `<r-popover>` | (默认) | 触发器元素以及 `<r-content>` 包裹层                                        |
| `<r-content>` | (默认) | 浮层的内容；这些子节点会被传送（portal）到 `document.body`，并在打开时显示 |

两个组件都只暴露一个匿名默认插槽，没有具名插槽。

## 展开状态 `open`

`open` 就是面板的状态，像 `<details open>`、`<dialog open>` 一样反射为属性。没有任何地方再从面板的 `display` 反推状态（那个值比状态滞后一整段退场动画），所以属性、`aria-expanded` 和屏幕上看到的三者不会互相矛盾。

```html
<r-popover id="pop" trigger="click">
  <r-button>触发器</r-button>
  <r-content><div>内容</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // 或 pop.show()
  pop.open = false; // 或 pop.hide()
  pop.toggle();
</script>
```

`show()`、`hide()`、`toggle()` 只是它的薄封装；`closePopover()` 作为 `hide()` 的别名保留。

## 事件

`<r-popover>` 会在面板开合前后派发四个事件，都不带 `detail`：

| 事件         | 时机                                 |
| ------------ | ------------------------------------ |
| `show`       | 面板即将出现。                       |
| `after-show` | 面板已出现，入场动画（若有）已结束。 |
| `hide`       | 面板即将关闭。                       |
| `after-hide` | 面板已关闭，退场动画（若有）已结束。 |

等待的是样式表里那个动画本身，而不是抄进脚本里的一个时长。所以在 `prefers-reduced-motion` 下（压根没有动画要播），`after-hide` 会紧接着 `hide` 发出，而不是干等一个固定延迟。

除此之外，它由标准的 DOM 交互驱动：

- **打开**：`mouseenter`（当 `trigger` 包含 `hover` 时）、`click`，或聚焦时按下 `Enter` / `Space`。
- **关闭**：`mouseleave`（hover 模式）、按下 `Escape`，或点击文档中的其他位置。

焦点位于传送后的面板控件内时，Escape 同样能关闭面板，并把焦点还给打开它的触发器。
嵌套弹层先处理自己的 Escape；已被处理的 Escape 或输入法组合输入不会关闭父弹层。
立即关闭会取消排队中的入场工作，包括首个绘制帧之前。Tab 顺序与模态焦点约束仍由组合界面
负责；Popover 不是模态对话框。

在内部，配套的 `<r-content>` 元素会用 `MutationObserver` 监视自身子树，并派发一个 `change` `CustomEvent`（`detail: { type, value: { content, mutation } }`），popover 消费这个事件以保持面板同步。这是一个实现细节，而非公开 API。

无障碍访问是自动接好的：host 元素会带上 `tabindex="0"`、`aria-haspopup="dialog"`，以及会随面板开关在 `"false"` 和 `"true"` 之间切换的 `aria-expanded`。

## 脚本加载之前

组件脚本运行之前，浏览器会把 `<r-content>` 当作普通内容排版出来。如果页面在首屏之前加载了 `ranui.css`，它会把这部分藏起来。给浮层加上 `hidden`，浏览器自己就会隐藏它，没加载样式表的页面也不会露出来。组件注册后，`<r-popover>` 会把浮层里的子元素搬进自己的浮动层，所以这个属性之后不起任何作用。支持 `popover` 属性的浏览器里，用 `popover` 效果相同。

```html
<r-popover trigger="click">
  <r-button>Language</r-button>
  <r-content hidden>
    <a href="/en/">English</a>
    <a href="/zh-CN/">中文</a>
  </r-content>
</r-popover>
```

完整列表见 [样式令牌](/cn/ranui/style-tokens#popover)；当触发器无法聚焦时，弹出层自身成为唯一 Tab 停靠点，并绘制 `--ran-focus-ring`。
