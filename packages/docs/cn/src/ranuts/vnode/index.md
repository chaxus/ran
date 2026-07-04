# 虚拟 DOM（vnode）

一个轻量级、Snabbdom 风格的虚拟 DOM。它把界面表示为普通的 JavaScript 对象（`VNode`），对新旧
两棵树做 diff，并只把差异应用到真实 DOM 上。

- `init()` 构建协调器并返回一个 `patch` 函数。内置模块（class / props / attrs / style /
  events）会被自动注册。
- `patch(oldVnode, newVnode)` 用于挂载一棵树（当 `oldVnode` 是真实 DOM 元素时），或对两棵
  vnode 树做 diff 并就地更新 DOM。
- `h(sel, dataOrChildren?, children?)` 是用于构建 `VNode` 的 hyperscript 辅助函数。

## 引入

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> 注意：在本实现中 `init()` **不接受任何参数** —— 模块集合是固定的、在内部注册的，因此各个
> `*Module` 导出不需要传给 `init`。它们被导出仅供参考和查看。

## 示例

### 快速上手

```js
import { init, h } from 'ranuts/vnode';

// init() 返回一个 `patch` 函数。
// 内置模块（class、props、attrs、style、events）会被自动注册。
const patch = init();

const container = document.getElementById('app');

// 构建一棵 vnode 树
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// 首次渲染：把一个真实 DOM 元素作为旧 vnode 传入以挂载到它上面
patch(container, vnode);

// 之后：构建更新后的树，并把上一个 vnode patch 成它。
// 只有差异（文本、样式、监听器）会被应用到 DOM 上。
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // 保留最新的树，供下一次 patch 使用
```

### 用 `h` 构建节点

```js
// 仅标签
h('div');

// 标签 + 数据
h('div', { class: { active: true } });

// 标签 + 单个文本子节点
h('span', 'hello');

// 标签 + 子节点数组
h('ul', [h('li', 'one'), h('li', 'two')]);

// 标签 + 数据 + 子节点
h('a', { attrs: { href: '/home' } }, 'Home');

// CSS 风格的选择器可设置 id 和 class
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// 当选择器以 "svg" 开头时，会自动应用 SVG 命名空间
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

创建协调器并返回一个 `patch` 函数。内置模块在内部注册，它不接受任何参数。

#### Return

| 值      | 说明                             | 类型                                              |
| ------- | -------------------------------- | ------------------------------------------------- |
| `patch` | 把 vnode 树挂载/diff 到真实 DOM  | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

由 `init()` 返回。首次调用时，把真实 DOM `Element` 作为 `oldVnode` 传入以挂载树。之后调用时，
传入上一个 `VNode` 以就地做 diff 更新。返回新的 `VNode`，你需要把它保留为下一次调用的“旧”值。

#### Parameters

| 参数       | 说明                                     | 类型               |
| ---------- | ---------------------------------------- | ------------------ |
| `oldVnode` | 上一个 vnode，或首次挂载时的 DOM 元素     | `VNode \| Element` |
| `vnode`    | 要渲染的新 vnode 树                        | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

用于构建 `VNode` 的 hyperscript 辅助函数。它是重载的：

| 签名                                        | 说明                                               |
| ------------------------------------------- | -------------------------------------------------- |
| `h(sel)`                                    | 仅根据选择器创建元素                                |
| `h(sel, data)`                              | 带 `VNodeData` 的元素（`data` 可为 `null`）         |
| `h(sel, children)`                          | 带子节点的元素 —— 文本/数字、单个 `VNode` 或数组    |
| `h(sel, data, children)`                    | 同时带数据和子节点的元素                            |

#### Parameters

| 参数      | 说明                                                                                     | 类型                              |
| --------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| `sel`     | CSS 风格选择器：`tag`、`tag#id`、`tag.class`、组合（`div#id.a.b`）。`svg…` 会自动附加 SVG 命名空间 | `string`                          |
| `data`    | 节点数据 —— class / props / attrs / style / 监听器 / key / hook，可为 `null`               | `VNodeData \| null`               |
| `children`| 文本或数字（会变成文本节点）、单个 `VNode`，或它们的数组                                    | `VNodeChildren`                   |

#### `VNodeData` 字段

| 字段    | 说明                                                                 | 类型                        | 处理模块              |
| ------- | ------------------------------------------------------------------- | --------------------------- | --------------------- |
| `props` | 通过 `elm[key] = value` 设置的 DOM 属性                              | `Record<string, any>`       | `propsModule`         |
| `attrs` | 通过 `setAttribute` 设置的 HTML 属性（`true`/`false` 用于开关属性）   | `Record<string, string \| number \| boolean>` | `attributesModule` |
| `class` | 条件类名 —— `name → boolean` 映射                                     | `Record<string, boolean>`   | `classModule`         |
| `style` | 内联样式 —— `name → value` 映射（`--var` 键使用 CSS 变量）            | `Record<string, any>`       | `styleModule`         |
| `on`    | 事件监听器 —— `event → handler`（或处理函数数组）                     | `Record<string, Function \| Function[]>` | `eventListenersModule` |
| `key`   | diff 算法用于匹配/重排子节点的稳定标识                                | `string \| number`          | （diff 核心）         |
| `ns`    | 命名空间 URI（在 SVG 子树中自动设置）                                 | `string`                    | （diff 核心）         |
| `hook`  | 单个 vnode 的生命周期钩子（`Hooks`）                                  | `Hooks`                     | （类型层 —— 见注意）  |

> 注意：`hook` 与 `Hooks` 类型属于公开的类型层。本精简实现通过**模块**生命周期
> （`create` / `update` / `destroy`）驱动 DOM；当前的 `patch` 流程不会调用单个 vnode 的
> `data.hook` 回调。

### 模块

每个模块负责 `VNodeData` 的一部分。`init()` 会注册全部模块；它们也被单独导出。

| 导出                    | 处理          | 说明                                                              |
| ----------------------- | ------------- | ----------------------------------------------------------------- |
| `classModule`           | `data.class`  | 根据 `name → boolean` 映射增删 class                              |
| `propsModule`           | `data.props`  | 直接赋值 DOM 属性（`elm[key] = value`）                          |
| `attributesModule`      | `data.attrs`  | 通过 `setAttribute` 设置/移除 HTML 属性（含 xml/xlink）           |
| `styleModule`           | `data.style`  | 设置内联样式和 CSS 自定义属性                                     |
| `eventListenersModule`  | `data.on`     | 添加/移除事件监听器                                               |
| `modules`               | —             | 默认注册表对象，把每个模块名映射到对应模块                        |

### 较底层的导出

| 导出          | 类型                                                             | 说明                                                                                          |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `vnode`       | `(sel, data, children, text, elm) => VNode`                     | `h` 内部使用的底层 `VNode` 工厂。应用代码中请优先使用 `h`。                                    |
| `addNS`       | `(data, children, sel) => void`                                 | 递归地为子树应用 SVG 命名空间。`h` 对 `svg…` 选择器会自动调用它。                              |
| `htmlDomApi`  | `DOMAPI`                                                        | `patch` 内部使用的默认浏览器 DOM 适配器（创建/插入/移除/文本节点等）。                         |
| `is`          | `{ array, isStr, primitive, isVnode }`                         | vnode 内部使用的一组类型守卫辅助函数。                                                         |
| `Chain`       | `class Chain`                                                   | 一个链式命令式 DOM 构建器（`setAttribute`、`append`、`setTextContent` 等），独立于 vnode diff。 |
| `create`      | `(tagName, options?) => Chain`                                 | 返回新 `Chain` 的便捷工厂。                                                                    |

### 类型

| 类型                | 结构 / 含义                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }` —— 一个虚拟节点            |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }` —— 见上文字段        |
| `VNodes`            | `VNode[]`                                                                        |
| `VNodeChildElement` | `VNode \| string \| number`                                                     |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                       |
| `ArrayOrElement<T>` | `T \| T[]`                                                                       |
| `Key`               | `string \| number`                                                              |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | 描述 `patch` 所用 DOM 操作的接口（参见 `htmlDomApi`）                            |
| `Fragment`          | 用于片段处理的 `DocumentFragment` 扩展                                           |
| `Modules`           | `Record<string, Record<string, ModuleHook>>` —— 模块注册表的形状                 |
| `ModuleHook`        | 单个模块生命周期回调                                                            |

## 注意事项

1. **仅限浏览器。** `ranuts/vnode` 会访问 `document` 和 DOM API；请在浏览器代码中引入，而非
   Node 中。
2. **保留上一个 vnode。** `patch` 返回新的 `VNode`。请把它保存下来，在下一次更新时作为
   `oldVnode` 传入，这样 diff 才会基于当前的树来计算。
3. **`text` 和 `children` 互斥** —— 一个节点要么是文本节点，要么是带子节点的元素。
4. **列表请使用 `key`。** 渲染动态列表时，给同级节点设置稳定的 `key` 值，让 diff 能够匹配并
   重排节点，而不是重新创建它们。
