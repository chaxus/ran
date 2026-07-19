# Modal 对话框

在当前页面之上进行聚焦交互的对话框组件，内置焦点锁定、滚动锁定与背景惰性化（inert）。

> **何时使用**：需要在页面之上进行聚焦交互的对话框，并希望自动完成焦点锁定、滚动锁定与背景惰性化时——可通过 `open` 属性驱动 `<r-modal>`，或使用命令式的 `Modal.confirm` / `Modal.info` 等辅助方法。

## 快速开始

### 基础用法

对话框的显示由 `open` 属性（或 `open` 属性值）控制。初始为关闭状态，在打开前不渲染任何内容，因此需要绑定一个触发器来切换它。

<Demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">打开对话框</r-button>
  <r-modal id="quickstart-modal" title="基础对话框">
    <p>这是对话框的内容。</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">确定</r-button>
    </div>
  </r-modal>
</Demo>

```html
<r-button onclick="modal.open = true">打开对话框</r-button>

<r-modal id="modal" title="基础对话框">
  <p>这是对话框的内容。</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">确定</r-button>
  </div>
</r-modal>
```

## API 参考

### 属性

| 属性           | 类型      | 默认值  | 说明                                 |
| -------------- | --------- | ------- | ------------------------------------ |
| `open`         | `boolean` | `false` | 对话框是否可见                       |
| `title`        | `string`  | `''`    | 头部标题文本（为空时回退为 `Modal`） |
| `closable`     | `boolean` | `true`  | 是否显示关闭（`x`）按钮              |
| `maskClosable` | `boolean` | `true`  | 点击背景遮罩是否关闭对话框           |
| `closeOnEsc`   | `boolean` | `true`  | 按下 `Escape` 键是否关闭对话框       |
| `lockScroll`   | `boolean` | `true`  | 对话框打开时是否锁定 body 滚动       |
| `autoFocus`    | `boolean` | `true`  | 打开时是否自动聚焦第一个可聚焦元素   |
| `sheet`        | `string`  | `''`    | 注入到 shadow DOM 中的 CSS           |

### 标题 `title`

```html
<r-modal open title="删除条目">
  <p>确定要删除该条目吗？</p>
</r-modal>
```

### 可关闭 `closable`

隐藏头部关闭按钮，使对话框只能通过你自己的控件关闭。

```html
<r-modal open title="条款" closable="false">
  <p>你必须接受条款才能继续。</p>
  <div slot="footer">
    <r-button type="primary">接受</r-button>
  </div>
</r-modal>
```

### 遮罩可关闭 `maskClosable`

默认点击背景遮罩会关闭对话框。设为 `false` 则要求显式操作才能关闭。

```html
<r-modal open title="未保存的更改" maskClosable="false">
  <p>点击外部不会关闭此对话框。</p>
</r-modal>
```

### 按 Escape 关闭 `closeOnEsc`

```html
<r-modal open title="报告" closeOnEsc="false">
  <p>该对话框已禁用 Escape 键。</p>
</r-modal>
```

### 锁定滚动 `lockScroll`

```html
<r-modal open title="预览" lockScroll="false">
  <p>对话框背后的页面仍可滚动。</p>
</r-modal>
```

### 自动聚焦 `autoFocus`

```html
<r-modal open title="搜索" autoFocus="false">
  <input type="text" placeholder="输入以搜索" />
</r-modal>
```

## 插槽 Slots

| 插槽     | 说明                                     |
| -------- | ---------------------------------------- |
| (默认)   | 对话框的主体内容                         |
| `footer` | 底部操作区；仅在该插槽有内容时才显示底栏 |

```html
<r-modal open title="确认">
  <p>主体内容放在默认插槽中。</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">取消</r-button>
    <r-button type="primary">确认</r-button>
  </div>
</r-modal>
```

## 事件 Events

所有与关闭相关的事件都会在 `event.detail` 中携带一个 `trigger`，描述关闭的来源：`'mask'`、`'button'`、`'escape'` 或 `'program'`。

| 事件          | 可取消 | `detail`      | 说明                                       |
| ------------- | ------ | ------------- | ------------------------------------------ |
| `beforeopen`  | 是     | —             | 打开前触发；调用 `preventDefault()` 可取消 |
| `open`        | 否     | —             | 对话框打开时触发                           |
| `afteropen`   | 否     | —             | 打开过渡动画结束后触发                     |
| `beforeclose` | 是     | `{ trigger }` | 关闭前触发；调用 `preventDefault()` 可取消 |
| `close`       | 否     | `{ trigger }` | 对话框关闭时触发                           |
| `afterclose`  | 否     | `{ trigger }` | 关闭过渡动画结束后触发                     |

```html
<r-modal id="modal" title="示例"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('放弃更改？')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('关闭来源：', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## 命令式 API

`Modal` 类提供了一组静态辅助方法，无需编写标签即可创建、挂载并解析一个对话框。每个方法返回 `Promise<{ action, trigger }>`，其中 `action` 为 `'confirm'`、`'cancel'` 或 `'dismiss'`。

| 方法                  | 说明                                     |
| --------------------- | ---------------------------------------- |
| `Modal.open(opts)`    | 打开一个只带「确定」按钮的对话框         |
| `Modal.confirm(opts)` | 打开一个带「确定」和「取消」按钮的对话框 |
| `Modal.info(opts)`    | 信息型对话框（标题默认为 `Info`）        |
| `Modal.success(opts)` | 成功型对话框（标题默认为 `Success`）     |
| `Modal.warning(opts)` | 警告型对话框（标题默认为 `Warning`）     |
| `Modal.error(opts)`   | 错误型对话框（标题默认为 `Error`）       |

选项（均可选）：`title`、`content`、`okText`、`cancelText`、`showCancel`、`maskClosable`、`closeOnEsc`、`lockScroll`、`autoFocus`、`closable`、`onConfirm`、`onCancel`。`onConfirm` / `onCancel` 可返回 `false`（或 resolve 为 `false` 的 promise）以保持对话框打开。

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: '删除项目',
  content: '此操作无法撤销。',
  okText: '删除',
  cancelText: '保留',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // 已删除
}
```

## CSS Parts

使用 `::part()` 为内部各部件设置样式。

| Part     | 说明                 |
| -------- | -------------------- |
| `root`   | 最外层遮罩容器       |
| `mask`   | 对话框背后的背景遮罩 |
| `dialog` | 对话框盒子           |
| `header` | 头部栏               |
| `title`  | 标题                 |
| `close`  | 关闭（`x`）按钮      |
| `body`   | 可滚动的主体区域     |
| `footer` | 底部操作栏           |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## 最佳实践

- **触发 + 切换**：用 `modal.open = true` 打开、`modal.open = false` 关闭，或调用 `close()`。
- **拦截破坏性关闭**：监听 `beforeclose` 并 `preventDefault()`，在丢弃未保存内容前进行确认。
- **底部操作**：把主/次按钮放进 `slot="footer"`；仅当该插槽有内容时才显示底栏。
- **不可关闭的流程**：同时设置 `closable="false"` 与 `maskClosable="false"`，强制用户做出显式选择。
- **一次性对话框**：用 `Modal.confirm` / `Modal.info` 快速弹窗，而不必手写标签。
