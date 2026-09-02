---
description: '用 ranui 开发的工程规范：入口、属性/属性值/事件契约、跨 Shadow 边界的样式覆盖、状态归属、SSR、测试，以及应当避开的反模式。'
---

# Coding guidelines 编码规范

如何**用** ranui 开发：组件的契约是什么，Shadow DOM 边界在哪些地方改变了你习惯的规则，以及哪些坑
值得在踩之前就知道。

视觉的另一半是[设计规范](/cn/src/ranui/design-guides/)，令牌清单是
[设计系统](/cn/src/ranui/design-system/)。

> **适用场景**：把 ranui 接入应用时——选择引入方式、绑定事件、给选择器够不到的地方加样式、做服务端
> 渲染、写测试。

## 原则

1. **元素就是 API。** 属性（attribute）、属性值（property）、事件、插槽和 `::part()` 构成全部契约。
   除此之外你从外面能看到的一切都是实现细节，会变。
2. **状态只归属一处。** 要么由你的应用持有并推给组件，要么由组件持有并在变化时通知你。双向镜像就是
   数值漂移的来源。
3. **走缝隙上样式。** 自定义属性、`::part()`、`sheet` 和插槽能跨越 Shadow DOM 边界；普通选择器不能
   ——再高的优先级也没用。
4. **用多少引多少。** 每个组件都有独立入口，主入口只是便利，不是必须。
5. **优先用平台能力。** 这些就是自定义元素：`addEventListener`、`setAttribute`、`hidden` 都按规范
   工作，框架封装是可选项。

## 入口

每个入口只注册名字所说的东西——只想要主题的页面不会为组件库付费。

| 引入                            | 内容                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `ranui`                         | 全部组件（副作用注册所有 `<r-*>` 元素）                    |
| `ranui/<component>`             | 单个组件——`ranui/button`、`ranui/select`、`ranui/modal`…   |
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

**为副作用而引入。** `import 'ranui/button'` 会注册 `<r-button>`，你很少需要那个导出的类。例外是
服务端渲染——那里需要你自己实例化。

## 组件契约

每个元素确切的属性、属性值、事件（含 `detail` 结构）、插槽和 part 都由源码生成到
[`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)。
下面讲的是那张表**不会告诉你**的部分。

### attribute 是字符串，property 是类型化的值

HTML 属性小写、只能是字符串；对应的 property 是小驼峰、接受真实的值。二者是同一份状态的两个入口：

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // property——小驼峰
select.setAttribute('showsearch', ''); // attribute——全小写
```

- **布尔属性看「有没有」**，和原生 `<button>` 的 `disabled` 一样：`disabled=""` 和
  `disabled="false"` 都是禁用。要取消就移除属性（或把 property 设为 `false`）。
- **复杂值走 property。** 数组、对象、`File` 无法塞进属性——例如 `r-attachments` 的 `attachments`
  就是 property。
- **HTML 里属性名不区分大小写**，所以上面写的是 `showsearch` 而 property 是 `showSearch`。在 JSX
  中请写属性形式。

### 把监听绑在元素本身上

ranui 组件派发 `CustomEvent`，负载永远在 `detail` 里：

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**是否冒泡是各组件自己的决定，所以请绑在元素上，而不是容器上。** 表单与浮层核心——`r-input`、
`r-checkbox`、`r-select`、`r-modal`——刻意在自身上派发**不冒泡**的事件：select 的 `change` 不该看
起来像 form 的 `change`。另一些则会冒泡（且 `composed`，能穿过 shadow 边界）：`r-theme-switch`、
`r-voice-button`、`r-attachments`、`r-conversation`、`r-tool-card`、`r-markdown`、`r-math`、
`r-mermaid`、`r-router`、`r-route`、`r-link`、`r-colorpicker`。

绑在元素上两种情况都成立；在祖先上做委托只对后一组有效，对前一组会**静默失效**。依赖委托之前，请查
源码或
[`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)。

**`before*` 事件可取消。** `r-modal` 在动作前派发 `beforeopen` / `beforeclose`，
`event.preventDefault()` 可以否决；`open` / `close` / `afteropen` / `afterclose` 报告的是已经发生
的事，不可取消。

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### 插槽与 part

内容通过插槽（默认与具名）传入，并**留在你的文档里**，所以**你的**页面 CSS 能正常给它们上样式。
够不到的只有组件内部构建的那部分，那正是 `::part()` 的用武之地。

## 跨 Shadow 边界上样式

每个 ranui 组件都渲染进 **closed** shadow root：页面 CSS 漏不进去，选择器也穿不过去。进入的方式
恰好有四种，按优先级排列：

| 方式             | 用于                          | 示例                                                  |
| ---------------- | ----------------------------- | ----------------------------------------------------- |
| **自定义属性**   | 组件已暴露为令牌的一切        | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**   | 令牌覆盖不到的结构性调整      | `r-card::part(footer) { justify-content: flex-end; }` |
| **`sheet` 属性** | 程序化 / 动态注入到内部的 CSS | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **插槽内容**     | 本来就归你的标记              | `<span slot="extra">…</span>`                         |

自定义属性排第一，是因为它会**继承穿过**边界：设在 `:root`、设在外层容器、设在元素上都有效，而且
和主题用的是同一套令牌。part 和 `sheet` 会把你绑在内部结构上，所以留给真正的缺口，并预期升级时需要
复查。

无论优先级多高都不生效的写法：`r-select .some-inner-class { … }`、`!important`、以及
`querySelector` 进组件内部。closed root 意味着 `element.shadowRoot` 恒为 `null`——对你的 CSS、你的
脚本、你的测试定位器一视同仁。

## 状态归属

逐个值决定归属：

- **组件持有**（非受控）：给一个初始值，然后从事件 `detail` 里读变化。最简单，表单默认如此。
- **应用持有**（受控）：每次渲染都设置 property，并把事件当作一个**变更请求**，而不是「模型里已经
  发生的变化」。

真正会坏的是两者都做：把组件的值复制一份到状态里，每次事件写回去，再从状态设置回 property。快速输入
下两者会漂移，而在事件里回写还可能形成回环。选一个方向。

```js
// 受控：状态是唯一真相，事件只是请求
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // 于是又设置了一次 input.value——但只有一个持有者
});
```

## 框架接入

它们就是标准自定义元素，不需要框架特定的东西——但有三个细节会咬人：

- **React**（< 19）会把 JSX 上的每个 prop 当作**属性**设置，所以复杂值传不进去，`onChange` 这类
  prop 也绑不到自定义事件上。请用 `ref`，在 effect 里设置 property / `addEventListener`。React 19
  会在存在同名 property 时设置 property，但仍不按名字绑定自定义事件，所以监听还是留给 `ref`。
- **Vue** 默认把未知标签当组件解析，需要在构建配置的 `compilerOptions.isCustomElement` 里放行
  `r-` 前缀。之后 `:prop` 绑定 property、`@change` 绑定真实事件监听，都能正确工作。
- **Angular** 需要 `CUSTOM_ELEMENTS_SCHEMA`；Svelte 和 Solid 直接透传属性与 `on:`/`on` 监听，无需
  额外配置。

TypeScript 用户可以 `import 'ranui/typings'` 获得 JSX 内置元素声明。

## 服务端渲染

ranui 组件会序列化成**声明式 Shadow DOM**，因此服务端能直接吐出真实标记，JS 尚未执行时首屏就是对的：

```js
import 'ranui'; // 填充 SSR 注册表
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)` 是它的异步生成器版本，用于流式响应；`ranui/ssr` 的
`renderToString(instance)` 序列化你自己构造的单个组件实例。未知标签原样透传，所以对整页运行是安全的。

有两点需要知道：

- **客户端是重建，不是复用。** 因为 root 是 closed 的，浏览器无法把服务端渲染的树交回给组件，元素
  升级时会构建一棵一模一样的新树。你得到的是服务端首屏，不是 hydration 复用——也因此不要把状态写进
  服务端渲染的 shadow 标记里指望客户端读回来。
- **服务端拿不到任何测量值。** 依赖 `getBoundingClientRect` / `offsetWidth` 的一切都在挂载后、在
  浏览器里才解析。

## 性能

- 只用到少量组件的页面**按组件引入**；主入口留给用掉大半个库的应用。
- **变体按需加载。** `r-icon` 和 `r-loading` 在运行时按名字取变体，基础成本不会随你没用到的图标增长。
- **设置 property，别重建元素。** 替换自定义元素会重跑构造函数；设置 property 则是原地更新。
- **批量写属性。** 每次写入都可能触发 `attributeChangedCallback`；能在插入前把状态准备好就先准备好。

## 测试

**closed shadow root 同样挡住测试定位器。** Playwright 的 `getByRole`、`getByText`、
`querySelector` 都止步于边界并且**什么都找不到**——用它们写的用例会「通过」，而它其实从未看到那些
元素。本仓库有两套用例就是这么写出来的，直到有人发现。`ranui/testing` 就是那道有名有据的缝：

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

除此之外，测契约而不是测内部：设置属性或 property，断言事件和用户能感知到的结果。针对内部类名的断言
会在每次重构时崩掉，而且并不能说明组件是否可用。

## 反模式

| 反模式                                          | 为什么不行                                                      |
| ----------------------------------------------- | --------------------------------------------------------------- |
| 给 `r-input` / `r-select` 在容器上委托 `change` | 这些事件不冒泡，监听永远不触发。请绑到元素本身。                |
| `document.querySelector('r-select').shadowRoot` | closed root，恒为 `null`。用公开 API、part 或 `ranui/testing`。 |
| 用 `r-card .inner { … }` 给内部上样式           | 选择器跨不过边界，优先级再高也没用。改用令牌或 `::part()`。     |
| 用 `!important` 去「压过」组件                  | 根本不存在层叠冲突——那条规则压根没生效。同上。                  |
| 把组件的值镜像进自己的状态再写回                | 一个值两个持有者，会漂移，还可能回环。                          |
| 靠重建元素来更新                                | 重跑构造函数，丢掉焦点和内部状态。请设置 property。             |
| 在主题化组件旁边写死颜色                        | 主题一翻转就坏。请用语义令牌。                                  |
| 「以防万一」给容器加全局 `z-index`              | 会把静态内容永久抬到你自己的骨架之上。用 `:has()` 限定范围。    |
| 在测试里等 `shadowRoot`                         | 同上——用 `ranui/testing` 或断言可观察行为。                     |

## 参与 ranui 开发

仓库对库代码本身有更严格的标准：

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md) ——
  可执行的设计标准，其中九条由 `pnpm -F ranui verify:design` 强制校验。
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md) ——
  库代码的组件架构、状态归属与测试规则。
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md) ——
  链式 DOM builder 及其响应式原语。
- 包根目录的 `CLAUDE.md` —— 随 npm 包一起发布的导览文件，人和编码智能体都先读它。

提 PR 之前：`pnpm -F ranui test:all`、`pnpm -F ranui verify:design`、`pnpm verify:docs`（API 与令牌
表是生成的，过期会导致 CI 失败）。
