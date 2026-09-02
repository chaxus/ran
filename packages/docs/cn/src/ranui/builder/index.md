---
description: 'ranui/builder——不依赖框架的链式 DOM 构建器，带 SwiftUI / Solid 风格的细粒度响应式：构建一次，之后只更新绑定到该信号的那个节点。'
---

# Builder 构建器

`ranui/builder` 用声明式的方式构建 DOM，具备细粒度响应式，没有虚拟 DOM。组件库自身就是用它写的，
并作为独立入口发布，因此应用也可以拿它来写自己的布局和胶水层。

> **适用场景**：想要不带框架的响应式视图（一个页面、一条路由、一个部件），或者在写自定义元素时希望
> 用与 ranui 内部一致的构建方式。

> **核心原则：构建一次，原地更新。** 视图函数只运行**一次**；状态变化只更新绑定到该信号的那个节点，
> 不存在整棵树的重渲染。按形状挑选原语——值 → getter 绑定；条件 → `Show` / `Switch`；列表 →
> `For` / `Index`。

```js
import {
  View,
  Div,
  Span,
  ButtonBuilder, // 元素工厂
  signal,
  computed,
  createEffect,
  batch,
  untrack, // 响应式
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // 归属（ownership）
  EventManager, // 生命周期范围内的事件
} from 'ranui/builder';
```

构建器**不会**注册任何自定义元素。要用 `<r-button>` 之类，还需引入组件入口：`import 'ranui/button'`。

## 元素

工厂函数返回可链式调用的 `ElementBuilder`，`build()` 返回真正的 DOM 节点。

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`、`Span()`、`ButtonBuilder()`、`InputBuilder()`、`Label()`、`Ul()`、`Li()`、`Section()`、
`Article()`、`Nav()`、`Header()`、`Footer()`、`Main()`、`Style()`、`Slot()`——其余标签（包括自定义
元素）用 `View('any-tag')`。

### 链式 API

| 分组          | 方法                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| 标识 / class  | `id(v)`、`class(v)`、`addClass(...v)`、`removeClass(...v)`                                                    |
| 属性          | `attr(name, v)`、`attrs({…})`、`boolAttr(name, on, enabledValue?)`、`part(v)`、`data(key, v)`                 |
| 样式          | `style(prop, v)` / `style({…})`、`cssVar(name, v)`                                                            |
| 无障碍        | `aria(key, v)`、`role(v)`、`tabIndex(n)`、`label(v)`、`labelledBy(id)`、`describedBy(id)`、`ariaHidden(b?)`   |
| 内容          | `text(v)`、`children(…nodes)`、`replaceChildren(…nodes)`                                                      |
| 引用 / shadow | `ref(holder)`、`shadow(opts?)` → `ShadowBuilder`                                                              |
| 事件          | `on(type, handler, options?)`、`listen(manager, type, handler)`、`delegate(manager, selector, type, handler)` |
| 终结          | `build()`、`serialize()`（SSR 的 HTML 字符串）                                                                |

`children()` 接受元素、字符串、其他 builder、数组、`null` / `undefined`（跳过），以及 getter（响应式
区域，见下）。

### 引用（ref）

`createRef<T>()` 配合 `.ref(holder)` 捕获构建出来的元素。把 ref 的类型标注为组件的元素类，就能直接
调用它的命令式方法，不需要类型断言：

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## 响应式

```js
const [count, setCount] = signal(0);
count(); // 读取——在 effect 和 memo 内部会被追踪
setCount(1); // 写入；setCount((n) => n + 1) 同样可用
// 值没变的写入是空操作（Object.is；可用 signal(v, { equals }) 覆盖比较方式）

const double = computed(() => count() * 2); // 惰性 + 记忆化

const dispose = createEffect(() => {
  console.log(count()); // 立即运行一次，之后每次依赖变化都重跑
  return () => {
    /* 可选的清理，在下一次运行前和销毁时执行 */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // 一次刷新，effect 去重
untrack(() => count()); // 读取但不订阅
```

- **`computed` 是惰性的**——没被读过的 memo 永远不会重算；而且只有它的**值**变了才会通知下游，因此
  稳定 memo 后面的 effect 会一直睡着。
- **effect 自动追踪**：只有最近一次运行中真正读过的信号才保持订阅，因此条件分支不会留下过期订阅。
- **循环 effect 会抛错**而不是死循环——读并写同一个信号的 effect 是 bug，运行时拒绝无限跑下去。

### 响应式绑定

`text`、`attr`、`class`、`boolAttr`、`style`、`part`、`data`、`aria`、`role`、`label` 都接受
**getter**，因此绑定会自我更新，不需要显式写 effect：

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

只有单值形式是响应式的：`style(prop, getter)` 是，而 `style({…})`、`attrs({…})` 这类 map 形式只应用
一次。

### 条件与列表

| 形状                 | 用                                   | 行为                                       |
| -------------------- | ------------------------------------ | ------------------------------------------ |
| 单个分支             | `Show({ when, children, fallback })` | 只有 `when` 的**真假**翻转时才重建。       |
| 多个分支             | `Switch` + `Match`                   | 只有选中的分支变化时才重建。               |
| 有稳定 id 的列表     | `For({ each, key, render })`         | 按 `key` 匹配项目并**复用节点**。          |
| 以位置为身份的列表   | `Index({ each, render })`            | 复用每个位置上的节点，项目本身是一个信号。 |
| 整体形状都会变的内容 | 原始 getter 子节点                   | 粗粒度：每次读取都拆掉重建整个区域。       |

```js
Ul().children(
  For({
    each: () => rows(), // 响应式的源数组
    key: (row) => row.id, // 稳定且唯一
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

决定 `For` 是否真的复用了节点的四条规则：

- **`key` 必须唯一。** 重复的 key 会被忽略（只渲染第一个），开发模式下会警告。不要用数组下标当 key
  ——那样一重排就失去了复用。
- **要用新数组更新。** `each` 读的是信号，原地修改同一个数组再 set 回去会被相等性跳过，列表不会更新。
- **`render` 每个项目只跑一次**，不是每次列表变化都跑。逐行更新交给信号；`index` 是 getter，因此重排
  之后依然正确。
- **移除一个项目会销毁该行的作用域**——它的 effect 和清理一并执行。

优先用 `Show` / `For`，而不是原始 getter 子节点：getter 会在它读到的**每一次**变化上重建整个区域，
哪怕结果并没有变，于是里面的焦点、滚动位置、输入值和过渡动画统统丢失。

## 归属（ownership）

每个 effect、memo 和响应式绑定都归属于创建它的作用域。销毁作用域会销毁其下的一切。

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // 这个绑定归属于该 root
  onCleanup(() => console.log('已拆除'));
  mount(el);
  return dispose;
});

dispose(); // 移除绑定的 effect 并执行清理
```

**响应式 UI 请在 `createRoot` 内部构建。** 没有归属者的绑定也能工作，但不会自动销毁。

### 按页面拆除

给每个页面 / 路由一个自己的 root，导航时销毁它——这个页面创建的所有 effect、绑定、定时器和监听器一次
性全部拆掉：

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

[`<r-route>`](/cn/src/ranui/route/) 内置了这套机制：配上 `src` 后，匹配时动态引入页面模块，其默认导出
在一个 `createRoot` 里运行，离开时销毁该 root。`getOwner()` / `runWithOwner()` 可以让路由把作用域带过
`await` 边界。

::: warning 在 Web Component 内部不要用 getter 绑定
组件的 `constructor` 和 `connectedCallback` **不是**响应式作用域，因此在那里创建的 getter 绑定或
`createEffect` 是「孤儿」，永远不会被销毁——它会在已经断开的节点上继续触发；如果信号比元素活得久，还会
把元素钉在内存里。请用普通值构建，用显式的 `createEffect` 驱动更新，把它们的 dispose 收集起来在
`disconnectedCallback` 里调用，并在重新连接时重新装配。见[编码规范](/cn/src/ranui/coding-guides/)。
:::

## 自定义元素内部的监听器

`EventManager` 背后是 `AbortController`，一次调用即可移除全部监听：

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // 全部移除，并为下一次连接重置
}
```

## 服务端渲染

构建器在 [SSR](/cn/src/ranui/ssr/) 下同样可用：`build()` 返回 mock 节点，`serialize()` 返回 HTML。
响应式绑定、`For`、`Show` 在服务端**只渲染一次**，作为静态快照——在代码跑进浏览器之前不存在任何协调
（reconciliation）。

## 完整参考

本页是常用子集。完整参考——每个工厂函数、每个操作符、SVG 命名空间规则，以及 `Switch` / `Match` 的细节
——见仓库中的
[BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md)，它同样随 npm 包
一起发布。
