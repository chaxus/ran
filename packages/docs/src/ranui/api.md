---
title: ranui element API
description: Every ranui custom element — 40 elements with their attributes, properties, events, slots and ::part() names, extracted from source.
---

# ranui element API (generated)

Auto-generated from the component source by `pnpm -F ranui doc:api`, so it cannot drift
from what ships. Per-element reference of attributes, typed properties, events (with
their `detail` shape and dispatch flags), slots, and `::part()` names.

For the CSS variables each element exposes see
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md); for how to choose
between them, the [design system](/src/ranui/design-system/) and the
[design guidelines](/src/ranui/design-guides/). Usage guidance per element lives on its
own page in the sidebar; this is the exhaustive surface in one place.

Each event states the options it is dispatched with: `bubbles`, `composed` (crosses the
shadow boundary) and `cancelable` (`preventDefault()` vetoes it). **`element-only`** means
none of the three — a delegated listener on an ancestor never sees that event, so bind to
the element itself.

**40 custom elements.**

## `<r-attachments>`

Source: `components/attachments/index.ts`

- **Attributes**: `sheet: string`
- **Properties**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **Events**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **Slots**: —
- **Parts**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

Source: `components/button/index.ts`

- **Attributes**: `aria-label`, `disabled: boolean | string`, `effect: string`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **Properties**:
  - `disabled: boolean | string`
  - `effect: string`
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **Events**: —
- **Slots**: `default`
- **Parts**: `button`, `content`

## `<r-card>`

Source: `components/card/index.ts`

- **Attributes**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **Properties**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **Events**: —
- **Slots**: `default`, `extra (named)`, `footer (named)`
- **Parts**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

Source: `components/checkbox/index.ts`

- **Attributes**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **Properties**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **Events**:
  - `change` · element-only · detail `{ checked }`
- **Slots**: `default`
- **Parts**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

Source: `components/colorpicker/index.ts`

- **Attributes**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **Properties**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean`
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. An attribute rather than a
  - `sheet: string`
  - `value: string`
- **Events**:
  - `change` · bubbles, composed
- **Slots**: —
- **Parts**: `block`, `swatch`

## `<r-content>`

Source: `components/popover/content/index.ts`

- **Attributes**: —
- **Properties**: —
- **Events**:
  - `change` · element-only
- **Slots**: `default`
- **Parts**: —

## `<r-conversation>`

Source: `components/conversation/index.ts`

- **Attributes**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **Properties**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **Events**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **Slots**: `footer (named)`
- **Parts**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

Source: `components/disclosure-row/index.ts`

- **Attributes**: `busy: boolean`, `expandable: boolean`, `heading: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **Properties**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **Events**:
  - `disclosuretoggle` · bubbles, composed
- **Slots**: `default`, `leading (named)`
- **Parts**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

Source: `components/dropdown/index.ts`

- **Attributes**: `arrow: string`, `sheet: string`, `transit: string`
- **Properties**: `arrow: string`, `sheet: string`, `transit: string`
- **Events**: —
- **Slots**: `default`
- **Parts**: `dropdown`

## `<r-dropdown-item>`

Source: `components/select/dropdown-item/index.ts`

- **Attributes**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **Properties**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **Events**: —
- **Slots**: `default`
- **Parts**: `content`, `item`

## `<r-glass>`

Source: `components/glass/index.ts`

- **Attributes**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **Properties**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **Events**: —
- **Slots**: `default`
- **Parts**: `glass`, `specular`

## `<r-icon>`

Source: `components/icon/index.ts`

- **Attributes**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **Properties**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **Events**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **Slots**: —
- **Parts**: `ran-icon`

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

Source: `components/image/index.ts`

- **Attributes**: —
- **Properties**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **Events**: —
- **Slots**: —
- **Parts**: —

## `<r-input>`

Source: `components/input/index.ts`

- **Attributes**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **Properties**:
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
- **Events**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **Slots**: —
- **Parts**: `content`, `input`, `label`, `message`

## `<r-link>`

Source: `components/link/index.ts`

- **Attributes**: `href: string`, `replace: boolean`, `sheet: string`
- **Properties**: `href: string`, `replace: boolean`, `sheet: string`
- **Events**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **Slots**: —
- **Parts**: —

## `<r-loading>`

Source: `components/loading/index.ts`

- **Attributes**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **Properties**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **Events**: —
- **Slots**: —
- **Parts**: —

## `<r-markdown>`

Source: `components/markdown/index.ts`

- **Attributes**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **Properties**:
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
- **Events**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **Slots**: —
- **Parts**: `block`, `body`, `error`, `markdown`

## `<r-math>`

Source: `components/math/index.ts`

- **Attributes**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **Properties**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **Events**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **Slots**: —
- **Parts**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

Source: `components/mermaid/index.ts`

- **Attributes**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **Properties**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **Events**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **Slots**: —
- **Parts**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

Source: `components/message/index.ts`

- **Attributes**: —
- **Properties**: `content: string | null`, `sheet: string`, `type: string | null`
- **Events**: —
- **Slots**: —
- **Parts**: —

## `<r-modal>`

Source: `components/modal/index.ts`

- **Attributes**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **Properties**:
  - `autoFocus: boolean`
  - `closable: boolean`
  - `closeOnEsc: boolean`
  - `heading: string` — Heading text.
  - `hideHeader: boolean` — Headerless mode: drops the title bar and its border, leaving only a floating
  - `lockScroll: boolean`
  - `maskClosable: boolean`
  - `open: boolean`
  - `sheet: string`
- **Events**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **Slots**: `default`, `footer (named)`
- **Parts**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

Source: `components/select/option/index.ts`

- **Attributes**: —
- **Properties**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **Events**: —
- **Slots**: `default`
- **Parts**: —

## `<r-player>`

Source: `components/player/index.ts`

- **Attributes**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **Properties**:
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
- **Events**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **Slots**: —
- **Parts**: —

## `<r-popover>`

Source: `components/popover/index.ts`

- **Attributes**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **Properties**:
  - `getPopupContainerId: string`
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment.
  - `sheet: string`
  - `trigger: string`
- **Events**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **Slots**: `default`
- **Parts**: —

## `<r-progress>`

Source: `components/progress/index.ts`

- **Attributes**: `drag`, `primary`
- **Properties**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **Events**:
  - `change` · element-only · detail `{ percent, total, value }`
- **Slots**: —
- **Parts**: `dot`, `fill`, `track`

## `<r-radar>`

Source: `components/radar/index.ts`

- **Attributes**: —
- **Properties**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **Events**: —
- **Slots**: —
- **Parts**: —

## `<r-reasoning>`

Source: `components/reasoning/index.ts`

- **Attributes**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **Properties**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **Events**: —
- **Slots**: `default`
- **Parts**: `body`, `row`, `text`

## `<r-route>`

Source: `components/route/index.ts`

- **Attributes**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **Properties**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **Events**:
  - `routematch` · bubbles · detail `{ params, path }`
- **Slots**: `default`
- **Parts**: —

## `<r-router>`

Source: `components/router/index.ts`

- **Attributes**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **Properties**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **Events**:
  - `routechange` · bubbles · detail `{ path }`
- **Slots**: `default`
- **Parts**: —

## `<r-scratch>`

Source: `components/scratch/index.ts`

- **Attributes**: `disabled: boolean`, `sheet: string`
- **Properties**: `disabled: boolean`, `sheet: string`
- **Events**: —
- **Slots**: `default`
- **Parts**: `award`

## `<r-section>`

Source: `components/section/index.ts`

- **Attributes**: `heading: string`, `sheet: string`, `subtitle: string`
- **Properties**: `heading: string`, `sheet: string`, `subtitle: string`
- **Events**: —
- **Slots**: `default`
- **Parts**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

Source: `components/select/index.ts`

- **Attributes**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **Properties**:
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
- **Events**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **Slots**: `default`
- **Parts**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

Source: `components/skeleton/index.ts`

- **Attributes**: `sheet: string`
- **Properties**: `sheet: string`
- **Events**: —
- **Slots**: —
- **Parts**: —

## `<r-state-dot>`

Source: `components/state-dot/index.ts`

- **Attributes**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **Properties**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **Events**: —
- **Slots**: —
- **Parts**: `dot`

## `<r-tab>`

Source: `components/tabpane/index.ts`

- **Attributes**: —
- **Properties**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **Events**: —
- **Slots**: `default`
- **Parts**: `content`

## `<r-tabs>`

Source: `components/tab/index.ts`

- **Attributes**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **Properties**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **Events**:
  - `change` · element-only · detail `{ active }`
- **Slots**: `default`
- **Parts**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

Source: `components/theme-switch/index.ts`

- **Attributes**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **Properties**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **Events**:
  - `change` · bubbles, composed · detail `{ theme }`
- **Slots**: —
- **Parts**: `button ${choice}`, `switch`

## `<r-token-meter>`

Source: `components/token-meter/index.ts`

- **Attributes**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **Properties**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **Events**: —
- **Slots**: —
- **Parts**: `fill`, `meter`, `text`, `track`

## `<r-tool-card>`

Source: `components/tool-card/index.ts`

- **Attributes**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **Properties**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **Events**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **Slots**: —
- **Parts**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

Source: `components/voice-button/index.ts`

- **Attributes**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **Properties**:
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
- **Events**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **Slots**: —
- **Parts**: `button`, `hint`, `icon`
