---
description: 'ranui Popover（<r-popover>）在悬停或点击时弹出浮动气泡卡片，用于提示、菜单与上下文内容。'
---

# Popover 气泡卡片

点击/鼠标移入元素，弹出气泡式的卡片浮层。

> **适用场景**：需要一个在触发器被悬停或点击时打开的浮动气泡面板——`<r-popover>` 会帮你定位、传送（portal）其 `<r-content>` 面板，并接好无障碍访问支持。

## 快速开始

### 基础用法

触发器放在默认插槽中；浮层内容包裹在嵌套的 `<r-content>` 元素里。

<r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>this is content</div>
    </r-content>
  </r-popover>

```xml
<r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>this is content</div>
    </r-content>
</r-popover>
```

## API 参考

### 属性

| 属性                   | 类型     | 默认值    | 说明                                                             |
| ---------------------- | -------- | --------- | ---------------------------------------------------------------- |
| `placement`            | `string` | `'top'`   | 面板相对触发器的位置：`top`、`bottom`、`left`、`right`            |
| `trigger`               | `string` | `'hover'` | 面板打开方式：`hover` 或 `click`（`click` 事件始终会绑定）        |
| `getPopupContainerId`   | `string` | `''`      | 面板定位所在容器的元素 `id`（在打开时读取，不会反映为属性）        |
| `sheet`                 | `string` | `''`      | 注入到组件 Shadow DOM 的 CSS                                      |

### 触发方式 `trigger`

触发方式

- `hover`

<r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
```

- `click`

<r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
```

### 位置 `placement`

展示的位置

- `top`

<r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
```

- `bottom`

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
```

- `left`

<r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
```

- `right`

<r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
```

## 插槽

| 组件          | 插槽      | 说明                                                     |
| ------------- | --------- | -------------------------------------------------------- |
| `<r-popover>` | (默认)    | 触发器元素以及 `<r-content>` 包裹层                       |
| `<r-content>` | (默认)    | 浮层的内容；这些子节点会被传送（portal）到 `document.body`，并在打开时显示 |

两个组件都只暴露一个匿名默认插槽——没有具名插槽。

## 事件

`<r-popover>` 不会派发任何自定义事件，而是由标准的 DOM 交互驱动：

- **打开**：`mouseenter`（当 `trigger` 包含 `hover` 时）、`click`，或聚焦时按下 `Enter` / `Space`。
- **关闭**：`mouseleave`（hover 模式）、按下 `Escape`，或点击文档中的其他位置。

在内部，配套的 `<r-content>` 元素会用 `MutationObserver` 监视自身子树，并派发一个 `change` `CustomEvent`（`detail: { type, value: { content, mutation } }`），popover 消费这个事件以保持面板同步。这是一个实现细节，而非公开 API。

无障碍访问是自动接好的：host 元素会带上 `tabindex="0"`、`aria-haspopup="dialog"`，以及会随面板开关在 `"false"` 和 `"true"` 之间切换的 `aria-expanded`。

## 最佳实践

- **触发元素**：把可聚焦的控件（例如 `<r-button>`）作为触发器，这样键盘打开/关闭才能正常工作。
- **内容包裹**：始终把面板内容包裹在 `<r-content>` 中——不在 `<r-content>` 里的普通子节点不会作为浮层显示。
- **内联尺寸**：host 元素默认是 `display: block`；加上 `style="display: inline-block;"`（或放在内联上下文中）让它收缩到触发器大小。
- **位置**：`placement` 只是一个偏好，而非保证——当触发器靠近视口边缘、首选方向空间不够时，面板会自动翻转到相反一侧，并沿交叉轴平移以保持在可视区域内。这种自动翻转只在默认的 body 级定位下生效。
- **限定容器**：当不想用默认的 body 级定位时，用 `getPopupContainerId` 把面板锚定到指定的滚动/定位容器内——这种模式下不会应用翻转/平移，因此要选择一个适合该容器的 `placement`。
