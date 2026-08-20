---
description: '把只追加的事件日志渲染为对话——投影、底部跟随与行对账；每一种内容都作为独立的 view 注册。'
---

# Conversation 对话

把只追加的事件日志渲染为对话。这个元素只拥有三件麻烦且容易做错的事，此外什么都不做：把事件投影成节点、让视图吸附在底部而不与用户的滚动打架、以及把行与节点列表对账。

> **适用场景**：当你要渲染一段流式记录——聊天、Agent 会话、日志——并且希望每一种内容（消息、工具调用、状态行）都是一次独立注册，而不是渲染器里越长越多的一个分支时。

消息或工具调用**长什么样**是注册进来的 view，不是这个元素的职责。它的投影层是 [ranuts/conversation](../../ranuts/conversation/)，滚动来自 [ranuts/utils](../../ranuts/utils/) 的 `createBottomFollower`。

## 快速开始

```html
<r-conversation empty="暂无消息" style="height: 400px"></r-conversation>
```

```ts
const chat = document.querySelector('r-conversation');

chat.register({
  kind: 'message',
  // 哪些事件是我的，以及属于哪个节点。
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // 折叠进我自己的状态。
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // 逐 token 的增量合并为每帧一次重绘；离散事实不等待。
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // 状态如何抵达屏幕。
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: '你好' });
```

正文行应当使用 `<r-markdown>`：它默认的 `mode="streaming"` 已经会补全半截流出的 `**bold`、反引号、链接与 `$$` 数学，view 里不需要再解决一遍。

## 会咬人的几条规则

- **所有 view 必须在第一次 `push` 之前注册完。** 投影只根据注册集合构建一次，之后再注册的 view 会静默错过所有已折叠的事件。元素会直接抛错，而不是这么做。
- **`update` 折叠状态，`patch` 把状态写进 DOM。** 两者刻意分开命名，因为它们是不同的活：`patch` 不折叠任何东西，而且在流式行上每帧都要跑一次，必须便宜。
- **`mount` 可以省略。** 没有 `mount` 的 view 只贡献状态，供其他 view 通过 `reader.previous` 读取，自身不渲染。
- **行保持它打开时的位置。** 流式消息不会每来一个增量就跳到列表末尾。

## 底部跟随

默认开启。内容到达时视图吸附在底部；用户往上滚的瞬间停止；用户滚回底部时重新吸附——而且不会和用户打架，因为跟随器是靠区分「自己的滚动写入」与「用户的滚动」来判断的，而不是监听输入设备。

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"` 让用户从一开始就掌握控制权；`scrollToBottom()` 把控制权收回。加载更早的内容时，在前插之前调用 `captureAnchor()`、之后调用 `restoreAnchor()`，用户就会一直看着他们正在看的那一行。

## API 参考

### 属性

| 属性     | 类型      | 默认值 | 说明                                           |
| -------- | --------- | ------ | ---------------------------------------------- |
| `follow` | `boolean` | `true` | 在用户滚离底部之前持续跟随新内容。             |
| `empty`  | `string`  | `''`   | 投影尚未产出任何行时显示的文本，为空则不显示。 |
| `pinned` | `boolean` | `true` | 只读。视图当前是否正在跟随新内容。             |
| `sheet`  | `string`  | `''`   | 注入元素 Shadow DOM 的 CSS。                   |

### 方法

| 方法                  | 说明                                         |
| --------------------- | -------------------------------------------- |
| `register(view)`      | 注册一种内容。第一次 `push` 之后调用会抛错。 |
| `push(event)`         | 投影一个事件，并渲染它改变的部分。           |
| `reset()`             | 丢弃全部节点与行，保留已注册的 view。        |
| `scrollToBottom()`    | 滚动到底部并恢复跟随。                       |
| `captureAnchor(key?)` | 在前插更早内容之前记住某一行的位置。         |
| `restoreAnchor()`     | 把记住的那一行恢复到原来的位置。             |

### 事件

| 事件           | detail                | 触发时机               |
| -------------- | --------------------- | ---------------------- |
| `pinnedchange` | `{ pinned: boolean }` | 获得或失去底部跟随时。 |

### 插槽

| 插槽     | 说明                                                     |
| -------- | -------------------------------------------------------- |
| `footer` | 行下方的吸底区域——输入框放这里，它的高度变化会被观测到。 |

### Part

`conversation`（滚动容器）、`list`、`row`、`footer`、`empty`。

每一行还带有 `data-kind` 与 `data-key`，消费方无需伸进 Shadow 树即可定位或设置样式。

## 相关

- [ranuts/stream](../../ranuts/stream/) —— 把厂商的 SSE 转成这里 push 的事件
- [ranuts/conversation](../../ranuts/conversation/) —— 投影层，含发布节奏
- [Markdown](../markdown/) —— 面向流式的正文行
