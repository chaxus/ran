# ranuts/conversation — 事件日志到可渲染节点

把只追加的事件日志投影为对话视图所渲染的节点。

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**独立入口**，且不依赖 DOM：这层投影本身就可测试、可服务端渲染。[`<r-conversation>`](../../ranui/conversation/) 是它的 DOM 消费方。

## 为什么不对事件类型做 switch

渲染对话的常见做法，是让视图对事件类型做 switch 并修改组件树。那会把排序、身份识别与局部更新的对账全部塞进**视图**，于是每新增一种内容——工具调用、审批请求、状态行——都要手工穿一遍，视图每多一种内容就多一个分支。

这里每一种内容都是**独立注册的状态机**：一个 definition 声明哪些事件属于自己，把它们折叠进自己的状态，并且永远不知道其他 definition 的存在。新增一种内容是新增一个 definition，而不是修改渲染器。

## 一个 definition

```ts
const message = {
  kind: 'message',
  // 哪些事件是我的，以及属于哪个节点。
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // 折叠进我自己的状态。
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // 订阅者多久能看到结果。
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions` 以 `unknown` 状态声明，因此不同状态类型的 definition 可以并排注册而**调用处无需类型断言**，同时各自在定义处保持完整类型。

## 语义

- **每个 definition 都会看到每个事件。** 引擎不会在第一个认领处停下，因此一条日志事件可以同时驱动两个节点。
- **顺序在 `start` 时固定。** 持续更新的节点停留在它打开时的位置，因此流式消息不会每来一个增量就跳到列表末尾。
- **找不到已打开节点的 `update` 会被丢弃。** 当起始事件被分页窗口裁掉时，这是诚实的处理方式；凭一条局部更新凭空造出节点，等于渲染一个从未存在过的东西。
- **重复的 `start` 会就地重开该节点。** 既然 definition 判定这是一个新节点，旧状态就被丢弃而非合并——但位置保留。
- **`reader.previous(kind)` 只能向后看。** 能看到自己之后才开启的节点的 definition，会因运行时机不同而给出不同结果，重放同一份日志也就复现不出同一个视图。

## 发布节奏

`publication` 是流式渲染的节流阀，也是你唯一需要的性能开关：

| 节奏              | 适用于                                                |
| ----------------- | ----------------------------------------------------- |
| `animation-frame` | 逐 token 的增量——两次绘制之间的所有增量合并为一次通知 |
| `immediate`       | 离散事实——工具结果、审批；等一帧只会徒增延迟          |
| `none`            | 后续发布反正会带上的状态；只记录，不唤醒视图          |

**节奏只升不降。** 已有待处理帧时到来的 `immediate` 会立即发布并取消该帧，而不是通知两次。省略 `publication` 等同于 `immediate`。

`scheduler` 选项可替换帧调度，这正是在没有真实绘制的情况下测试节奏的方式。默认在浏览器中使用 `requestAnimationFrame`，其他环境使用微任务。

## 节点

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`，在节点整个生命周期内稳定
  kind: string;
  id: string;
  seq: number; // 起始事件的序号——排序依据
  state: State;
}
```

在下一个被接受的事件到来之前，`nodes()` 返回同一个数组，且每个节点都已冻结，因此视图可以跨发布持有某个节点而不必担心它从底下被改掉。

## 相关

- [ranuts/stream](../stream/) —— 产生这些事件
- [`<r-conversation>`](../../ranui/conversation/) —— 渲染这些节点
- [ranuts/utils](../utils/) 中的 `createBottomFollower` —— 让视图保持吸附在底部
