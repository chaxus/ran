---
title: ranui 更新日志
description: ranui 的变更记录——新增、变更、修复与移除及其原因，以及每一批改动背后的工程记录。
---

# Changelog 更新日志

由 `pnpm -F ranui doc:changelog` 从 `packages/ranui/CHANGELOG.zh-CN.md` 生成，与英文版一同维护，
因此本页与 npm 包内的副本不会出现分歧。

::: warning ranui 处于 alpha 阶段
版本以 `0.x-alpha` 发布，**其中会包含破坏性变更**——现阶段优先把设计做对，而不是保住 API 形状。
请锁定确切版本，并在升级前先读本页。
:::

::: v-pre

## [Unreleased]

### Added

- **构建器（builder）新增 `unsafeHtml()`。** `text()` 会转义内容，此前构建器生成的元素树因此无法包含本身就是 HTML 的内容：已渲染的 markdown、别处拼好的片段、带有自身强调标记的翻译字符串（`Local-first · <b>open source</b>`）。这类内容完全没有表达方式，这也是为什么内置 markdown 的静态站点生成器此前只能拼接字符串，而不能使用这个 API。之所以这样命名，是为了标明区别：传给它的所有内容都会被当作标记解析，所以任何来自外部的内容都要先做清理（sanitize）。它会替换元素的内容，`text()` 和 `unsafeHtml()` 两者中后调用的那个生效，和 DOM 的行为一致。

- **构建器现在会在 SVG 命名空间中创建 SVG 元素。** `View('svg')` 以及其他所有 SVG 专用标签（`path`、`circle`、`g` 等）现在都通过 `createElementNS` 创建，`Svg()` 则导出给 SVG 与 HTML 共用的标签（`a`、`script`、`style`、`title`）使用，因为对这些标签做自动推断会破坏更常见的 HTML 场景。此前所有标签都通过 `document.createElement` 创建，而它为 `svg` 返回的是 `HTMLUnknownElement`：浏览器不会把它当作 SVG 渲染，而且由于 HTML 会把属性名转成小写，`viewBox` 会变成 `viewbox`，SVG 按大小写敏感读取属性，因此直接忽略它。用构建器搭出来的图标是空白的，但序列化后的页面标记看起来是对的。这个问题是从外部发现的：一个静态站点生成器在 node 和 jsdom 下渲染同一个页面产生了不同的字节结果，差异就出在被拍平的 `viewBox` 上。

- **`r-select` 和 `r-popover` 背后统一为一个浮层面板控制器（`FloatingController`，已导出）。** 弹出层（portal）、定位（flip/shift/对齐）、跟随锚点滚动和 resize、进入/退出动画以及开关状态机，这些逻辑此前在两个组件里各写了一遍，并且已经开始出现偏差：`r-select` 的重新定位监听器里有一条注释，说它是照抄 `r-popover` 的写法，这正是"手动同步一份共享逻辑"在失效前夕的样子。现在两者都驱动同一个控制器，只传入各自独有的信息：`r-select` 传入它从触发器上复制的面板宽度（以及消费者可能用 `::part(dropdown)` 加宽后的实际渲染宽度），`r-popover` 传入哪个亮域（light DOM）子节点是触发器、箭头该指向哪里。该控制器已从桶文件（barrel）导出，这样第三个浮层组件可以直接复用，而不是再抄一份。
- **`r-select` 和 `r-popover` 新增 `open` 属性。** 这是一个会反射（reflect）到 attribute 上的状态，并且是唯一权威状态，就像 `<details open>` 和 `<dialog open>` 一样。不再有任何逻辑从面板的 `style.display` 反推状态，那种做法会比真实状态滞后一个退出动画的时长。`show()` / `hide()` / `toggle()` 是操作方法；`:host([open])` 现在可以作为样式选择器使用，`el.open = true` 是驱动这两个组件的受支持方式，测试里也可以直接断言这个 attribute，而不用去轮询某个样式值。
- **两个组件都新增 `show` / `after-show` / `hide` / `after-hide` 事件。** 每一对里的第一个事件在过渡开始时宣告意图，第二个事件在面板到位、动画全部结束后触发。此前这两个组件都没有任何方式可以得知面板已经打开。这些事件通过标准的 `@fires` JSDoc 标签声明，API 文档生成器现在会读取它；从共享控制器派发的事件，对组件文件本身的静态扫描是不可见的，所以此前这两个组件的文档都会显示成"没有任何事件"。
- **`r-dropdown` / `r-select` / `r-popover` 新增 `prefers-reduced-motion` 支持。** 这三个是库里动画最重的组件，此前反而是没有做这项适配的那几个，而另外八个组件早就支持了。媒体查询会将 `animation` 设为 `none`；由于退出动画现在等待的是样式表本身，而不是写死在脚本里的一个时长，面板会立即关闭，不会再为一段实际上根本没有播放的动画等待。

- **新增 `serializeForm(form)`。** 这是一个小工具函数（`import { serializeForm } from 'ranui'`），通过 `FormData` 把一个 `<form>` 里带 name 的字段收集成一个普通对象，用来取代已移除的 `<r-form>`（见下文），作为把提交结果转成可以 `JSON.stringify` 或作为 fetch body 发送的推荐方式。它对任意真实的 `<form>` 都适用，不要求里面必须有 ranui 的字段。
- **`r-input`、`r-checkbox`、`r-select` 实现了 `formResetCallback` 和原生校验（`ElementInternals.setValidity`）。** 原生的 `form.reset()`（或 `<button type="reset">`）现在会真正把每个字段恢复到交互前的状态（此前这是个空操作：表单关联只覆盖了 `FormData` 的收集，不覆盖重置或校验）。`r-checkbox` 和 `r-select` 新增了 `required` 属性/attribute（此前只有 `r-input` 有）；一个为空的 `required` 字段现在会阻止提交，并显示浏览器原生的校验 UI，锚定在该字段上，行为和原生控件完全一致（`<fieldset disabled>` 的传播，即 `formDisabledCallback`，是有意不做的）。三者现在都暴露了 `checkValidity()`、`reportValidity()`、`validity`、`validationMessage`，与原生字段 API 对齐。
- **`<r-input>` 现在会把 `focus()` / `blur()` / `select()` 转发给内部的 `<input>`。** 宿主元素不在 tab 顺序里，它的 shadow root 又是 closed 的，所以此前没有办法从 JS 里聚焦这个字段（`el.focus()` 打在了不可交互的宿主上，`el.shadowRoot` 是 `null`）。现在这三个原生方法都被重写，转发到真正的控件上，从而支持程序化聚焦、"聚焦搜索框"这类快捷键（例如 `/`），以及先聚焦再全选的流程。attribute 和标记都没有变化；已有对应的契约测试覆盖。
- **新增独立的 `ranui/scratch`、`ranui/section` 子路径入口。** 这两个组件此前已经通过 `ranui` 桶文件（barrel）导出，并且也构建出了 `dist/scratch.js` / `dist/section.js`，但没有列进包的 `exports` 映射，所以 `import 'ranui/scratch'`（等等）会解析失败。现在这两个按组件划分的子路径导入可以正常工作了，和其他每个组件入口一致。
- **新增独立的 `ranui/theme` 和 `ranui/i18n` 子路径入口。** 主题引擎（`initTheme`/`setTheme`/`setThemeToken(s)`/`clearThemeToken`）和 i18n 引擎（`createI18n`/`useI18n`/`I18nCore`）现在可以单独导入（`import { initTheme } from 'ranui/theme'`、`import { createI18n } from 'ranui/i18n'`）。这两个入口都不会注册任何自定义元素，所以只想要 token/暗色模式或翻译能力的消费者可以把组件排除在打包体积之外。这些 API 仍然会从 `ranui` 桶文件重新导出。分别构建为 `dist/theme.js` / `dist/i18n.js`；文档见 `docs/src/ranui/{theme,i18n}/`。
- **主色改为单色（Vercel/Geist 品牌基调）。** `--ran-color-primary` / `-hover` / `-active` 现在是黑白互换的单色动作色（浅色下黑底白字，深色下白底黑字，此前是蓝色），并新增了 **`--ran-color-primary-text`**（主色表面上文字/图标要用的反色墨色，它也会随主题反转，从而保证主色按钮在两种主题下文字都读得清）。**蓝色现在只保留给链接（`--ran-color-link`）和焦点环使用**（`--ran-focus-ring` 已和主色解耦，固定为蓝色）。这取代了此前独立的 `--ran-color-contrast-*` token 以及 `r-button type="contrast"` 变体，两者都因为冗余而被移除，**默认的 `type="primary"` 按钮就是这个单色动作色**。状态色（红/绿/琥珀）没有变化。**破坏性变更（预发布阶段）：** 任何引用 `--ran-color-contrast-*` 或 `type="contrast"` 的地方都应该迁移到 `--ran-color-primary*` / `type="primary"`。
- **新增 `<r-theme-switch>`。** 一个 Vercel 风格的三态（跟随系统／浅色／深色）分段胶囊控件，接入了主题 API（`setTheme`、localStorage 键 `ran-theme`）。多个实例会在同一页面内以及跨标签页保持同步，`label`/`label-*` attribute 可以本地化 aria-label，组合事件 `change` 会携带 `{ theme }`，`theme-color` 的 meta 标签也会跟随解析出的 `--ran-color-bg` 同步更新（`system` 模式下会恢复成原始值）。作为 `ranui/theme-switch` 以及 `dist/iife/theme-switch.iife.js` 发布。
- **新增自托管 Geist 字体：`ranui/fonts`。** 包含 `dist/fonts/fonts.css` 以及可变字重的 `Geist-Variable.woff2` / `GeistMono-Variable.woff2`（共约 138 KB，SIL OFL 1.1 协议，许可证随包附带）。只需一次导入，消费者就能拿到 `--ran-font-family` / `--ran-font-mono` 背后对应的官方字体，自托管、离线可用（不依赖 CDN）。
- **新增 `r-card hoverable` 属性。** 用于选择性开启 Geist 风格的交互式卡片悬停效果（边框 400 → 500，加上悬浮阴影；可通过 `--ran-card-hover-border-color` / `--ran-card-hover-shadow` 覆盖）。非交互式卡片保持不受影响。
- **`ranui/builder` 新增响应式所有权（ownership）机制和 `untrack`。** 信号引擎现在暴露了 `createRoot` / `onCleanup` / `getOwner` / `runWithOwner`（以及 `Owner` 类型）和 `untrack`，从 `ranui/builder` 和 `ranui` 两处都重新导出。effect 和 memo 组成一棵所有者树：销毁一个作用域（`createRoot((dispose) => …)`）会一次性拆掉它派生出的每一个 effect、memo、绑定和 `onCleanup`，这正是一个页面/路由（无论 MPA 还是 SPA）该有的那个销毁单元。一个自引用的 effect（读和写同一个 signal）现在会抛出"cyclic dependency"错误，而不是死循环。相关文档见新增的 `docs/BUILDER.md`。
- **`ElementBuilder` 的绑定支持响应式。** `text` / `attr` / `class` / `boolAttr` / `style` / `part` / `data` / `aria` / `role` / `label` 现在除了普通值，还可以接受一个 **getter**（一个 signal 或 `computed`）；DOM 会通过一个归属于当前作用域的 effect 在值变化时自动更新。传入普通值仍保持原来的一次性行为。（响应式只适用于单键形式的 `style(prop, getter)`，不适用于对象/`attrs` 映射形式。）
- **`<r-route src>` 支持懒加载、代码分割的页面。** 带 `src` 模块说明符的路由现在会在匹配时动态 `import()` 该模块，并在 **一个 `createRoot` 内部** 执行其 `default: (host) => void | (() => void)` 渲染函数；离开该路由会销毁这个作用域，拆掉该页面注册的每一个 effect、绑定和 `onCleanup`（如果返回了可选的清理函数，也会一并执行）。这是面向更大型多页应用的按页生命周期模式；静态（slot 承载）路由不受影响，仍然是 SSG 的默认方式。已经对"离开又立刻重新进入"这类竞态情况下的动态导入做了防护。
- **支持嵌套路由配置。** `createRouter({ routes })` 现在支持在一条路由上写 `children`；路径会被拍平成绝对路径（`parent/child`）用于匹配和 `getStaticPaths()`（SSG 枚举）。`matchPath` 现在是 `RouterCore` 和 `<r-route>` 共用的一个统一导出的辅助函数。

### Changed

- **`r-select` 的 `placement` 支持对齐后缀，且两个组件的 `placement` 都改为 `Placement` 类型。** `bottom-end`、`top-center` 等等，这套语法 `r-popover` 此前就已经支持，现在两个组件通过同一个控制器定位，因此对齐语法也统一了。裸的方位词仍然默认表示 `-start`。**破坏性变更（预发布阶段）：** 两个组件的 `placement` 此前都是 `string` 类型，现在改成了定位器实际能理解的那个联合类型。
- **`r-select` 在自定义容器内的对齐方式，现在和在视口内一致了。** 此前它的 `getPopupContainerId` 分支用一条写死的规则把面板居中对齐到触发器上，而视口分支对齐到前沿，导致同一个 `placement` 在不同挂载位置下代表两种不同的含义。现在两条路径统一走同一套对齐逻辑。**破坏性变更（预发布阶段）：** 如果某个自定义容器内的面板此前依赖这种隐式居中效果，现在需要显式指定：`r-player` 的画质和字幕菜单现在显式设置了 `placement="top-center"`。
- **`PlacementDirection` 不再导出。** 过渡类名表现在归控制器内部所有，属于内部实现。**破坏性变更（预发布阶段）：** 这个类型在公开 API 里没有替代品。

- **组件级 CSS 自定义属性名精简为固定语法**：统一为 `--ran-{component}-{element}[-{state}]-{property}`，取代此前把完整 BEM 类名嵌套路径编码进 token 名的做法（例如 `--ran-select-selection-search-input-active-border-right-width` 变成 `--ran-select-search-active-border-width`）。这次改动只做重命名（每一个可覆盖点都被 1:1 保留下来，没有任何 fallback 值发生变化），覆盖全部 29 个组件，包括 `player`（它自己就有 225 个 token，加上供内嵌音量滑块使用的 `--ran-progress-*` 覆盖；`player` 是最后一个改名的，因为当天它还处于开发中）；已移除的 `form` 组件不在此列。新的命名规范见 `docs/DESIGN.md` 第 9 节。**破坏性变更（预发布阶段）：** 任何覆盖了被改名 token 的消费方代码都需要换成新名字，当前完整列表见 `docs/style-tokens-public.md`，完整原因和一份代表性改名对照表见 `changelogs/2026-08-08.md`。

- **移除 `<r-form>`，改用普通 `<form>` 加新工具函数 `serializeForm()`。** `<r-form>` 此前在 shadow DOM 内部构建了自己的 `<form>`，把字段 slot 进去（最初通过命名 slot `r-form_content`，后来改成默认 slot）；但无论对原生控件还是表单关联的自定义元素，这套机制在真实浏览器里都从未真正生效过：一个藏在 shadow DOM 里的 `<form>` 永远无法成为亮域（light DOM）子元素的表单所有者（表单归属是沿着真实 DOM 祖先链解析的，不会穿透进 shadow root，这一点已经直接验证过：一个被 slot 进去的 `<input>`，它的 `.form` 是 `null`，`FormData` 也看不到它）。后来一次修改把一个真正的 `<form>` 嵌套进 `<r-form>` 内部解决了这个问题，但这样一来 `<r-form>` 就只剩下给这个 `<form>` 一个默认布局，以及一个把内容序列化成 JSON 的 `value` 属性，等于给你自己的 `<form>` 多套了一层壳，做两件普通 `<form>` 本来就不需要帮忙的事。`r-input`/`r-checkbox`/`r-select` 本身就能在任何原生 `<form>` 里独立工作（它们是表单关联自定义元素，见下文）。**破坏性变更（预 1.0 alpha 阶段）：** 移除 `<r-form>` 这层包裹，`<r-form><form>...</form></r-form>` 直接变成 `<form>...</form>`；改从 `ranui` 导入 `serializeForm`，把一次 `submit` 转成普通对象，而不是去读 `<r-form>` 的 `value`。
- **`computed` 现在是惰性求值并且按值做记忆化（memoize）。** 一个 memo 不再在每次依赖写入时都立即重新计算，只在依赖变化之后被读取时才会重新计算，从未被读取过的 memo 根本不会计算。它现在也只在派生值真正发生变化时才通知观察者（默认按 `Object.is` 比较，可通过 `computed(fn, { equals })` 覆盖），因此挂在一个值没有变化的 memo 后面的 effect 不会再被无意义地重新触发。**行为变化：** 依赖 `computed` 内部副作用立即执行的代码，需要把这部分副作用挪到 `createEffect` 里；一个函数体里带副作用的 memo，在第一次被读取之前不会执行。

- **i18n 的 `t()` 现在支持通过双写花括号转义字面量花括号**（`{{` 变成 `{`，`}}` 变成 `}`），和 Rust/Python/.NET 的格式化字符串约定一致，因此一条消息既能显示字面量 `{token}`（写作 `{{token}}`），又能正常插值真正的 `{param}` 占位符。转义和插值在同一次从左到右的扫描中完成，带不带参数都适用。单独出现或前后带空格的花括号（`{ ... }`）仍然会原样透传，因此消息里出现的 CSS/JSON/代码片段是安全的。**行为变化：** 任何现有消息里如果包含并非有意用作转义的字面量 `{{` 或 `}}`，现在都会被折叠成一个花括号。
- **`r-card` 的默认外观改为 Geist 风格的描边卡片。** 背景色改为页面背景（`--ran-color-bg`）加 1px 的 `--ran-color-border`，取代此前偏灰的内凹填充色（`--ran-color-bg-muted`）。想要旧的内凹效果的消费者可以自行设置 `--ran-card-background: var(--ran-color-bg-muted)`。同时新增了一个专门的 `--ran-card-border-color` 组件 token，这样悬停时的边框加深效果就可以从（closed 的）shadow root 外部驱动。
- **默认（secondary）`r-button` 的悬停效果不再切换成强调色。** 现在是把边框颜色加深（灰度 400 → 500），同时保持主文字颜色，遵循 Geist 的状态阶梯；默认的波纹（ripple）效果也从主色蓝改成了半透明灰色（`--ran-gray-alpha-400`）。

### Fixed

- **SSR mock 里的 `textContent` 和 `innerHTML` 现在会像浏览器里一样互相替换对方。** 此前的 mock 会把两者都保留下来，并且序列化时优先用文本，导致 `el.textContent = 'a'; el.innerHTML = '<b/>'` 在 node 下渲染出 `a`，在浏览器里却渲染出 `<b/>`；设置完 `textContent` 之后再读 `innerHTML`，读到的是已经被替换掉的旧标记。只有当同一个模板同时在两种环境下渲染时才会暴露这个问题，而这正是静态站点生成器在 vitest 下会做的事。

- **连续点击 `r-select` 的触发器不会再把菜单卡死。** 具体场景：把鼠标悬停在触发器上，点击一次（打开），不移动鼠标再点击一次（关闭），再点击一次：面板会闪一下打开，然后自己关闭，从这之后菜单就卡住了。触发器在每次点击时会同时跑关闭和打开两段过渡，最终谁生效取决于两个 300ms 动画计时器里哪一个刚好还在跑，因为每段逻辑都是靠读取 `style.display` 来判断自己该不该做事。而在那个窗口期内，`display` 反映的是当前这一帧的画面，不是真正的意图。触发器现在改为切换 `open`，这才是真正的状态。
- **`aria-expanded` 不会再和面板状态脱节。** 这是在排查上一个 bug 过程中发现的：中途某一时刻，combobox 宣称自己处于展开状态，而它的面板其实是 `display: none`。现在只有一处代码负责写入 display、过渡类名、重新定位监听器和 `aria-expanded`，四者不可能再互相矛盾。
- **面板的退出动画不再等待一个写死在脚本里的时长。** `dropdown/index.less` 里定义了动画时长，同时有三个 JS 文件各自手写了一份 `const animationTime = 300` 去匹配它；那份样式表里的一条注释记录了上次两边失配时发生的事，如果有消费者设置了 `--ran-dropdown-animation-duration`，同样的问题会重演。控制器现在直接向元素询问它正在播放什么动画（`getAnimations()`），这样就不可能失配，而且没有动画要等时会立即返回。
- **`r-select` 的宿主元素不会再在自己下方多留出一行幽灵空间。** `:host` 是 inline-block，里面的字段元素也是另一个 inline-block，导致宿主保留了一段没有任何内容会画上去的下行字符（descender）空间：38px 高的宿主里包着一个 32px 高的字段，里面所有内容相对宿主自身的垂直中心整体上移了 3px。这段空隙的大小取决于所在页面继承来的 `line-height`，因此每个页面都不一样。单独截一张 select 的图看不出问题，jsdom 里也测不出来；只有当一个 select 和别的元素共享同一行、且这一行要求垂直居中对齐时，作为"旁边那个元素"才会显得没对齐。现在字段改成了 `display: block`，宿主的实际高度也终于是它自己注释里一直声称的那 32px。
- **`r-button` 的浮起阴影现在会跟随按钮的圆角。** 阴影画在宿主元素上，但圆角此前只对 shadow DOM 内部的表面和内容生效，宿主本身还是一个直角矩形：一个圆角按钮外面套着一个方形阴影，阴影底边会在四个角上都露出一截直线。默认 6px 圆角下这个问题不明显，所以一直没被发现；一旦有消费者把按钮圆角调成胶囊形（`--ran-btn-border-radius: var(--ran-radius-full)`），问题立刻就看出来了。宿主现在读取和表面同一个 `--ran-btn-border-radius`，一个变量就能同时控制三层盒子的圆角，阴影不会再和按钮本身对不上。
- **`r-colorpicker` 在断开又重新连接之后仍然保持响应式。** 面板的 4 个更新 effect 每次 `disconnectedCallback` 都会被销毁，但只在首次打开时创建过一次，因此一个被移动或者重新挂载过的取色器会悄无声息地失去响应（拖动不再更新色块/滑块位置）。现在 `connectedCallback` 会在面板已经存在但对应的 disposer 已被清空时重新装配这些 effect。
- **基于配置的路由现在会正确填充 `currentRoute.params`。** `RouterCore._navigate` 现在通过新增的 `matchParams(path)` 填充 `to.params`（取第一个匹配上的拍平路由），因此导航之后 `RouteLocation` 上能拿到 `:param` 对应的值，而不是永远是 `{}`。
- 把 button/card/section/input/checkbox/colorpicker/select/message 里遗留的 antd 时代硬编码 fallback 颜色（`#1890ff`、`#40a9ff`、`#d9d9d9`）替换成了当前 Geist token 对应的值（`#006bff`、`#eaeaea`、`#f2f2f2`），这样即使 token 层缺失，也能降级到正确的配色。

### Added

- **全组件无障碍能力升级（`DESIGN.md` 第 7 节）：**
  - `r-message` 的 toast 现在会被屏幕阅读器播报：整个消息栈是一个常驻的 `aria-live="polite"` 区域，每条 toast 都是 `aria-atomic`，`error`/`warning` 会升级为更强打断性的 `role="alert"`（其他类型是 `role="status"`）。
  - `r-img` 新增了转发到内部 `<img>` 的 `alt` attribute/property；未设置时默认是空 `alt`（装饰性图片），这样屏幕阅读器会跳过它，而不是把 URL 念出来。
  - `r-checkbox`、`r-input`、`r-select` 现在都是**表单关联（form-associated）**元素（`ElementInternals` + `setFormValue`），因此当它们是原生 `<form>` 的真实后代节点时，`new FormData(form)` 能收集到它们的值。`r-checkbox` 还把宿主暴露为唯一的 `role="checkbox"`（带 `aria-checked`、roving `tabindex`、空格/回车切换、`aria-disabled`），并隐藏了内部装饰性的 input；`r-input` 会把渲染出的 `<label>` 通过 `for`/`id` 和控件关联起来。
  - `r-tabs` 实现了 WAI-ARIA 的 tabs 模式：`role="tablist"`/`tab`/`tabpanel`、`aria-selected`、`aria-controls`/`aria-labelledby`、roving `tabindex`，以及方向键/Home/End 键盘导航。
  - `r-colorpicker` 现在可以用键盘操作：色相/透明度滑块是 `role="slider"`，带 `aria-valuemin/max/now`，支持方向键/Home/End 调节；色块触发器（`role="button"`、`aria-haspopup="dialog"`）支持回车/空格打开面板。
  - 每个组件都遵循 `prefers-reduced-motion: reduce`：一份精简动画的覆盖样式会通过 `ensureShadowRoot` 被采纳进每个 shadow root。
- `r-button` 的 `type`（`''` | `primary` | `warning` | `text`）现在是一个真正的被观察 attribute 加 property，因此它会出现在自动生成的 API 文档里，也可以像 `button.type = …` 这样直接设置。
- `docs/COMPONENTS.md` 现在包含了**带类型的属性**（例如 `checked: boolean`、`value: string`）和**事件的 `detail` 结构**（例如 `r-select change → { value, label }`、`r-checkbox change → { checked }`、`r-input input/change → { value }`），这些内容都是从源码里提取出来的。
- 新增 `docs/COMPONENTS.md`，一份自动生成的、按元素划分的 API 参考文档（attribute、property、事件、slot、`::part()`），覆盖全部 29 个自定义元素，通过 `npm run doc:api`（`bin/generate-component-api.ts`）生成。已随包发布，并在 CLAUDE.md 里引用，方便 agent 在不读源码的情况下使用这些组件。
- `r-input` 现在不再只靠颜色来表达 `status="error"`/`"warning"`（`DESIGN.md` 第 7 节）：新增了自动状态图标，以及一个可选的 `message` attribute，用于在字段下方渲染帮助/校验文案。

- 把 demo 重写成了一个 token 驱动、Geist 风格的多页应用，使用 ranui 自己的 `r-router`/`r-route`/`r-link` 以 history 模式路由（Overview、Design、Components、Guide），并配了 Cloudflare Pages 的 `_redirects` SPA 兜底规则。顶部导航加了路由链接、GitHub/Issues 入口、一个持久化（并检测 `navigator.language`）的中英文 `r-select` 语言切换器，以及一个浅色/深色切换按钮。详见 `changelogs/2026-06-27.md`。
- 新增一批基于 Geist 的设计 token：完整的 `--ran-gray/gray-alpha/blue/red/amber/green-100..1000` 色阶、`--ran-background-100/200`、`--ran-space-*` 间距刻度、`--ran-radius-full`、`--ran-shadow-menu/modal`、`--ran-focus-ring`，以及 `--ran-color-primary-hover/active`。
- 新增一个框架无关的 i18n 工具（`utils/i18n`，从 `ranui` 导出为 `createI18n` / `useI18n` / `I18nCore`）：`t(key, params)` 支持语言回退加 `{param}` 插值、`setLocale`/`onChange` 订阅、`addMessages`、localStorage 持久化，以及 `navigator` 语言检测。SSR 安全。设计上和 router 的 core/singleton 模式保持一致。
- 新增遵循 Geist 100–1000 状态模型的交互状态语义 token：`--ran-color-bg-hover` / `-bg-active` / `-border-hover` / `-border-active`。
- demo 的 Design 路由现在是一个方法论页面（配色状态阶梯、间距节奏、排版角色、动效时长、文案的推荐/禁止写法、无障碍规范），参照 Vercel/Geist 的设计规范制作。
- 新增 `docs/DESIGN.md`：一份面向 AI、可执行的设计规范文档（配色状态、间距、排版角色、圆角/层级、动效、文案、无障碍、组件落地方式，以及一份上线前检查清单）。

### Changed

- **主题系统围绕 Geist 设计体系重新设计。** 语义 token（`--ran-color-*`）现在映射到 Geist 的基础色阶上；暗色模式变成单一数据源（`theme/dark.less` 里的一个 mixin），它重新定义基础色阶，从而让每一个语义 token 自动翻转。
- 把各组件对齐到 Geist 规范：控件圆角（`button`、`input`、`select`）、主按钮悬停/激活状态的色阶步进、菜单/弹窗的圆角与阴影，以及 Geist 的字体/动效 token。
- 给 `button`、`input`、`link`、`checkbox`、`progress` 加上了键盘焦点环（`:focus-visible` / `:focus-within`）。

### Removed

- **移除了所有可选主题包**（pixel-retro、windows-98、windows-xp、system-6、wired、paper、neo-brutalism）、`dark-overrides`/`transitions` 样式表、wired 的 SVG 管线、`roughjs` 依赖，以及 `setThemePack`/`getThemePack`/`RanThemePackName` 这些 API。现在只保留基础的浅色/深色主题。
- 移除了已经没有用的 `theme/color.less` 和 `theme/compat.less`（没有任何消费者使用的旧版别名文件），以及只在主题包里用到的 `--ran-skin-*` 基础变量。

### Fixed

- `r-input` 设置了 `message` 之后不会再撑高：字段盒子现在默认按内容高度显示（`--ran-input-height: auto`，最小高度仍是 32px），而不是 `100%`，此前一旦下方堆了一条 message，`100%` 相对更高的宿主就会算错。
- `r-input` 的 `change` 现在只在提交/失焦时触发（原生行为），不再每次按键都触发，`input` 事件仍然每次按键都会触发。此前每次按键都会派发 `change`。
- `r-select` 的下拉选项现在会暴露 `role="option"`（此前已经有 `aria-selected`），这样屏幕阅读器才能正确播报它们。
- `r-select` 中过长的已选文本现在会显示省略号（选中项本身有了宽度限制，`text-overflow: ellipsis` 才能生效），而不是被硬截断。
- 把 `engines.node` 从 `>=24.0.0` 降到了 `>=20.19.0`，这样 Node 20–23 的消费者就不会再收到引擎版本警告。
- 修复了几处因为硬编码颜色导致的暗色模式渲染问题：`dropdown-item` 的文字/悬停/激活颜色、`skeleton` 的底色和高光（此前在暗色模式下完全不可见），以及 `radar` 画布上的标签颜色和网格线，现在都跟随主题 token 变化。
- **语义上是布尔值的属性现在会返回真正的 boolean**，而不是字符串（字符串形式会让 `if (el.prop)` 永远为真）：`r-checkbox.checked`、`r-checkbox.disabled`、`r-input.disabled`、`r-input.required`。setter 仍然同时接受 boolean 或字符串；布尔类型的 attribute 现在会按 `disabled=""` 这种 HTML 惯例来反射。（破坏性变更，预 1.0 beta 阶段。）
- demo 首页 hero 区域的 CTA 文字现在垂直居中了（内部的 `<a>` 设置了 `height:100%`，但相对一个自动高度的宿主它没法生效；现在改成给宿主一个固定高度加 `line-height:1` 来修复）。
- demo 的路由导航在移动端现在可以正常访问了（此前在 820px 以下被隐藏了）；现在改成折行成独立的一整行显示。
- demo 的无障碍改进：GitHub/Issues 链接现在有了 `aria-label`（它们在移动端会只显示图标），主 `<nav>` 也加上了标签，并且 demo 现在遵循 `prefers-reduced-motion`。
- 层级：重新校准了浮层的阴影档位（`--ran-shadow-menu`、`--ran-shadow-modal`），让浮层组件（dropdown、select、modal、message）在视觉上真正有"悬浮"的感觉，此前直接照搬 Geist 原始数值的效果几乎看不出来。`message` 现在改用菜单档位的阴影，而不是卡片那种更平的档位。"层级即角色"这条原则已经写进 `DESIGN.md` 第 4 节和 CLAUDE.md。

### Tests

- 增强了 `r-player` 的单元测试覆盖，新增了控件、媒体事件处理、全屏兼容性、交互和清单（manifest）层级的测试。
- 把 `player/index.ts` 的行覆盖率提升到了 87.97%，ranui 整体行覆盖率提升到了 93.08%。
- 新增了针对播放器生命周期清理、Hls 销毁、媒体监听器清理、attribute 同步、清晰度切换、拖动进度、音量、全屏，以及控制器交互的测试覆盖。
- 新增了一批共享的单元测试辅助函数，用于挂载组件、等待异步 DOM 操作，以及模拟元素几何信息。
- 为 `r-popover` 和 `r-select` 新增了键盘和无障碍方面的契约测试覆盖。

### Fixed

- 取消 `r-player` 静音时，会恢复此前记住的音量。
- 给播放器控制器的悬停和进度条离开事件处理函数加了保护，防止事件对象没有 target 元素时报错。
- 让播放器的全屏辅助函数在标准全屏 API 不可用时，回退使用带浏览器前缀的 API。
- 让 `r-popover` 可以通过键盘聚焦，跟踪 `aria-expanded`，支持回车/空格/Esc 键盘交互，并且会移除自己注册过的同一批监听器。

### Changed

- 把播放器的全屏 API 选择逻辑和 HLS 清单层级归一化逻辑提取成了独立的核心辅助函数，便于测试。

:::

## 工程记录

每一批改动为什么发生的长文记录，与代码放在一起，不在此处摘要。它们是上面这些条目背后的推理过程。

| 日期 | ranui |
| ---- | ------- |
| 2026-08-16 | [new `<r-markdown>`: streaming Markdown renderer](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-08-16.md) |
| 2026-08-08 | [`<r-form>` redesign + native reset/validation for form fields](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-08-08.md) |
| 2026-07-04 | [r-message：toast 变成可朗读的 live region](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-07-04.md) |
| 2026-06-28 | [r-select：下拉箭头图标自注册 + 暗色适配](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-06-28.md) |
| 2026-06-27 | [主题系统重做：采用 Geist 设计系统](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-06-27.md) |
| 2026-06-21 | [视觉回归测试体系建立](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-06-21.md) |
| 2026-05-31 | [主题系统与 Demo 优化](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-05-31.md) |
| 2026-05-24 | [单元测试覆盖率提升](https://github.com/chaxus/ran/blob/main/packages/ranui/changelogs/2026-05-24.md) |

| 日期 | 仓库整体 |
| ---- | ------- |
| 2026-07-25 | [补齐：现有模块的缺口](https://github.com/chaxus/ran/blob/main/changelogs/2026-07-25.md) |
| 2026-07-19 | [builder：`children()` 支持响应式 getter（reactive children）](https://github.com/chaxus/ran/blob/main/changelogs/2026-07-19.md) |
| 2026-07-11 | [Geist contrast action + bordered card default](https://github.com/chaxus/ran/blob/main/changelogs/2026-07-11.md) |

发布与标签见 [GitHub](https://github.com/chaxus/ran/releases)，已发布的每个版本见
[npm](https://www.npmjs.com/package/ranui?activeTab=versions)。
