---
description: 'ranui Message 以命令式方式展示全局反馈（info/success/warning/error/toast），以轻量浮层渲染。'
---

# message 全局提示

用于操作结果的全局反馈组件，通过命令式的 `message` API 调用，渲染为可自动关闭的 toast。

> **适用场景**：当你需要一条短暂、自动消失的 toast 来确认操作结果时——调用命令式的 `message.info` / `success` / `warning` / `error` / `toast` API，而不是编写标签。

## 快速开始

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" onclick="message.info('这是一条提示')">点击触发全局提示</r-button>
</div>

```html
<r-button type="primary" onclick="message.info('这是一条提示')">点击触发全局提示</r-button>
```

Message 通常在 JavaScript 中调用。组件模块加载后，全局 `message` 对象会立即挂载到 `window` 上（也可以通过 `window.ranui.message` 访问）。

```js
message.info('这是一条提示');
message.success('项目已删除');
```

## API 参考

### 全局方法

每个方法都会追加一条 toast，并在 `duration` 毫秒后自动消失（默认 `3000`）。以下五个方法共享同一套签名。

| 方法                 | 说明                                       |
| -------------------- | ------------------------------------------ |
| `message.info()`     | 中性信息提示（蓝色信息图标）               |
| `message.success()`  | 成功提示（绿色对勾图标）                   |
| `message.warning()`  | 警告提示（琥珀色图标），以强调方式播报     |
| `message.error()`    | 错误提示（红色图标），以强调方式播报       |
| `message.toast()`    | 无图标的纯深色提示                         |

### 方法签名

每个方法都接受一个 `string`（提示内容）或一个选项对象。

```js
// 1. 传入字符串——仅设置内容，3000ms 后自动关闭
message.info('这是一条提示');

// 2. 传入选项对象
message.info({
  content: '这是一条提示',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### 选项

| 选项           | 类型                         | 默认值           | 说明                                                       |
| -------------- | ---------------------------- | ---------------- | ------------------------------------------------------------ |
| `content`      | `string`                     | —                | 显示的文本内容（以对象形式传入时为必填项）                 |
| `duration`     | `number`                     | `3000`           | 自动关闭的延时，单位毫秒                                   |
| `close`        | `() => void`                 | —                | toast 被移除后触发的回调函数                                |
| `top`          | `number \| string`           | `8`               | toast 堆栈相对于所在容器顶部的偏移量（数字将按 px 处理）    |
| `zIndex`       | `number \| string`           | `1200`            | toast 容器的堆叠层级（z-index）                              |
| `getContainer` | `() => HTMLElement \| null`  | `document.body`  | 返回 toast 堆栈挂载到的目标元素                              |

> 传入 `null`、`undefined` 或空参数不会有任何效果——不会显示任何内容。

### 元素属性 `r-message`

每条 toast 都是一个 `<r-message>` 自定义元素。全局 API 会替你设置这些属性，但也可以直接使用它们。

| 属性      | 类型     | 默认值 | 说明                                                                                |
| --------- | -------- | ------ | ------------------------------------------------------------------------------------- |
| `type`    | `string` | —      | `info`、`success`、`warning`、`error`、`toast` 之一，决定图标/颜色以及 ARIA live region 的角色 |
| `content` | `string` | —      | 渲染在 toast 内部的文本                                                              |
| `sheet`   | `string` | `''`   | 注入到组件 Shadow DOM 中的 CSS                                                        |

## 提示类型 `type`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info('这是一条提示')">信息提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.success('这是一条提示')">成功提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button  onclick="message.error('这是一条提示')">错误提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.toast('这是一条提示')">toast提示</r-button>
</div>

```html
<r-button onclick="message.info('这是一条提示')">信息提示</r-button>
<r-button onclick="message.success('这是一条提示')">成功提示</r-button>
<r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
<r-button onclick="message.error('这是一条提示')">错误提示</r-button>
<r-button onclick="message.toast('这是一条提示')">toast提示</r-button>
```

## 自定义时长 `duration`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info({ content: '停留 6 秒', duration: 6000 })">6 秒提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info({ content: '停留 1 秒', duration: 1000 })">1 秒提示</r-button>
</div>

```html
<r-button onclick="message.info({ content: '停留 6 秒', duration: 6000 })">6 秒提示</r-button>
<r-button onclick="message.info({ content: '停留 1 秒', duration: 1000 })">1 秒提示</r-button>
```

## 关闭回调 `close`

`close` 回调会在 toast 从 DOM 中移除后触发。

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.success({ content: '已保存', close: () => message.info('提示已关闭') })">关闭后触发提示</r-button>
</div>

```html
<r-button onclick="message.success({ content: '已保存', close: () => message.info('提示已关闭') })"
  >关闭后触发提示</r-button
>
```

```js
message.success({
  content: '已保存',
  close: () => {
    // toast 关闭后触发
    console.log('toast closed');
  },
});
```

## 自定义位置 `top` / `zIndex` / `getContainer`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info({ content: '向下偏移', top: 120 })">顶部偏移</r-button>
</div>

```js
message.info({
  content: '向下偏移',
  top: 120, // 相对于容器顶部的距离
  zIndex: 1300, // 堆叠层级
  getContainer: () => document.querySelector('#app'), // 自定义挂载点
});
```

## 样式

toast 堆栈挂载在一个传送到 `body` 的容器中；每个 `<r-message>` 都在其 Shadow DOM 内渲染内容，表面可通过 CSS 变量主题化（均带有合理的兜底值）。

| CSS 变量                              | 默认值                          | 说明               |
| -------------------------------------- | -------------------------------- | ------------------ |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)`  | toast 表面背景色   |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`          | toast 圆角         |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`        | toast 阴影层级     |
| `--ran-message-text-color`            | `var(--ran-color-text)`         | toast 文本颜色     |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`    | 堆栈层级（z-index）|
| `--ran-message-top`                   | `8px`                            | 堆栈相对顶部的偏移 |

## 最佳实践

- **陈述结果**：把 toast 文案写成一个结果——「项目已删除」「已保存修改」——而不是含糊的「成功」。
- **成功 / 信息**：使用 `message.success` / `message.info` 表示不阻塞流程的确认。
- **错误 / 警告**：使用 `message.error` / `message.warning`；它们会升级为强调（assertive）的 ARIA live region，让屏幕阅读器打断当前朗读进行播报。
- **保持简洁**：toast 会自动消失——较长或需要操作的内容应放进对话框。
- **谨慎调整时长**：可以为较长的文案适当延长 `duration`，但不要让短暂反馈变得常驻不消失。
