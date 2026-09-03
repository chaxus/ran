---
description: 'ranui Progress（<r-progress>）以进度条展示任务完成度，支持可拖拽手柄。'
---

# Progress 进度条

用于展示任务完成度的进度条，支持可选的可拖拽手柄。

> **适用场景**：需要一个展示任务完成度的进度条时，只读展示用静态的 `<r-progress>`，需要用户通过拖拽手柄设置数值时用 `type="drag"`。

## 快速开始

<r-progress percent="40%"></r-progress>

```xml
<r-progress percent="40%"></r-progress>
```

> 💡 **提示**：`r-progress` 是一个没有固有宽度的块级元素。放在 flex 行内时可能会被压缩为 0 宽度，请显式设置宽度（例如 `style="width:100%"`），或将其放在块级上下文中。

## API 参考

### 属性

| 属性      | 类型     | 默认值      | 说明                                                      |
| --------- | -------- | ----------- | --------------------------------------------------------- |
| `percent` | `string` | `'0'`       | 当前进度；接受数字或百分比，不能超过 `total`。            |
| `total`   | `string` | `'100'`     | 总进度；接受数字或百分比。                                |
| `type`    | `string` | `'primary'` | 进度条类型：`primary`（静态）或 `drag`（可点击/可拖拽）。 |
| `dot`     | `string` | `'true'`    | 是否展示拖拽手柄：`true` 或 `false`。                     |
| `sheet`   | `string` | `''`        | 注入组件 Shadow DOM 的 CSS。                              |

### 当前进度 `percent`

设置当前进度。可以是数字或百分比字符串，且不能超过 `total`。未设置 `total` 时默认值为 `100`（即 `percent` 按 100 的百分比解析）。

<r-progress percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress percent="70%"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress percent="100%"></r-progress>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### 总进度 `total`

设置 `percent` 的分母。数字和百分比均可，所以 `percent="30" total="1000"` 会让进度条只填充 3%。

<r-progress percent="30" total="1000"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress percent="70" total="100"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress percent="10%" total="100%"></r-progress>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### 类型 `type`

- `primary`：静态进度条。不设置 `type` 时即为默认值。
- `drag`：可点击、可拖拽的进度条。点击轨道或拖拽手柄会更新 `percent` 并触发 `change` 事件。拖拽手柄需要 `dot="true"`。

<r-progress type="drag" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%"></r-progress>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### 拖拽手柄 `dot`

控制是否展示拖拽手柄。手柄仅在 `dot="true"` **且** `type="drag"` 时才会渲染，在静态的 `primary` 进度条上会被有意省略，因此 `dot` 在其上没有可见效果。

<r-progress type="drag" percent="30%" dot="true"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="drag" percent="30%" dot="false"></r-progress>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## 事件

### `change`

当用户点击轨道或拖拽手柄、更新 `percent` 时，在 `drag` 类型上触发。`detail` 对象携带：

| 字段      | 类型     | 说明     |
| --------- | -------- | -------- |
| `value`   | `string` | 当前进度 |
| `percent` | `string` | 当前进度 |
| `total`   | `string` | 总进度   |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.querySelector('r-progress');
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
</script>
```

## CSS Parts

| Part    | 说明               |
| ------- | ------------------ |
| `track` | 进度条轨道（背景） |
| `fill`  | 轨道中已填充的部分 |
| `dot`   | 拖拽手柄           |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## 最佳实践

- **静态进度条**：使用默认的 `type="primary"` 展示只读进度。
- **可交互进度条**：需要用户设置数值时使用 `type="drag"`，并监听 `change` 事件。
- **百分比与数字**：`percent` 和 `total` 可以自由搭配，数值有明确总数时传数字，需要直接控制时传百分比。
- **布局宽度**：将进度条放入块级容器，或显式设置宽度，避免在 flex 布局中被压缩为 0。
