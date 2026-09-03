---
description: '根据声明的渲染意图（generic、terminal 或 diff）渲染工具调用及其结果，而不是由工具自己选定的标记。'
---

# ToolCard 工具卡片

根据**声明的渲染意图**渲染工具调用及其结果，而不是根据标记。

> **适用场景**：你要展示 Agent 或任务实际做了什么（一条 shell 命令、一次文件修改、一次查询），并且希望由工具说明「这是什么」、由界面决定「长什么样」时。

一个返回 HTML 的工具，等于替 UI 选好了渲染器、主题和布局，而且是在**面向模型的结果**里做这件事，这恰恰是最不该掺入 UI 关切的地方。声明意图把两者分开：同一次调用在这里可以渲染成终端块，在紧凑的记录视图里是一行，在编辑器里是一个跳转目标，而工具完全不需要知道这些界面的存在。

## 快速开始

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.querySelector('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …调用返回后
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';
```

## 卡片种类

### `generic`

默认值，同时也是兜底。包含标题、可选的参数键值表，以及可选的结果内容。

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

这次调用**本身就是**一条 shell 命令。`title` 是命令；`description` 与 `cwd` 渲染在输出上方。非零 `exitCode` 会显示出来，零则不显示。

```ts
card.call = { card: 'terminal', title: 'ls -la', description: '列出目录树', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

这次调用创建或修改了文件。每一项都渲染为带双栏行号的 unified 风格 hunk，由 [ranuts/utils](../../ranuts/utils/) 的 `diffLines` 计算。**`oldText` 为 null 表示文件正在创建**：这正是调用期视图掌握的信息，因为调用方无法读取尚不存在的旧内容。

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## 两条会咬人的规则

这些视图会在实时调用时计算一次，**在日志重放时再计算一次**。其余规则都由此推导而来。

- **视图必须是调用参数的纯函数**（结果视图还包括结果本身）。不做 I/O、不读时钟、不读会话状态，否则重放出来的画面会和用户当初看到的不一致。
- **无法识别的卡片降级，绝不抛异常。** 来自更新版本生产方的卡片种类，或是存储中损坏的值，都会以 `generic` 渲染并保留它的标题；畸形视图渲染为空。展示层绝不能让重放崩掉。

## 位置引用

调用上的 `locations` 会渲染为按钮并触发 `locationclick`，以便编辑器跟随：

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## API 参考

### 属性

| 属性     | 类型                                | 默认值      | 说明                             |
| -------- | ----------------------------------- | ----------- | -------------------------------- |
| `call`   | `ToolCallView \| null`              | `null`      | 待完成视图，由调用参数推导而来。 |
| `result` | `ToolResultView \| null`            | `null`      | 完成视图，会替换待完成视图。     |
| `status` | `'running' \| 'success' \| 'error'` | `'running'` | 反射到属性，便于样式据此区分。   |
| `open`   | `boolean`                           | `false`     | 主体是否展开。                   |
| `sheet`  | `string`                            | `''`        | 注入元素 Shadow DOM 的 CSS。     |

未知的 `status` 值读回时为 `running`。

### 事件

| 事件            | detail                       | 触发时机             |
| --------------- | ---------------------------- | -------------------- |
| `locationclick` | `{ location: ToolLocation }` | 某个文件引用被激活。 |

### Part

`card`、`header`、`status`、`title`、`toggle`、`body`、`description`、`exit`、`input`、`output`、`file`、`path`、`hunk`、`line`、`locations`、`location`。

diff 行带有 `data-kind`，取值为 `context`、`added` 或 `removed`。

### 无障碍

页眉是真正的 `<button type="button">` 并带 `aria-expanded`，无需额外接线即可用键盘抵达与操作。

## 相关

- [Conversation 对话](../conversation/)：把它作为工具调用 view 的 `mount` 目标
- [ranuts/utils](../../ranuts/utils/)：渲染 `diff` 卡片所用的 `diffLines`

## 自定义样式

`<r-tool-card>` 自身暴露了 **24 个 CSS 自定义属性**，另外还会读取主题里的语义令牌。令牌设在任何能继承到的
地方都有效，比如 `:root`、外层容器，或元素本身：

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Part：`body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

完整清单见[样式令牌](/cn/src/ranui/style-tokens#tool-card)；该选哪个令牌见[设计系统](/cn/src/ranui/design-system/)。
