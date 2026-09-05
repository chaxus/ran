---
title: ranui 要素 API
description: ranui のすべてのカスタム要素 —— 40 個の要素の属性、プロパティ、イベント、スロット、::part() 名。いずれもソースから抽出しています。
---

# ranui 要素 API（自動生成）

`pnpm -F ranui doc:api` がコンポーネントのソースから自動生成するため、実際に配布される
コードとずれることがありません。要素ごとに属性（attribute）、型つきプロパティ、イベント
（`detail` の構造と派発オプションつき）、スロット、`::part()` 名を列挙します。説明は
ソースの JSDoc をそのまま取り出したものなので英語のままです。

各要素が公開する CSS 変数は
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) を、使い分けは
[デザインシステム](/ja/src/ranui/design-system/)と[デザインガイドライン](/ja/src/ranui/design-guides/)を参照してください。
個々の要素の使い方はサイドバーの各ページにあります。ここは全インターフェースを一望する場所です。

各イベントには派発時のオプションを併記しています：`bubbles`（バブリング）、`composed`
（Shadow 境界を越える）、`cancelable`（`preventDefault()` で取り消せる）。**`element-only`**
は三つとものない状態で、祖先要素へのイベント委譲では決して受け取れません。要素自身に
リスナーを登録してください。

**カスタム要素 40 個。**

## `<r-attachments>`

ソース: `components/attachments/index.ts`

- **属性（attribute）**: `sheet: string`
- **プロパティ（property）**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **イベント**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **スロット**: —
- **Part**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

ソース: `components/button/index.ts`

- **属性（attribute）**: `aria-label`, `disabled: boolean | string`, `effect: boolean`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **プロパティ（property）**:
  - `disabled: boolean | string`
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `button`, `content`

## `<r-card>`

ソース: `components/card/index.ts`

- **属性（attribute）**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **プロパティ（property）**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **イベント**: —
- **スロット**: `デフォルトスロット`, `extra（名前つき）`, `footer（名前つき）`
- **Part**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

ソース: `components/checkbox/index.ts`

- **属性（attribute）**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **プロパティ（property）**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **イベント**:
  - `change` · element-only · detail `{ checked }`
- **スロット**: `デフォルトスロット`
- **Part**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

ソース: `components/colorpicker/index.ts`

- **属性（attribute）**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **プロパティ（property）**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean`
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. An attribute rather than a
  - `sheet: string`
  - `value: string`
- **イベント**:
  - `change` · bubbles, composed
- **スロット**: —
- **Part**: `block`, `swatch`

## `<r-content>`

ソース: `components/popover/content/index.ts`

- **属性（attribute）**: —
- **プロパティ（property）**: —
- **イベント**:
  - `change` · element-only
- **スロット**: `デフォルトスロット`
- **Part**: —

## `<r-conversation>`

ソース: `components/conversation/index.ts`

- **属性（attribute）**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **プロパティ（property）**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **イベント**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **スロット**: `footer（名前つき）`
- **Part**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

ソース: `components/disclosure-row/index.ts`

- **属性（attribute）**: `busy: boolean`, `expandable: boolean`, `heading: string`, `name: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **プロパティ（property）**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `name: string` — Groups rows so that opening one closes the rest.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **イベント**:
  - `disclosurebeforetoggle` · bubbles, composed, cancelable · detail `{ open }`
  - `disclosuretoggle` · bubbles, composed · detail `{ open }`
- **スロット**: `デフォルトスロット`, `leading（名前つき）`
- **Part**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

ソース: `components/dropdown/index.ts`

- **属性（attribute）**: `arrow: string`, `sheet: string`, `transit: string`
- **プロパティ（property）**: `arrow: string`, `sheet: string`, `transit: string`
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `dropdown`

## `<r-dropdown-item>`

ソース: `components/select/dropdown-item/index.ts`

- **属性（attribute）**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **プロパティ（property）**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `content`, `item`

## `<r-glass>`

ソース: `components/glass/index.ts`

- **属性（attribute）**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **プロパティ（property）**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `glass`, `specular`

## `<r-icon>`

ソース: `components/icon/index.ts`

- **属性（attribute）**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **プロパティ（property）**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **イベント**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **スロット**: —
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

ソース: `components/image/index.ts`

- **属性（attribute）**: —
- **プロパティ（property）**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **イベント**: —
- **スロット**: —
- **Part**: —

## `<r-input>`

ソース: `components/input/index.ts`

- **属性（attribute）**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **プロパティ（property）**:
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
- **イベント**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **スロット**: —
- **Part**: `content`, `input`, `label`, `message`

## `<r-link>`

ソース: `components/link/index.ts`

- **属性（attribute）**: `href: string`, `replace: boolean`, `sheet: string`
- **プロパティ（property）**: `href: string`, `replace: boolean`, `sheet: string`
- **イベント**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **スロット**: —
- **Part**: —

## `<r-loading>`

ソース: `components/loading/index.ts`

- **属性（attribute）**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **プロパティ（property）**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **イベント**: —
- **スロット**: —
- **Part**: —

## `<r-markdown>`

ソース: `components/markdown/index.ts`

- **属性（attribute）**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **プロパティ（property）**:
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
- **イベント**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **スロット**: —
- **Part**: `block`, `body`, `error`, `markdown`

## `<r-math>`

ソース: `components/math/index.ts`

- **属性（attribute）**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **プロパティ（property）**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **イベント**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **スロット**: —
- **Part**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

ソース: `components/mermaid/index.ts`

- **属性（attribute）**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **プロパティ（property）**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **イベント**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **スロット**: —
- **Part**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

ソース: `components/message/index.ts`

- **属性（attribute）**: —
- **プロパティ（property）**: `content: string | null`, `sheet: string`, `type: string | null`
- **イベント**: —
- **スロット**: —
- **Part**: —

## `<r-modal>`

ソース: `components/modal/index.ts`

- **属性（attribute）**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **プロパティ（property）**:
  - `autoFocus: boolean`
  - `closable: boolean`
  - `closeOnEsc: boolean`
  - `heading: string` — Heading text.
  - `hideHeader: boolean` — Headerless mode: drops the title bar and its border, leaving only a floating
  - `lockScroll: boolean`
  - `maskClosable: boolean`
  - `open: boolean`
  - `sheet: string`
- **イベント**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **スロット**: `デフォルトスロット`, `footer（名前つき）`
- **Part**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

ソース: `components/select/option/index.ts`

- **属性（attribute）**: —
- **プロパティ（property）**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: —

## `<r-player>`

ソース: `components/player/index.ts`

- **属性（attribute）**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **プロパティ（property）**:
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
- **イベント**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **スロット**: —
- **Part**: —

## `<r-popover>`

ソース: `components/popover/index.ts`

- **属性（attribute）**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **プロパティ（property）**:
  - `getPopupContainerId: string`
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment.
  - `sheet: string`
  - `trigger: string`
- **イベント**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **スロット**: `デフォルトスロット`
- **Part**: —

## `<r-progress>`

ソース: `components/progress/index.ts`

- **属性（attribute）**: `drag`, `primary`
- **プロパティ（property）**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **イベント**:
  - `change` · element-only · detail `{ percent, total, value }`
- **スロット**: —
- **Part**: `dot`, `fill`, `track`

## `<r-radar>`

ソース: `components/radar/index.ts`

- **属性（attribute）**: —
- **プロパティ（property）**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **イベント**: —
- **スロット**: —
- **Part**: —

## `<r-reasoning>`

ソース: `components/reasoning/index.ts`

- **属性（attribute）**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **プロパティ（property）**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `body`, `row`, `text`

## `<r-route>`

ソース: `components/route/index.ts`

- **属性（attribute）**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **プロパティ（property）**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **イベント**:
  - `routematch` · bubbles · detail `{ params, path }`
- **スロット**: `デフォルトスロット`
- **Part**: —

## `<r-router>`

ソース: `components/router/index.ts`

- **属性（attribute）**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **プロパティ（property）**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **イベント**:
  - `routechange` · bubbles · detail `{ path }`
- **スロット**: `デフォルトスロット`
- **Part**: —

## `<r-scratch>`

ソース: `components/scratch/index.ts`

- **属性（attribute）**: `disabled: boolean`, `sheet: string`
- **プロパティ（property）**: `disabled: boolean`, `sheet: string`
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `award`

## `<r-section>`

ソース: `components/section/index.ts`

- **属性（attribute）**: `heading: string`, `sheet: string`, `subtitle: string`
- **プロパティ（property）**: `heading: string`, `sheet: string`, `subtitle: string`
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

ソース: `components/select/index.ts`

- **属性（attribute）**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **プロパティ（property）**:
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
- **イベント**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **スロット**: `デフォルトスロット`
- **Part**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

ソース: `components/skeleton/index.ts`

- **属性（attribute）**: `sheet: string`
- **プロパティ（property）**: `sheet: string`
- **イベント**: —
- **スロット**: —
- **Part**: —

## `<r-state-dot>`

ソース: `components/state-dot/index.ts`

- **属性（attribute）**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **プロパティ（property）**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **イベント**: —
- **スロット**: —
- **Part**: `dot`

## `<r-tab>`

ソース: `components/tabpane/index.ts`

- **属性（attribute）**: —
- **プロパティ（property）**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **イベント**: —
- **スロット**: `デフォルトスロット`
- **Part**: `content`

## `<r-tabs>`

ソース: `components/tab/index.ts`

- **属性（attribute）**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **プロパティ（property）**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **イベント**:
  - `change` · element-only · detail `{ active }`
- **スロット**: `デフォルトスロット`
- **Part**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

ソース: `components/theme-switch/index.ts`

- **属性（attribute）**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **プロパティ（property）**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **イベント**:
  - `change` · bubbles, composed · detail `{ theme }`
- **スロット**: —
- **Part**: `button ${choice}`, `switch`

## `<r-token-meter>`

ソース: `components/token-meter/index.ts`

- **属性（attribute）**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **プロパティ（property）**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **イベント**: —
- **スロット**: —
- **Part**: `meter`, `text`

## `<r-tool-card>`

ソース: `components/tool-card/index.ts`

- **属性（attribute）**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **プロパティ（property）**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **イベント**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **スロット**: —
- **Part**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

ソース: `components/voice-button/index.ts`

- **属性（attribute）**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **プロパティ（property）**:
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
- **イベント**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **スロット**: —
- **Part**: `button`, `hint`, `icon`
