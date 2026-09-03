---
description: '用 ranui 开发时的工程规范：入口选择、attribute / property / 事件契约、跨 Shadow 边界的样式覆盖、状态归属、SSR、测试，以及该避开的反模式。'
---

# Coding guidelines 编码规范

这一页讲怎么**用** ranui 开发：组件的契约是什么，Shadow DOM 边界在哪些地方改变了你习惯的规则，还有
哪些坑最好在踩到之前就知道。

视觉方面的规范见[设计规范](/cn/src/ranui/design-guides/)，令牌清单见
[设计系统](/cn/src/ranui/design-system/)。

> **适用场景**：把 ranui 接入应用的各个环节：选择引入方式、绑定事件、给选择器够不到的地方加样式、
> 做服务端渲染、写测试。

## 原则

1. **元素就是 API。** 属性（attribute）、属性值（property）、事件、插槽和 `::part()` 构成全部契约。
   除此之外从外面能看到的一切都是实现细节，随时可能变。
2. **状态只归属一处。** 要么由你的应用持有并推给组件，要么由组件持有并在变化时通知你。双向镜像正是
   数值漂移的根源。
3. **从预留的口子上样式。** 自定义属性、`::part()`、`sheet` 和插槽能跨越 Shadow DOM 边界；普通选择器
   不能，优先级再高也没用。
4. **用多少引多少。** 每个组件都有独立入口，主入口只是便利，不是必须。
5. **优先用平台能力。** 它们就是标准的自定义元素：`addEventListener`、`setAttribute`、`hidden` 都按
   规范工作，框架封装只是可选项。

## 入口

每个入口只注册它名字所指的那部分。页面如果只需要主题，就不会把整个组件库一起打进去。

| 引入                            | 内容                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `ranui`                         | 全部组件（副作用注册所有 `<r-*>` 元素）                    |
| `ranui/<component>`             | 单个组件，如 `ranui/button`、`ranui/select`、`ranui/modal` |
| `ranui/theme`                   | `initTheme` / `setTheme` / `getTheme` 与令牌覆盖；不含元素 |
| `ranui/i18n`                    | 翻译引擎；不含元素                                         |
| `ranui/fonts`                   | 自托管的 Geist Sans + Geist Mono（仅 `@font-face` CSS）    |
| `ranui/style`                   | 样式表，供构建工具没有自动引入时使用                       |
| `ranui/builder`                 | 组件自身所用的链式 DOM builder                             |
| `ranui/ssr`、`ranui/ssr-stream` | 服务端渲染                                                 |
| `ranui/testing`                 | 在测试中进入 closed shadow root 的助手                     |
| `ranui/typings`                 | 环境类型声明（JSX / TS 元素类型）                          |

```js
import 'ranui/button'; // 单个元素
import 'ranui'; // 全部
```

**引入是为了副作用。** `import 'ranui/button'` 会注册 `<r-button>`，导出的类你很少会用到。例外是
服务端渲染，那时需要你自己实例化。

## 组件契约

每个元素确切的 attribute、property、事件（含 `detail` 结构）、插槽和 part 都从源码生成到
[`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)。
下面讲的是那张表里**看不出来**的部分。

### attribute 是字符串，property 是类型化的值

HTML 属性小写、只能是字符串；对应的 property 是小驼峰、接受真实的值。二者是同一份状态的两个入口：

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // property：小驼峰
select.setAttribute('showsearch', ''); // attribute：全小写
```

- **布尔属性看「有没有」**，和原生 `<button>` 的 `disabled` 一样：`disabled=""` 和
  `disabled="false"` 都是禁用。要取消就移除属性（或把 property 设为 `false`）。
- **复杂值走 property。** 数组、对象、`File` 无法塞进 attribute，例如 `r-attachments` 的
  `attachments` 就只能通过 property 传。
- **HTML 里属性名不区分大小写**，所以 HTML 里写 `showsearch`，property 则是 `showSearch`。在 JSX
  中请写 attribute 形式。

### 把监听绑在元素本身上

ranui 组件派发的是 `CustomEvent`，数据永远放在 `detail` 里：

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**是否冒泡由各组件自行决定，所以请绑在元素上，而不是容器上。** 表单和浮层类的核心组件（`r-input`、
`r-checkbox`、`r-select`、`r-modal`）刻意只在自身上派发**不冒泡**的事件：select 的 `change` 不应该
被误认成 form 的 `change`。另一些组件的事件则会冒泡（并且是 `composed` 的，能穿过 shadow 边界）：`r-theme-switch`、
`r-voice-button`、`r-attachments`、`r-conversation`、`r-tool-card`、`r-markdown`、`r-math`、
`r-mermaid`、`r-router`、`r-route`、`r-link`、`r-colorpicker`。

绑在元素上，两类组件都能收到；在祖先上做事件委托只对后一组有效，对前一组会**静默失效**。要依赖委托
之前，请先查源码或
[`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)。

**`before*` 事件可取消。** `r-modal` 在动作前派发 `beforeopen` / `beforeclose`，
调用 `event.preventDefault()` 可以阻止；`open` / `close` / `afteropen` / `afterclose` 报告的是已经
发生的事，无法取消。

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### 插槽与 part

内容通过插槽（默认插槽和具名插槽）传入，并且**留在你的文档里**，所以你的页面 CSS 能正常作用于它们。
够不到的只有组件内部自己构建的那部分，这正是 `::part()` 的用武之地。

## 跨 Shadow 边界上样式

每个 ranui 组件都渲染在 **closed** shadow root 里，页面 CSS 进不去，选择器也穿不透。能进去的方式
一共四种，按推荐顺序排列：

| 方式             | 用于                          | 示例                                                  |
| ---------------- | ----------------------------- | ----------------------------------------------------- |
| **自定义属性**   | 组件已暴露为令牌的一切        | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**   | 令牌覆盖不到的结构性调整      | `r-card::part(footer) { justify-content: flex-end; }` |
| **`sheet` 属性** | 程序化 / 动态注入到内部的 CSS | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **插槽内容**     | 本来就归你的标记              | `<span slot="extra">…</span>`                         |

自定义属性排第一，是因为它能**穿过边界继承**下去：设在 `:root`、外层容器或元素上都有效，而且和主题
用的是同一套令牌。part 和 `sheet` 会让你依赖内部结构，所以只留给令牌确实覆盖不到的地方，并且要预期
升级时需要复查。

以下写法无论优先级多高都不会生效：`r-select .some-inner-class { … }`、`!important`、以及用
`querySelector` 进入组件内部。closed root 意味着 `element.shadowRoot` 恒为 `null`，对你的 CSS、
脚本和测试定位器都一样。

## 状态归属

每个值单独决定归属：

- **组件持有**（非受控）：给一个初始值，然后从事件 `detail` 里读变化。最简单，表单默认如此。
- **应用持有**（受控）：每次渲染都设置 property，并把事件当作一个**变更请求**，而不是「模型里已经
  发生的变化」。

真正会出问题的是两者都做：把组件的值复制一份到状态里，每次事件写回去，再从状态设置回 property。
快速输入时两边会漂移，在事件里回写还可能形成死循环。只选一个方向。

```js
// 受控：状态是唯一真相，事件只是请求
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // 于是又设置了一次 input.value，但持有者始终只有一个
});
```

## 框架接入

它们就是标准的自定义元素，不需要任何框架专属的东西，但有三个细节容易踩坑：

- **React**（< 19）会把 JSX 上的每个 prop 都当作 **attribute** 设置，所以复杂值传不进去，`onChange`
  这类 prop 也绑不到自定义事件上。请用 `ref`，在 effect 里设置 property、调用 `addEventListener`。
  React 19 在存在同名 property 时会改设 property，但仍不会按名字绑定自定义事件，所以监听还是要靠
  `ref`。
- **Vue** 默认把未知标签当组件解析，需要在构建配置的 `compilerOptions.isCustomElement` 里放行
  `r-` 前缀。之后 `:prop` 绑定 property、`@change` 绑定真实事件监听，都能正确工作。
- **Angular** 需要 `CUSTOM_ELEMENTS_SCHEMA`；Svelte 和 Solid 直接透传属性与 `on:`/`on` 监听，无需
  额外配置。

TypeScript 用户可以 `import 'ranui/typings'` 获得 JSX 内置元素声明。

## 服务端渲染

ranui 组件可以序列化成**声明式 Shadow DOM**，服务端因此能直接输出真实标记，JS 还没执行时首屏就已经是正确的：

```js
import 'ranui'; // 填充 SSR 注册表
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)` 是它的异步生成器版本，用于流式响应；`ranui/ssr` 的
`renderToString(instance)` 序列化你自己构造的单个组件实例。不认识的标签原样透传，所以拿整页来跑也没问题。

有两点需要知道：

- **客户端会重建，而不是复用。** 因为 root 是 closed 的，浏览器无法把服务端渲染的树交还给组件，元素
  升级时会构建一棵一模一样的新树。它保证的是服务端首屏，不是 hydration 复用；所以也不要把状态写进
  服务端渲染的 shadow 标记里，指望客户端再读回来。
- **服务端没有任何尺寸信息。** 凡是依赖 `getBoundingClientRect` / `offsetWidth` 的逻辑，都要等到组件
  在浏览器里挂载之后才会执行。

## 性能

- 只用到少量组件的页面**按组件引入**；主入口留给用掉大半个库的应用。
- **变体按需加载。** `r-icon` 和 `r-loading` 在运行时按名字取变体，基础开销不会因为你没用到的图标而变大。
- **设置 property，别重建元素。** 替换自定义元素会重跑构造函数；设置 property 则是原地更新。
- **批量写属性。** 每次写入都可能触发 `attributeChangedCallback`；能在插入前把状态准备好就先准备好。

## 测试

**closed shadow root 同样会挡住测试定位器。** Playwright 的 `getByRole`、`getByText`、
`querySelector` 都止步于边界，并且**什么都找不到**。用它们写的用例会「通过」，但其实从来没看到过
那些元素。本仓库就曾有两套用例是这么写出来的，很久之后才被发现。`ranui/testing` 是官方提供的进入
方式：

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

除此之外，请测契约而不是测内部：设置 attribute 或 property，断言事件和用户能感知到的结果。针对内部
类名的断言每次重构都会坏，而且说明不了组件是否可用。

## 反模式

| 反模式                                          | 为什么不行                                                       |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| 给 `r-input` / `r-select` 在容器上委托 `change` | 这些事件不冒泡，监听永远不触发。请绑到元素本身。                 |
| `document.querySelector('r-select').shadowRoot` | closed root，恒为 `null`。用公开 API、part 或 `ranui/testing`。  |
| 用 `r-card .inner { … }` 给内部上样式           | 选择器跨不过边界，优先级再高也没用。改用令牌或 `::part()`。      |
| 用 `!important` 去「压过」组件                  | 根本不存在层叠冲突，那条规则压根没生效。同上。                   |
| 把组件的值镜像进自己的状态再写回                | 一个值两个持有者，会漂移，还可能回环。                           |
| 靠重建元素来更新                                | 重跑构造函数，丢掉焦点和内部状态。请设置 property。              |
| 在主题化组件旁边写死颜色                        | 主题一翻转就坏。请用语义令牌。                                   |
| 「以防万一」给容器加全局 `z-index`              | 会把静态内容永久抬到你自己的页面骨架之上。用 `:has()` 限定范围。 |
| 在测试里等 `shadowRoot`                         | 同上，用 `ranui/testing` 或断言可观察的行为。                    |

## 参与 ranui 开发

仓库对库代码本身有更严格的标准：

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md)：可执行的设计标准，其中九条由 `pnpm -F ranui verify:design` 强制校验。
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md)：库代码的组件架构、状态归属与测试规则。
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md)：链式 DOM builder 及其响应式原语。
- 包根目录的 `CLAUDE.md`：随 npm 包一起发布的导览文件，人和编码智能体都应该先读它。

提 PR 之前：`pnpm -F ranui test:all`、`pnpm -F ranui verify:design`、`pnpm verify:docs`（API 与令牌
表是生成的，过期会导致 CI 失败）。
