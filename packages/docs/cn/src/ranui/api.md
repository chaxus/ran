---
title: ranui 元素 API
description: ranui 的全部自定义元素 —— 40 个元素的属性、属性值、事件、插槽与 ::part() 名称，均从源码提取。
---

# ranui 元素 API（自动生成）

由 `pnpm -F ranui doc:api` 从组件源码自动生成，因此不会与实际发布的代码脱节：逐个元素
列出属性（attribute）、带类型的属性值（property）、事件（含 `detail` 结构与派发选项）、
插槽与 `::part()` 名称。描述直接提取自源码 JSDoc，因此保持英文。

每个元素暴露的 CSS 变量见
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)；如何在其中取舍见
[设计系统](/cn/src/ranui/design-system/)与[设计规范](/cn/src/ranui/design-guides/)。
单个元素的用法说明在侧边栏各自的页面里，这里是一次性列全的完整接口。

每个事件都标注了它的派发选项：`bubbles`（冒泡）、`composed`（可穿过 Shadow 边界）、
`cancelable`（`preventDefault()` 可否决）。**`element-only`** 表示三者皆无——在祖先节点上
做事件委托永远收不到它，请把监听绑在元素本身上。

**共 40 个自定义元素。**

## `<r-attachments>`

源码: `components/attachments/index.ts`

- **属性（attribute）**: `sheet: string`
- **属性值（property）**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **事件**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **插槽**: —
- **Part**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

源码: `components/button/index.ts`

- **属性（attribute）**: `aria-label`, `disabled: boolean | string`, `effect: string`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **属性值（property）**:
  - `disabled: boolean | string`
  - `effect: string`
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `button`, `content`

## `<r-card>`

源码: `components/card/index.ts`

- **属性（attribute）**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **属性值（property）**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **事件**: —
- **插槽**: `默认插槽`, `extra（具名）`, `footer（具名）`
- **Part**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

源码: `components/checkbox/index.ts`

- **属性（attribute）**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **属性值（property）**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **事件**:
  - `change` · element-only · detail `{ checked }`
- **插槽**: `默认插槽`
- **Part**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

源码: `components/colorpicker/index.ts`

- **属性（attribute）**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **属性值（property）**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean`
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. An attribute rather than a
  - `sheet: string`
  - `value: string`
- **事件**:
  - `change` · bubbles, composed
- **插槽**: —
- **Part**: `block`, `swatch`

## `<r-content>`

源码: `components/popover/content/index.ts`

- **属性（attribute）**: —
- **属性值（property）**: —
- **事件**:
  - `change` · element-only
- **插槽**: `默认插槽`
- **Part**: —

## `<r-conversation>`

源码: `components/conversation/index.ts`

- **属性（attribute）**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **属性值（property）**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **事件**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **插槽**: `footer（具名）`
- **Part**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

源码: `components/disclosure-row/index.ts`

- **属性（attribute）**: `busy: boolean`, `expandable: boolean`, `heading: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **属性值（property）**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **事件**:
  - `disclosuretoggle` · bubbles, composed
- **插槽**: `默认插槽`, `leading（具名）`
- **Part**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

源码: `components/dropdown/index.ts`

- **属性（attribute）**: `arrow: string`, `sheet: string`, `transit: string`
- **属性值（property）**: `arrow: string`, `sheet: string`, `transit: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `dropdown`

## `<r-dropdown-item>`

源码: `components/select/dropdown-item/index.ts`

- **属性（attribute）**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **属性值（property）**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `content`, `item`

## `<r-glass>`

源码: `components/glass/index.ts`

- **属性（attribute）**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **属性值（property）**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `glass`, `specular`

## `<r-icon>`

源码: `components/icon/index.ts`

- **属性（attribute）**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **属性值（property）**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **事件**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **插槽**: —
- **Part**: `ran-icon`

> **Requires registration.** `<r-icon>` has no built-in icon set — it renders only SVGs
> registered into its in-memory registry, so `<r-icon name="lock">` is **blank** until `lock`
> is registered. Register once, in the browser, before the first `<r-icon>` connects:
>
> ```ts
> import { registerBuiltinIcons } from 'ranui';       // or 'ranui/icons'
> registerBuiltinIcons(); // registers every name in RAN_ICON_NAMES
> ```
>
> For a custom set, call `registerIcon(name, svgString)` / `registerIcons({ … })`, or pass raw
> SVG markup straight to `name` (rendered as-is when it starts with `<svg`). Valid bundled
> names are the `RanIconName` union / `RAN_ICON_NAMES` tuple.

## `<r-img>`

源码: `components/image/index.ts`

- **属性（attribute）**: —
- **属性值（property）**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-input>`

源码: `components/input/index.ts`

- **属性（attribute）**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **属性值（property）**:
  - `disabled: boolean` — input 上 disabled 属性
  - `icon: string` — 一个 icon
  - `label: string` — 字段上方的静态说明文字（label）。
  - `max: string` — 当 input 类型为 number 类型时，可以获取 max 属性
  - `message: string` — 下方的提示/校验文案
  - `min: string` — 当 input 类型为 number 类型时，可以获取 min 属性
  - `name: string` — 与 form 组件联动时，收集的属性名
  - `placeholder: string` — input 的占位字符
  - `required: boolean` — input 是否为必选
  - `sheet: string`
  - `status: string` — input 框的状态
  - `step: string` — 当 input 类型为 number 类型时，可以获取 step 属性
  - `type: string` — input 的类型
  - `validationMessage: string`
  - `validity: ValidityState | undefined`
  - `value: string` — input 的值
- **事件**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **插槽**: —
- **Part**: `content`, `input`, `label`, `message`

## `<r-link>`

源码: `components/link/index.ts`

- **属性（attribute）**: `href: string`, `replace: boolean`, `sheet: string`
- **属性值（property）**: `href: string`, `replace: boolean`, `sheet: string`
- **事件**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **插槽**: —
- **Part**: —

## `<r-loading>`

源码: `components/loading/index.ts`

- **属性（attribute）**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **属性值（property）**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-markdown>`

源码: `components/markdown/index.ts`

- **属性（attribute）**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **属性值（property）**:
  - `caret: string`
  - `content: string` — Markdown source. Resolution order: the `content` property (set via JS, not
  - `copyable: boolean`
  - `downloadable: boolean`
  - `highlight: string | null` — `""` → github-light/github-dark; `"a"` → both; `"a b"` → light / dark theme.
  - `inlineMath: boolean`
  - `lineNumbers: boolean`
  - `linkTarget: string`
  - `mode: string`
  - `sheet: string`
  - `theme: string`
- **事件**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **插槽**: —
- **Part**: `block`, `body`, `error`, `markdown`

## `<r-math>`

源码: `components/math/index.ts`

- **属性（attribute）**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **属性值（property）**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **事件**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **插槽**: —
- **Part**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

源码: `components/mermaid/index.ts`

- **属性（attribute）**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **属性值（property）**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **事件**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **插槽**: —
- **Part**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

源码: `components/message/index.ts`

- **属性（attribute）**: —
- **属性值（property）**: `content: string | null`, `sheet: string`, `type: string | null`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-modal>`

源码: `components/modal/index.ts`

- **属性（attribute）**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **属性值（property）**:
  - `autoFocus: boolean`
  - `closable: boolean`
  - `closeOnEsc: boolean`
  - `heading: string` — Heading text.
  - `hideHeader: boolean` — Headerless mode: drops the title bar and its border, leaving only a floating
  - `lockScroll: boolean`
  - `maskClosable: boolean`
  - `open: boolean`
  - `sheet: string`
- **事件**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **插槽**: `默认插槽`, `footer（具名）`
- **Part**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

源码: `components/select/option/index.ts`

- **属性（attribute）**: —
- **属性值（property）**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: —

## `<r-player>`

源码: `components/player/index.ts`

- **属性（attribute）**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **属性值（property）**:
  - `autoplay: boolean`
  - `controllerBarTimeId: ReturnType<typeof setTimeout> | undefined`
  - `currentTime: string`
  - `debug: string`
  - `disableErrorModal: boolean`
  - `format: string` — 强制指定引擎（`hls`/`dash`/`flv`/`webrtc`/`native`），给拿不到扩展名的
  - `loop: boolean`
  - `moveProgress`
  - `muted: boolean`
  - `playbackRate: string`
  - `poster: string`
  - `rememberPosition: boolean`
  - `sheet: string`
  - `src: string`
  - `thumbnails: string` — URL of a WebVTT sprite-sheet manifest (cues whose text is
  - `tracks: PlayerTrackConfig[]` — 字幕/CC 轨道配置，imperative 属性而不是 attribute——player 会在每次
  - `volume: string`
- **事件**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **插槽**: —
- **Part**: —

## `<r-popover>`

源码: `components/popover/index.ts`

- **属性（attribute）**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **属性值（property）**:
  - `getPopupContainerId: string`
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment.
  - `sheet: string`
  - `trigger: string`
- **事件**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **插槽**: `默认插槽`
- **Part**: —

## `<r-progress>`

源码: `components/progress/index.ts`

- **属性（attribute）**: `drag`, `primary`
- **属性值（property）**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **事件**:
  - `change` · element-only · detail `{ percent, total, value }`
- **插槽**: —
- **Part**: `dot`, `fill`, `track`

## `<r-radar>`

源码: `components/radar/index.ts`

- **属性（attribute）**: —
- **属性值（property）**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-reasoning>`

源码: `components/reasoning/index.ts`

- **属性（attribute）**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **属性值（property）**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `body`, `row`, `text`

## `<r-route>`

源码: `components/route/index.ts`

- **属性（attribute）**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **属性值（property）**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **事件**:
  - `routematch` · bubbles · detail `{ params, path }`
- **插槽**: `默认插槽`
- **Part**: —

## `<r-router>`

源码: `components/router/index.ts`

- **属性（attribute）**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **属性值（property）**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **事件**:
  - `routechange` · bubbles · detail `{ path }`
- **插槽**: `默认插槽`
- **Part**: —

## `<r-scratch>`

源码: `components/scratch/index.ts`

- **属性（attribute）**: `disabled: boolean`, `sheet: string`
- **属性值（property）**: `disabled: boolean`, `sheet: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `award`

## `<r-section>`

源码: `components/section/index.ts`

- **属性（attribute）**: `heading: string`, `sheet: string`, `subtitle: string`
- **属性值（property）**: `heading: string`, `sheet: string`, `subtitle: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

源码: `components/select/index.ts`

- **属性（attribute）**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **属性值（property）**:
  - `defaultValue: string`
  - `disabled: boolean`
  - `dropdownclass: string`
  - `getPopupContainerId: string`
  - `label: string` — 字段上方的静态说明文字（label）。
  - `open: boolean` — Whether the dropdown is showing.
  - `placement: Placement` — Which side of the trigger the panel opens on, with an optional alignment.
  - `required: boolean`
  - `sheet: string`
  - `showSearch: string`
  - `trigger: string`
  - `type: string`
  - `validationMessage: string`
  - `validity: ValidityState | undefined`
  - `value: string`
- **事件**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **插槽**: `默认插槽`
- **Part**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

源码: `components/skeleton/index.ts`

- **属性（attribute）**: `sheet: string`
- **属性值（property）**: `sheet: string`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-state-dot>`

源码: `components/state-dot/index.ts`

- **属性（attribute）**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **属性值（property）**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **事件**: —
- **插槽**: —
- **Part**: `dot`

## `<r-tab>`

源码: `components/tabpane/index.ts`

- **属性（attribute）**: —
- **属性值（property）**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `content`

## `<r-tabs>`

源码: `components/tab/index.ts`

- **属性（attribute）**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **属性值（property）**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **事件**:
  - `change` · element-only · detail `{ active }`
- **插槽**: `默认插槽`
- **Part**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

源码: `components/theme-switch/index.ts`

- **属性（attribute）**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **属性值（property）**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **事件**:
  - `change` · bubbles, composed · detail `{ theme }`
- **插槽**: —
- **Part**: `button ${choice}`, `switch`

## `<r-token-meter>`

源码: `components/token-meter/index.ts`

- **属性（attribute）**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **属性值（property）**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **事件**: —
- **插槽**: —
- **Part**: `fill`, `meter`, `text`, `track`

## `<r-tool-card>`

源码: `components/tool-card/index.ts`

- **属性（attribute）**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **属性值（property）**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **事件**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **插槽**: —
- **Part**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

源码: `components/voice-button/index.ts`

- **属性（attribute）**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **属性值（property）**:
  - `activeLabel: string` — Accessible name while listening; the name has to change, not only the icon.
  - `cancelHint: string` — Replaces {@link holdHint} once the finger has slid far enough to discard.
  - `continuous: boolean` — Keep listening across pauses instead of stopping at the first one.
  - `disabled: boolean`
  - `holdHint: string` — Shown above the button while a finger is held down.
  - `label: string` — Accessible name while idle.
  - `lang: string` — Language being spoken, as a BCP 47 tag.
  - `listening: boolean` — Whether a capture is running. Reflected, so `:host([listening])` can style it.
  - `sheet: string`
  - `supported: boolean` — Whether this platform can recognize speech at all.
- **事件**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **插槽**: —
- **Part**: `button`, `hint`, `icon`
