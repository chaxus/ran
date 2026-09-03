---
description: 'ranui StateDot（<r-state-dot>）是一个 8px 的生命周期指示点（idle、running、success、warning、error），由光晕与实心点两层组成。'
---

# StateDot 状态点

一个 8px 的生命周期指示点：光晕与实心点在同一个元素里，两层都用 `currentColor`，因此一个状态是
一条颜色规则，而不是两个令牌。

> **适用场景**：某一行需要表明一件事进行到哪一步（排队中、进行中、已完成、失败），又不值得为它单开
> 一行时。`<r-tool-card>` 和会话压缩标记用的都是它。

## 快速开始

### 基础用法

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running` 会脉动，其余都是静止的。无法识别的值渲染为 `idle` 而不是消失，这样一来，生产端新增、页面还
没学会的状态，仍然占着它在行里的位置。

### 与文字并排

点承载状态，文字承载含义。永远不要让颜色成为区分两行的唯一线索，详见
[设计规范](/cn/src/ranui/design-guides/#无障碍)。

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>正在跑测试</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>2 个测试失败</span>
  </div>
</Demo>

## API 参考

### 属性

| 属性值  | 属性    | 类型                                                       | 默认值   | 说明                                     |
| ------- | ------- | ---------------------------------------------------------- | -------- | ---------------------------------------- |
| `state` | `state` | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | 显示哪一步。无法识别的值按 `idle` 渲染。 |
| `label` | `label` | `string`                                                   | `''`     | 无障碍名称，见下。                       |
| `sheet` | `sheet` | `string`                                                   | `''`     | 注入 shadow root 的 CSS。                |

### 无障碍

**没有 `label` 时这个点是 `aria-hidden` 的。** 如果同一行的文字已经说明了结果，点在屏幕阅读器里就
是噪音，把「进行中」念两遍帮不了任何人。只有当点是状态的**唯一**载体时才设置 `label`：

```html
<!-- 文字已经说了：让点保持沉默 -->
<r-state-dot state="error"></r-state-dot> <span>构建失败</span>

<!-- 单元格里只有点：给它命名 -->
<r-state-dot state="error" label="构建失败"></r-state-dot>
```

### Part

| Part  | 元素   |
| ----- | ------ |
| `dot` | 点本身 |

### 样式

每个状态只需要**一个**颜色：光晕是该颜色的 16%，实心点是它内缩 60% 的结果，两层都由
`currentColor` 绘制。所以一个状态是一个令牌，而不是两个：

| 令牌                            | 默认值                              |
| ------------------------------- | ----------------------------------- |
| `--ran-state-dot-size`          | `8px`                               |
| `--ran-state-dot-color`         | `--ran-color-text-disabled`（idle） |
| `--ran-state-dot-running-color` | `--ran-color-primary`               |
| `--ran-state-dot-success-color` | `--ran-color-success`               |
| `--ran-state-dot-warning-color` | `--ran-color-warning`               |
| `--ran-state-dot-error-color`   | `--ran-color-danger`                |
| `--ran-state-dot-halo-opacity`  | `0.16`                              |

`running` 是脉动实心点而不是旋转：8px 的转圈只会糊成一团；在 `prefers-reduced-motion` 下脉动会停止。
